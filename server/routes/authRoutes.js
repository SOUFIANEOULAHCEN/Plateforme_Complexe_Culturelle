import express from "express";
import { register, login, logout, forgotPassword, resetPassword } from "../controllers/authController.js";
import {
  verifyToken,
  isAdmin,
  isSuperAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes examples
router.get("/profile", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

router.get("/admin", verifyToken, isAdmin, (req, res) => {
  res.json({ message: "Admin access granted" });
});

router.get("/superadmin", verifyToken, isSuperAdmin, (req, res) => {
  res.json({ message: "Superadmin access granted" });
});

export default router;
