/// backend/controllers/talentController.js

import Utilisateur from "../models/utilisateur.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from 'path';

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
      // Créer le dossier s'il n'existe pas
      const cvDir = path.join(process.cwd(), 'public', 'uploads', 'EventAffiche');
      if (!fs.existsSync(cvDir)) {
        fs.mkdirSync(cvDir, { recursive: true });
      }
      updates.cv = `/uploads/EventAffiche/${req.files.cv[0].filename}`;
    }

    // Vérifier d'abord si le talent existe
    const talent = await Utilisateur.findOne({
      where: {
        id: id,
        is_talent: true
      }
    });

    if (!talent) {
      return res.status(404).json({ message: "Talent non trouvé" });
    }

    // Mise à jour dans la base de données
    await talent.update(updates);
    
    // Récupérer le talent mis à jour
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

    const talent = await Utilisateur.findOne({
      where: {
        id: id,
        is_talent: true
      }
    });

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

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await talent.update({ password: hashedPassword });

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur dans updatePassword:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getTalentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const talent = await Utilisateur.findOne({ 
      where: { 
        id: id,
        is_talent: true 
      }
    });
    
    if (!talent) {
      return res.status(404).json({ 
        message: `Aucun talent trouvé avec l'ID ${id}` 
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

export const getTalentCV = async (req, res) => {
  try {
    const { id } = req.params;
    
    const talent = await Utilisateur.findOne({ 
      where: { 
        id: id,
        is_talent: true 
      }
    });
    
    if (!talent) {
      return res.status(404).json({ 
        message: `Aucun talent trouvé avec l'ID ${id}` 
      });
    }

    if (!talent.cv) {
      return res.status(404).json({ 
        message: "CV non trouvé pour ce talent" 
      });
    }

    // Construire le chemin complet du fichier
    const cvPath = path.join(process.cwd(), 'public', talent.cv);

    // Vérifier si le fichier existe
    if (!fs.existsSync(cvPath)) {
      console.error('CV file not found at path:', cvPath);
      return res.status(404).json({ 
        message: "Le fichier CV n'existe pas sur le serveur" 
      });
    }

    // Déterminer le type MIME du fichier
    const ext = path.extname(cvPath).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Envoyer le fichier avec le bon type MIME
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="CV_${talent.nom}${ext}"`);
    res.sendFile(cvPath);
  } catch (error) {
    console.error('Error fetching talent CV:', error);
    res.status(500).json({ 
      message: "Erreur serveur lors de la récupération du CV",
      error: error.message 
    });
  }
};