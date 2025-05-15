import express from 'express';
import { 
  createContactMessage, 
  getContactMessages, 
  markAsRead,
  respondToMessage
} from '../controllers/contactController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route publique pour envoyer un message
router.post('/', createContactMessage);

// Routes protégées pour les administrateurs
router.get('/', verifyToken, isAdmin, getContactMessages);
router.put('/:id/read', verifyToken, isAdmin, markAsRead);
router.post('/:id/respond', verifyToken, isAdmin, respondToMessage);

export default router;