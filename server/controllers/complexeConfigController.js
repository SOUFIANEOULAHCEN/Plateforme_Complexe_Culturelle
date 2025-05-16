import { Op } from "sequelize";
import ComplexeConfig from "../models/complexeConfig.js";
import Utilisateur from "../models/utilisateur.js";
import Evenement from "../models/evenement.js";
import Notification from "../models/notification.js";
import sendEmail from "../utils/sendEmail.js";

// Get current configuration
export const getComplexeConfig = async (req, res) => {
  try {
    let config = await ComplexeConfig.findOne();
    if (!config) {
      // Créer une configuration par défaut
      config = await ComplexeConfig.create({
        platformName: "Centre Culturel Ouarzazate",
        contactEmail: "contact@culture-ouarzazate.ma",
        timezone: "Africa/Casablanca", 
        sessionDuration: 60,
        emailNotifications: true,
        weeklyReports: true,
        activityLogging: true,
        lastUpdated: new Date()
      });
    }
    res.json(config);
  } catch (error) {
    console.error("Error fetching config:", error);
    res.status(500).json({ message: "Erreur lors de la récupération de la configuration" });
  }
};

// Update configuration
export const updateComplexeConfig = async (req, res) => {
  try {
    const {
      platformName,
      contactEmail,
      timezone,
      sessionDuration,
      emailNotifications,
      weeklyReports,
      activityLogging
    } = req.body;

    // Validation des champs
    if (contactEmail && !contactEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: "Format d'email invalide" });
    }

    if (sessionDuration && (sessionDuration < 15 || sessionDuration > 240)) {
      return res.status(400).json({ message: "La durée de session doit être entre 15 et 240 minutes" });
    }

    let config = await ComplexeConfig.findOne();
    if (!config) {
      config = await ComplexeConfig.create({});
    }

    const updatedConfig = await config.update({
      platformName: platformName || config.platformName,
      contactEmail: contactEmail || config.contactEmail,
      timezone: timezone || config.timezone,
      sessionDuration: sessionDuration || config.sessionDuration,
      emailNotifications: emailNotifications !== undefined ? emailNotifications : config.emailNotifications,
      weeklyReports: weeklyReports !== undefined ? weeklyReports : config.weeklyReports,
      activityLogging: activityLogging !== undefined ? activityLogging : config.activityLogging,
      lastUpdated: new Date(),
      lastUpdatedBy: req.user.id
    });

    res.json(updatedConfig);
  } catch (error) {
    console.error("Error updating config:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la configuration" });
  }
};

export const sendNewsletter = async (req, res) => {
  try {
    const config = await ComplexeConfig.findOne();
    if (!config) {
      return res.status(404).json({ message: "Configuration non trouvée" });
    }

    const upcomingEvents = await Evenement.findAll({
      where: {
        date_debut: {
          [Op.gte]: new Date()
        }
      },
      order: [['date_debut', 'ASC']],
      limit: 5
    });

    const users = await Utilisateur.findAll({
      where: {
        email_notifications: true,
        email: {
          [Op.ne]: null,
          [Op.ne]: ''
        }
      }
    });

    let newsletterContent = `Bonjour [Nom],\n\n`;
    newsletterContent += `Voici les prochains événements au ${config.platformName} :\n\n`;

    if (upcomingEvents.length > 0) {
      upcomingEvents.forEach(event => {
        newsletterContent += `- ${event.titre}\n`;
        newsletterContent += `  Date: ${new Date(event.date_debut).toLocaleDateString()}\n`;
        newsletterContent += `  Type: ${event.type}\n\n`;
      });
    } else {
      newsletterContent += "Aucun événement n'est prévu pour le moment.\n\n";
    }

    newsletterContent += `N'hésitez pas à consulter notre site pour plus d'informations.\n\n`;
    newsletterContent += `Cordialement,\nL'équipe du Centre Culturel`;

    let successCount = 0;
    let errorCount = 0;
    
    for (const user of users) {
      try {
        await Notification.create({
          utilisateurId: user.id,
          type: 'newsletter',
          message: 'Nouvelle newsletter du Centre Culturel',
          is_read: false
        });

        await sendEmail({
          to: user.email,
          subject: `Newsletter du ${config.platformName}`,
          text: newsletterContent.replace('[Nom]', user.nom || 'Client')
        });
        
        successCount++;
      } catch (err) {
        console.error(`Erreur lors de l'envoi à ${user.email}:`, err);
        errorCount++;
      }
    } // Ajout de l'accolade manquante ici

    res.json({ 
      message: `Newsletter envoyée avec succès à ${successCount} utilisateurs${errorCount > 0 ? `, échec pour ${errorCount} utilisateurs` : ''}`,
      successCount,
      errorCount
    });

  } catch (error) {
    console.error("Erreur lors de l'envoi de la newsletter:", error);
    res.status(500).json({ message: "Erreur lors de l'envoi de la newsletter" });
  }
};
