const User = require('../models/User');
const path = require('path');
const fs = require('fs');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    await User.update(req.user.id, req.body);
    res.json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await User.updatePassword(req.user.id, currentPassword, newPassword);
    res.json({ message: 'Mot de passe changé avec succès' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier uploadé' });
    }

    const imagePath = `/uploads/profile_images/${req.file.filename}`;
    await User.updateProfileImage(req.user.id, imagePath);
    
    res.json({ 
      message: 'Image de profil mise à jour',
      imagePath 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};