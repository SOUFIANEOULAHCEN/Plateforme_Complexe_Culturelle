import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { IoSend } from 'react-icons/io5';
import { FaRobot, FaTimes } from 'react-icons/fa';
import ChatMessage from './ChatMessage';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isPulsing, setIsPulsing] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await axios.post('http://localhost:3000/api/chatbot', {
        question: inputValue
      });
      
      console.log('Réponse du serveur:', response.data);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const botMessage = { 
        text: response.data.response || "Je n'ai pas compris", 
        sender: 'bot' 
      };
      
      // Animation de réponse du bot
      setIsPulsing(true);
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsPulsing(false);
      }, 500);
      
    } catch (error) {
      console.error('Erreur:', error.response?.data || error.message);
      const errorMessage = { 
        text: "Désolé, une erreur s'est produite",
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col border border-gray-100 overflow-hidden transform transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] animate-fadeInUp">
          {/* Header avec dégradé */}
          <div 
            className="p-4 rounded-t-lg flex justify-between items-center"
            style={{
              background: `linear-gradient(135deg, oklch(47.3% 0.137 46.201), oklch(55% 0.15 46.201))`
            }}
          >
            <div className="flex items-center space-x-2">
              <FaRobot className="text-xl text-white" />
              <h2 className="font-bold text-white">Chatbot Assistant</h2>
            </div>
            <button 
              onClick={toggleChat} 
              className="text-white hover:text-gray-200 transition-transform duration-200 hover:rotate-90"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-16 animate-fadeIn">
                Posez-moi une question!
              </div>
            ) : (
              messages.map((msg, index) => (
                <ChatMessage 
                  key={index} 
                  message={msg} 
                  animationDelay={index * 100}
                />
              ))
            )}
            {isPulsing && (
              <div className="flex justify-start my-2">
                <div className="bg-gray-200 rounded-full p-2 animate-pulse">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSendMessage} 
            className="p-3 border-t border-gray-200 flex bg-white"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-oklch(47.3% 0.137 46.201)/50 focus:border-transparent transition-all duration-200"
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-r-lg text-white transition-all duration-300 ${inputValue.trim() ? 'bg-oklch(47.3% 0.137 46.201) hover:bg-oklch(55% 0.15 46.201)' : 'bg-gray-400 cursor-not-allowed'}`}
              style={{
                background: inputValue.trim() 
                  ? `linear-gradient(135deg, oklch(47.3% 0.137 46.201), oklch(55% 0.15 46.201))`
                  : '#9CA3AF'
              }}
              disabled={!inputValue.trim()}
            >
              <IoSend className="transform transition-transform duration-200 hover:scale-110" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className={`p-4 rounded-full shadow-lg transition-all duration-300 ${isPulsing ? 'animate-pulse' : ''} hover:shadow-xl`}
          style={{
            background: `radial-gradient(circle, oklch(55% 0.15 46.201), oklch(47.3% 0.137 46.201))`,
            boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
          }}
        >
          <FaRobot 
            className="text-2xl text-white transform transition-transform duration-500 hover:rotate-360" 
          />
        </button>
      )}
    </div>
  );
};

export { ChatBot };