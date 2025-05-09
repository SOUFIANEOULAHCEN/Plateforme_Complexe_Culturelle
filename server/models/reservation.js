import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Evenement from './evenement.js'; // Add this import

const Reservation = sequelize.define('reservation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  evenement_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  utilisateur_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type_reservateur: {
    type: DataTypes.ENUM('individu', 'association', 'entreprise', 'institution'),
    allowNull: false,
    defaultValue: 'individu'
  },
  documents_fournis: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  date_reservation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  nombre_places: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  statut: {
    type: DataTypes.ENUM('confirme', 'annule', 'en_attente'),
    defaultValue: 'en_attente',
  },
  materiel_requis: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  commentaires: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date_annulation: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'reservation',
  timestamps: false // Désactiver les timestamps car les colonnes n'existent pas
});

// Uncomment this line to establish the association
Reservation.belongsTo(Evenement, { foreignKey: 'evenement_id', as: 'evenement' });

export default Reservation;