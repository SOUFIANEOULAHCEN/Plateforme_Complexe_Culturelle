import express from "express";
import Utilisateur from "../models/utilisateur.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

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
    await utilisateur.destroy();
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
});

export default router;
