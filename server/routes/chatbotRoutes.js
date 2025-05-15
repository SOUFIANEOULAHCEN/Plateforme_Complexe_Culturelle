import express from 'express';
import { getBotResponse, getAllQA, createQA, updateQA, deleteQA } from '../controllers/chatbotController.js';
import { isAdmin, verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public route for chatbot responses
router.post('/', getBotResponse);

// Admin routes for managing Q&A pairs
router.get('/qa', verifyToken, isAdmin, getAllQA);
router.post('/qa', verifyToken, isAdmin, createQA);
router.put('/qa/:id', verifyToken, isAdmin, updateQA);
router.delete('/qa/:id', verifyToken, isAdmin, deleteQA);

export default router;