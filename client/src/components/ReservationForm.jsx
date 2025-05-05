"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import api from "../api";
import Toast from "./Toast";

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
    evenement_id: "",
    utilisateur_id: "",
    type_reservateur: "individu",
    documents_fournis: {},
    date_reservation: formatDateForInput(new Date()),
    statut: "en_attente",
    nombre_places: 1,
    materiel_requis: {},
    commentaires: ""
  });
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch reservation data if editing
  useEffect(() => {
    if (isOpen && reservation) {
      // Editing: fill form with reservation prop
      setFormReservation({
        ...reservation,
        date_reservation: formatDateForInput(new Date(reservation.date_reservation)),
      });
      fetchEvents()
      fetchUsers()
    } else if (isOpen) {
      // Reset form for new reservation
      setFormReservation({
        evenement_id: "",
        utilisateur_id: "",
        type_reservateur: "individu",
        documents_fournis: {},
        date_reservation: formatDateForInput(new Date()),
        statut: "en_attente",
        nombre_places: 1,
        materiel_requis: {},
        commentaires: ""
      });
      fetchEvents()
      fetchUsers()
    }
  }, [isOpen, reservation]);

  // Remove this function, it's not needed anymore:
  // const fetchReservation = async () => { ... }

  function formatDateForInput(date) {
    return date.toISOString().slice(0, 16);
  }

  const fetchReservation = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/reservations/${reservationId}`);
      const reservationData = response.data;

      // Format date for input field
      setReservation({
        ...reservationData,
        date_reservation: formatDateForInput(
          new Date(reservationData.date_reservation)
        ),
      });

      // Fetch related data
      fetchEvents();
      fetchUsers();
    } catch (error) {
      console.error("Error fetching reservation:", error);
      setToast({
        message: "Erreur lors de la récupération de la réservation",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get("/evenements");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setToast({
        message: "Erreur lors de la récupération des événements",
        type: "error",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/utilisateurs");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setToast({
        message: "Erreur lors de la récupération des utilisateurs",
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

  const handleDocumentChange = (e) => {
    const { name, checked } = e.target;
    setFormReservation((prev) => ({
      ...prev,
      documents_fournis: {
        ...prev.documents_fournis,
        [name.split(".")[1]]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);
    try {
      if (reservation && reservation.id) {
        await api.put(`/reservations/${reservation.id}`, formReservation);
      } else {
        await api.post("/reservations", formReservation);
      }
      setToast({ message: "Réservation enregistrée avec succès", type: "success" });
      if (onSuccess) onSuccess();
    } catch (error) {
      setToast({
        message: "Erreur lors de l'enregistrement de la réservation",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Type de réservateur
                </label>
                <select
                  name="type_reservateur"
                  value={formReservation.type_reservateur}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                  required
                >
                  <option value="individu">Individu</option>
                  <option value="association">Association</option>
                  <option value="entreprise">Entreprise</option>
                  <option value="institution">Institution</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Documents requis
                </label>
                <div className="space-y-2">
                  {formReservation.type_reservateur === 'individu' && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="documents_fournis.cni_ou_acte_naissance"
                        checked={formReservation.documents_fournis?.cni_ou_acte_naissance || false}
                        onChange={handleDocumentChange}
                        className="mr-2"
                      />
                      <span className="text-sm">CNI ou acte de naissance</span>
                    </div>
                  )}
                  {formReservation.type_reservateur === 'association' && (
                    <>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="documents_fournis.statuts"
                          checked={formReservation.documents_fournis?.statuts || false}
                          onChange={handleDocumentChange}
                          className="mr-2"
                        />
                        <span className="text-sm">Statuts</span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="documents_fournis.recu_adhesion"
                          checked={formReservation.documents_fournis?.recu_adhesion || false}
                          onChange={handleDocumentChange}
                          className="mr-2"
                        />
                        <span className="text-sm">Reçu d'adhésion</span>
                      </div>
                    </>
                  )}
                  {formReservation.type_reservateur === 'entreprise' && (
                    <>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="documents_fournis.documents_legaux"
                          checked={formReservation.documents_fournis?.documents_legaux || false}
                          onChange={handleDocumentChange}
                          className="mr-2"
                        />
                        <span className="text-sm">Documents légaux</span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="documents_fournis.recu_adhesion"
                          checked={formReservation.documents_fournis?.recu_adhesion || false}
                          onChange={handleDocumentChange}
                          className="mr-2"
                        />
                        <span className="text-sm">Reçu d'adhésion</span>
                      </div>
                    </>
                  )}
                  {formReservation.type_reservateur === 'institution' && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="documents_fournis.lettre_officielle"
                        checked={formReservation.documents_fournis?.lettre_officielle || false}
                        onChange={handleDocumentChange}
                        className="mr-2"
                      />
                      <span className="text-sm">Lettre officielle</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Événement
              </label>
              <select
                name="evenement_id"
                value={formReservation.evenement_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              >
                <option value="">Sélectionner un événement</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.titre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Date de réservation
              </label>
              <input
                type="datetime-local"
                name="date_reservation"
                value={formReservation.date_reservation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                La réservation doit être faite au moins 15 jours à l'avance
              </p>
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
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Matériel requis
              </label>
              <textarea
                name="materiel_requis"
                value={formReservation.materiel_requis.description || ""}
                onChange={(e) => setFormReservation(prev => ({
                  ...prev,
                  materiel_requis: { description: e.target.value }
                }))}
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
                placeholder="Commentaires additionnels..."
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
