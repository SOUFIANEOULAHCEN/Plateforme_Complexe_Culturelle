import express from 'express';
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

// Route publique pour les soumissions de Google Form
router.post('/', createEventProposal);

// Routes protégées qui nécessitent une authentification admin
router.use(verifyToken, isAdmin);
router.get('/', getEventProposals);
router.get('/pending', getPendingProposals);
router.get('/stats', getEventProposalStats);
router.get('/:id', getEventProposalById);
router.put('/:id/process', processEventProposal);

export default router;