import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Utilisateur from "./utilisateur.js";

const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  utilisateurId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Allow null for system-wide notifications
    references: {
      model: Utilisateur,
      key: "id",
    },
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  type: {
    type: DataTypes.ENUM('info', 'warning', 'success', 'error', 'event_proposal'),
    defaultValue: 'info',
  },
  reference_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // ID of the related entity (e.g., event proposal ID)
  },
  reference_type: {
    type: DataTypes.STRING,
    allowNull: true, // Type of the related entity (e.g., 'event_proposal')
  },
  for_admins_only: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "notifications",
  timestamps: true,
});

// Association (un utilisateur a plusieurs notifications)
Utilisateur.hasMany(Notification, { foreignKey: "utilisateurId" });
Notification.belongsTo(Utilisateur, { foreignKey: "utilisateurId" });

export default Notification;