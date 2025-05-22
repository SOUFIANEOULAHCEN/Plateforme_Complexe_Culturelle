import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

// Vérification des variables d'environnement requises
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Variables d\'environnement manquantes pour l\'envoi d\'emails:', missingEnvVars);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  try {
    // Vérification des paramètres requis
    if (!to || !subject || !text) {
      throw new Error('Paramètres manquants pour l\'envoi d\'email');
    }

    // Vérification des variables d'environnement
    if (missingEnvVars.length > 0) {
      throw new Error(`Configuration email incomplète. Variables manquantes: ${missingEnvVars.join(', ')}`);
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    });

    console.log('Email envoyé avec succès:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

export default sendEmail;
