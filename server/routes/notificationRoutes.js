import express from "express";
import {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} from "../controllers/notificationController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Notification routes
router.post("/", createNotification);
router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/:id/read", markAsRead);
router.put("/mark-all-read", markAllAsRead);

export default router;