import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Utilisateur from './utilisateur.js';

const EventProposal = sequelize.define('event_proposal', {
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
  proposeur_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    }
  },
  proposeur_nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  proposeur_telephone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  prix: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'approuve', 'rejete'),
    defaultValue: 'en_attente',
  },
  commentaire_admin: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  traite_par: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Utilisateur,
      key: 'id',
    },
  },
  date_traitement: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'event_proposals',
  timestamps: true,
});

// Association with the admin who processed the proposal
EventProposal.belongsTo(Utilisateur, { foreignKey: 'traite_par', as: 'administrateur' });

export default EventProposal;