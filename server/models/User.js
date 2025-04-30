const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT id, nom, email, role, date_inscription, is_talent, 
       domaine_artiste, description_talent, image_profil, statut_talent
       FROM utilisateur WHERE id = ?`, 
      [id]
    );
    return rows[0];
  }

  static async update(id, updates) {
    const allowedFields = [
      'nom', 'domaine_artiste', 'description_talent', 'image_profil'
    ];
    const fieldsToUpdate = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fieldsToUpdate[key] = updates[key];
      }
    });

    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new Error('Aucun champ valide à mettre à jour');
    }

    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    
    values.push(id);
    
    await db.query(
      `UPDATE utilisateur SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  static async updatePassword(id, currentPassword, newPassword) {
    // Vérifier le mot de passe actuel
    const [rows] = await db.query(
      'SELECT password FROM utilisateur WHERE id = ?', 
      [id]
    );
    
    if (rows.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    const isValid = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isValid) {
      throw new Error('Mot de passe actuel incorrect');
    }

    // Mettre à jour avec le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      'UPDATE utilisateur SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
  }

  static async updateProfileImage(id, imagePath) {
    await db.query(
      'UPDATE utilisateur SET image_profil = ? WHERE id = ?',
      [imagePath, id]
    );
  }
}

module.exports = User;