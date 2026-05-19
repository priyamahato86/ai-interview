import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  me,
  logout,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", protect, me);
router.post("/logout", protect, logout);

export default router;
