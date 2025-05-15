import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Utilisateur from './utilisateur.js';
import Espace from './espace.js';

const Reservation = sequelize.define('reservation', {
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
  type_reservation: {
    type: DataTypes.ENUM('standard', 'evenement'),
    defaultValue: 'standard',
  },
  type_organisateur: {
    type: DataTypes.ENUM('individu', 'association', 'entreprise'),
    defaultValue: 'individu',
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
  utilisateur_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre_places: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  documents_fournis: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  documents_paths: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  materiel_additionnel: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'confirme', 'annule', 'termine'),
    defaultValue: 'en_attente',
  },
  date_annulation: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  commentaires: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'reservations',
  timestamps: true
});

// Définir les associations
Reservation.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id', as: 'utilisateur' });
Reservation.belongsTo(Espace, { foreignKey: 'espace_id', as: 'espace' });

export default Reservation;