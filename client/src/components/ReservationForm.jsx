"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import api from "../api";
import Toast from "./Toast";
import Cookies from "js-cookie";

export default function ReservationForm({
  isOpen,
  onClose,
  reservation = null,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
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
    commentaires: ""
  });
  const [espaces, setEspaces] = useState([]);

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
          commentaires: ""
        });
        await fetchEspaces();
      }
    };

    initializeForm();
  }, [isOpen, reservation]);

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
        message: "Erreur lors de la récupération des espaces",
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
        message: "La réservation doit être faite au moins 15 jours à l'avance",
        type: "error"
      });
      return false;
    }

    if (!formReservation.titre || !formReservation.date_debut || !formReservation.date_fin || !formReservation.espace_id) {
      setToast({
        message: "Veuillez remplir tous les champs obligatoires",
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

    if (!validateReservation()) {
      setSaving(false);
      return;
    }

    try {
      const userId = await getUserId();
      if (!userId) {
        setToast({
          message: "Vous devez être connecté pour faire une réservation",
          type: "error"
        });
        setSaving(false);
        return;
      }

      const payload = {
        ...formReservation,
        type_reservation: "standard", // Toujours standard
        utilisateur_id: userId
      };

      if (reservation && reservation.id) {
        await api.put(`/reservations/${reservation.id}`, payload);
      } else {
        await api.post("/reservations", payload);
      }
      setToast({ message: "Réservation enregistrée avec succès", type: "success" });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving reservation:", error);
      setToast({
        message: error.response?.data?.message || "Erreur lors de l'enregistrement de la réservation",
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

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={reservation ? "Modifier la réservation" : "Nouvelle réservation"}
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
              {saving ? "Enregistrement..." : "Enregistrer"}
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
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Titre *
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
                Description
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
                Type d'organisateur *
              </label>
              <select
                name="type_organisateur"
                value={formReservation.type_organisateur}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              >
                <option value="individu">Individu</option>
                <option value="association">Association</option>
                <option value="entreprise">Entreprise</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Date de début *
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
                La réservation doit être faite au moins 15 jours à l'avance
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Date de fin *
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
                Espace *
              </label>
              <select
                name="espace_id"
                value={formReservation.espace_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              >
                <option value="">Sélectionner un espace</option>
                {espaces.map((espace) => (
                  <option key={espace.id} value={espace.id}>
                    {espace.nom} - {espace.type} {espace.sous_type ? `(${espace.sous_type})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Nombre de places
              </label>
              <input
                type="number"
                name="nombre_places"
                value={formReservation.nombre_places}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Matériel additionnel
              </label>
              <textarea
                name="materiel_additionnel"
                value={formReservation.materiel_additionnel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] h-20"
                placeholder="Décrivez le matériel dont vous avez besoin..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Le matériel supplémentaire peut être payant
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Commentaires
              </label>
              <textarea
                name="commentaires"
                value={formReservation.commentaires}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] h-20"
                placeholder="Ajoutez des commentaires supplémentaires..."
              />
            </div>
          </form>
        )}
      </Modal>
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
