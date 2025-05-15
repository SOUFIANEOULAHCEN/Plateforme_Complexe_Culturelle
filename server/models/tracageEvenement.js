import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Evenement from './evenement.js';
import Utilisateur from './utilisateur.js';

const TracageEvenement = sequelize.define('tracage_evenement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  evenement_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  affiche_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  proposeur_nom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  proposeur_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date_tracage: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'tracage_evenement',
  timestamps: false,
});

TracageEvenement.belongsTo(Evenement, { foreignKey: 'evenement_id', as: 'evenement' });
TracageEvenement.belongsTo(Utilisateur, { foreignKey: 'user_id', as: 'user' });

export default TracageEvenement; 