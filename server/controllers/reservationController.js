import Reservation from '../models/reservation.js';
import Evenement from '../models/evenement.js';

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
      evenement_id,
      utilisateur_id,
      type_reservateur,
      documents_fournis,
      date_reservation,
      nombre_places,
      materiel_requis,
      commentaires
    } = req.body;

    // Vérifier le type de réservateur
    if (!['individu', 'association', 'entreprise', 'institution'].includes(type_reservateur)) {
      return res.status(400).json({ 
        message: 'Type de réservateur invalide'
      });
    }

    // Vérifier les documents requis
    const documentsManquants = DOCUMENTS_REQUIS[type_reservateur].filter(
      doc => !documents_fournis || !documents_fournis[doc]
    );
    if (documentsManquants.length > 0) {
      return res.status(400).json({
        message: 'Documents manquants',
        documentsManquants
      });
    }

    // Vérifier le délai de réservation
    const dateReservation = new Date(date_reservation);
    const aujourdhui = new Date();
    const joursAvantReservation = Math.ceil((dateReservation - aujourdhui) / (1000 * 60 * 60 * 24));

    if (joursAvantReservation < DELAI_RESERVATION) {
      return res.status(400).json({
        message: `La réservation doit être faite au moins ${DELAI_RESERVATION} jours à l'avance`
      });
    }

    // Créer la réservation
    const reservation = await Reservation.create({
      evenement_id,
      utilisateur_id,
      type_reservateur,
      documents_fournis,
      date_reservation,
      nombre_places,
      materiel_requis,
      commentaires,
      statut: 'en_attente'
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

    // Si c'est une annulation, vérifier le délai
    if (req.body.statut === 'annule') {
      const dateReservation = new Date(reservation.date_reservation);
      const aujourdhui = new Date();
      const joursAvantReservation = Math.ceil((dateReservation - aujourdhui) / (1000 * 60 * 60 * 24));

      if (joursAvantReservation < DELAI_ANNULATION) {
        return res.status(400).json({
          message: `L'annulation doit être faite au moins ${DELAI_ANNULATION} jours à l'avance`
        });
      }

      req.body.date_annulation = new Date();
    }

    // Pour une modification, vérifier la disponibilité si la date change
    if (req.body.date_reservation && req.body.date_reservation !== reservation.date_reservation) {
      const evenement = await Evenement.findByPk(reservation.evenement_id);
      const dateReservation = new Date(req.body.date_reservation);
      
      // Vérifier que la date est dans la plage de l'événement
      if (dateReservation < evenement.date_debut || dateReservation > evenement.date_fin) {
        return res.status(400).json({
          message: 'La date de réservation doit être comprise dans la période de l\'événement'
        });
      }
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

    // Vérifier le délai d'annulation avant suppression
    const dateReservation = new Date(reservation.date_reservation);
    const aujourdhui = new Date();
    const joursAvantReservation = Math.ceil((dateReservation - aujourdhui) / (1000 * 60 * 60 * 24));

    if (joursAvantReservation < DELAI_ANNULATION) {
      return res.status(400).json({
        message: `La suppression doit être faite au moins ${DELAI_ANNULATION} jours à l'avance`
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
    const reservations = await Reservation.findAll({
      order: [['date_reservation', 'DESC']]
    });
    res.json(reservations);
  } catch (err) {
    console.error("Erreur récupération réservations:", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};