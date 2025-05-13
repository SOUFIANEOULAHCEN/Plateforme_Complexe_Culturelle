import express from 'express';
import { getBotResponse } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/', getBotResponse);

export default router;