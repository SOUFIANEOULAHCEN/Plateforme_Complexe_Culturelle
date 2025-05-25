"use client";

import { useState } from "react";
import Modal from "./Modal";
import api from "../api";
import Toast from "./Toast";
import Cookies from "js-cookie";
import AuthForms from "../pages/AuthForms";

export default function ReservationModal({ isOpen, onClose, onSuccess, type = "evenement" }) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      setError("Veuillez entrer votre adresse email");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/utilisateurs/check-email?email=${encodeURIComponent(email)}`);
      if (response.data.exists) {
        Cookies.set("userEmail", email, { secure: true, sameSite: "strict", expires: 1 });
        setToast({ message: "Vous pouvez maintenant réserver", type: "success" });
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        setPendingEmail(email);
        setShowAuthModal(true);
        setError("Vous devez créer un compte avant de pouvoir réserver");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      setToast({ message: "Une erreur est survenue lors de la vérification de l'email", type: "error" });
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    if (pendingEmail) {
      Cookies.set("userEmail", pendingEmail, { secure: true, sameSite: "strict", expires: 1 });
      setShowAuthModal(false);
      setToast({ message: "Inscription réussie. Vous pouvez maintenant réserver.", type: "success" });
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }
  };

  const handleClose = () => {
    setAcceptedTerms(false);
    setEmail("");
    setError("");
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={type === "evenement" ? "Création d'événement" : "Réservation d'espace"}
        footer={
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
            >
              Fermer
            </button>
            {!acceptedTerms ? (
              <button
                onClick={handleAcceptTerms}
                className="bg-[#824B26] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#6e3d20] transition duration-300"
              >
                J'accepte les conditions
              </button>
            ) : (
              <button
                onClick={handleEmailSubmit}
                disabled={loading || !email}
                className="bg-[#824B26] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#6e3d20] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Vérification..." : "Continuer"}
              </button>
            )}
          </div>
        }
      >
        <div className="space-y-6 text-[#333333]">
          {acceptedTerms && (
            <div className="mb-6 border-b pb-6 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-[#824B26]">Veuillez entrer votre email pour continuer</h3>
              <div className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
                  required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-[#824B26]">Termes et conditions</h3>
            <p className="mb-4">
              Bienvenue sur notre plateforme de réservation d'espaces et de création d'événements. Veuillez lire attentivement les conditions suivantes avant de procéder.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-[#824B26]">Réservation d'espaces</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Les réservations sont soumises à disponibilité et doivent être effectuées au moins 48 heures à l'avance.</li>
              <li>Un acompte de 30% est requis pour confirmer votre réservation.</li>
              <li>L'annulation est possible jusqu'à 24 heures avant la date réservée avec remboursement partiel.</li>
              <li>Les espaces doivent être rendus dans l'état où ils ont été trouvés.</li>
              <li>Tout dommage causé aux installations sera facturé.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-[#824B26]">Création d'événements</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Les propositions d'événements doivent être soumises au moins 2 semaines avant la date prévue.</li>
              <li>Chaque proposition sera examinée par notre équipe dans un délai de 72 heures.</li>
              <li>Nous nous réservons le droit de refuser tout événement qui ne correspond pas à nos valeurs.</li>
              <li>L'organisateur est responsable de l'obtention de toutes les autorisations nécessaires.</li>
              <li>Un contrat détaillé sera établi pour chaque événement approuvé.</li>
            </ul>
          </div>
        </div>
      </Modal>

      {showAuthModal && (
        <AuthForms
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          initialEmail={pendingEmail}
        />
      )}

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