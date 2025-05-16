import express from 'express';
import { getComplexeConfig, updateComplexeConfig } from '../controllers/complexeConfigController.js';
import { verifyToken, isSuperAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication and super admin privileges
router.use(verifyToken, isSuperAdmin);

// Configuration routes
router.get('/', getComplexeConfig);
router.put('/', updateComplexeConfig);

export default router;
