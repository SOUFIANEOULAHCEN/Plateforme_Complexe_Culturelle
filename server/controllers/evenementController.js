import Evenement from "../models/evenement.js";
import Utilisateur from "../models/utilisateur.js";

export const getEvenements = async (req, res) => {
  try {
    const { createur_email } = req.query;
    
    if (createur_email) {
      // Joindre la table utilisateur pour filtrer par email du créateur
      const evenements = await Evenement.findAll({
        include: [
          {
            model: Utilisateur,
            as: 'createur',
            where: { email: createur_email },
            attributes: ['id', 'nom', 'email']
          }
        ]
      });
      return res.json(evenements);
    }
    
    // Si pas de filtre par email, retourner tous les événements
    const evenements = await Evenement.findAll();
    res.json(evenements);
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

    const evenement = await Evenement.create(req.body);
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
