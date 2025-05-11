"use client";

import { useState } from "react";
import Modal from "./Modal";
import api from "../api";
import Toast from "./Toast";
import axios from 'axios';
import Cookies from "js-cookie";
import AuthForms from "../pages/AuthForms";
import ReservationForm from "./ReservationForm";
import EventProposalForm from "./EventProposalForm";

export default function ReservationModal({ isOpen, onClose }) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [step, setStep] = useState("terms"); // "terms", "email", "choix", "form"
  const [choix, setChoix] = useState("");

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    setStep("email");
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
        setToast({ message: "Vous pouvez maintenant réserver un espace ou créer un événement", type: "success" });
        setTimeout(() => {
          setStep("choix");
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
        setStep("choix");
      }, 1000);
    }
  };

  const handleChoix = (type) => {
    setChoix(type);
    setStep("form");
  };

  const handleClose = () => {
    setStep("terms");
    setAcceptedTerms(false);
    setEmail("");
    setError("");
    setChoix("");
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Réservation d'espace ou création d'événement"
        footer={
          step === "terms" ? (
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
              >
                Fermer
              </button>
              <button
                onClick={handleAcceptTerms}
                className="bg-[#824B26] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#6e3d20] transition duration-300"
              >
                J'accepte les conditions
              </button>
            </div>
          ) : step === "email" ? (
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
              >
                Fermer
              </button>
              <button
                onClick={handleEmailSubmit}
                disabled={loading || !email}
                className="bg-[#824B26] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#6e3d20] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Vérification..." : "Continuer"}
              </button>
            </div>
          ) : null
        }
      >
        {step === "terms" && (
          <div className="space-y-6 text-[#333333]">
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
            <div>
              <h4 className="font-medium mb-2 text-[#824B26]">Tarification</h4>
              <p>
                Les tarifs varient selon l'espace, la durée et le type d'événement. Un devis personnalisé vous sera fourni après examen de votre demande. Des réductions peuvent s'appliquer pour les associations et les événements culturels.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm italic">
                En cliquant sur "J'accepte les conditions", vous confirmez avoir lu et accepté les termes et conditions ci-dessus.
              </p>
            </div>
          </div>
        )}
        {step === "email" && (
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
        {step === "choix" && (
          <div className="flex flex-col items-center space-y-6 py-8">
            <h3 className="text-lg font-semibold text-[#824B26] mb-4">Que souhaitez-vous faire ?</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => handleChoix("event_proposal")}
                className="px-6 py-3 bg-[#824B26] text-white rounded-lg font-semibold hover:bg-[#6e3d20] transition"
              >
                Proposer un événement
              </button>
              <button
                onClick={() => handleChoix("reservation")}
                className="px-6 py-3 bg-[#e6b17a] text-[#824B26] rounded-lg font-semibold hover:bg-[#d99a4a] transition"
              >
                Réserver un espace
              </button>
            </div>
          </div>
        )}
        {step === "form" && choix === "event_proposal" && (
          <>
            <Toast message="Remplissez le formulaire pour proposer un événement." type="info" />
            <EventProposalForm isOpen={true} onClose={handleClose} onSuccess={handleClose} />
          </>
        )}
        {step === "form" && choix === "reservation" && (
          <>
            <Toast message="Remplissez le formulaire pour réserver un espace." type="info" />
            <ReservationForm isOpen={true} onClose={handleClose} onSuccess={handleClose} />
          </>
        )}
      </Modal>
      {showAuthModal && (
        <AuthForms isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}