import express from 'express';
import { handleGoogleFormWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Route pour recevoir les soumissions du formulaire Google
router.post('/google-form', handleGoogleFormWebhook);

export default router;