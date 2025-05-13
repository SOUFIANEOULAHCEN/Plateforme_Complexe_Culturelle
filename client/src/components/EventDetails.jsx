"use client";

import { useState } from "react";
import Modal from "./Modal";
import Toast from "./Toast";

export default function EventDetails({ isOpen, onClose, event, onEdit }) {
  const [toast, setToast] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeBadge = (type) => {
    const typeMap = {
      spectacle: "bg-pink-100 text-pink-800",
      atelier: "bg-green-100 text-green-800",
      conference: "bg-yellow-100 text-yellow-800",
      exposition: "bg-blue-100 text-blue-800",
      rencontre: "bg-purple-100 text-purple-800",
    };

    const typeText = {
      spectacle: "Spectacle",
      atelier: "Atelier",
      conference: "Conférence",
      exposition: "Exposition",
      rencontre: "Rencontre",
    };

    const className = typeMap[type] || "bg-gray-100 text-gray-800";
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}
      >
        {typeText[type] || type || "N/A"}
      </span>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Détails de l'événement"
        footer={
          <>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)]"
            >
              Modifier
            </button>
          </>
        }
      >
        {event ? (
          <div className="space-y-4">
            {event.affiche && (
              <div className="flex justify-center mb-4">
                <img
                  src={typeof event.affiche === 'string' ? event.affiche : URL.createObjectURL(event.affiche)}
                  alt="Affiche de l'événement"
                  className="max-h-64 rounded-lg border border-gray-200 shadow"
                  onError={e => { e.target.src = '/placeholder.svg'; e.target.alt = 'Image non disponible'; }}
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  ID de l'événement
                </h3>
                <p className="mt-1 text-sm text-gray-900">{event.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Type</h3>
                <p className="mt-1">{getTypeBadge(event.type)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Titre</h3>
              <p className="mt-1 text-sm text-gray-900">{event.titre}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Date de début
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(event.date_debut)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Date de fin
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(event.date_fin)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Espace</h3>
              <p className="mt-1 text-sm text-gray-900">
                {event.espace_nom || `Espace #${event.espace_id}`}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Prix</h3>
              <p className="mt-1 text-sm text-gray-900">
                {event.prix === 0 || isNaN(event.prix)
                  ? "Gratuit"
                  : `${Number(event.prix).toFixed(2)} MAD`}
              </p>
            </div>

            {event.createur?.email && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email du créateur</h3>
                <p className="mt-1 text-sm text-gray-900">{event.createur.email}</p>
              </div>
            )}

            {event.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Description
                </h3>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Aucune information disponible
          </div>
        )}
      </Modal>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
