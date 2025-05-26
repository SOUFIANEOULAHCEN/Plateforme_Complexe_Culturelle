import express from "express";
import Utilisateur from "../models/utilisateur.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getUtilisateurByEmail } from "../controllers/utilisateurController.js";
import TracageEvenement from "../models/tracageEvenement.js";
import Reservation from "../models/reservation.js";
import Notification from "../models/notification.js";
import Evenement from "../models/evenement.js";
import EventProposal from "../models/eventProposal.js";
import Commentaire from "../models/commentaire.js";
import path from "path";
import { unlink } from "fs/promises";

const router = express.Router();

// GET /api/utilisateurs?is_talent=true
router.get("/", verifyToken, async (req, res) => {
  try {
    const where = {};
    if (req.query.is_talent === "true") {
      where.is_talent = true;
    }
    const utilisateurs = await Utilisateur.findAll({ where });
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/utilisateurs/email/:email
router.get("/email/:email", getUtilisateurByEmail);

// GET /api/utilisateurs/check-email - Vérifier si un email existe (pas besoin d'authentification)
router.get("/check-email", async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }
    
    const utilisateur = await Utilisateur.findOne({ where: { email } });
    
    res.json({ exists: !!utilisateur });
  } catch (err) {
    console.error("Erreur lors de la vérification de l'email:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/utilisateurs/:id
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(utilisateur);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add this DELETE route
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si l'utilisateur est un superadmin
    if (utilisateur.role === 'superadmin') {
      return res.status(403).json({ message: "Impossible de supprimer un superadmin" });
    }

    // Vérifier si l'utilisateur essaie de se supprimer lui-même
    if (req.user.id === parseInt(req.params.id)) {
      return res.status(403).json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
    }

    // Supprimer les enregistrements associés
    await Promise.all([
      // Supprimer les traçages d'événements
      TracageEvenement.destroy({ where: { user_id: req.params.id } }),
      // Supprimer les réservations
      Reservation.destroy({ where: { utilisateur_id: req.params.id } }),
      // Supprimer les notifications
      Notification.destroy({ where: { utilisateurId: req.params.id } }),
      // Supprimer les événements créés
      Evenement.destroy({ where: { createur_id: req.params.id } }),
      // Supprimer les propositions d'événements traitées
      EventProposal.destroy({ where: { traite_par: req.params.id } }),
      // Supprimer les commentaires
      Commentaire.destroy({ where: { utilisateur_id: req.params.id } })
    ]);

    // Supprimer l'image de profil si elle existe
    if (utilisateur.image_profil) {
      try {
        const imagePath = path.join(process.cwd(), 'public', utilisateur.image_profil);
        await unlink(imagePath);
      } catch (err) {
        console.error("Erreur lors de la suppression de l'image de profil:", err);
      }
    }

    // Supprimer l'utilisateur
    await utilisateur.destroy();
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'utilisateur:", err);
    res.status(500).json({ 
      message: "Erreur lors de la suppression de l'utilisateur",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// POST /api/utilisateurs - Créer un nouvel utilisateur
router.post("/", verifyToken, async (req, res) => {
  try {
    const { nom, prenom, email, password, role, is_talent, domaine_artiste, description_talent } = req.body;
    
    // Vérifier si l'email existe déjà
    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Créer le nouvel utilisateur
    const newUser = await Utilisateur.create({
      nom,
      prenom,
      email,
      password, // Note: Assurez-vous que le modèle hash le mot de passe
      role: role || 'user', // Valeur par défaut si non spécifiée
      is_talent: is_talent || false,
      domaine_artiste,
      description_talent
    });

    // Ne pas renvoyer le mot de passe dans la réponse
    const userResponse = { ...newUser.toJSON() };
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur:", err);
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
  }
});

// PUT /api/utilisateurs/:id - Modifier un utilisateur existant
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, password, role, is_talent, domaine_artiste, description_talent } = req.body;

    // Trouver l'utilisateur
    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== utilisateur.email) {
      const existingUser = await Utilisateur.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }
    }

    // Mettre à jour l'utilisateur
    const updateData = {
      nom: nom || utilisateur.nom,
      prenom: prenom || utilisateur.prenom,
      email: email || utilisateur.email,
      role: role || utilisateur.role,
      is_talent: is_talent !== undefined ? is_talent : utilisateur.is_talent,
      domaine_artiste: domaine_artiste || utilisateur.domaine_artiste,
      description_talent: description_talent || utilisateur.description_talent,
      statut_talent: req.body.statut_talent || utilisateur.statut_talent,
    };

    // Mettre à jour le mot de passe seulement s'il est fourni
    if (password) {
      updateData.password = password;
    }

    await utilisateur.update(updateData);

    // Ne pas renvoyer le mot de passe dans la réponse
    const userResponse = { ...utilisateur.toJSON() };
    delete userResponse.password;

    res.json(userResponse);
  } catch (err) {
    console.error("Erreur lors de la modification de l'utilisateur:", err);
    res.status(500).json({ message: "Erreur lors de la modification de l'utilisateur" });
  }
});

export default router;
