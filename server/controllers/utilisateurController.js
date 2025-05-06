import Utilisateur from "../models/utilisateur.js";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getUtilisateurByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email est requis" });
    }

    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Ne pas renvoyer le mot de passe
    const { password, ...userData } = utilisateur.get({ plain: true });
    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, email, telephone, adresse, role } = req.body;
    
    let imagePath = null;
    
    if (req.file) {
        imagePath = `/uploads/profiles/${req.file.filename}`;
        
        // Supprimez l'ancienne image si elle existe
        if (user.image_profil) {
          const oldImagePath = path.join(__dirname, '../public', user.image_profil);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

    const updateData = {
      nom,
      email,
      telephone,
      adresse,
      role,
      ...(imagePath && { image_profil: imagePath })
    };

    const [updated] = await Utilisateur.update(updateData, { where: { id } });
    
    if (updated) {
      const updatedUser = await Utilisateur.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(currentPassword, utilisateur.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await utilisateur.update({ password: hashedPassword });

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};