"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import api from "../api";
import Toast from "./Toast";
import Cookies from "js-cookie";

export default function EventProposalForm({ isOpen, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    espace_id: "",
    type: "spectacle",
    affiche: null,
    proposeur_email: "",
    proposeur_nom: "",
    proposeur_telephone: "",
    statut: "en_attente"
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [espaces, setEspaces] = useState([]);
  const [modalVisible, setModalVisible] = useState(isOpen);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Charger les espaces pour le select
  useEffect(() => {
    if (isOpen) {
      setModalVisible(true);
      api.get("/espaces")
        .then(res => setEspaces(res.data))
        .catch((error) => {
          setEspaces([]);
          if (error.response && error.response.status === 401) {
            showToast(t("event_proposal_error_connection"), "error");
          } else {
            showToast(t("event_proposal_error_loading"), "error");
          }
        });
      
      // Récupérer l'email de l'utilisateur connecté et pré-remplir le champ proposeur_email
      const email = Cookies.get("userEmail");
      if (email) {
        setForm(prev => ({...prev, proposeur_email: email }));
      }
    }
  }, [isOpen, t]);

  // Utiliser un useEffect pour gérer la fermeture après succès
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

  const showToast = (message, type = "success", duration = 5000) => {
    setToast({ message, type, duration });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "prix" ? Number.parseFloat(value) : (name === "espace_id" ? Number(value) : value) });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showToast(t("event_proposal_error_file_size"), "error");
        e.target.value = ''; // Réinitialiser l'input
        return;
      }
      setForm({ ...form, affiche: file });
    }
  };

  const validateForm = () => {
    const requiredFields = [
      { key: 'titre', label: t('event_proposal_title_label') },
      { key: 'description', label: t('event_proposal_description_label') },
      { key: 'date_debut', label: t('event_proposal_start_date') },
      { key: 'date_fin', label: t('event_proposal_end_date') },
      { key: 'espace_id', label: t('event_proposal_space') },
      { key: 'proposeur_nom', label: t('event_proposal_organizer_name') },
      { key: 'proposeur_email', label: t('event_proposal_organizer_email') }
    ];
    
    const missingFields = requiredFields
      .filter(field => !form[field.key])
      .map(field => field.label);
    
    if (missingFields.length > 0) {
      showToast(t("event_proposal_error_missing", { fields: missingFields.join(', ') }), "error");
      return false;
    }
    
    if (new Date(form.date_debut) >= new Date(form.date_fin)) {
      showToast(t("event_proposal_error_date"), "error");
      return false;
    }
    
    if (!form.proposeur_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showToast(t("event_proposal_error_email"), "error");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "affiche" && value) {
          formData.append("affiche", value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      
      const response = await api.post("/event-proposals", formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      
      showToast(t("event_proposal_success"), "success", 5000);
      
      setForm({
        titre: "",
        description: "",
        date_debut: "",
        date_fin: "",
        espace_id: "",
        type: "spectacle",
        affiche: null,
        proposeur_email: Cookies.get("userEmail") || "",
        proposeur_nom: "",
        proposeur_telephone: "",
        statut: "en_attente"
      });
      
      setFormSubmitted(true);
      
    } catch (error) {
      let errorMessage = t("event_proposal_error_generic");
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = t("event_proposal_error_connection");
            break;
          case 413:
            errorMessage = t("event_proposal_error_file_size");
            break;
          default:
            if (error.response.data && error.response.data.message) {
              errorMessage = error.response.data.message;
            }
        }
      }
      
      showToast(errorMessage, "error", 5000);
    } finally {
      setLoading(false);
    }
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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}
      <Modal
        isOpen={modalVisible && isOpen}
        onClose={handleModalClose}
        title={t("event_proposal_title")}
        footer={
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleModalClose}
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
            >
              {t("event_proposal_cancel")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#824B26] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#6e3d20] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("event_proposal_submitting") : t("event_proposal_submit")}
            </button>
          </div>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#824B26]">{t("event_proposal_title_label")}</label>
            <input
              type="text"
              name="titre"
              value={form.titre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#824B26]">{t("event_proposal_description_label")}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-[#824B26]">{t("event_proposal_start_date")}</label>
              <input
                type="datetime-local"
                name="date_debut"
                value={form.date_debut}
                onChange={handleChange}
                required
                min={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#824B26]">{t("event_proposal_end_date")}</label>
              <input
                type="datetime-local"
                name="date_fin"
                value={form.date_fin}
                onChange={handleChange}
                required
                min={form.date_debut || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#824B26]">{t("event_proposal_space")}</label>
            <select
              name="espace_id"
              value={form.espace_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            >
              <option value="">{t("event_proposal_select_space")}</option>
              {espaces.map(espace => (
                <option key={espace.id} value={espace.id}>{espace.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#824B26]">{t("event_proposal_type")}</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            >
              <option value="spectacle">{t("event_proposal_type_show")}</option>
              <option value="atelier">{t("event_proposal_type_workshop")}</option>
              <option value="conference">{t("event_proposal_type_conference")}</option>
              <option value="exposition">{t("event_proposal_type_exhibition")}</option>
              <option value="rencontre">{t("event_proposal_type_meeting")}</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#824B26]">{t("event_proposal_poster")}</label>
            <input
              type="file"
              name="affiche"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-[#824B26]">{t("event_proposal_organizer_name")}</label>
              <input
                type="text"
                name="proposeur_nom"
                value={form.proposeur_nom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#824B26]">{t("event_proposal_organizer_email")}</label>
              <input
                type="email"
                name="proposeur_email"
                value={form.proposeur_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#824B26]">{t("event_proposal_organizer_phone")}</label>
            <input
              type="text"
              name="proposeur_telephone"
              value={form.proposeur_telephone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            />
          </div>
        </form>
      </Modal>
    </>
  );
}