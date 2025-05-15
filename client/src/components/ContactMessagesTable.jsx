import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Modal from "./Modal";

export default function ContactMessagesTable({ messages, onMarkAsRead, onSendResponse }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    if (!message.is_read) {
      onMarkAsRead(message.id);
    }
  };

  const handleSendResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    await onSendResponse(selectedMessage.id, selectedMessage.email, responseText);
    setResponseText("");
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((message) => (
              <tr 
                key={message.id}
                className={`hover:bg-gray-50 ${!message.is_read ? 'bg-blue-50' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      message.is_read
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {message.is_read ? "Lu" : "Non lu"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{message.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap">{message.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(message.created_at), "dd MMMM yyyy HH:mm", {
                    locale: fr,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewMessage(message)}
                    className="text-[#824B26] hover:text-[#5c3116] mr-4"
                  >
                    Voir le message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal pour voir le message et répondre */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Détails du message"
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Message de {selectedMessage.nom}
              </h3>
              <p className="text-sm text-gray-500">
                Reçu le{" "}
                {format(new Date(selectedMessage.created_at), "dd MMMM yyyy à HH:mm", {
                  locale: fr,
                })}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-1">Coordonnées :</h4>
              <p className="text-sm">Email : {selectedMessage.email}</p>
              {selectedMessage.telephone && (
                <p className="text-sm">Téléphone : {selectedMessage.telephone}</p>
              )}
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-1">Message :</h4>
              <p className="text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {selectedMessage.message}
              </p>
            </div>

            <form onSubmit={handleSendResponse} className="space-y-4">
              <div>
                <label
                  htmlFor="response"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Répondre
                </label>
                <textarea
                  id="response"
                  rows="4"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#824B26] focus:border-[#824B26]"
                  placeholder="Votre réponse..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  disabled={!responseText.trim()}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#824B26] hover:bg-[#5c3116] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#824B26] disabled:opacity-50"
                >
                  Envoyer la réponse
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
