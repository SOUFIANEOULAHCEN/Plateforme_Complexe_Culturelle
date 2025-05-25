"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../Footer";
import Image_de_centre from "../../assets/img/imgAtelier/Image_de_centre.jpeg";
import ReservationModal from "../../components/ReservationModal";
import ReservationForm from "../../components/ReservationForm";
import EventProposalForm from "../../components/EventProposalForm";
import Toast from "../../components/Toast";

export default function ReservationsChois() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [reservationType, setReservationType] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  const handleReservationClick = (type) => {
    if (type === "workshop" || type === "coworking") {
      setToast({
        message: "Ce service est actuellement indisponible. Nous travaillons à le rendre disponible prochainement. Merci de votre compréhension.",
        type: "info"
      });
      return;
    }
    setReservationType(type);
    setShowModal(true);
  };

  const handleModalSuccess = (email) => {
    setShowModal(false);
    setShowForm(true);
  };

  const handleModalError = (message) => {
    setToast({
      message,
      type: "error"
    });
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setToast({
      message: t("reservation_success"),
      type: "success"
    });
  };

  const handleFormError = (message) => {
    setToast({
      message,
      type: "error"
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#824B26] to-[#6e3d20]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-12">
        {/* Header text */}
        <div className="text-center mb-16 pt-16">
          <h1 className="mb-8 text-4xl font-bold text-white md:text-5xl tracking-tight">{t("reservations")}</h1>
          <p className="text-white/90 text-lg max-w-4xl mx-auto leading-relaxed px-4">
            {t("reservations_subtitle")}
          </p>
        </div>

        {/* Cards container */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {/* Card 1 - LES ÉVÉNEMENTS */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="h-16 w-16 bg-[#824B26]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-[#824B26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#824B26] mb-6 text-center uppercase tracking-wide">{t("events")}</h3>
            <div className="space-y-3 mb-8 min-h-[180px]">
              <p className="text-gray-600 text-sm text-center">Espaces polyvalents et spacieux.</p>
              <p className="text-gray-600 text-sm text-center">Équipements technologiques modernes.</p>
              <p className="text-gray-600 text-sm text-center">Emplacement central et accessible.</p>
              <p className="text-gray-600 text-sm text-center">
                Soutien à l'organisation d'activités culturelles et éducatives.
              </p>
            </div>
            <button 
              onClick={() => handleReservationClick("event")}
              className="w-full bg-[#824B26] hover:bg-[#6e3d20] text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:shadow-lg uppercase tracking-wide"
            >
              {t("reserve")}
            </button>
          </div>

          {/* Card 2 - LES ATELIERS */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="h-16 w-16 bg-[#824B26]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-[#824B26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#824B26] mb-6 text-center uppercase tracking-wide">{t("workshops")}</h3>
            <div className="space-y-3 mb-8 min-h-[180px]">
              <p className="text-gray-600 text-sm text-center">Renforcement des compétences pratiques.</p>
              <p className="text-gray-600 text-sm text-center">Opportunités de réseautage.</p>
              <p className="text-gray-600 text-sm text-center">Apprentissage interactif.</p>
              <p className="text-gray-600 text-sm text-center">Soutien à l'innovation et à la créativité.</p>
              <p className="text-gray-600 text-sm text-center">Accessibilité pour tous les niveaux.</p>
              <p className="text-gray-600 text-sm text-center">Encadrement par des professionnels qualifiés.</p>
            </div>
            <button 
              onClick={() => handleReservationClick("workshop")}
              className="w-full bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:shadow-lg uppercase tracking-wide cursor-not-allowed"
            >
              {t("register")}
            </button>
          </div>

          {/* Card 3 - LES ESPACES */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="h-16 w-16 bg-[#824B26]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-[#824B26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#824B26] mb-6 text-center uppercase tracking-wide">{t("spaces")}</h3>
            <div className="space-y-3 mb-8 min-h-[180px]">
              <p className="text-gray-600 text-sm text-center">Espaces polyvalents.</p>
              <p className="text-gray-600 text-sm text-center">Conception confortable et inspirante.</p>
              <p className="text-gray-600 text-sm text-center">Équipements techniques avancés.</p>
              <p className="text-gray-600 text-sm text-center">Accès facile et central.</p>
              <p className="text-gray-600 text-sm text-center">Espaces extérieurs pour la détente.</p>
            </div>
            <button 
              onClick={() => handleReservationClick("space")}
              className="w-full bg-[#824B26] hover:bg-[#6e3d20] text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:shadow-lg uppercase tracking-wide"
            >
              {t("reserve")}
            </button>
          </div>

          {/* Card 4 - LES ESPACES COWORKING */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="h-16 w-16 bg-[#824B26]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-[#824B26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#824B26] mb-6 text-center uppercase tracking-wide">{t("coworking_spaces")}</h3>
            <div className="space-y-3 mb-8 min-h-[180px]">
              <p className="text-gray-600 text-sm text-center">Encourager la collaboration et les idées.</p>
              <p className="text-gray-600 text-sm text-center">Équipements modernes et adaptés.</p>
              <p className="text-gray-600 text-sm text-center">Ateliers et formations.</p>
              <p className="text-gray-600 text-sm text-center">Soutien aux entrepreneurs et créatifs.</p>
            </div>
            <button 
              onClick={() => handleReservationClick("coworking")}
              className="w-full bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:shadow-lg uppercase tracking-wide cursor-not-allowed"
            >
              {t("reserve")}
            </button>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        onError={handleModalError}
        reservationType={reservationType}
      />

      {/* Reservation Form */}
      {showForm && (
        <>
          {reservationType === "event" ? (
            <EventProposalForm
              isOpen={true}
              onClose={() => setShowForm(false)}
              onSuccess={handleFormSuccess}
              onError={handleFormError}
            />
          ) : (
            <ReservationForm
              isOpen={true}
              onClose={() => setShowForm(false)}
              onSuccess={handleFormSuccess}
              onError={handleFormError}
            />
          )}
        </>
      )}

      {/* Toast Messages */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Footer />
    </div>
  );
}