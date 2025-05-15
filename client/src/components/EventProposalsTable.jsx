import React, { useState, useEffect } from "react";
import api from "../api";
import Toast from "./Toast";

const EventProposalsTable = ({ limit }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [commentaire, setCommentaire] = useState("");
  const [toast, setToast] = useState(null);
  // Ajout des états pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  // Compteurs pour le filtrage dynamique
  const statusCounts = proposals.reduce(
    (acc, proposal) => {
      acc.total++;
      acc[proposal.statut] = (acc[proposal.statut] || 0) + 1;
      return acc;
    },
    { total: 0, en_attente: 0, approuve: 0, rejete: 0 }
  );

  // Filter proposals based on search term and status
  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      searchTerm === "" ||
      (proposal.titre &&
        proposal.titre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (proposal.proposeur_nom &&
        proposal.proposeur_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (proposal.proposeur_email &&
        proposal.proposeur_email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filter === "all" || proposal.statut === filter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProposals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6e3d20]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2 items-center">
        <input
          type="text"
          placeholder="Rechercher..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] ml-0 sm:ml-2"
          value={filter}
          onChange={e => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">Tous les statuts ({statusCounts.total})</option>
          <option value="en_attente">En attente ({statusCounts.en_attente})</option>
          <option value="approuve">Approuvés ({statusCounts.approuve})</option>
          <option value="rejete">Rejetés ({statusCounts.rejete})</option>
        </select>
      </div>

      {/* Tableau */}
      {filteredProposals.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucune proposition trouvée</p>
        </div>
      ) : (
        <>
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
                {currentItems.map((proposal) => (
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
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#6e3d20]/10 text-[#6e3d20]">
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
                          className="text-gray-600 hover:text-[#6e3d20]"
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
          
          {/* Pagination */}
          {filteredProposals.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-4">
              {/* Affichage du texte indiquant la plage d'éléments affichés */}
              <div className="text-sm text-gray-500">
                Affichage de {indexOfFirstItem + 1} à{" "}
                {Math.min(indexOfLastItem, filteredProposals.length)} sur{" "}
                {filteredProposals.length} propositions
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
      )}

      {/* Modal de traitement */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 font-inter">
            <h3 className="text-xl font-bold mb-4 text-[#a94c0f]">
              Traiter la proposition
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
                onClick={() => handleProcessProposal('rejete')}
                className="rounded-lg px-6 py-2 font-semibold border-2 border-[#a94c0f] text-[#a94c0f] bg-white hover:bg-[#a94c0f] hover:text-white transition"
              >
                Rejeter
              </button>
              {selectedProposal?.statut !== 'rejete' && (
                <button
                  onClick={() => handleProcessProposal('approuve')}
                  className="rounded-lg px-6 py-2 font-semibold bg-[#a94c0f] text-white border-2 border-[#a94c0f] hover:bg-[#7a370b] hover:border-[#7a370b] transition"
                >
                  Approuver
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );
};

export default EventProposalsTable;