import { type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User, type UserDoc } from "../models/User.js";
import { BlacklistedToken } from "../models/BlacklistedToken.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
      token?: string;
    }
  }
}

interface AuthTokenPayload extends JwtPayload {
  id: string;
}

export const extractToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.slice("Bearer ".length).trim();
  }
  const cookieToken = (req as Request & { cookies?: Record<string, string> })
    .cookies?.token;
  return cookieToken ?? null;
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    if (!token) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: "Server misconfigured: JWT_SECRET" });
      return;
    }

    const decoded = jwt.verify(token, secret) as AuthTokenPayload;

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const blacklisted = await BlacklistedToken.findOne({ tokenHash });
    if (blacklisted) {
      res.status(401).json({ message: "Token has been invalidated" });
      return;
    }

    req.token = token;

    const user = await User.findById(decoded.id).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      res.status(401).json({ message: "User no longer exists" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("protect middleware error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
