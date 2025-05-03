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
