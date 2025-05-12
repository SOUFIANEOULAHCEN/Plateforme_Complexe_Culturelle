import Reservation from '../models/reservation.js';
import Evenement from '../models/evenement.js';
import Utilisateur from '../models/utilisateur.js'; // Add this import
import Espace from '../models/espace.js';
import { Op } from 'sequelize';

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

    // Vérifier si l'espace est déjà réservé pour cette période
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
    const reservation = await Reservation.findByPk(id);
    
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Vérifier si la date de début est modifiée
    if (req.body.date_debut && req.body.date_debut !== reservation.date_debut) {
      const dateReservation = new Date(req.body.date_debut);
      const aujourdhui = new Date();
      const joursAvantReservation = Math.ceil((dateReservation - aujourdhui) / (1000 * 60 * 60 * 24));

      if (joursAvantReservation < DELAI_RESERVATION) {
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

    const [updated] = await Reservation.update(req.body, { 
      where: { id },
      returning: true
    });

    if (updated) {
      const updatedReservation = await Reservation.findByPk(id);
      res.json(updatedReservation);
    } else {
      res.status(404).json({ message: "Réservation non trouvée" });
    }
  } catch (err) {
    console.error("Erreur mise à jour réservation:", err);
    res.status(500).json({ 
      message: "Erreur lors de la modification de la réservation",
      error: err.message 
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
      
      // Then find reservations by user ID
      const reservations = await Reservation.findAll({
        where: { utilisateur_id: user.id }
      });
      
      return res.json(reservations);
    }
    
    // If no email filter, return all reservations
    const reservations = await Reservation.findAll();
    
    res.json(reservations);
  } catch (err) {
    console.error("Erreur lors de la récupération des réservations:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};