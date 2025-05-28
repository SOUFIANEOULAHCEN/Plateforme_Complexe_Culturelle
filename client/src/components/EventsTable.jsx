"use client"

import { useState, useEffect, useRef } from "react"
import { Eye, Edit, Trash2, Search, Filter, ChevronUp, ChevronDown } from "lucide-react"
import Modal from "./Modal"
import api from "../api"
import Cookies from "js-cookie"
import EventForm from "./EventForm"
import EventDetails from "./EventDetails"
import Toast from "./Toast"

export default function EventsTable({ limit }) {
  const [events, setEvents] = useState([])
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [showEventForm, setShowEventForm] = useState(false)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [viewingEvent, setViewingEvent] = useState(null)
  const [toast, setToast] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [dateDebutMin, setDateDebutMin] = useState("")
  const [dateDebutMax, setDateDebutMax] = useState("")
  const [sortOrder, setSortOrder] = useState("desc")
  const [showSortMenu, setShowSortMenu] = useState(false)
  const sortMenuRef = useRef()

  const userRole = Cookies.get("userRole")
  const canDelete = userRole === "superadmin"

  useEffect(() => {
    fetchAllData()
  }, [limit])

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [eventsRes, spacesRes] = await Promise.all([api.get("/evenements?_expand=espace"), api.get("/espaces")])

      const eventsWithSpaceNames = eventsRes.data.map((event) => ({
        ...event,
        espace_nom: event.espace?.nom || `Espace #${event.espace_id}`,
      }))

      setEvents(eventsWithSpaceNames)
      setSpaces(spacesRes.data)
      setError(null)
      setToast({ message: "Evenements chargées avec succès", type: "success" })
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

  const getSpaceName = (spaceId) => {
    const space = spaces.find((s) => s.id === spaceId)
    return space ? space.nom : "N/A"
  }

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await api.get("/evenements")
      let data = response.data

      if (limit) {
        data = data.slice(0, limit)
      }

      setEvents(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching events:", err)
      setError("Impossible de charger les événements")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id) => {
    setSelectedId(id)
    setShowConfirmModal(true)
  }

  const confirmDelete = async () => {
    try {
      await api.delete(`/evenements/${selectedId}`)
      setEvents(events.filter((event) => event.id !== selectedId))
      setShowConfirmModal(false)
      setToast({ message: "Événement supprimé avec succès", type: "success" })
    } catch (error) {
      console.error("Error deleting event:", error)
      setError("Erreur lors de la suppression de l'événement")
      setToast({ message: "Erreur lors de la suppression", type: "error" })
    }
  }

  const handleAddEvent = () => {
    setEditingEvent(null)
    setShowEventForm(true)
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    setShowEventForm(true)
  }

  const handleViewEvent = (event) => {
    setViewingEvent(event)
    setShowEventDetails(true)
  }

  const handleEventFormSuccess = () => {
    fetchAllData()
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

  const getTypeBadge = (type) => {
    const typeMap = {
      spectacle: "bg-pink-50 text-pink-700 border-pink-200",
      atelier: "bg-green-50 text-green-700 border-green-200",
      conference: "bg-yellow-50 text-yellow-700 border-yellow-200",
      exposition: "bg-blue-50 text-blue-700 border-blue-200",
      rencontre: "bg-purple-50 text-purple-700 border-purple-200",
    }

    const typeText = {
      spectacle: "Spectacle",
      atelier: "Atelier",
      conference: "Conférence",
      exposition: "Exposition",
      rencontre: "Rencontre",
    }

    const className = typeMap[type] || "bg-gray-50 text-gray-700 border-gray-200"
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
        {typeText[type] || type || "N/A"}
      </span>
    )
  }

  let filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === "" || (event.titre && event.titre.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = typeFilter === "" || event.type === typeFilter

    return matchesSearch && matchesType
  })

  filteredEvents = filteredEvents.sort((a, b) => {
    const dateA = new Date(a.date_debut)
    const dateB = new Date(b.date_debut)
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[oklch(47.3%_0.137_46.201)] border-t-transparent"></div>
      </div>
    )
  }

  if (error && events.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-4">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 items-center">
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Tous les types</option>
              <option value="spectacle">Spectacle</option>
              <option value="atelier">Atelier</option>
              <option value="conference">Conférence</option>
              <option value="exposition">Exposition</option>
              <option value="rencontre">Rencontre</option>
            </select>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-4">Aucun événement trouvé</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Affiche
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <span className="flex items-center gap-1 cursor-pointer" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                        Date
                        <span className="flex flex-col">
                          <ChevronUp className={`w-3 h-3 ${sortOrder === 'asc' ? 'text-[oklch(47.3%_0.137_46.201)]' : 'text-gray-400'}`} />
                          <ChevronDown className={`w-3 h-3 -mt-0.5 ${sortOrder === 'desc' ? 'text-[oklch(47.3%_0.137_46.201)]' : 'text-gray-400'}`} />
                        </span>
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email du proposeur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {currentItems.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col items-center">
                          <img
                            src={`http://localhost:3000${event.affiche_url || event.affiche || ""}`}
                            alt="Affiche"
                            className="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-200 mb-1"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg"
                              e.target.alt = "Image non disponible"
                            }}
                            title={event.id}
                          />
                          <span className="text-xs text-gray-400 font-medium">#{event.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.titre}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(event.type)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(event.date_debut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.proposeur_email || event.createur?.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewEvent(event)}
                            className="p-2 text-gray-400 hover:text-[oklch(47.3%_0.137_46.201)] hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteClick(event.id)}
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

          {filteredEvents.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-6 px-2">
              <div className="text-sm text-gray-600">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredEvents.length)} sur{" "}
                {filteredEvents.length} événements
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
          Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
        </p>
      </Modal>

      <EventForm
        isOpen={showEventForm}
        onClose={() => setShowEventForm(false)}
        event={editingEvent}
        onSuccess={handleEventFormSuccess}
        spaces={spaces}
      />

      <EventDetails
        isOpen={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        event={viewingEvent}
        onEdit={() => {
          setShowEventDetails(false)
          setEditingEvent(viewingEvent)
          setShowEventForm(true)
        }}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
