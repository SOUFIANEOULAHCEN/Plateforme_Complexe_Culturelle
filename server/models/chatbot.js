// Import par défaut
import sequelize from '../config/database.js'; 
import { DataTypes } from 'sequelize';

const ChatBot = sequelize.define('ChatBot', {
  question: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reponse: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'chatbot',
  timestamps: false
});

// Export par défaut pour rester cohérent
export default ChatBot;