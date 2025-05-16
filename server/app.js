import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import evenementRoutes from "./routes/evenementRoutes.js";
import commentaireRoutes from "./routes/commentaireRoutes.js";
import espaceRoutes from "./routes/espaceRoutes.js";
import utilisateurRoutes from "./routes/utilisateurRoutes.js";
import sequelize from "./config/database.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import eventProposalRoutes from "./routes/eventProposalRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import {talentRoutes} from './routes/talentRoutes.js';
import chatbotRoutes from "./routes/chatbotRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import complexeConfigRoutes from "./routes/complexeConfigRoutes.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

// Configure CORS properly for your frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/evenements", evenementRoutes);
app.use("/api/commentaires", commentaireRoutes);
app.use("/api/espaces", espaceRoutes);
app.use("/api/utilisateurs", utilisateurRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/event-proposals", eventProposalRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/talent", talentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/complexe-config", complexeConfigRoutes);
app.use("/api/config", complexeConfigRoutes);

// Servir les fichiers statiques du dossier public
app.use(express.static('public'));
// Exposer le dossier uploads pour les affiches d'événements
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Test de connexion à la base de données
sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion à la base de données réussie.");
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données :", err);
  });

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});