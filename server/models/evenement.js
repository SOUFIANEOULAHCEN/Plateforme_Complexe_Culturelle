import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Utilisateur from './utilisateur.js';

const Evenement = sequelize.define('evenement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date_debut: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  date_fin: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  espace_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('spectacle', 'atelier', 'conference', 'exposition', 'rencontre'),
    allowNull: false,
  },
  affiche_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createur_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  prix: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  statut: {
    type: DataTypes.ENUM('planifie', 'confirme', 'annule'),
    defaultValue: 'planifie',
  },
}, {
  tableName: 'evenement',
  timestamps: false,
});

// Établir l'association avec l'utilisateur créateur
Evenement.belongsTo(Utilisateur, { foreignKey: 'createur_id', as: 'createur' });

export default Evenement;