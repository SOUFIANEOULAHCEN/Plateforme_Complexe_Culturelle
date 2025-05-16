import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ComplexeConfig = sequelize.define("ComplexeConfig", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  platformName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Centre Culturel Ouarzazate"
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "contact@culture-ouarzazate.ma"
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Africa/Casablanca"
  },
  sessionDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60 // en minutes
  },
  emailNotifications: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  weeklyReports: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  activityLogging: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  lastUpdatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Utilisateurs',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

export default ComplexeConfig;
