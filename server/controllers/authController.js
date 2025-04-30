import Utilisateur from "../models/utilisateur.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Op } from "sequelize";



// Configuration du transporteur email (à mettre en haut du fichier)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* -------------------------------------------------------------------------- */

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1. Vérifier si l'utilisateur existe
    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      return res.status(404).json({ message: "Aucun utilisateur avec cet email." });
    }

    // 2. Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // 3. Définir une expiration (1 heure)
    const resetPasswordExpires = Date.now() + 3600000;

    // 4. Mettre à jour l'utilisateur
    await utilisateur.update({
      resetPasswordToken,
      resetPasswordExpires
    });

    // 5. Créer l'URL de réinitialisation
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 6. Envoyer l'email
    const mailOptions = {
      to: utilisateur.email,
      from: process.env.EMAIL_FROM,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <p>Vous avez demandé une réinitialisation de mot de passe</p>
        <p>Cliquez sur ce lien pour définir un nouveau mot de passe :</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email de réinitialisation envoyé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // 1. Hasher le token pour le comparer
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 2. Trouver l'utilisateur avec token valide et non expiré
    const utilisateur = await Utilisateur.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!utilisateur) {
      return res.status(400).json({ message: "Token invalide ou expiré." });
    }

    // 3. Hasher le nouveau mot de passe
    const hash = await bcrypt.hash(password, 10);

    // 4. Mettre à jour le mot de passe et effacer le token
    await utilisateur.update({
      password: hash,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    // 5. Envoyer un email de confirmation
    const mailOptions = {
    
      to: utilisateur.email,
      from: process.env.EMAIL_FROM,
      subject: 'Mot de passe modifié',
      html: `
        <p>Votre mot de passe a été modifié avec succès.</p>
        <p>Si vous n'avez pas effectué cette modification, veuillez nous contacter immédiatement.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};



/* -------------------------------------------------------------------------- */
export const register = async (req, res) => {
  const { nom, email, password } = req.body;
  try {
    const utilisateurExiste = await Utilisateur.findOne({ where: { email } });
    if (utilisateurExiste) {
      return res.status(400).json({ message: "L'email existe déjà." });
    }
    const hash = await bcrypt.hash(password, 10);
    const utilisateur = await Utilisateur.create({
      nom,
      email,
      password: hash,
    });
    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect." });
    }
    const isMatch = await bcrypt.compare(password, utilisateur.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect." });
    }
    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "developpement",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, 
      // maxAge: 10 * 60 * 1000,
    });

    // Ajout de isTalent et adaptation du rôle si talent
    const isTalent = utilisateur.is_talent === true;
    const role = isTalent ? "talent" : utilisateur.role;

    res.json({
      token,
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: role,
        isTalent: isTalent
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Déconnexion réussie" });
};
