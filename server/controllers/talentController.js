/// backend/controllers/talentController.js

import Utilisateur from "../models/utilisateur.js";
import bcrypt from "bcryptjs";
import fs from "fs";

export const getTalentByEmail = async (req, res) => {
  try {
    console.log('Query params:', req.query); // Debug
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        message: "Le paramètre email est requis dans l'URL : /api/talent?email=example@mail.com" 
      });
    }

    const talent = await Utilisateur.findOne({ 
      where: { 
        email: email,
        is_talent: true 
      }
    });
    
    if (!talent) {
      return res.status(404).json({ 
        message: `Aucun talent trouvé avec l'email ${email}` 
      });
    }
    
    res.json(talent);
  } catch (error) {
    console.error('Error fetching talent:', error);
    res.status(500).json({ 
      message: "Erreur serveur lors de la récupération du talent",
      error: error.message 
    });
  }
};

export const updateTalent = async (req, res) => {
  try {
    

    const { id } = req.params;
    let updates = { ...req.body };

    // Convertir les champs JSON si ce sont des chaînes
    if (typeof updates.reseaux_sociaux === 'string') {
      try {
        updates.reseaux_sociaux = JSON.parse(updates.reseaux_sociaux);
      } catch {
        updates.reseaux_sociaux = {};
      }
    }

    if (typeof updates.experience === 'string') {
      try {
        updates.experience = JSON.parse(updates.experience);
      } catch {
        updates.experience = [];
      }
    }

    // Convertir les champs numériques
    updates.annees_experience = updates.annees_experience === '' ? null : parseInt(updates.annees_experience);

    // Nettoyer les champs vides sauf ceux qui acceptent des chaînes vides explicitement
    for (const key in updates) {
      if (updates[key] === '') {
        updates[key] = null;
      }
    }

    // Gestion des fichiers envoyés
    if (req.files?.image_profil) {
      updates.image_profil = `/uploads/profiles/${req.files.image_profil[0].filename}`;
    }

    if (req.files?.cv) {
      updates.cv = `/uploads/${req.files.cv[0].filename}`;
    }

    // Mise à jour dans la base de données
    const [updated] = await Utilisateur.update(updates, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: "Talent non trouvé" });
    }

    const updatedTalent = await Utilisateur.findByPk(id);
    res.json(updatedTalent);

  } catch (error) {
    console.error('Erreur dans updateTalent:', error);
    res.status(500).json({
      message: 'Erreur serveur',
      error: error.message
    });
  }
};


export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Vérifier que les deux champs sont fournis
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Les champs 'currentPassword' et 'newPassword' sont requis" });
    }

    const talent = await Utilisateur.findByPk(id);
    console.log("Utilisateur récupéré :", talent?.email);

    if (!talent) {
      return res.status(404).json({ message: "Talent non trouvé" });
    }


    // Corriger le préfixe $2y$ → $2b$ si nécessaire
    let storedPassword = talent.password;
    if (storedPassword.startsWith("$2y$")) {
      storedPassword = storedPassword.replace("$2y$", "$2b$");
    }
    // Comparer les mots de passe
    const isMatch = await bcrypt.compare(currentPassword, storedPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }
    console.log("Comparaison avec bcrypt :", currentPassword, "vs", storedPassword);


    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await talent.update({ password: hashedPassword });

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur dans updatePassword:", error);
    res.status(500).json({ message: error.message });
  }
};