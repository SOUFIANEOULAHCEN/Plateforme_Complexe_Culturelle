"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../Footer";
import ReservationModal from "../../components/ReservationModal";
import ReservationForm from "../../components/ReservationForm";
import EventProposalForm from "../../components/EventProposalForm";
import Toast from "../../components/Toast";
import Image_de_centre from "../../assets/img/imgAtelier/Image_de_centre.jpeg";

export default function ReservationsChois() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [reservationType, setReservationType] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  const handleReservationClick = (type) => {
    if (type === "workshop" || type === "coworking") {
      setToast({
        message: t("service_unavailable_message"),
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

  const cards = [
    {
      title: t("events"),
      features: [
        t("events_feature_1"),
        t("events_feature_2"),
        t("events_feature_3"),
        t("events_feature_4")
      ],
      buttonText: t("reserve"),
      type: "event"
    },
    {
      title: t("workshops"),
      features: [
        t("workshops_feature_1"),
        t("workshops_feature_2"),
        t("workshops_feature_3"),
        t("workshops_feature_4"),
        t("workshops_feature_5"),
        t("workshops_feature_6")
      ],
      buttonText: t("register"),
      type: "workshop"
    },
    {
      title: t("spaces"),
      features: [
        t("spaces_feature_1"),
        t("spaces_feature_2"),
        t("spaces_feature_3"),
        t("spaces_feature_4"),
        t("spaces_feature_5")
      ],
      buttonText: t("reserve"),
      type: "space"
    },
    {
      title: t("coworking_spaces"),
      features: [
        t("coworking_feature_1"),
        t("coworking_feature_2"),
        t("coworking_feature_3"),
        t("coworking_feature_4")
      ],
      buttonText: t("reserve"),
      type: "coworking"
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={Image_de_centre}
          alt={t("complexe_background_alt")}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-center text-2xl md:text-3xl mb-8 text-[#FDF8F5]">
            {t("reservations_subtitle")}
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 py-12 gap-8 mt-12">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-[#FDF8F5] rounded-lg p-8 text-[#8B4513] transform hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                <h2 className="text-2xl font-serif font-bold mb-6 text-center">{card.title}</h2>
                <ul className="space-y-4 mb-8">
                  {card.features.map((feature, idx) => (
                    <li key={idx} className="text-sm">
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-center">
                  <button
                    onClick={() => handleReservationClick(card.type)}
                    className={`w-full px-8 py-3 rounded-md transition-all duration-300 ${
                      card.type === "workshop" || card.type === "coworking"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#824B26] hover:bg-[#6e3d20] text-white font-bold uppercase tracking-wide hover:shadow-lg"
                    }`}
                  >
                    {card.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <Footer />
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
    </div>
  );
}