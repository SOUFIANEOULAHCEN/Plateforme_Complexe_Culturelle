"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Send, Bot, X } from "lucide-react"
import ChatMessage from "./ChatMessage"

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isPulsing, setIsPulsing] = useState(false)
  const messagesEndRef = useRef(null)

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsPulsing(true)
      setTimeout(() => setIsPulsing(false), 1000)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Ajouter le message de l'utilisateur
    const userMessage = { text: inputValue, sender: "user" }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    try {
      const response = await axios.post("http://localhost:3000/api/chatbot", {
        question: inputValue,
      })

      console.log("Réponse du serveur:", response.data)

      if (response.data.error) {
        throw new Error(response.data.error)
      }

      const botMessage = {
        text: response.data.response || "Je n'ai pas compris",
        sender: "bot",
      }

      // Animation de réponse du bot
      setIsPulsing(true)
      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage])
        setIsPulsing(false)
      }, 500)
    } catch (error) {
      console.error("Erreur:", error.response?.data || error.message)
      const errorMessage = {
        text: "Désolé, une erreur s'est produite",
        sender: "bot",
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden transform transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] animate-fadeInUp backdrop-blur-sm">
          {/* Header avec dégradé modernisé */}
          <div
            className="p-4 rounded-t-2xl flex justify-between items-center border-b border-white/10"
            style={{
              background: `linear-gradient(135deg, oklch(47.3% 0.137 46.201), oklch(55% 0.15 46.201))`,
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <h2 className="font-semibold text-white">Assistant Chatbot</h2>
            </div>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 hover:rotate-90 p-2 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-16 animate-fadeIn">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 inline-block">
                  <Bot className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium">Posez-moi une question!</p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => <ChatMessage key={index} message={msg} animationDelay={index * 100} />)
            )}
            {isPulsing && (
              <div className="flex justify-start my-2">
                <div className="bg-gray-100 border border-gray-200 rounded-2xl p-3 animate-pulse">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input modernisé */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex bg-white/80 backdrop-blur-sm">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]/20 focus:border-[oklch(47.3%_0.137_46.201)] transition-all duration-200 bg-white shadow-sm"
            />
            <button
              type="submit"
              className={`ml-3 px-4 py-3 rounded-xl text-white transition-all duration-300 shadow-sm ${
                inputValue.trim() ? "hover:shadow-lg hover:scale-105 active:scale-95" : "cursor-not-allowed opacity-50"
              }`}
              style={{
                background: inputValue.trim()
                  ? `linear-gradient(135deg, oklch(47.3% 0.137 46.201), oklch(55% 0.15 46.201))`
                  : "#E5E7EB",
              }}
              disabled={!inputValue.trim()}
            >
              <Send className="h-4 w-4 transform transition-transform duration-200 hover:translate-x-0.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className={`p-4 rounded-2xl shadow-lg transition-all duration-300 ${
            isPulsing ? "animate-pulse" : ""
          } hover:shadow-xl hover:scale-105 active:scale-95 border border-white/20`}
          style={{
            background: `linear-gradient(135deg, oklch(47.3% 0.137 46.201), oklch(55% 0.15 46.201))`,
            boxShadow: `0 10px 25px -5px oklch(47.3% 0.137 46.201 / 0.3), 0 10px 10px -5px oklch(47.3% 0.137 46.201 / 0.1)`,
          }}
        >
          <Bot className="h-6 w-6 text-white transform transition-transform duration-500 hover:rotate-12" />
        </button>
      )}
    </div>
  )
}

export { ChatBot }
