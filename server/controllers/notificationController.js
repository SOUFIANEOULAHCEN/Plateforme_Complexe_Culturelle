import Notification from "../models/notification.js";
import { Op } from "sequelize";

// Create a notification
export const createNotification = async (req, res) => {
  try {
    const { utilisateurId, message, type, reference_id, reference_type, for_admins_only } = req.body;

    const notification = await Notification.create({
      utilisateurId,
      message,
      type: type || 'info',
      reference_id,
      reference_type,
      for_admins_only: for_admins_only || false
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Erreur création notification:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Get notifications with filtering options
export const getNotifications = async (req, res) => {
  try {
    const { unread_only, type, for_admins_only } = req.query;
    const where = {};
    
    // Filter by read status
    if (unread_only === 'true') {
      where.is_read = false;
    }
    
    // Filter by type
    if (type) {
      where.type = type;
    }
    
    // Filter by admin-only status
    if (for_admins_only) {
      where.for_admins_only = for_admins_only === 'true';
    }
    
    // If user is not admin/superadmin, only show their notifications or non-admin notifications
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      where[Op.or] = [
        { utilisateurId: req.user.id },
        { utilisateurId: null, for_admins_only: false }
      ];
    }
    
    const notifications = await Notification.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    
    res.json(notifications);
  } catch (error) {
    console.error("Erreur récupération notifications:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }

    notification.is_read = true;
    await notification.save();

    res.json({ message: "Notification marquée comme lue", notification });
  } catch (error) {
    console.error("Erreur maj notification:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const where = {};
    
    // If user is not admin/superadmin, only mark their notifications as read
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      where.utilisateurId = req.user.id;
    }
    
    await Notification.update(
      { is_read: true },
      { where }
    );

    res.json({ message: "Toutes les notifications ont été marquées comme lues" });
  } catch (error) {
    console.error("Erreur maj notifications:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const where = { is_read: false };
    
    // If user is not admin/superadmin, only count their notifications or non-admin notifications
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      where[Op.or] = [
        { utilisateurId: req.user.id },
        { utilisateurId: null, for_admins_only: false }
      ];
    }
    
    const count = await Notification.count({ where });
    
    res.json({ count });
  } catch (error) {
    console.error("Erreur comptage notifications:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};