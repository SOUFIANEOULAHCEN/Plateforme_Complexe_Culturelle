"use client";

import { useState } from "react";
import Modal from "./Modal";
import api from "../api";
import Toast from "./Toast";
import axios from 'axios';

export default function ReservationModal({ isOpen, onClose }) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
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
      // Vérifier si l'email existe dans la base de données
      const response = await api.get(`/utilisateurs/check-email?email=${encodeURIComponent(email)}`);
      
      if (response.data.exists) {
        // L'utilisateur existe, on peut continuer avec la réservation
        setToast({
          message: "Vous pouvez maintenant réserver un espace ou créer un événement",
          type: "success"
        });
        
        // Fermer le modal après un court délai
        setTimeout(() => {
          onClose();
          // Ici, vous pouvez rediriger vers le formulaire de réservation
          // Par exemple: navigate('/reservation-form', { state: { email } });
        }, 1500);
      } else {
        // L'utilisateur n'existe pas
        setToast({
          message: "Vous devez créer un compte avant de pouvoir réserver",
          type: "error"
        });
        setError("Vous devez créer un compte avant de pouvoir réserver");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      setToast({
        message: "Une erreur est survenue lors de la vérification de l'email",
        type: "error"
      });
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        title="Réservation d'espace ou création d'événement"
      footer={
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
          >
            Fermer
          </button>
          {!acceptedTerms ? (
            <button
              onClick={() => setAcceptedTerms(true)}
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
    </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}