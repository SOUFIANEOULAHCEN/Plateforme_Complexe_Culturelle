import EventProposal from '../models/eventProposal.js';
import Notification from '../models/notification.js';
import sendEmail from '../utils/sendEmail.js';

// Handle Google Form submissions
export const handleGoogleFormWebhook = async (req, res) => {
  try {
    const formData = req.body;
    
    // Mapper les champs du formulaire Google aux champs de notre modèle
    const eventProposal = {
      titre: formData.titre || formData.title || '',
      description: formData.description || '',
      date_debut: new Date(formData.date_debut || formData.start_date),
      date_fin: new Date(formData.date_fin || formData.end_date),
      type: formData.type || 'spectacle',
      espace_id: parseInt(formData.espace_id || formData.space_id) || 1,
      proposeur_nom: formData.nom || formData.name || '',
      proposeur_email: formData.email || '',
      proposeur_telephone: formData.telephone || formData.phone || '',
      statut: 'en_attente'
    };

    // Créer la proposition d'événement
    const proposal = await EventProposal.create(eventProposal);

    // Créer une notification pour les administrateurs
    await Notification.create({
      message: `Nouvelle proposition d'événement via Google Form: ${eventProposal.titre}`,
      type: 'event_proposal',
      reference_id: proposal.id,
      reference_type: 'event_proposal',
      for_admins_only: true,
      is_read: false,
      metadata: JSON.stringify({
        proposalId: proposal.id,
        title: eventProposal.titre,
        proposeur: eventProposal.proposeur_nom,
        email: eventProposal.proposeur_email
      })
    });

    // Envoyer un email de confirmation
    await sendEmail({
      to: eventProposal.proposeur_email,
      subject: 'Proposition d\'événement reçue',
      text: `Bonjour ${eventProposal.proposeur_nom},\n\nNous avons bien reçu votre proposition d'événement "${eventProposal.titre}". Notre équipe l'examinera dans les plus brefs délais.\n\nCordialement,\nL'équipe du Centre Culturel`
    });

    res.status(200).json({
      success: true,
      message: 'Proposition d\'événement reçue avec succès'
    });
  } catch (error) {
    console.error('Erreur webhook Google Form:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du traitement de la proposition'
    });
  }
};