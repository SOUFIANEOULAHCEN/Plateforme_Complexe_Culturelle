import bcrypt from "bcryptjs";
import Utilisateur from "../models/utilisateur.js";
import { unlink } from 'fs/promises';
import path from 'path';
import { Op } from "sequelize"; // Ajoutez cet import

// Récupérer le profil de l'utilisateur connecté
export const getUserProfile = async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour les informations du profil
export const updateProfile = async (req, res) => {
  try {
    // Vérifier si req.body existe
    if (!req.body) {
      return res.status(400).json({ message: "Données de requête manquantes" });
    }
    
    // Récupérer les données du formulaire de manière sécurisée
    const nom = req.body.nom || '';
    const email = req.body.email || '';
    const telephone = req.body.telephone || '';
    const adresse = req.body.adresse || '';
    
    const user = await Utilisateur.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const emailExists = await Utilisateur.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: req.user.id } // Exclure l'utilisateur actuel de la vérification
        } 
      });
      if (emailExists) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }
    }

    // Préparer les données à mettre à jour
    const updateData = {};
    if (nom) updateData.nom = nom;
    if (email) updateData.email = email;
    if (telephone) updateData.telephone = telephone;
    if (adresse) updateData.adresse = adresse;
    
    // Mise à jour des champs
    await user.update(updateData);

    const updatedUser = await Utilisateur.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Changer le mot de passe
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await Utilisateur.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier l'ancien mot de passe
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }

    // Hasher et mettre à jour le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour l'image de profil
export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucune image n'a été fournie" });
    }

    const user = await Utilisateur.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    // Supprimer l'ancienne image si elle existe
    if (user.image_profil) {
      try {
        const oldImagePath = path.join(process.cwd(), 'public', user.image_profil);
        await unlink(oldImagePath);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'ancienne image:", error);
      }
    }

    // Mettre à jour le chemin de l'image
    const imagePath = `/uploads/profiles/${req.file.filename}`;
    await user.update({ image_profil: imagePath });

    const updatedUser = await Utilisateur.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'image de profil:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};