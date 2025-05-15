"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import api from "../api";
import Toast from "./Toast";
import Cookies from "js-cookie";

export default function ChatbotQATable({ limit }) {
  const [qaPairs, setQaPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showQAForm, setShowQAForm] = useState(false);
  const [editingQA, setEditingQA] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const userRole = Cookies.get("userRole");
  const canDelete = userRole === "superadmin" || userRole === "admin";

  useEffect(() => {
    fetchQAPairs();
  }, []);

  const fetchQAPairs = async () => {
    try {
      const response = await api.get("/chatbot/qa");
      setQaPairs(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching Q&A pairs:", err);
      setError("Impossible de charger les paires Q&R");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/chatbot/qa/${selectedId}`);
      setQaPairs(qaPairs.filter((qa) => qa.id !== selectedId));
      setShowConfirmModal(false);
      setToast({
        message: "Paire Q&R supprimée avec succès",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting Q&A pair:", error);
      setError("Erreur lors de la suppression");
      setToast({
        message: "Erreur lors de la suppression",
        type: "error",
      });
    }
  };

  const handleAddQA = () => {
    setEditingQA(null);
    setShowQAForm(true);
  };

  const handleEditQA = (qa) => {
    setEditingQA(qa);
    setShowQAForm(true);
  };

  const handleQAFormSuccess = () => {
    fetchQAPairs();
    setCurrentPage(1);
  };

  const filteredQAPairs = qaPairs.filter(
    (qa) =>
      qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qa.reponse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredQAPairs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQAPairs.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    );
  }

  if (error && qaPairs.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2 items-center">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <input
            type="text"
            placeholder="Rechercher..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {!limit && (
          <button
            onClick={handleAddQA}
            className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
          >
            Ajouter une paire Q&R
          </button>
        )}
      </div>

      {currentItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Aucune paire Q&R trouvée
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Réponse
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((qa) => (
                    <tr key={qa.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900">
                        {qa.question}
                      </td>
                      <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900">
                        {qa.reponse}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditQA(qa)}
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
                            onClick={() => handleDeleteClick(qa.id)}
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
          </div>

          {/* Pagination */}
          {!limit && totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-2">
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

                {[...Array(totalPages)].map((_, index) => {
                  const number = index + 1;
                  return (
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
                  );
                })}

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
          Êtes-vous sûr de vouloir supprimer cette paire Q&R ? Cette action est
          irréversible.
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
            <button type="submit" form="qaForm" className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)]">
              {editingQA ? "Modifier" : "Ajouter"}
            </button>
          </>
        }
      >
        <form 
          id="qaForm"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
              question: formData.get('question'),
              reponse: formData.get('reponse')
            };
            
            try {
              if (editingQA) {
                await api.put(`/chatbot/qa/${editingQA.id}`, data);
              } else {
                await api.post('/chatbot/qa', data);
              }
              setShowQAForm(false);
              handleQAFormSuccess();
              setToast({
                message: editingQA ? "Paire Q&R modifiée avec succès" : "Paire Q&R ajoutée avec succès",
                type: "success"
              });
            } catch (error) {
              console.error("Error saving Q&A pair:", error);
              setToast({
                message: "Erreur lors de l'enregistrement",
                type: "error"
              });
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Question
            </label>
            <textarea
              name="question"
              defaultValue={editingQA?.question}
              required
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)]"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Réponse
            </label>
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
