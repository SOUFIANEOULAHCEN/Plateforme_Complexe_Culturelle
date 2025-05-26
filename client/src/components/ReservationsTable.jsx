"use client"

import { useState, useEffect } from "react"
import { Eye, Edit, Trash2, Check, X, Search, Filter, ChevronUp, ChevronDown } from "lucide-react"
import Modal from "./Modal"
import api from "../api"
import Cookies from "js-cookie"
import ReservationDetails from "./ReservationDetails"
import Toast from "./Toast"
import AdminReservationForm from "./AdminReservationForm"

export default function ReservationsTable({ limit }) {
  const [reservations, setReservations] = useState([])
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [showReservationDetails, setShowReservationDetails] = useState(false)
  const [editingReservation, setEditingReservation] = useState(null)
  const [viewingReservation, setViewingReservation] = useState(null)
  const userRole = Cookies.get("userRole")
  const canDelete = userRole === "superadmin"
  const [toast, setToast] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedUser, setSelectedUser] = useState("")
  const [reservedPeriods, setReservedPeriods] = useState([])
  const [dateDebutMin, setDateDebutMin] = useState("")
  const [dateDebutMax, setDateDebutMax] = useState("")
  const [sortOrder, setSortOrder] = useState("desc")

  useEffect(() => {
    fetchAllData()
  }, [limit])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [reservationsRes, eventsRes, usersRes] = await Promise.all([
        api.get("/reservations"),
        api.get("/evenements"),
        api.get("/utilisateurs"),
      ])

      setReservations(reservationsRes.data)
      setEvents(eventsRes.data)
      setUsers(usersRes.data)
      setError(null)
      setCurrentPage(1)

      setToast({
        message: "Réservations chargées avec succès",
        type: "success",
      })
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Impossible de charger les données")
      setToast({
        message: "Erreur lors du chargement des données",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const getEventName = (eventId) => {
    const event = events.find((e) => e.id === eventId)
    return event ? event.titre : "N/A"
  }

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.nom : "N/A"
  }

  const handleDeleteClick = (id) => {
    setSelectedId(id)
    setShowConfirmModal(true)
  }

  const confirmDelete = async () => {
    try {
      await api.delete(`/reservations/${selectedId}`)
      setReservations(reservations.filter((reservation) => reservation.id !== selectedId))
      setShowConfirmModal(false)
      setToast({
        message: "Réservation supprimée avec succès",
        type: "success",
      })
    } catch (error) {
      console.error("Error deleting reservation:", error)
      setShowConfirmModal(false)
      const errorMessage = error.response?.data?.message || "Erreur lors de la suppression de la réservation"
      setToast({
        message: errorMessage,
        type: "error",
      })
    }
  }

  const handleAddReservation = () => {
    setEditingReservation(null)
    setShowReservationForm(true)
  }

  const handleEditReservation = (reservation) => {
    setEditingReservation(reservation)
    setShowReservationForm(true)
  }

  const handleViewReservation = (reservation) => {
    const enhancedReservation = {
      ...reservation,
      evenement_titre: getEventName(reservation.evenement_id),
      utilisateur_nom: getUserName(reservation.utilisateur_id),
      evenement: events.find((e) => e.id === reservation.evenement_id),
      utilisateur: users.find((u) => u.id === reservation.utilisateur_id),
    }
    setViewingReservation(enhancedReservation)
    setShowReservationDetails(true)
  }

  const handleReservationFormSuccess = () => {
    fetchAllData()
    setShowReservationForm(false)
    setToast({
      message: "Réservation enregistrée avec succès",
      type: "success",
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      confirme: "bg-emerald-50 text-emerald-700 border-emerald-200",
      en_attente: "bg-amber-50 text-amber-700 border-amber-200",
      annule: "bg-red-50 text-red-700 border-red-200",
    }

    const statusText = {
      confirme: "Confirmée",
      en_attente: "En attente",
      annule: "Annulée",
    }

    const className = statusMap[status] || "bg-gray-50 text-gray-700 border-gray-200"
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
        {statusText[status] || status || "N/A"}
      </span>
    )
  }

  const filteredReservations = reservations.filter((reservation) => {
    const eventName = getEventName(reservation.evenement_id)
    const userName = getUserName(reservation.utilisateur_id)

    const matchesSearch =
      searchTerm === "" ||
      eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "" || reservation.statut === statusFilter

    const dateDebut = new Date(reservation.date_debut)
    const afterMin = !dateDebutMin || dateDebut >= new Date(dateDebutMin)
    const beforeMax = !dateDebutMax || dateDebut <= new Date(dateDebutMax)

    return matchesSearch && matchesStatus && afterMin && beforeMax
  })

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    const dateA = new Date(a.date_debut)
    const dateB = new Date(b.date_debut)
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA
  })
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage
  const indexOfLastItem = indexOfFirstItem + itemsPerPage
  const currentItems = sortedReservations.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleDecision = async (id, decision) => {
    try {
      await api.put(`/reservations/${id}/decision`, { decision })
      setToast({
        message: `Réservation ${decision === "confirme" ? "acceptée" : "refusée"} avec succès`,
        type: "success",
      })
      fetchAllData()
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Erreur lors du traitement",
        type: "error",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[oklch(47.3%_0.137_46.201)] border-t-transparent"></div>
      </div>
    )
  }

  if (error && reservations.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-4">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:border-transparent transition-all duration-200 appearance-none bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="confirme">Confirmée</option>
            <option value="en_attente">En attente</option>
            <option value="annule">Annulée</option>
          </select>
        </div>
      </div>

      {filteredReservations.length > 0 ? (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        Date
                        <button
                          type="button"
                          aria-label={sortOrder === "asc" ? "Trier par date décroissante" : "Trier par date croissante"}
                          className={`focus:outline-none p-1 rounded hover:bg-gray-100 transition-colors ${
                            sortOrder === "asc" ? "text-[oklch(47.3%_0.137_46.201)]" : "text-gray-400"
                          }`}
                          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        >
                          {sortOrder === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {currentItems.map((reservation, index) => (
                    <tr key={reservation.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getUserName(reservation.utilisateur_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(reservation.date_debut)} - {formatDate(reservation.date_fin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(reservation.statut)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewReservation(reservation)}
                            className="p-2 text-gray-400 hover:text-[oklch(47.3%_0.137_46.201)] hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditReservation(reservation)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {["admin", "superadmin"].includes(userRole) && reservation.statut === "en_attente" && (
                            <>
                              <button
                                onClick={() => handleDecision(reservation.id, "confirme")}
                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                                title="Accepter"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDecision(reservation.id, "annule")}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Refuser"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteClick(reservation.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredReservations.length > itemsPerPage && (
            <div className="flex justify-between items-center mt-6 px-2">
              <div className="text-sm text-gray-600">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredReservations.length)} sur{" "}
                {filteredReservations.length} réservations
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  «
                </button>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === number
                        ? "bg-[oklch(47.3%_0.137_46.201)] text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  ›
                </button>
                <button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
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
            <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Supprimer
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
        </p>
      </Modal>

      <AdminReservationForm
        isOpen={showReservationForm}
        onClose={() => setShowReservationForm(false)}
        reservation={editingReservation}
        onSuccess={handleReservationFormSuccess}
        events={events}
        users={users}
      >
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Utilisateur *</label>
          <input
            type="text"
            list="users"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            placeholder="Email de l'utilisateur"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
            required
          />
          <datalist id="users">
            {users
              .filter((user) => user.role === "utilisateur" && user.is_talent === false)
              .map((user) => (
                <option key={user.id} value={user.email}>
                  {user.nom} ({user.email})
                </option>
              ))}
          </datalist>
        </div>
      </AdminReservationForm>

      <ReservationDetails
        isOpen={showReservationDetails}
        onClose={() => setShowReservationDetails(false)}
        reservation={viewingReservation}
        onEdit={() => {
          setShowReservationDetails(false)
          setEditingReservation(viewingReservation)
          setShowReservationForm(true)
        }}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}

function isDateReserved(dateDebut, dateFin, reservedPeriods) {
  return reservedPeriods.some((period) => {
    const start = new Date(period.date_debut)
    const end = new Date(period.date_fin)
    return new Date(dateDebut) < end && new Date(dateFin) > start
  })
}
