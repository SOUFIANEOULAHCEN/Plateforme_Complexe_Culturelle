import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ChatMessage = ({ message, index }) => {
  const messageRef = useRef(null);
  const messageTime = message.timestamp ? new Date(message.timestamp) : new Date();

  // Couleurs harmonisées
  const colors = {
    primary: 'oklch(47.3% 0.137 46.201)',
    primaryLight: 'oklch(55% 0.15 46.201)',
    primaryLighter: 'oklch(65% 0.12 46.201)',
    bgLight: 'oklch(98% 0.01 46.201)',
    textDark: 'oklch(25% 0.08 46.201)',
    textLight: 'white'
  };

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      ref={messageRef}
      className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          type: 'spring', 
          stiffness: 300,
          damping: 15,
          delay: index * 0.05
        }
      }}
      exit={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
      layout
    >
      <motion.div
        className={`relative max-w-[80%] px-4 py-3 rounded-2xl ${
          message.sender === 'user'
            ? 'text-white rounded-br-sm'
            : 'rounded-bl-sm'
        }`}
        style={{
          background: message.sender === 'user'
            ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`
            : colors.bgLight,
          color: message.sender === 'user' ? colors.textLight : colors.textDark,
          boxShadow: message.sender === 'user'
            ? '0 4px 14px -2px rgba(71, 162, 235, 0.3)'
            : '0 4px 14px -2px rgba(0, 0, 0, 0.05)'
        }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: message.sender === 'user'
            ? '0 6px 20px -2px rgba(71, 162, 235, 0.4)'
            : '0 6px 20px -2px rgba(0, 0, 0, 0.1)'
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ 
          scale: 1,
          opacity: 1,
          transition: { type: 'spring', stiffness: 400 }
        }}
      >
        {/* Animation de fond pour les messages */}
        {message.sender === 'user' && (
          <motion.div 
            className="absolute inset-0 rounded-2xl overflow-hidden z-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { delay: 0.2 }
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-oklch(47.3% 0.137 46.201/0.8) to-oklch(55% 0.15 46.201/0.8)"
              animate={{
                x: [-20, 20, -20],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          </motion.div>
        )}

        <div className="relative z-10">
          <div className="text-sm whitespace-pre-wrap relative z-10">
            {message.text}
          </div>
          
          {/* Heure du message avec animation */}
          <motion.div 
            className={`text-xs mt-1 flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
            style={{
              color: message.sender === 'user' 
                ? 'rgba(255,255,255,0.8)' 
                : 'oklch(50% 0.05 46.201)'
            }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.3 }
            }}
          >
            {format(messageTime, 'HH:mm', { locale: fr })}
          </motion.div>
        </div>
        
        {/* Coin décoratif animé */}
        {message.sender === 'user' && (
          <motion.div 
            className="absolute -bottom-1.5 right-0 w-3 h-3 overflow-hidden"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1,
              scale: 1,
              transition: { delay: 0.1 }
            }}
          >
            
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ChatMessage;