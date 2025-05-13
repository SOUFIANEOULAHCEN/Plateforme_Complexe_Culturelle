"use client"

import { useState, useEffect } from "react"
import Modal from "./Modal"
import api from "../api"
import Toast from "./Toast"

export default function EspaceForm({ isOpen, onClose, espace = null, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    nom: "",
    type: "salle",
    sous_type: "",
    capacite: "",
    description: "",
    image_url: "",
  })

  // Initialize form with espace data if editing
  useEffect(() => {
    if (isOpen && espace) {
      setFormData({
        nom: espace.nom || "",
        type: espace.type || "salle",
        sous_type: espace.sous_type || "",
        capacite: espace.capacite || "",
        description: espace.description || "",
        image_url: espace.image_url || "",
      })
    } else if (isOpen) {
      // Reset form for new espace
      setFormData({
        nom: "",
        type: "salle",
        sous_type: "",
        capacite: "",
        description: "",
        image_url: "",
      })
    }
  }, [isOpen, espace])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacite" ? (value === "" ? "" : Number.parseInt(value)) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = { ...formData }

      if (espace?.id) {
        // Update existing espace
        await api.put(`/espaces/${espace.id}`, payload)
        setToast({
          message: "Espace mis à jour avec succès",
          type: "success",
        })
      } else {
        // Create new espace
        await api.post("/espaces", payload)
        setToast({
          message: "Espace créé avec succès",
          type: "success",
        })
      }

      if (onSuccess) onSuccess()
      setTimeout(() => onClose(), 1500)
    } catch (error) {
      console.error("Error saving espace:", error)
      setToast({
        message: error.response?.data?.message || "Erreur lors de l'enregistrement",
        type: "error",
      })
    } finally {
      setSaving(false)
    }
  }

  const getSousTypeOptions = () => {
    if (formData.type === "salle") {
      return [
        { value: "théâtre", label: "Théâtre" },
        { value: "conférence", label: "Conférence" },
        { value: "bibliothèque", label: "Bibliothèque" },
        { value: "musique", label: "Musique" },
        { value: "café", label: "Café" },
      ]
    } else if (formData.type === "atelier") {
      return [
        { value: "photographie", label: "Photographie" },
        { value: "informatique", label: "Informatique" },
        { value: "langue", label: "Langue" },
        { value: "arts", label: "Arts" },
      ]
    }
    return []
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={espace?.id ? "Modifier l'espace" : "Nouvel espace"}
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
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
              >
                <option value="salle">Salle</option>
                <option value="atelier">Atelier</option>
                <option value="exposition">Exposition</option>
                <option value="cinéma">Cinéma</option>
              </select>
            </div>

            {getSousTypeOptions().length > 0 && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Sous-type</label>
                <select
                  name="sous_type"
                  value={formData.sous_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                >
                  <option value="">Sélectionner un sous-type</option>
                  {getSousTypeOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Capacité</label>
              <input
                type="number"
                name="capacite"
                value={formData.capacite}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
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