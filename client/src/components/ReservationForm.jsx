"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import api from "../api";
import Toast from "./Toast";
import Cookies from "js-cookie";

export default function ReservationForm({
  isOpen,
  onClose,
  reservation = null,
  onSuccess,
  type = "evenement"
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [modalVisible, setModalVisible] = useState(isOpen);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formReservation, setFormReservation] = useState({
    titre: "",
    description: "",
    type_organisateur: "individu",
    date_debut: formatDateForInput(new Date()),
    date_fin: formatDateForInput(new Date()),
    espace_id: "",
    utilisateur_id: "",
    nombre_places: 1,
    documents_fournis: {},
    documents_paths: {},
    materiel_additionnel: "",
    statut: "en_attente",
    commentaires: "",
    type_reservation: type
  });
  const [espaces, setEspaces] = useState([]);
  const [error, setError] = useState("");

  // Gérer la fermeture après succès
  useEffect(() => {
    if (formSubmitted && !toast) {
      // Si le formulaire a été soumis avec succès et le toast a été fermé, fermer le modal
      setModalVisible(false);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 500);
    }
  }, [formSubmitted, toast, onSuccess, onClose]);

  // Mettre à jour la visibilité du modal quand isOpen change
  useEffect(() => {
    setModalVisible(isOpen);
  }, [isOpen]);

  // Récupérer l'ID utilisateur depuis l'email
  const getUserId = async () => {
    const userEmail = Cookies.get("userEmail");
    if (!userEmail) {
      return null;
    }

    try {
      const response = await api.get(`/utilisateurs/email/${userEmail}`);
      return response.data.id;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };

  // Fetch reservation data if editing
  useEffect(() => {
    const initializeForm = async () => {
      if (isOpen && reservation) {
        setFormReservation({
          ...reservation,
          date_debut: formatDateForInput(new Date(reservation.date_debut)),
          date_fin: formatDateForInput(new Date(reservation.date_fin)),
        });
        await fetchEspaces();
      } else if (isOpen) {
        const userId = await getUserId();
        setFormReservation({
          titre: "",
          description: "",
          type_organisateur: "individu",
          date_debut: formatDateForInput(new Date()),
          date_fin: formatDateForInput(new Date()),
          espace_id: "",
          utilisateur_id: userId,
          nombre_places: 1,
          documents_fournis: {},
          documents_paths: {},
          materiel_additionnel: "",
          statut: "en_attente",
          commentaires: "",
          type_reservation: type
        });
        await fetchEspaces();
      }
    };

    initializeForm();
  }, [isOpen, reservation, type]);

  function formatDateForInput(date) {
    return date.toISOString().slice(0, 16);
  }

  const fetchEspaces = async () => {
    try {
      const response = await api.get("/espaces");
      setEspaces(response.data);
    } catch (error) {
      console.error("Error fetching espaces:", error);
      setToast({
        message: t("reservation_form_error_loading_spaces"),
        type: "error",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormReservation((prev) => ({
      ...prev,
      [name]: name === "nombre_places" ? Number.parseInt(value, 10) : value,
    }));
  };

  // Add validation function
  const validateReservation = () => {
    const dateDebut = new Date(formReservation.date_debut);
    const aujourdhui = new Date();
    const joursAvantReservation = Math.ceil((dateDebut - aujourdhui) / (1000 * 60 * 60 * 24));

    if (joursAvantReservation < 15) {
      setToast({
        message: t("reservation_form_error_date"),
        type: "error"
      });
      return false;
    }

    if (!formReservation.titre || !formReservation.date_debut || !formReservation.date_fin || !formReservation.espace_id) {
      setToast({
        message: t("reservation_form_error_required_fields"),
        type: "error"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);
    setError("");

    if (!validateReservation()) {
      setSaving(false);
      return;
    }

    try {
      const userId = await getUserId();
      if (!userId) {
        throw new Error(t("reservation_form_error_no_user"));
      }

      const payload = {
        ...formReservation,
        type_reservation: type,
        utilisateur_id: userId
      };

      if (reservation && reservation.id) {
        await api.put(`/reservations/${reservation.id}`, payload);
      } else {
        await api.post("/reservations", payload);
      }
      
      // Afficher le toast de succès et marquer comme soumis
      setToast({ message: t("reservation_form_success"), type: "success" });
      setFormSubmitted(true);
      
      // NE PAS fermer le modal immédiatement, laisser le toast s'afficher
      // Le useEffect s'occupera de fermer le modal après que le toast soit fermé
    } catch (error) {
      console.error("Error saving reservation:", error);
      setError(error.response?.data?.message || t("reservation_form_error_generic"));
      setToast({
        message: error.response?.data?.message || t("reservation_form_error_generic"),
        type: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  // Calculer la date minimale (15 jours à partir d'aujourd'hui)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return formatDateForInput(date);
  };

  const handleModalClose = () => {
    // Si un toast est affiché, on ferme d'abord le modal visuel
    if (toast) {
      setModalVisible(false);
      // Attendre que l'animation de fermeture soit terminée avant de réellement fermer
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      // Si pas de toast, on peut fermer directement
      setModalVisible(false);
      onClose();
    }
  };

  const handleToastClose = () => {
    // Attendre que l'animation de fermeture soit terminée avant de réinitialiser le toast
    setTimeout(() => setToast(null), 300);
  };

  return (
    <>
      <Modal
        isOpen={modalVisible && isOpen}
        onClose={handleModalClose}
        title={reservation ? t("reservation_form_edit_title") : t("reservation_form_title")}
        footer={
          <>
            <button
              onClick={handleModalClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              disabled={saving}
            >
              {t("reservation_form_cancel")}
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)] disabled:opacity-50"
              disabled={saving}
            >
              {saving ? t("reservation_form_saving") : t("reservation_form_save")}
            </button>
          </>
        }
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("reservation_form_title_label")} *
              </label>
              <input
                type="text"
                name="titre"
                value={formReservation.titre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("reservation_form_description")}
              </label>
              <textarea
                name="description"
                value={formReservation.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] h-20"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("reservation_form_organizer_type")} *
              </label>
              <select
                name="type_organisateur"
                value={formReservation.type_organisateur}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              >
                <option value="individu">{t("reservation_form_organizer_type_individual")}</option>
                <option value="association">{t("reservation_form_organizer_type_association")}</option>
                <option value="entreprise">{t("reservation_form_organizer_type_company")}</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("reservation_form_start_date")} *
              </label>
              <input
                type="datetime-local"
                name="date_debut"
                value={formReservation.date_debut}
                onChange={handleChange}
                min={getMinDate()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {t("reservation_form_min_days_notice")}
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("reservation_form_end_date")} *
              </label>
              <input
                type="datetime-local"
                name="date_fin"
                value={formReservation.date_fin}
                onChange={handleChange}
                min={formReservation.date_debut}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("reservation_form_space")} *
              </label>
              <select
                name="espace_id"
                value={formReservation.espace_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              >
                <option value="">{t("reservation_form_select_space")}</option>
                {espaces.map((espace) => (
                  <option key={espace.id} value={espace.id}>
                    {espace.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("reservation_form_places")} *
              </label>
              <input
                type="number"
                name="nombre_places"
                value={formReservation.nombre_places}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("reservation_form_additional_equipment")}
              </label>
              <textarea
                name="materiel_additionnel"
                value={formReservation.materiel_additionnel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] h-20"
                placeholder={t("reservation_form_additional_equipment_placeholder")}
              />
              <p className="text-sm text-gray-500 mt-1">
                {t("reservation_form_additional_equipment_notice")}
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("reservation_form_comments")}
              </label>
              <textarea
                name="commentaires"
                value={formReservation.commentaires}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] h-20"
                placeholder={t("reservation_form_comments_placeholder")}
              />
            </div>
          </form>
        )}
      </Modal>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}
    </>
  );
}