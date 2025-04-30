import express from "express";
import Utilisateur from "../models/utilisateur.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import upload from "../config/multerConfig.js";

// 🛠 Import controllers
import { 
  getUtilisateurByEmail, 
  updateUtilisateur, 
  updatePassword 
} from "../controllers/utilisateurController.js";

const router = express.Router();

// ✅ Route: Get all utilisateurs (optionally filter by is_talent)
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

// ✅ Route: Get utilisateur by ID
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

// ✅ Route: Search utilisateur by email
router.get("/search/by-email", verifyToken, getUtilisateurByEmail);

// ✅ Route: Create new utilisateur
router.post("/", verifyToken, async (req, res) => {
  try {
    req.body.password = req.body.password || "tempPassword123"; // Default password if not provided

    const utilisateur = await Utilisateur.create({
      ...req.body,
      is_talent: true,
      role: req.body.role || "utilisateur",
    });

    res.status(201).json(utilisateur);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
});

// ✅ Route: Update utilisateur (with optional image upload)
router.put("/:id", verifyToken, upload.single('image_profil'), updateUtilisateur);

// ✅ Route: Update utilisateur password
router.put("/:id/password", verifyToken, updatePassword);

// ✅ Route: Delete utilisateur
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
