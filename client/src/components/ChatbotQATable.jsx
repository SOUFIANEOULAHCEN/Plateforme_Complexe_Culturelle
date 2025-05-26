"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus, Search } from "lucide-react"
import Modal from "./Modal"
import api from "../api"
import Toast from "./Toast"
import Cookies from "js-cookie"

export default function ChatbotQATable({ limit }) {
  const [qaPairs, setQaPairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showQAForm, setShowQAForm] = useState(false)
  const [editingQA, setEditingQA] = useState(null)
  const [toast, setToast] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const userRole = Cookies.get("userRole")
  const canDelete = userRole === "superadmin" || userRole === "admin"

  useEffect(() => {
    fetchQAPairs()
  }, [])

  const fetchQAPairs = async () => {
    try {
      const response = await api.get("/chatbot/qa")
      setQaPairs(response.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching Q&A pairs:", err)
      setError("Impossible de charger les paires Q&R")
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
      await api.delete(`/chatbot/qa/${selectedId}`)
      setQaPairs(qaPairs.filter((qa) => qa.id !== selectedId))
      setShowConfirmModal(false)
      setToast({
        message: "Paire Q&R supprimée avec succès",
        type: "success",
      })
    } catch (error) {
      console.error("Error deleting Q&A pair:", error)
      setError("Erreur lors de la suppression")
      setToast({
        message: "Erreur lors de la suppression",
        type: "error",
      })
    }
  }

  const handleAddQA = () => {
    setEditingQA(null)
    setShowQAForm(true)
  }

  const handleEditQA = (qa) => {
    setEditingQA(qa)
    setShowQAForm(true)
  }

  const handleQAFormSuccess = () => {
    fetchQAPairs()
    setCurrentPage(1)
  }

  const filteredQAPairs = qaPairs.filter(
    (qa) =>
      qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qa.reponse.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredQAPairs.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredQAPairs.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[oklch(47.3%_0.137_46.201)] border-t-transparent"></div>
      </div>
    )
  }

  if (error && qaPairs.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-4">
        <p>{error}</p>
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
        {!limit && (
          <button
            onClick={handleAddQA}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow-sm hover:bg-[oklch(50%_0.137_46.201)] transition-all duration-200 font-medium"
          >
            <Plus className="h-4 w-4" />
            Ajouter une paire Q&R
          </button>
        )}
      </div>

      {currentItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-500">
          Aucune paire Q&R trouvée
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Réponse
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {currentItems.map((qa) => (
                    <tr key={qa.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900">{qa.question}</td>
                      <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900">{qa.reponse}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditQA(qa)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteClick(qa.id)}
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

          {!limit && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-2">
              <div className="text-sm text-gray-600">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredQAPairs.length)} sur{" "}
                {filteredQAPairs.length} paires Q&R
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

                {[...Array(totalPages)].map((_, index) => {
                  const number = index + 1
                  return (
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
                  )
                })}

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
          Êtes-vous sûr de vouloir supprimer cette paire Q&R ? Cette action est irréversible.
        </p>
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={showQAForm}
        onClose={() => setShowQAForm(false)}
        title={editingQA ? "Modifier la paire Q&R" : "Ajouter une paire Q&R"}
        footer={
          <>
            <button
              onClick={() => setShowQAForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="qaForm"
              className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)]"
            >
              {editingQA ? "Modifier" : "Ajouter"}
            </button>
          </>
        }
      >
        <form
          id="qaForm"
          onSubmit={async (e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            const data = {
              question: formData.get("question"),
              reponse: formData.get("reponse"),
            }

            try {
              if (editingQA) {
                await api.put(`/chatbot/qa/${editingQA.id}`, data)
              } else {
                await api.post("/chatbot/qa", data)
              }
              setShowQAForm(false)
              handleQAFormSuccess()
              setToast({
                message: editingQA ? "Paire Q&R modifiée avec succès" : "Paire Q&R ajoutée avec succès",
                type: "success",
              })
            } catch (error) {
              console.error("Error saving Q&A pair:", error)
              setToast({
                message: "Erreur lors de l'enregistrement",
                type: "error",
              })
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Question</label>
            <textarea
              name="question"
              defaultValue={editingQA?.question}
              required
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Réponse</label>
            <textarea
              name="reponse"
              defaultValue={editingQA?.reponse}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
            />
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
