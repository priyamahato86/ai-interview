import { type Request, type Response } from "express";
import crypto from "crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import { User } from "../models/User.js";
import { BlacklistedToken } from "../models/BlacklistedToken.js";
import { extractToken } from "../middleware/auth.middleware.js";
import type { RegisterInput, LoginInput, ResetPasswordInput } from "../schemas/auth.js";

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const signToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  const expiresIn = (process.env.JWT_EXPIRES_IN ||
    "30d") as SignOptions["expiresIn"];
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

const setAuthCookie = (res: Response, token: string): void => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE_MS,
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    // Data is validated by middleware - no manual checks needed
    const { username, email, password } = req.body as RegisterInput;

    const existing = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "User with this email or username already exists" });
    }

    const user = await User.create({ username, email, password });
    const token = signToken(user.id);
    setAuthCookie(res, token);

    return res.status(201).json({
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({
      message: "Server error",
      ...(process.env.NODE_ENV !== "production" && {
        error: err instanceof Error ? err.message : String(err),
      }),
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Data is validated by middleware - no manual checks needed
    const { email, username, password } = req.body as LoginInput;
    const identifier = email ?? username;

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const existingRaw = extractToken(req);
    if (existingRaw) {
      try {
        const secret = process.env.JWT_SECRET!;
        jwt.verify(existingRaw, secret);
        const existingHash = crypto.createHash("sha256").update(existingRaw).digest("hex");
        const isBlacklisted = await BlacklistedToken.findOne({ tokenHash: existingHash });
        if (!isBlacklisted) {
          setAuthCookie(res, existingRaw);
          return res.json({
            user: { id: user.id, username: user.username, email: user.email },
            token: existingRaw,
          });
        }
      } catch {
        // Expired, tampered, or blacklisted — fall through to issue a new token
      }
    }

    const token = signToken(user.id);
    setAuthCookie(res, token);

    return res.json({
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({
      message: "Server error",
      ...(process.env.NODE_ENV !== "production" && {
        error: err instanceof Error ? err.message : String(err),
      }),
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Don't reveal whether the email exists
    if (!user) {
      return res.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    // In production, email `rawToken` to the user instead of returning it.
    return res.json({
      message: "Password reset token generated.",
      resetToken: rawToken,
      expiresInMinutes: 15,
      note: "In production this would be sent via email instead of returned here.",
    });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({
      message: "Server error",
      ...(process.env.NODE_ENV !== "production" && {
        error: err instanceof Error ? err.message : String(err),
      }),
    });
  }
};

export const me = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const { id, username, email } = req.user;
  return res.json({ user: { id, username, email } });
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.token!;

    const payload = jwt.decode(token) as { exp?: number } | null;
    const expiresAt = payload?.exp
      ? new Date(payload.exp * 1000)
      : new Date(Date.now() + COOKIE_MAX_AGE_MS);

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    try {
      await BlacklistedToken.create({ tokenHash, expiresAt });
    } catch (dbErr: unknown) {
      if (
        typeof dbErr !== "object" ||
        dbErr === null ||
        (dbErr as { code?: number }).code !== 11000
      ) {
        throw dbErr;
      }
    }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({
      message: "Server error",
      ...(process.env.NODE_ENV !== "production" && {
        error: err instanceof Error ? err.message : String(err),
      }),
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    // Data is validated by middleware - no manual checks needed
    const { token, newPassword } = req.body as ResetPasswordInput;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password reset successful. Please log in." });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({
      message: "Server error",
      ...(process.env.NODE_ENV !== "production" && {
        error: err instanceof Error ? err.message : String(err),
      }),
    });
  }
};
