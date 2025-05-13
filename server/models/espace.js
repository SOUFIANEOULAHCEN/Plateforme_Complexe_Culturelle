import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Espace = sequelize.define(
  "espace",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("salle", "atelier", "exposition", "cinéma"),
      allowNull: false,
    },
    sous_type: {
      type: DataTypes.ENUM(
        "théâtre",
        "bibliothèque",
        "informatique",
        "musique",
        "conférence",
        "café",
        "photographie",
        "langue",
        "arts"
      ),
      allowNull: true,
    },
    capacite: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "espace",
    timestamps: false,
  }
);

export default Espace;
