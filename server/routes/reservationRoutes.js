import express from 'express';
import { 
  getReservations, 
  updateReservation, 
  deleteReservation,
  createReservation // <-- Add this import
} from '../controllers/reservationController.js';
import { verifyToken, isSuperAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getReservations);
router.put('/:id', verifyToken, updateReservation);
router.delete('/:id', verifyToken, isSuperAdmin, deleteReservation); 
router.post('/', verifyToken, createReservation); // <-- Add this line

export default router;