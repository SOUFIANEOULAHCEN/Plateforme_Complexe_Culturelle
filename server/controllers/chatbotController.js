import ChatBot from '../models/chatbot.js';
import { Op } from 'sequelize';

export const getBotResponse = async (req, res) => {
  try {
    const { question } = req.body;
    
    const response = await ChatBot.findOne({
      where: {
        question: {
          [Op.like]: `%${question}%`
        }
      }
    });

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

// Get all Q&A pairs
export const getAllQA = async (req, res) => {
  try {
    const qaPairs = await ChatBot.findAll();
    res.json(qaPairs);
  } catch (error) {
    console.error('Error fetching Q&A pairs:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

// Create new Q&A pair
export const createQA = async (req, res) => {
  try {
    const { question, reponse } = req.body;
    if (!question || !reponse) {
      return res.status(400).json({ error: 'La question et la réponse sont requises' });
    }

    const newQA = await ChatBot.create({ question, reponse });
    res.status(201).json(newQA);
  } catch (error) {
    console.error('Error creating Q&A pair:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

// Update Q&A pair
export const updateQA = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, reponse } = req.body;
    
    if (!question || !reponse) {
      return res.status(400).json({ error: 'La question et la réponse sont requises' });
    }

    const qa = await ChatBot.findByPk(id);
    if (!qa) {
      return res.status(404).json({ error: 'Paire Q&A non trouvée' });
    }

    await qa.update({ question, reponse });
    res.json(qa);
  } catch (error) {
    console.error('Error updating Q&A pair:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

// Delete Q&A pair
export const deleteQA = async (req, res) => {
  try {
    const { id } = req.params;
    const qa = await ChatBot.findByPk(id);
    
    if (!qa) {
      return res.status(404).json({ error: 'Paire Q&A non trouvée' });
    }

    await qa.destroy();
    res.json({ message: 'Paire Q&A supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting Q&A pair:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};