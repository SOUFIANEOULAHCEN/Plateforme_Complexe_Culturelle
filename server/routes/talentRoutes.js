import express from 'express';
import upload from '../middlewares/upload.js';
import { 
  getTalentByEmail, 
  updateTalent, 
  updatePassword 
} from '../controllers/talentController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Récupérer un talent par email
router.get('/', verifyToken, getTalentByEmail);



// Mettre à jour un talent

router.put('/:id',
  verifyToken, 
  upload.fields([
    { name: 'image_profil', maxCount: 1 },
    { name: 'cv', maxCount: 1 }
  ]), 
  updateTalent
);

// Changer le mot de passe
router.put('/:id/password', verifyToken, updatePassword);

export { router as talentRoutes };  // Export nommé