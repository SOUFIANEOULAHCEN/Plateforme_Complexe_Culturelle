import EventProposal from '../models/eventProposal.js';
import Notification from '../models/notification.js';
import Evenement from '../models/evenement.js';
import Utilisateur from '../models/utilisateur.js';
import sendEmail from '../utils/sendEmail.js';
import { Op } from 'sequelize';

// Get all event proposals with optional filtering
export const getEventProposals = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    
    if (status) {
      where.statut = status;
    }
    
    const proposals = await EventProposal.findAll({
      where,
      include: [
        {
          model: Utilisateur,
          as: 'administrateur',
          attributes: ['id', 'nom', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(proposals);
  } catch (error) {
    console.error('Error fetching event proposals:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des propositions d\'événements' });
  }
};

// Get a specific event proposal by ID
export const getEventProposalById = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await EventProposal.findByPk(id, {
      include: [
        {
          model: Utilisateur,
          as: 'administrateur',
          attributes: ['id', 'nom', 'email']
        }
      ]
    });
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposition d\'événement non trouvée' });
    }
    
    res.json(proposal);
  } catch (error) {
    console.error('Error fetching event proposal:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la proposition d\'événement' });
  }
};

// Create a new event proposal (from Google Form or direct API call)
export const createEventProposal = async (req, res) => {
  try {
    const {
      titre,
      description,
      date_debut,
      date_fin,
      espace_id,
      type,
      proposeur_email,
      proposeur_nom,
      proposeur_telephone
    } = req.body;
    
    // Récupérer l'URL de l'affiche si un fichier a été uploadé
    let affiche_url = null;
    if (req.file) {
      affiche_url = req.file.path.replace(/\\/g, '/'); // Normaliser le chemin pour l'URL
    }
    
    // Validate required fields
    if (!titre || !date_debut || !date_fin || !espace_id || !type || !proposeur_email || !proposeur_nom) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }
    
    // Create the event proposal
    const proposal = await EventProposal.create({
      titre,
      description,
      date_debut,
      date_fin,
      espace_id,
      type,
      proposeur_email,
      proposeur_nom,
      proposeur_telephone,
      affiche_url,
      statut: 'en_attente'
    });
    
    // Create notification for admins
    await Notification.create({
      message: `Nouvelle proposition d'événement: ${titre}`,
      type: 'event_proposal',
      reference_id: proposal.id,
      reference_type: 'event_proposal',
      for_admins_only: true,
      is_read: false,
      metadata: JSON.stringify({
        proposalId: proposal.id,
        title: titre,
        type: type,
        proposeur: proposeur_nom,
        email: proposeur_email
      })
    });
    
    // Envoi d'email encapsulé dans un try/catch pour ne pas bloquer la création
    try {
      await sendEmail({
        to: proposeur_email,
        subject: 'Proposition d\'événement reçue',
        text: `Bonjour ${proposeur_nom},\n\nNous avons bien reçu votre proposition d'événement \"${titre}\". Notre équipe l'examinera dans les plus brefs délais.\n\nCordialement,\nL'équipe du Centre Culturel`
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
      // On n'empêche pas la création même si l'email échoue
    }
    
    res.status(201).json({
      success: true,
      message: 'Proposition d\'événement créée avec succès',
      proposal
    });
  } catch (error) {
    console.error('Error creating event proposal:', error);
    console.error('Contenu reçu:', req.body, req.file); // Ajoutez ceci pour le debug
    res.status(500).json({ message: 'Erreur lors de la création de la proposition d\'événement' });
  }
};

// Process an event proposal (approve or reject)
export const processEventProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, commentaire_admin } = req.body;
    
    // Validate status
    if (!['approuve', 'rejete'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide. Utilisez "approuve" ou "rejete"' });
    }
    
    // Find the proposal
    const proposal = await EventProposal.findByPk(id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposition d\'événement non trouvée' });
    }
    
    // Update the proposal
    await proposal.update({
      statut,
      commentaire_admin,
      traite_par: req.user.id,
      date_traitement: new Date()
    });
    
    // If approved, create an actual event
    if (statut === 'approuve') {
      const newEvent = await Evenement.create({
        titre: proposal.titre,
        description: proposal.description,
        date_debut: proposal.date_debut,
        date_fin: proposal.date_fin,
        espace_id: proposal.espace_id,
        type: proposal.type,
        createur_id: req.user.id,
        statut: 'planifie'
      });
      
      // Create notification for event creation
      await Notification.create({
        type: 'success',
        message: `Événement créé à partir de la proposition: ${proposal.titre}`,
        reference_id: newEvent.id,
        reference_type: 'event',
        for_admins_only: true,
        metadata: JSON.stringify({
          eventId: newEvent.id,
          proposalId: proposal.id
        })
      });

      // Send approval email
      await sendEmail({
        to: proposal.proposeur_email,
        subject: 'Votre proposition d\'événement a été approuvée',
        text: `Bonjour ${proposal.proposeur_nom},\n\nNous sommes heureux de vous informer que votre proposition d'événement "${proposal.titre}" a été approuvée.\n\n${commentaire_admin ? `Commentaire : ${commentaire_admin}\n\n` : ''}L'événement a été programmé du ${new Date(proposal.date_debut).toLocaleDateString('fr-FR')} au ${new Date(proposal.date_fin).toLocaleDateString('fr-FR')}.\n\nCordialement,\nL'équipe du Centre Culturel`
      });
    } else {
      // Create notification for rejection
      await Notification.create({
        type: 'info',
        message: `Proposition d'événement rejetée : ${proposal.titre}`,
        reference_id: proposal.id,
        reference_type: 'event_proposal',
        for_admins_only: true,
        metadata: JSON.stringify({
          proposalId: proposal.id,
          reason: commentaire_admin
        })
      });

      // Send rejection email
      await sendEmail({
        to: proposal.proposeur_email,
        subject: 'Votre proposition d\'événement n\'a pas été retenue',
        text: `Bonjour ${proposal.proposeur_nom},\n\nNous vous remercions pour votre proposition d'événement "${proposal.titre}".\n\nAprès examen, nous sommes au regret de vous informer que nous ne pourrons pas donner suite à cette proposition.\n\n${commentaire_admin ? `Commentaire : ${commentaire_admin}\n\n` : ''}N'hésitez pas à soumettre d'autres propositions à l'avenir.\n\nCordialement,\nL'équipe du Centre Culturel`
      });
    }
    
    res.json({
      success: true,
      message: `Proposition d'événement ${statut === 'approuve' ? 'approuvée' : 'rejetée'} avec succès`,
      proposal
    });

  } catch (error) {
    console.error('Error processing event proposal:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du traitement de la proposition d\'événement',
      error: error.message
    });
  }
};

// Get statistics about event proposals
export const getEventProposalStats = async (req, res) => {
  try {
    const [pending, approved, rejected, total] = await Promise.all([
      EventProposal.count({ where: { statut: 'en_attente' } }),
      EventProposal.count({ where: { statut: 'approuve' } }),
      EventProposal.count({ where: { statut: 'rejete' } }),
      EventProposal.count()
    ]);
    
    res.json({
      pending,
      approved,
      rejected,
      total
    });
  } catch (error) {
    console.error('Error fetching event proposal stats:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};

// Get pending proposals
export const getPendingProposals = async (req, res) => {
  try {
    const proposals = await EventProposal.findAll({
      where: { statut: 'en_attente' },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: proposals
    });
  } catch (error) {
    console.error('Error fetching pending proposals:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des propositions'
    });
  }
};