import express from 'express';
import { createContactMessage, getContactMessages, markAsRead } from '../controllers/contactController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route publique pour envoyer un message
router.post('/', createContactMessage);

// Routes protégées pour les administrateurs
router.get('/', verifyToken, isAdmin, getContactMessages);
router.put('/:id/read', verifyToken, isAdmin, markAsRead);

export default router; 