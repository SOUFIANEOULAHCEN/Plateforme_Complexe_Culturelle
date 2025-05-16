import express from 'express';
import { getComplexeConfig, updateComplexeConfig, sendNewsletter } from '../controllers/complexeConfigController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getComplexeConfig);
router.put('/', verifyToken, isAdmin, updateComplexeConfig);
router.post('/send-newsletter', verifyToken, isAdmin, sendNewsletter);

export default router;
