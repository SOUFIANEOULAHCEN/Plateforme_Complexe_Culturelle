"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import api from "../api";
import Toast from "./Toast";
import Cookies from "js-cookie";
import AuthForms from "../pages/AuthForms";

export default function ReservationModal({ isOpen, onClose, onSuccess, type = "evenement" }) {
  const { t } = useTranslation();
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
      setError(t("reservation_modal_email_required"));
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(t("reservation_modal_email_invalid"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/utilisateurs/check-email?email=${encodeURIComponent(email)}`);
      if (response.data.exists) {
        Cookies.set("userEmail", email, { secure: true, sameSite: "strict", expires: 1 });
        setToast({ message: t("reservation_modal_reservation_success"), type: "success" });
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        setPendingEmail(email);
        setShowAuthModal(true);
        setError(t("reservation_modal_auth_required"));
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      setToast({ message: t("reservation_modal_email_error"), type: "error" });
      setError(t("reservation_modal_email_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    if (pendingEmail) {
      Cookies.set("userEmail", pendingEmail, { secure: true, sameSite: "strict", expires: 1 });
      setShowAuthModal(false);
      setToast({ message: t("reservation_modal_auth_success"), type: "success" });
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
        title={type === "evenement" ? t("reservation_modal_title") : t("reservation_modal_space_title")}
        footer={
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
            >
              {t("reservation_modal_close")}
            </button>
            {!acceptedTerms ? (
              <button
                onClick={handleAcceptTerms}
                className="bg-[#824B26] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#6e3d20] transition duration-300"
              >
                {t("reservation_modal_accept_terms")}
              </button>
            ) : (
              <button
                onClick={handleEmailSubmit}
                disabled={loading || !email}
                className="bg-[#824B26] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#6e3d20] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("reservation_modal_verifying") : t("reservation_modal_continue")}
              </button>
            )}
          </div>
        }
      >
        <div className="space-y-6 text-[#333333]">
          {acceptedTerms && (
            <div className="mb-6 border-b pb-6 border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-[#824B26]">{t("reservation_modal_email_title")}</h3>
              <div className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("reservation_modal_email_placeholder")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
                  required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-[#824B26]">{t("reservation_modal_terms_title")}</h3>
            <p className="mb-4">
              {t("reservation_modal_welcome")}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-[#824B26]">{t("reservation_modal_space_conditions")}</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>{t("reservation_terms_space_1")}</li>
              <li>{t("reservation_terms_space_2")}</li>
              <li>{t("reservation_terms_space_3")}</li>
              <li>{t("reservation_terms_space_4")}</li>
              <li>{t("reservation_terms_space_5")}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-[#824B26]">{t("reservation_modal_event_conditions")}</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>{t("reservation_terms_event_1")}</li>
              <li>{t("reservation_terms_event_2")}</li>
              <li>{t("reservation_terms_event_3")}</li>
              <li>{t("reservation_terms_event_4")}</li>
              <li>{t("reservation_terms_event_5")}</li>
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
          initialIsLogin={false}
          initialIsTalent={false}
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