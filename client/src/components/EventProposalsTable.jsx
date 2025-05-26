"use client"

import { useState, useEffect } from "react"
import { Eye, Check, X, Search, Filter } from "lucide-react"
import api from "../api"
import Toast from "./Toast"

const EventProposalsTable = ({ limit }) => {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProposal, setSelectedProposal] = useState(null)
  const [processingAction, setProcessingAction] = useState(false)
  const [commentaire, setCommentaire] = useState("")
  const [toast, setToast] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchProposals()
  }, [filter, limit])

  const fetchProposals = async () => {
    setLoading(true)
    try {
      const params = {
        status: filter === "all" ? undefined : filter,
        limit: limit || undefined,
      }

      const { data } = await api.get("/event-proposals", {
        params,
        validateStatus: (status) => status < 500,
      })

      if (!data || !Array.isArray(data)) {
        throw new Error("Réponse API invalide")
      }

      setProposals(data)
      setToast({
        message: "Propositions chargées avec succès",
        type: "success",
      })
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Erreur lors du chargement des propositions"

      setToast({ message, type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (proposal) => {
    setSelectedProposal(proposal)
    setModalType("view")
  }

  const handleCloseModal = () => {
    setSelectedProposal(null)
    setModalType(null)
    setCommentaire("")
  }

  const handleActionClick = (proposal, action) => {
    setSelectedProposal(proposal)
    setModalType(action)
    setCommentaire("")
  }

  const handleProcessProposal = async (status) => {
    if (!selectedProposal) return

    setProcessingAction(true)
    try {
      await api.put(`/event-proposals/${selectedProposal.id}/process`, {
        statut: status,
        commentaire_admin: commentaire,
      })

      setProposals(
        proposals.map((p) =>
          p.id === selectedProposal.id ? { ...p, statut: status, commentaire_admin: commentaire } : p,
        ),
      )

      handleCloseModal()

      setToast({
        message: `Proposition ${status === "approuve" ? "approuvée" : "rejetée"} avec succès`,
        type: "success",
      })

      fetchProposals()
    } catch (error) {
      console.error("Error processing event proposal:", error)
      setToast({
        message: "Erreur lors du traitement de la proposition",
        type: "error",
      })
    } finally {
      setProcessingAction(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      en_attente: "bg-amber-50 text-amber-700 border-amber-200",
      approuve: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejete: "bg-red-50 text-red-700 border-red-200",
    }

    const statusText = {
      en_attente: "En attente",
      approuve: "Approuvé",
      rejete: "Rejeté",
    }

    const className = statusMap[status] || "bg-gray-50 text-gray-700 border-gray-200"
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
        {statusText[status] || status || "Inconnu"}
      </span>
    )
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

    const className = typeMap[type?.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200"
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
        {typeText[type?.toLowerCase()] || type || "Autre"}
      </span>
    )
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

  const statusCounts = proposals.reduce(
    (acc, proposal) => {
      acc.total++
      acc[proposal.statut] = (acc[proposal.statut] || 0) + 1
      return acc
    },
    { total: 0, en_attente: 0, approuve: 0, rejete: 0 },
  )

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      searchTerm === "" ||
      (proposal.titre && proposal.titre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (proposal.proposeur_nom && proposal.proposeur_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (proposal.proposeur_email && proposal.proposeur_email.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = filter === "all" || proposal.statut === filter

    return matchesSearch && matchesStatus
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProposals.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#6e3d20] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 items-center">
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
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="all">Tous les statuts ({statusCounts.total})</option>
            <option value="en_attente">En attente ({statusCounts.en_attente})</option>
            <option value="approuve">Approuvés ({statusCounts.approuve})</option>
            <option value="rejete">Rejetés ({statusCounts.rejete})</option>
          </select>
        </div>
      </div>

      {filteredProposals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Aucune proposition trouvée</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Proposeur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
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
                  {currentItems.map((proposal) => (
                    <tr key={proposal.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {proposal.titre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{proposal.proposeur_nom}</div>
                        <div className="text-sm text-gray-500">{proposal.proposeur_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(proposal.date_debut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(proposal.type)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(proposal.statut)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(proposal)}
                            className="p-2 text-gray-400 hover:text-[#6e3d20] hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {proposal.statut === "en_attente" && (
                            <>
                              <button
                                onClick={() => handleActionClick(proposal, "approve")}
                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                                title="Approuver"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleActionClick(proposal, "reject")}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Rejeter"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredProposals.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-6 px-2">
              <div className="text-sm text-gray-600">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredProposals.length)} sur{" "}
                {filteredProposals.length} propositions
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

      {/* Modal de visualisation */}
      {selectedProposal && modalType === "view" && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 font-inter">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-[#a94c0f]">{selectedProposal.titre}</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Informations générales</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Type:</span> {getTypeBadge(selectedProposal.type)}
                  </p>
                  <p>
                    <span className="font-medium">Statut:</span> {getStatusBadge(selectedProposal.statut)}
                  </p>
                  <p>
                    <span className="font-medium">Date de début:</span> {formatDate(selectedProposal.date_debut)}
                  </p>
                  <p>
                    <span className="font-medium">Date de fin:</span> {formatDate(selectedProposal.date_fin)}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Proposeur</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Nom:</span> {selectedProposal.proposeur_nom}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {selectedProposal.proposeur_email}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
              <p className="text-gray-600">{selectedProposal.description}</p>
            </div>

            {selectedProposal.commentaire_admin && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Commentaire administrateur</h4>
                <p className="text-gray-600">{selectedProposal.commentaire_admin}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              {selectedProposal.statut === "en_attente" && (
                <>
                  <button
                    onClick={() => handleActionClick(selectedProposal, "approve")}
                    className="rounded-lg px-6 py-2 font-semibold bg-[#a94c0f] text-white border-2 border-[#a94c0f] hover:bg-[#7a370b] hover:border-[#7a370b] transition"
                  >
                    Approuver
                  </button>
                  <button
                    onClick={() => handleActionClick(selectedProposal, "reject")}
                    className="rounded-lg px-6 py-2 font-semibold border-2 border-[#a94c0f] text-[#a94c0f] bg-white hover:bg-[#a94c0f] hover:text-white transition"
                  >
                    Rejeter
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de traitement (Approuver/Rejeter) */}
      {selectedProposal && (modalType === "approve" || modalType === "reject") && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 font-inter">
            <h3 className="text-xl font-bold mb-4 text-[#a94c0f]">
              {modalType === "approve" ? "Approuver la proposition" : "Rejeter la proposition"}
            </h3>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Commentaire (optionnel)"
              className="w-full p-3 border rounded-lg mb-6 focus:ring-2 focus:ring-[#a94c0f] focus:border-[#a94c0f]"
              rows="3"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="rounded-lg px-6 py-2 font-semibold bg-gray-100 text-[#a94c0f] border border-gray-200 hover:bg-gray-200 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => handleProcessProposal(modalType === "approve" ? "approuve" : "rejete")}
                disabled={processingAction}
                className={`rounded-lg px-6 py-2 font-semibold ${
                  modalType === "approve"
                    ? "bg-[#a94c0f] text-white border-2 border-[#a94c0f] hover:bg-[#7a370b] hover:border-[#7a370b]"
                    : "border-2 border-[#a94c0f] text-[#a94c0f] bg-white hover:bg-[#a94c0f] hover:text-white"
                } ${processingAction ? "opacity-50 cursor-not-allowed" : ""} transition`}
              >
                {processingAction ? "Traitement..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  )
}

export default EventProposalsTable
