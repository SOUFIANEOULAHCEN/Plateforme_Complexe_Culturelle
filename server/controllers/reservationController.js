import Reservation from '../models/reservation.js';
import Evenement from '../models/evenement.js';
import Utilisateur from '../models/utilisateur.js'; // Add this import
import Espace from '../models/espace.js';
import { Op } from 'sequelize';
import sendEmail from '../utils/sendEmail.js';

// Règles de documents requis par type de réservateur
const DOCUMENTS_REQUIS = {
  individu: ['cni_ou_acte_naissance'],
  association: ['statuts', 'recu_adhesion'],
  entreprise: ['documents_legaux', 'recu_adhesion'],
  institution: ['lettre_officielle']
};

// Délais requis (en jours)
const DELAI_RESERVATION = 15;
const DELAI_ANNULATION = 7;

export const createReservation = async (req, res) => {
  try {
    const {
      titre,
      description,
      type_organisateur,
      date_debut,
      date_fin,
      espace_id,
      utilisateur_id,
      nombre_places,
      documents_fournis,
      documents_paths,
      materiel_additionnel,
      commentaires
    } = req.body;

    // Vérification des champs obligatoires
    if (!utilisateur_id) {
      return res.status(400).json({ 
        message: "L'ID de l'utilisateur est requis"
      });
    }

    if (!espace_id) {
      return res.status(400).json({ 
        message: "L'ID de l'espace est requis"
      });
    }

    // Vérifier le type d'organisateur
    if (!['individu', 'association', 'entreprise'].includes(type_organisateur)) {
      return res.status(400).json({ 
        message: 'Type d\'organisateur invalide'
      });
    }

    // Vérifier que l'espace existe
    const espace = await Espace.findByPk(espace_id);
    if (!espace) {
      return res.status(400).json({
        message: 'Espace non trouvé'
      });
    }

    // Vérifier que l'utilisateur existe
    const utilisateur = await Utilisateur.findByPk(utilisateur_id);
    if (!utilisateur) {
      return res.status(400).json({
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier la capacité de l'espace
    if (espace.capacite && nombre_places > espace.capacite) {
      return res.status(400).json({
        message: `Le nombre de places demandé (${nombre_places}) dépasse la capacité de l'espace (${espace.capacite})`
      });
    }

    // Vérifier le délai de réservation
    const dateReservation = new Date(date_debut);
    const aujourdhui = new Date();
    const joursAvantReservation = Math.ceil((dateReservation - aujourdhui) / (1000 * 60 * 60 * 24));

    if (joursAvantReservation < DELAI_RESERVATION) {
      return res.status(400).json({
        message: `La réservation doit être faite au moins ${DELAI_RESERVATION} jours à l'avance`
      });
    }

    // Ajoute ce check AVANT la vérification de chevauchement
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');
    const forcer = req.body.forcer === true;

    // Vérifier si l'espace est déjà réservé pour cette période
    if (!(isAdmin && forcer)) {
      const reservationExistante = await Reservation.findOne({
        where: {
          espace_id,
          statut: {
            [Op.notIn]: ['annule', 'termine']
          },
          [Op.or]: [
            {
              date_debut: {
                [Op.between]: [date_debut, date_fin]
              }
            },
            {
              date_fin: {
                [Op.between]: [date_debut, date_fin]
              }
            }
          ]
        }
      });

      if (reservationExistante) {
        return res.status(400).json({
          message: 'L\'espace est déjà réservé pour cette période'
        });
      }
    }

    // Créer la réservation
    const reservation = await Reservation.create({
      titre,
      description,
      type_reservation: 'standard',
      type_organisateur,
      date_debut,
      date_fin,
      espace_id,
      utilisateur_id,
      nombre_places,
      documents_fournis,
      documents_paths,
      materiel_additionnel,
      statut: 'en_attente',
      commentaires
    });

    res.status(201).json(reservation);
  } catch (err) {
    console.error("Erreur création réservation:", err);
    res.status(500).json({ 
      message: "Erreur lors de l'enregistrement de la réservation",
      error: err.message 
    });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Updating reservation with ID:", id);
    console.log("Update payload:", req.body);

    // Vérifier que l'ID est un nombre valide
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ 
        message: "ID de réservation invalide" 
      });
    }

    // Vérifier que la réservation existe
    const reservation = await Reservation.findByPk(id, {
      include: [
        { model: Utilisateur, as: 'utilisateur' },
        { model: Espace, as: 'espace' }
      ]
    });

    if (!reservation) {
      return res.status(404).json({ 
        message: "Réservation non trouvée",
        id: id,
        details: "La réservation avec cet ID n'existe pas dans la base de données"
      });
    }

    // Vérifier si la date de début est modifiée
    if (req.body.date_debut && new Date(req.body.date_debut).getTime() !== new Date(reservation.date_debut).getTime()) {
      const dateReservation = new Date(req.body.date_debut);
      const aujourdhui = new Date();
      const joursAvantReservation = Math.ceil((dateReservation - aujourdhui) / (1000 * 60 * 60 * 24));

      // Si la réservation est déjà confirmée, on ne vérifie pas le délai de 15 jours
      if (reservation.statut !== 'confirme' && joursAvantReservation < DELAI_RESERVATION) {
        return res.status(400).json({
          message: `La réservation doit être faite au moins ${DELAI_RESERVATION} jours à l'avance`
        });
      }

      // Vérifier si l'espace est déjà réservé pour la nouvelle période
      const reservationExistante = await Reservation.findOne({
        where: {
          espace_id: reservation.espace_id,
          id: { [Op.ne]: id },
          statut: {
            [Op.notIn]: ['annule', 'termine']
          },
          [Op.or]: [
            {
              date_debut: {
                [Op.between]: [req.body.date_debut, req.body.date_fin]
              }
            },
            {
              date_fin: {
                [Op.between]: [req.body.date_debut, req.body.date_fin]
              }
            }
          ]
        }
      });

      if (reservationExistante) {
        return res.status(400).json({
          message: 'L\'espace est déjà réservé pour cette période'
        });
      }
    }

    // Si c'est une annulation
    if (req.body.statut === 'annule') {
      req.body.date_annulation = new Date();
    }

    // Mise à jour de la réservation
    const [updated] = await Reservation.update(req.body, { 
      where: { id }
    });

    if (updated) {
      const updatedReservation = await Reservation.findByPk(id, {
        include: [
          { model: Utilisateur, as: 'utilisateur' },
          { model: Espace, as: 'espace' }
        ]
      });

      // Si la date a été modifiée et que la réservation est confirmée, envoyer un email
      if (req.body.date_debut && reservation.statut === 'confirme' && 
          new Date(req.body.date_debut).getTime() !== new Date(reservation.date_debut).getTime()) {
        try {
          await sendEmail({
            to: updatedReservation.utilisateur.email,
            subject: 'Modification de votre réservation',
            text: `Bonjour ${updatedReservation.utilisateur.nom || ''},

Votre réservation a été modifiée.

Nouveaux détails de la réservation :
- Titre : ${updatedReservation.titre}
- Date de début : ${new Date(updatedReservation.date_debut).toLocaleDateString()}
- Date de fin : ${new Date(updatedReservation.date_fin).toLocaleDateString()}

Merci de votre compréhension.

Cordialement,
L'équipe de gestion des réservations`
          });
        } catch (emailError) {
          console.error("Erreur lors de l'envoi de l'email:", emailError);
          // On continue même si l'email échoue
        }
      }

      res.json(updatedReservation);
    } else {
      res.status(404).json({ 
        message: "Réservation non trouvée",
        id: id,
        details: "La mise à jour n'a pas pu être effectuée"
      });
    }
  } catch (err) {
    console.error("Erreur mise à jour réservation:", err);
    res.status(500).json({ 
      message: "Erreur lors de la modification de la réservation",
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);
    
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Vérifier si la réservation peut être supprimée
    const dateReservation = new Date(reservation.date_debut);
    const aujourdhui = new Date();
    const joursAvantReservation = Math.ceil((dateReservation - aujourdhui) / (1000 * 60 * 60 * 24));

    if (joursAvantReservation < DELAI_RESERVATION) {
      return res.status(400).json({
        message: `La réservation ne peut plus être supprimée car elle est dans moins de ${DELAI_RESERVATION} jours`
      });
    }

    await reservation.destroy();
    res.json({ message: 'Réservation supprimée' });
  } catch (err) {
    console.error("Erreur suppression réservation:", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getReservations = async (req, res) => {
  try {
    const { utilisateur_email } = req.query;
    
    if (utilisateur_email) {
      // First find the user by email
      const user = await Utilisateur.findOne({
        where: { email: utilisateur_email }
      });
      
      if (!user) {
        return res.json([]); // Return empty array if user not found
      }
      
      // Then find reservations by user ID with relations
      const reservations = await Reservation.findAll({
        where: { utilisateur_id: user.id },
        include: [
          { 
            model: Utilisateur,
            as: 'utilisateur',
            attributes: ['id', 'nom', 'email']
          },
          {
            model: Espace,
            as: 'espace',
            attributes: ['id', 'nom']
          }
        ]
      });
      
      return res.json(reservations);
    }
    
    // If no email filter, return all reservations with relations
    const reservations = await Reservation.findAll({
      include: [
        { 
          model: Utilisateur,
          as: 'utilisateur',
          attributes: ['id', 'nom', 'email']
        },
        {
          model: Espace,
          as: 'espace',
          attributes: ['id', 'nom']
        }
      ]
    });
    
    res.json(reservations);
  } catch (err) {
    console.error("Erreur lors de la récupération des réservations:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Suppose que reservedPeriods contient les réservations existantes pour l'espace sélectionné
function isDateReserved(dateDebut, dateFin) {
  return reservedPeriods.some(period => {
    const start = new Date(period.date_debut);
    const end = new Date(period.date_fin);
    return (
      (new Date(dateDebut) < end) && (new Date(dateFin) > start)
    );
  });
}

export const decisionReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision } = req.body; // 'confirme' ou 'annule'
    
    if (!['confirme', 'annule'].includes(decision)) {
      return res.status(400).json({ message: "Décision invalide" });
    }

    // Récupérer la réservation avec l'utilisateur associé
    const reservation = await Reservation.findByPk(id, {
      include: [
        { 
          model: Utilisateur,
          as: 'utilisateur'
        }
      ]
    });

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Mettre à jour le statut
    reservation.statut = decision;
    if (decision === 'annule') {
      reservation.date_annulation = new Date();
    }
    await reservation.save();

    // Envoi d'email avec un message plus détaillé
    if (reservation.utilisateur && reservation.utilisateur.email) {
      let subject, text;
      if (decision === 'confirme') {
        subject = 'Votre réservation a été acceptée';
        text = `Bonjour ${reservation.utilisateur.nom || ''},

Votre réservation a été acceptée.

Détails de la réservation :
- Titre : ${reservation.titre}
- Date de début : ${new Date(reservation.date_debut).toLocaleDateString()}
- Date de fin : ${new Date(reservation.date_fin).toLocaleDateString()}

Pour finaliser votre réservation, veuillez vous présenter au bureau du directeur avec les documents suivants :
1. Une pièce d'identité valide
2. Les documents spécifiques à votre type de réservation
3. Le paiement des frais de réservation

Le directeur vous remettra alors votre badge d'accès et vous donnera toutes les informations nécessaires pour votre événement.

Merci de votre confiance.

Cordialement,
L'équipe de gestion des réservations`;
      } else {
        subject = 'Votre réservation a été refusée';
        text = `Bonjour ${reservation.utilisateur.nom || ''},

Nous regrettons de vous informer que votre réservation (ID: ${reservation.id}) a été refusée.

Détails de la réservation :
- Titre : ${reservation.titre}
- Date de début : ${new Date(reservation.date_debut).toLocaleDateString()}
- Date de fin : ${new Date(reservation.date_fin).toLocaleDateString()}

Si vous souhaitez plus d'informations sur les raisons de ce refus, n'hésitez pas à contacter notre service client.

Merci de votre compréhension.

Cordialement,
L'équipe de gestion des réservations`;
      }

      await sendEmail({ 
        to: reservation.utilisateur.email, 
        subject, 
        text 
      });
    }

    res.json({ 
      message: `Réservation ${decision === 'confirme' ? 'acceptée' : 'refusée'} et email envoyé.`,
      reservation: {
        ...reservation.toJSON(),
        utilisateur: {
          email: reservation.utilisateur.email,
          nom: reservation.utilisateur.nom
        }
      }
    });
  } catch (err) {
    console.error('Erreur décision réservation:', err);
    res.status(500).json({ 
      message: "Erreur lors du traitement de la décision", 
      error: err.message 
    });
  }
};