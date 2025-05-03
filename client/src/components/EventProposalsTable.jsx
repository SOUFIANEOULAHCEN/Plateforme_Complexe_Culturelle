import React, { useState, useEffect } from "react";
import api from "../api";
import Toast from "./Toast";

const EventProposalsTable = ({ limit }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("en_attente");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [commentaire, setCommentaire] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProposals();
  }, [filter, limit]);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const params = {
        status: filter === "all" ? undefined : filter,
        limit: limit || undefined,
      };

      const { data } = await api.get("/event-proposals", {
        params,
        validateStatus: (status) => status < 500,
      });

      if (!data || !Array.isArray(data)) {
        throw new Error("Réponse API invalide");
      }
                                    
      setProposals(data);
      setToast({
        message: "Propositions chargées avec succès",
        type: "success",
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors du chargement des propositions";

      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (proposal) => {
    setSelectedProposal(proposal);
  };

  const handleCloseModal = () => {
    setSelectedProposal(null);
    setCommentaire("");
  };

  const handleProcessProposal = async (status) => {
    if (!selectedProposal) return;

    setProcessingAction(true);
    try {
      await api.put(`/event-proposals/${selectedProposal.id}/process`, {
        statut: status,
        commentaire_admin: commentaire,
      });

      // Update the local state
      setProposals(
        proposals.map((p) =>
          p.id === selectedProposal.id
            ? { ...p, statut: status, commentaire_admin: commentaire }
            : p
        )
      );

      // Close the modal
      handleCloseModal();

      // Show success message
      setToast({
        message: `Proposition ${
          status === "approuve" ? "approuvée" : "rejetée"
        } avec succès`,
        type: "success",
      });

      // Refresh the list
      fetchProposals();
    } catch (error) {
      console.error("Error processing event proposal:", error);
      setToast({
        message: "Erreur lors du traitement de la proposition",
        type: "error",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      en_attente: "bg-yellow-100 text-yellow-800",
      approuve: "bg-green-100 text-green-800",
      rejete: "bg-red-100 text-red-800",
    };

    const statusText = {
      en_attente: "En attente",
      approuve: "Approuvé",
      rejete: "Rejeté",
    };

    const className = statusMap[status] || "bg-gray-100 text-gray-800";
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}
      >
        {statusText[status] || status || "Inconnu"}
      </span>
    );
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="mb-4 flex flex-wrap gap-2">
            {["all", "en_attente", "approuve", "rejete"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {
                  {
                    all: "Tous",
                    en_attente: "En attente",
                    approuve: "Approuvés",
                    rejete: "Rejetés",
                  }[f]
                }
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tableau */}
      {proposals.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucune proposition trouvée</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proposeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
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
              {proposals.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {proposal.titre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {proposal.proposeur_nom}
                    </div>
                    <div className="text-sm text-gray-500">
                      {proposal.proposeur_email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(proposal.date_debut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {proposal.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(proposal.statut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewDetails(proposal)}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>

                      {proposal.statut === "en_attente" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedProposal(proposal);
                              setCommentaire("");
                            }}
                            className="text-green-600 hover:text-green-800"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProposal(proposal);
                              setCommentaire("");
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
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
      )}

      {/* Modal de traitement */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              Traiter la proposition
            </h3>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Commentaire (optionnel)"
              className="w-full p-3 border rounded-lg mb-4"
              rows="3"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={() => handleProcessProposal("rejete")}
                className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg"
              >
                Rejeter
              </button>
              <button
                onClick={() => handleProcessProposal("approuve")}
                className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg"
              >
                Approuver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Toast component */}
      {/* {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )} */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );
};

export default EventProposalsTable;
