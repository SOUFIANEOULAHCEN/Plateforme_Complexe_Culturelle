import ChatBot from '../models/chatbot.js';
import { Op } from 'sequelize';

export const getBotResponse = async (req, res) => {
  try {
    const { question } = req.body;
    // console.log('Question reçue:', question); // Debug
    
    const response = await ChatBot.findOne({
      where: {
        question: {
          [Op.like]: `%${question}%`
        }
      }
    });
    // console.log('Réponse trouvée:', response?.reponse); // Debug

    if (response) {
      return res.json({ response: response.reponse });
    }
    return res.json({ response: "Je n'ai pas trouvé de réponse à votre question." });
  } catch (error) {
    console.error('Erreur complète:', error);
    return res.status(500).json({ 
      error: 'Erreur serveur',
      details: error.message 
    });
  }
};