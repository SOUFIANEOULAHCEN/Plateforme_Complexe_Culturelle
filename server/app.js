import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import reservationRoutes from './routes/reservationRoutes.js';
import evenementRoutes from './routes/evenementRoutes.js'; 
import commentaireRoutes from './routes/commentaireRoutes.js'; 
import espaceRoutes from './routes/espaceRoutes.js'; 
import utilisateurRoutes from './routes/utilisateurRoutes.js';
import sequelize from "./config/database.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"
import reportsRoutes from "./routes/reportsRoutes.js"
const PORT = 3000;
const app = express();
// dotenv.config()

// FIX: Configure CORS properly for your frontend
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/evenements', evenementRoutes); // Use evenement routes
app.use('/api/commentaires', commentaireRoutes); // Use commentaire routes
app.use('/api/espaces', espaceRoutes); // Use espace routes
app.use('/api/utilisateurs', utilisateurRoutes);
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/reports", reportsRoutes)
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
