import ContactMessage from "../models/contactMessage.js";
import Notification from "../models/notification.js";
import sendEmail from "../utils/sendEmail.js";

// Créer un nouveau message de contact
export const createContactMessage = async (req, res) => {
  try {
    const { nom, email, telephone, message } = req.body;

    // Validation des données
    if (!nom || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs obligatoires"
      });
    }

    // Créer le message de contact
    const contactMessage = await ContactMessage.create({
      nom,
      email,
      telephone: telephone || null,
      message,
    });

    // Créer une notification pour les administrateurs
    try {
      await Notification.create({
        message: `Nouveau message de contact de ${nom}`,
        type: 'info',
        reference_id: contactMessage.id,
        reference_type: 'contact_message',
        for_admins_only: true,
        is_read: false,
        metadata: JSON.stringify({
          messageId: contactMessage.id,
          nom: nom,
          email: email
        })
      });
    } catch (notificationError) {
      console.error('Erreur lors de la création de la notification:', notificationError);
      // On continue même si la notification échoue
    }

    // Envoyer un email de confirmation
    try {
      await sendEmail({
        to: email,
        subject: 'Message reçu - Centre Culturel Ouarzazate',
        text: `Bonjour ${nom},\n\nNous avons bien reçu votre message. Notre équipe vous répondra dans les plus brefs délais.\n\nCordialement,\nL'équipe du Centre Culturel Ouarzazate`
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
      // On continue même si l'email échoue
    }

    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      contactMessage
    });
  } catch (error) {
    console.error('Erreur lors de la création du message de contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message',
      error: error.message
    });
  }
};

// Récupérer tous les messages de contact (admin uniquement)
export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur',
      error: error.message 
    });
  }
};

// Marquer un message comme lu
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByPk(id);
    
    if (!message) {
      return res.status(404).json({ 
        success: false,
        message: 'Message non trouvé' 
      });
    }

    message.is_read = true;
    await message.save();

    res.json({ 
      success: true,
      message: 'Message marqué comme lu', 
      contactMessage: message 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur',
      error: error.message 
    });
  }
};

// Répondre à un message de contact
export const respondToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, response } = req.body;

    const message = await ContactMessage.findByPk(id);
    if (!message) {
      return res.status(404).json({ 
        success: false,
        message: 'Message non trouvé' 
      });
    }

    // Envoyer l'email de réponse
    await sendEmail({
      to: email,
      subject: 'Réponse à votre message - Centre Culturel Ouarzazate',
      text: response
    });

    // Mettre à jour le message comme étant lu
    message.is_read = true;
    await message.save();

    res.json({ 
      success: true,
      message: 'Réponse envoyée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réponse:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de l\'envoi de la réponse',
      error: error.message 
    });
  }
};