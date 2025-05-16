import express from 'express';
import { 
  getEspaces, 
  createEspace, 
  updateEspace, 
  deleteEspace 
} from '../controllers/espaceController.js';
import { verifyToken, isSuperAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getEspaces);
router.post('/', verifyToken, createEspace);
router.put('/:id', verifyToken, updateEspace);
router.delete('/:id', verifyToken, isSuperAdmin, deleteEspace); // Only SuperAdmin can delete

export default router;