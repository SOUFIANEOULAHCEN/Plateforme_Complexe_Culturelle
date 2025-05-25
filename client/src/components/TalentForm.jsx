"use client"

import { useState, useEffect } from "react"
import Modal from "./Modal"
import api from "../api"
import Toast from "./Toast"

export default function TalentForm({ isOpen, onClose, talentId = null, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [talent, setTalent] = useState({
    nom: "",
    email: "",
    domaine_artiste: "",
    statut_talent: "en_validation",
    description_talent: "",
    is_talent: true,
    password: "",
  })

  // Fetch talent data if editing
  useEffect(() => {
    if (isOpen && talentId) {
      fetchTalent()
    } else if (isOpen) {
      // Reset form for new talent
      setTalent({
        nom: "",
        email: "",
        domaine_artiste: "",
        statut_talent: "en_validation",
        description_talent: "",
        is_talent: true,
        password: "",
      })
    }
  }, [isOpen, talentId])

  const fetchTalent = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/utilisateurs/${talentId}`)
      console.log('DATA TALENT:', response.data) // Log pour debug
      // Ne pas inclure le mot de passe dans les données chargées
      const { password, ...talentData } = response.data
      setTalent({
        ...talentData,
        domaine_artiste: talentData.domaine_artiste || "",
        description_talent: talentData.description_talent || "",
        password: "", // Réinitialiser le mot de passe
      })
    } catch (error) {
      console.error("Error fetching talent:", error)
      setToast({
        message: "Erreur lors de la récupération du talent",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setTalent((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validation du mot de passe pour la création
      if (!talentId && !talent.password) {
        setToast({
          message: "Le mot de passe est requis pour la création d'un talent",
          type: "error",
        });
        setSaving(false);
        return;
      }

      // Préparer le payload avec uniquement les champs modifiés
      const payload = {
        ...talent,
        role: "utilisateur"
      };

      // Pour la modification, ne pas envoyer les champs vides
      if (talentId) {
        // Supprimer les champs vides du payload
        Object.keys(payload).forEach(key => {
          if (payload[key] === "" || payload[key] === null) {
            delete payload[key];
          }
        });
        
        // Ne pas envoyer le mot de passe s'il n'est pas modifié
        if (!payload.password) {
          delete payload.password;
        }
      }

      if (talentId) {
        await api.put(`/utilisateurs/${talentId}`, payload);
        setToast({
          message: "Talent mis à jour avec succès",
          type: "success",
        });
      } else {
        await api.post("/utilisateurs", payload);
        setToast({
          message: "Talent créé avec succès",
          type: "success",
        });
      }

      if (onSuccess) onSuccess();
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error("Error saving talent:", error);
      setToast({
        message: error.response?.data?.message || "Erreur lors de l'enregistrement",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={talentId ? "Modifier le talent" : "Ajouter un talent"}
        footer={
          <>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              disabled={saving}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)] disabled:opacity-50"
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enregistrement...
                </span>
              ) : (
                "Enregistrer"
              )}
            </button>
          </>
        }
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
          </div>
        ) : (
          <form className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                name="nom"
                value={talent.nom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={talent.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {talentId ? "Nouveau mot de passe (laisser vide pour ne pas modifier)" : "Mot de passe"}
              </label>
              <input
                type="password"
                name="password"
                value={talent.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required={!talentId}
                minLength={8}
                placeholder={talentId ? "Laisser vide pour ne pas modifier" : "Mot de passe"}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Domaine artistique</label>
              <input
                type="text"
                name="domaine_artiste"
                value={talent.domaine_artiste}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Statut</label>
              <select
                name="statut_talent"
                value={talent.statut_talent}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
              >
                <option value="en_validation">En validation</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description_talent"
                value={talent.description_talent}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
              ></textarea>
            </div>
          </form>
        )}
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
