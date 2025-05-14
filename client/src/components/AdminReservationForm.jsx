"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import api from "../api";
import Toast from "./Toast";
import Cookies from "js-cookie";

export default function AdminReservationForm({
  isOpen,
  onClose,
  reservation = null,
  onSuccess,
  events,
  users
}) {
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
    commentaires: ""
  });
  const [espaces, setEspaces] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

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
        let email = "";
        if (reservation.utilisateur && reservation.utilisateur.email) {
          email = reservation.utilisateur.email;
        } else if (reservation.utilisateur_id && users && users.length > 0) {
          const userObj = users.find(u => u.id === reservation.utilisateur_id || u._id === reservation.utilisateur_id);
          if (userObj) email = userObj.email;
        }
        setSelectedUser(email);
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
        setSelectedUser("");
      }
    };

    initializeForm();
  }, [isOpen, reservation, users]);

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

    if (!selectedUser) {
      setToast({
        message: "Veuillez sélectionner un utilisateur.",
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

    // Trouver l'utilisateur sélectionné
    const user = users.find(u => u.email === selectedUser);
    if (!user) {
      setToast({
        message: "Veuillez sélectionner un utilisateur valide dans la liste.",
        type: "error"
      });
      setSaving(false);
      return;
    }

    const payload = {
      ...formReservation,
      type_reservation: "standard",
      utilisateur_id: user._id
    };

    try {
      if (reservation && reservation.id) {
        await api.put(`/reservations/${reservation.id}`, payload);
      } else {
        await api.post("/reservations", payload);
      }
      setToast({ message: "Réservation enregistrée avec succès", type: "success" });
      setFormSubmitted(true);
    } catch (error) {
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

  useEffect(() => {
    if (isOpen) {
      api.get('/utilisateurs')
        .then(res => {
          console.log("Utilisateurs récupérés :", res.data);
        })
        .catch(() => console.error("Erreur lors de la récupération des utilisateurs"));
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={modalVisible && isOpen}
        onClose={handleModalClose}
        title={reservation ? "Modifier la réservation" : "Nouvelle réservation"}
        footer={
          <>
            <button
              onClick={handleModalClose}
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
                Email de l'utilisateur *
              </label>
              <input
                type="email"
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
                placeholder="Saisir l'email de l'utilisateur"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
            </div>

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
          onClose={handleToastClose}
        />
      )}
    </>
  );
}