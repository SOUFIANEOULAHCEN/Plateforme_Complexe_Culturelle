import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import evenementRoutes from "./routes/evenementRoutes.js";
import commentaireRoutes from "./routes/commentaireRoutes.js";
import espaceRoutes from "./routes/espaceRoutes.js";
import utilisateurRoutes from "./routes/utilisateurRoutes.js";
import sequelize from "./config/database.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const PORT = 3000;
const app = express();

// Configuration de __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration des fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Configuration CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/evenements", evenementRoutes);
app.use("/api/commentaires", commentaireRoutes);
app.use("/api/espaces", espaceRoutes);
app.use("/api/utilisateurs", utilisateurRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Test de connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log("Connexion à la base de données réussie.");
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données :", err);
  });

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});