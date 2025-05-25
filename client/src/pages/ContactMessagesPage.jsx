import React, { useState, useEffect } from "react";
import ContactMessagesTable from "../components/ContactMessagesTable";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api";
import Toast from "../components/Toast";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get("/contact");
      setMessages(response.data);
    } catch (error) {
      setToast({
        message: "Erreur lors du chargement des messages",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await api.put(`/contact/${messageId}/read`);
      fetchMessages();
      setToast({
        message: "Message marqué comme lu",
        type: "success"
      });
    } catch (error) {
      setToast({
        message: "Erreur lors de la mise à jour du message",
        type: "error"
      });
    }
  };

  const handleSendResponse = async (messageId, email, response) => {
    try {
      await api.post(`/contact/${messageId}/respond`, { email, response });
      setToast({
        message: "Réponse envoyée avec succès",
        type: "success"
      });
    } catch (error) {
      setToast({
        message: "Erreur lors de l'envoi de la réponse",
        type: "error"
      });
    }
  };

  return (
    <DashboardLayout> 
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[oklch(0.145_0_0)]">Messages de contact</h1>
            <p className="text-[oklch(0.556_0_0)] mt-1">Gérez les messages reçus depuis le formulaire de contact</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-[oklch(0.922_0_0)] mb-8 overflow-hidden">
            <ContactMessagesTable
              messages={messages}
              onMarkAsRead={handleMarkAsRead}
              onSendResponse={handleSendResponse}
            />
          </div>
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
