import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import upload from '../config/multerConfig.js';
import {
  getUserProfile,
  updateProfile,
  changePassword,
  updateProfileImage
} from '../controllers/userProfileController.js';

const router = express.Router();

// Routes sécurisées avec verifyToken
router.get('/me', verifyToken, getUserProfile);
router.put('/me', verifyToken, updateProfile);
router.put('/me/password', verifyToken, changePassword);
router.put('/me/image', verifyToken, upload.single('image_profil'), updateProfileImage);

export default router;