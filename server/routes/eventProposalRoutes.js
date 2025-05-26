import express from 'express';
import { upload, handleMulterError } from '../middlewares/upload.js';
import {
  createEventProposal,
  getEventProposals,
  getEventProposalById,
  processEventProposal,
  getPendingProposals,
  getEventProposalStats
} from '../controllers/eventProposalContoller.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route publique pour les soumissions de Google Form et formulaire
router.post('/', upload.single('affiche'), handleMulterError, createEventProposal);

// Routes protégées qui nécessitent une authentification admin
router.use(verifyToken, isAdmin);
router.get('/', getEventProposals);
router.get('/pending', getPendingProposals);
router.get('/stats', getEventProposalStats);
router.get('/:id', getEventProposalById);
router.put('/:id/process', processEventProposal);

export default router;