"use client"

import { useState, useEffect } from "react"
import { Eye, Edit, Trash2, Plus, Search, Filter } from "lucide-react"
import Modal from "./Modal"
import api from "../api"
import Cookies from "js-cookie"
import EspaceForm from "./EspaceForm"
import EspaceDetails from "./EspaceDetails"
import Toast from "./Toast"

export default function EspacesTable({ limit }) {
  const [espaces, setEspaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [showEspaceForm, setShowEspaceForm] = useState(false)
  const [showEspaceDetails, setShowEspaceDetails] = useState(false)
  const [editingEspace, setEditingEspace] = useState(null)
  const [viewingEspace, setViewingEspace] = useState(null)
  const [toast, setToast] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const userRole = Cookies.get("userRole")
  const canDelete = userRole === "superadmin"
  const allTypes = Array.from(new Set(espaces.map((e) => e.type).filter(Boolean)))

  useEffect(() => {
    fetchEspaces()
  }, [limit])

  const fetchEspaces = async () => {
    setLoading(true)
    try {
      const response = await api.get("/espaces")
      let data = response.data

      if (limit) {
        data = data.slice(0, limit)
      }

      setEspaces(data)
      setError(null)
      setToast({
        message: "Espaces chargés avec succès",
        type: "success",
      })
    } catch (err) {
      console.error("Error fetching espaces:", err)
      setError("Impossible de charger les espaces")
      setToast({
        message: "Erreur lors du chargement des espaces",
        type: "error",
      })
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
      await api.delete(`/espaces/${selectedId}`)
      setEspaces(espaces.filter((espace) => espace.id !== selectedId))
      setShowConfirmModal(false)
      setToast({
        message: "Espace supprimé avec succès",
        type: "success",
      })
    } catch (error) {
      console.error("Error deleting espace:", error)
      setError("Erreur lors de la suppression de l'espace")
      setToast({
        message: "Erreur lors de la suppression",
        type: "error",
      })
    }
  }

  const handleAddEspace = () => {
    setEditingEspace(null)
    setShowEspaceForm(true)
  }

  const handleEditEspace = (espace) => {
    setEditingEspace(espace)
    setShowEspaceForm(true)
  }

  const handleViewEspace = (espace) => {
    setViewingEspace(espace)
    setShowEspaceDetails(true)
  }

  const handleEspaceFormSuccess = () => {
    fetchEspaces()
    setCurrentPage(1)
  }

  const typeColors = {
    salle: "bg-blue-50 text-blue-700 border-blue-200",
    atelier: "bg-green-50 text-green-700 border-green-200",
    exposition: "bg-yellow-50 text-yellow-700 border-yellow-200",
    cinéma: "bg-purple-50 text-purple-700 border-purple-200",
    theatre: "bg-pink-50 text-pink-700 border-pink-200",
  }

  const typeLabels = {
    salle: "Salle",
    atelier: "Atelier",
    exposition: "Exposition",
    cinéma: "Cinéma",
    theatre: "Théâtre",
  }

  const getTypeBadge = (type) => {
    const className = typeColors[type] || "bg-gray-50 text-gray-700 border-gray-200"
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
        {typeLabels[type] || (type ? type.charAt(0).toUpperCase() + type.slice(1) : "N/A")}
      </span>
    )
  }

  const filteredEspaces = espaces.filter((espace) => {
    const matchesSearch =
      searchTerm === "" ||
      (espace.nom && espace.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (espace.description && espace.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = typeFilter === "" || espace.type === typeFilter

    return matchesSearch && matchesType
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredEspaces.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredEspaces.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[oklch(47.3%_0.137_46.201)] border-t-transparent"></div>
      </div>
    )
  }

  if (error && espaces.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-4">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
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
              {allTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        {!limit && (
          <button
            onClick={handleAddEspace}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow-sm hover:bg-[oklch(50%_0.137_46.201)] transition-all duration-200 font-medium"
          >
            <Plus className="h-4 w-4" />
            Ajouter un espace
          </button>
        )}
      </div>

      {filteredEspaces.length === 0 ? (
        <div className="text-center py-12 border border-gray-200 rounded-xl bg-white">
          <p className="text-gray-500 mb-4">Aucun espace trouvé</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Capacité
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {currentItems.map((espace) => (
                    <tr key={espace.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{espace.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{espace.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(espace.type)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{espace.capacite || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewEspace(espace)}
                            className="p-2 text-gray-400 hover:text-[oklch(47.3%_0.137_46.201)] hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditEspace(espace)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteClick(espace.id)}
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

          {filteredEspaces.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-6 px-2">
              <div className="text-sm text-gray-600">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredEspaces.length)} sur{" "}
                {filteredEspaces.length} espaces
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
          Êtes-vous sûr de vouloir supprimer cet espace ? Cette action est irréversible.
        </p>
      </Modal>

      <EspaceForm
        isOpen={showEspaceForm}
        onClose={() => setShowEspaceForm(false)}
        espace={editingEspace}
        onSuccess={handleEspaceFormSuccess}
      />

      <EspaceDetails
        isOpen={showEspaceDetails}
        onClose={() => setShowEspaceDetails(false)}
        espace={viewingEspace}
        onEdit={() => {
          setShowEspaceDetails(false)
          setEditingEspace(viewingEspace)
          setShowEspaceForm(true)
        }}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
