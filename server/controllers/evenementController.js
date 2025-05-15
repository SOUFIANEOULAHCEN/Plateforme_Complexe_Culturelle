import Evenement from "../models/evenement.js";
import Utilisateur from "../models/utilisateur.js";
import TracageEvenement from '../models/tracageEvenement.js';

export const getEvenements = async (req, res) => {
  try {
    const { createur_email, date_debut_min, date_debut_max } = req.query;
    const where = {};
    if (date_debut_min) {
      where.date_debut = { ...(where.date_debut || {}), $gte: new Date(date_debut_min) };
    }
    if (date_debut_max) {
      where.date_debut = { ...(where.date_debut || {}), $lte: new Date(date_debut_max) };
    }
    let include = [
      {
        model: Utilisateur,
        as: 'createur',
        attributes: ['id', 'nom', 'email']
      }
    ];
    if (createur_email) {
      include[0].where = { email: createur_email };
    }
    const evenements = await Evenement.findAll({ where, include });
    // Injecter proposeur_email fallback si absent
    const evenementsWithProposeur = evenements.map(ev => ({
      ...ev.toJSON(),
      proposeur_email: ev.proposeur_email || (ev.createur ? ev.createur.email : null)
    }));
    res.json(evenementsWithProposeur);
  } catch (err) {
    console.error("Erreur lors de la récupération des événements:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// evenementController.js
export const createEvenement = async (req, res) => {
  try {
    // Vérifier que les champs obligatoires sont présents
    if (
      !req.body.titre ||
      !req.body.date_debut ||
      !req.body.date_fin ||
      !req.body.espace_id ||
      !req.body.type
    ) {
      return res
        .status(400)
        .json({ message: "Tous les champs obligatoires doivent être remplis" });
    }

    // Vérifier que createur_id est présent (si nécessaire)
    if (!req.body.createur_id) {
      return res.status(400).json({ message: "Createur ID est requis" });
    }

    // Gestion de l'upload de l'affiche
    let affiche_url = null;
    if (req.file) {
      affiche_url = `/uploads/EventAffiche/${req.file.filename}`;
    }

    const evenement = await Evenement.create({
      ...req.body,
      affiche_url,
    });
    res.status(201).json(evenement);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({
      message: "Erreur serveur",
      error: err.message, // Ajouter ceci pour le débogage
    });
  }
};

export const updateEvenement = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Evenement.update(req.body, { where: { id } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteEvenement = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Evenement.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    await TracageEvenement.destroy({ where: { evenement_id: id } });
    await event.destroy();
    res.json({ message: "Événement supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'événement:", err);
    res.status(500).json({ message: "Erreur lors de la suppression de l'événement", error: err.message });
  }
};

export const getEvenementById = async (req, res) => {
  try {
    const { id } = req.params;
    const evenement = await Evenement.findByPk(id);

    if (!evenement) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    res.json(evenement);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
