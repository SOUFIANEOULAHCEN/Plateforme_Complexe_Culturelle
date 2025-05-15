import express from 'express';
import { 
  getEvenements, 
  createEvenement, 
  updateEvenement, 
  deleteEvenement ,
  getEvenementById 
} from '../controllers/evenementController.js';
import { verifyToken, isSuperAdmin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/', getEvenements);
router.get('/:id', verifyToken, getEvenementById);
router.post('/', verifyToken, upload.single('affiche'), createEvenement);
router.put('/:id', verifyToken, updateEvenement);
router.delete('/:id', verifyToken, isSuperAdmin, deleteEvenement); // Only SuperAdmin can delete

export default router;