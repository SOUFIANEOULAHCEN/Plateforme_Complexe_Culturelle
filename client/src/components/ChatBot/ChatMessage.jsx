"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const ChatMessage = ({ message, index }) => {
  const messageRef = useRef(null)
  const messageTime = message.timestamp ? new Date(message.timestamp) : new Date()

  // Couleurs harmonisées avec la couleur principale
  const colors = {
    primary: "oklch(47.3% 0.137 46.201)",
    primaryLight: "oklch(55% 0.15 46.201)",
    primaryLighter: "oklch(65% 0.12 46.201)",
    bgLight: "oklch(98% 0.01 46.201)",
    bgBot: "oklch(96% 0.005 46.201)",
    textDark: "oklch(25% 0.08 46.201)",
    textLight: "white",
    border: "oklch(90% 0.02 46.201)",
  }

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  return (
    <motion.div
      ref={messageRef}
      className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 15,
          delay: index * 0.05,
        },
      }}
      exit={{ opacity: 0, x: message.sender === "user" ? 20 : -20 }}
      layout
    >
      <motion.div
        className={`relative max-w-[80%] px-4 py-3 rounded-2xl border ${
          message.sender === "user" ? "text-white rounded-br-md border-white/10" : "rounded-bl-md border-gray-100"
        }`}
        style={{
          background:
            message.sender === "user"
              ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`
              : colors.bgBot,
          color: message.sender === "user" ? colors.textLight : colors.textDark,
          boxShadow:
            message.sender === "user"
              ? `0 4px 14px -2px oklch(47.3% 0.137 46.201 / 0.25)`
              : "0 2px 8px -2px rgba(0, 0, 0, 0.05)",
        }}
        whileHover={{
          scale: 1.02,
          boxShadow:
            message.sender === "user"
              ? `0 6px 20px -2px oklch(47.3% 0.137 46.201 / 0.35)`
              : "0 4px 12px -2px rgba(0, 0, 0, 0.1)",
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { type: "spring", stiffness: 400 },
        }}
      >
        {/* Animation de fond pour les messages utilisateur */}
        {message.sender === "user" && (
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden z-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { delay: 0.2 },
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"
              animate={{
                x: [-20, 20, -20],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </motion.div>
        )}

        <div className="relative z-10">
          <div className="text-sm whitespace-pre-wrap relative z-10 leading-relaxed">{message.text}</div>

          {/* Heure du message avec animation */}
          <motion.div
            className={`text-xs mt-2 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            style={{
              color: message.sender === "user" ? "rgba(255,255,255,0.7)" : "oklch(60% 0.05 46.201)",
            }}
            initial={{ opacity: 0, y: 5 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.3 },
            }}
          >
            {format(messageTime, "HH:mm", { locale: fr })}
          </motion.div>
        </div>

        {/* Indicateur de statut pour les messages utilisateur */}
        {message.sender === "user" && (
          <motion.div
            className="absolute -bottom-1 right-2 w-2 h-2 bg-white/30 rounded-full"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { delay: 0.4 },
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

export default ChatMessage
