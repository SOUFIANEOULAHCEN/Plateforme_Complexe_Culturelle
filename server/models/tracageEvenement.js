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
    allowNull: false,
    references: {
      model: Evenement,
      key: 'id',
    },
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'acceptation',
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Utilisateur,
      key: 'id',
    },
  },
  date_tracage: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'tracage_evenement',
  timestamps: false,
});

TracageEvenement.belongsTo(Evenement, { foreignKey: 'evenement_id', as: 'evenement' });
TracageEvenement.belongsTo(Utilisateur, { foreignKey: 'user_id', as: 'user' });

export default TracageEvenement; 