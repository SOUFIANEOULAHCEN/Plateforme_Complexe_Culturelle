"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import api from "../api";
import Cookies from "js-cookie";
import ReservationForm from "./ReservationForm";
import ReservationDetails from "./ReservationDetails";
import Toast from "./Toast";

export default function ReservationsTable({ limit }) {
  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [viewingReservation, setViewingReservation] = useState(null);
  const userRole = Cookies.get("userRole");
  const canDelete = userRole === "superadmin";
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchAllData();
  }, [limit]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [reservationsRes, eventsRes, usersRes] = await Promise.all([
        api.get("/reservations"),
        api.get("/evenements"),
        api.get("/utilisateurs"),
      ]);

      setReservations(reservationsRes.data);
      setEvents(eventsRes.data);
      setUsers(usersRes.data);
      setError(null);
      setCurrentPage(1);

      setToast({
        message: "Réservations chargées avec succès",
        type: "success",
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Impossible de charger les données");
      setToast({
        message: "Erreur lors du chargement des données",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventName = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    return event ? event.titre : "N/A";
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.nom : "N/A";
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/reservations/${selectedId}`);
      setReservations(
        reservations.filter((reservation) => reservation.id !== selectedId)
      );
      setShowConfirmModal(false);
      setToast({
        message: "Réservation supprimée avec succès",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      setError("Erreur lors de la suppression de la réservation");
      setToast({
        message: "Erreur lors de la suppression de la réservation",
        type: "error",
      });
    }
  };

  const handleAddReservation = () => {
    setEditingReservation(null);
    setShowReservationForm(true);
  };

  const handleEditReservation = (reservation) => {
    setEditingReservation(reservation);
    setShowReservationForm(true);
  };

  const handleViewReservation = (reservation) => {
    const enhancedReservation = {
      ...reservation,
      evenement_titre: getEventName(reservation.evenement_id),
      utilisateur_nom: getUserName(reservation.utilisateur_id),
      evenement: events.find((e) => e.id === reservation.evenement_id),
      utilisateur: users.find((u) => u.id === reservation.utilisateur_id),
    };
    setViewingReservation(enhancedReservation);
    setShowReservationDetails(true);
  };

  const handleReservationFormSuccess = () => {
    fetchAllData();
    setShowReservationForm(false);
    setToast({
      message: "Réservation enregistrée avec succès",
      type: "success",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      confirme: "bg-green-100 text-green-800",
      en_attente: "bg-yellow-100 text-yellow-800",
      annule: "bg-red-100 text-red-800",
    };

    const statusText = {
      confirme: "Confirmée",
      en_attente: "En attente",
      annule: "Annulée",
    };

    const className = statusMap[status] || "bg-gray-100 text-gray-800";
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}
      >
        {statusText[status] || status || "N/A"}
      </span>
    );
  };

  const filteredReservations = reservations.filter((reservation) => {
    const eventName = getEventName(reservation.evenement_id);
    const userName = getUserName(reservation.utilisateur_id);

    const matchesSearch =
      searchTerm === "" ||
      eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" || reservation.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    );
  }

  if (error && reservations.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <input
            type="text"
            placeholder="Rechercher..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="confirme">Confirmée</option>
            <option value="en_attente">En attente</option>
            <option value="annule">Annulée</option>
          </select>
        </div>
        {!limit && (
          <button
            onClick={handleAddReservation}
            className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
          >
            Nouvelle réservation
          </button>
        )}
      </div>

      {filteredReservations.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Événement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((reservation, index) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getEventName(reservation.evenement_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getUserName(reservation.utilisateur_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(reservation.date_reservation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(reservation.statut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewReservation(reservation)}
                        className="text-[oklch(47.3%_0.137_46.201)] hover:text-[oklch(50%_0.137_46.201)] mr-3"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEditReservation(reservation)}
                        className="text-amber-600 hover:text-amber-900 mr-3"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteClick(reservation.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReservations.length > itemsPerPage && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Affichage de {indexOfFirstItem + 1} à{" "}
                {Math.min(indexOfLastItem, filteredReservations.length)} sur{" "}
                {filteredReservations.length} réservations
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  «
                </button>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === number
                          ? "bg-[oklch(47.3%_0.137_46.201)] text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  ›
                </button>
                <button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">Aucune réservation trouvée</p>
        </div>
      )}

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmer la suppression"
        footer={
          <>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Supprimer
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action
          est irréversible.
        </p>
      </Modal>

      <ReservationForm
        isOpen={showReservationForm}
        onClose={() => setShowReservationForm(false)}
        reservation={editingReservation}
        onSuccess={handleReservationFormSuccess}
        events={events}
        users={users}
      />

      <ReservationDetails
        isOpen={showReservationDetails}
        onClose={() => setShowReservationDetails(false)}
        reservation={viewingReservation}
        onEdit={() => {
          setShowReservationDetails(false);
          setEditingReservation(viewingReservation);
          setShowReservationForm(true);
        }}
      />

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
