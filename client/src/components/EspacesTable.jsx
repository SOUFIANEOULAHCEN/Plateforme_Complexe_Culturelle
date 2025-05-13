"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import api from "../api";
import Cookies from "js-cookie";
import EspaceForm from "./EspaceForm";
import EspaceDetails from "./EspaceDetails";
import Toast from "./Toast";

export default function EspacesTable({ limit }) {
  const [espaces, setEspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showEspaceForm, setShowEspaceForm] = useState(false);
  const [showEspaceDetails, setShowEspaceDetails] = useState(false);
  const [editingEspace, setEditingEspace] = useState(null);
  const [viewingEspace, setViewingEspace] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const userRole = Cookies.get("userRole");
  const canDelete = userRole === "superadmin";
  const allTypes = Array.from(new Set(espaces.map(e => e.type).filter(Boolean)));
   // Ajout des états pour la pagination


  useEffect(() => {
    fetchEspaces();
  }, [limit]);

  const fetchEspaces = async () => {
    setLoading(true);
    try {
      const response = await api.get("/espaces");
      let data = response.data;

      if (limit) {
        data = data.slice(0, limit);
      }

      setEspaces(data);
      setError(null);
      setToast({
        message: "Espaces chargés avec succès",
        type: "success",
      });
    } catch (err) {
      console.error("Error fetching espaces:", err);
      setError("Impossible de charger les espaces");
      setToast({
        message: "Erreur lors du chargement des espaces",
        type: "error",
      });
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
      await api.delete(`/espaces/${selectedId}`);
      setEspaces(espaces.filter((espace) => espace.id !== selectedId));
      setShowConfirmModal(false);
      setToast({
        message: "Espace supprimé avec succès",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting espace:", error);
      setError("Erreur lors de la suppression de l'espace");
      setToast({
        message: "Erreur lors de la suppression",
        type: "error",
      });
    }
  };

  const handleAddEspace = () => {
    setEditingEspace(null);
    setShowEspaceForm(true);
  };

  const handleEditEspace = (espace) => {
    setEditingEspace(espace);
    setShowEspaceForm(true);
  };

  const handleViewEspace = (espace) => {
    setViewingEspace(espace);
    setShowEspaceDetails(true);
  };

  const handleEspaceFormSuccess = () => {
    fetchEspaces();
    setCurrentPage(1); // Reset to first page after adding/editing
  };

  // Générer dynamiquement les couleurs pour chaque type
  const typeColors = {
    salle: "bg-blue-100 text-blue-800",
    atelier: "bg-green-100 text-green-800",
    exposition: "bg-yellow-100 text-yellow-800",
    cinéma: "bg-purple-100 text-purple-800",
    theatre: "bg-pink-100 text-pink-800",
    // Ajoute ici d'autres types si besoin
  };

  // Générer dynamiquement le texte affiché pour chaque type
  const typeLabels = {
    salle: "Salle",
    atelier: "Atelier",
    exposition: "Exposition",
    cinéma: "Cinéma",
    theatre: "Théâtre",
    // Ajoute ici d'autres types si besoin
  };

  const getTypeBadge = (type) => {
    const className = typeColors[type] || "bg-gray-100 text-gray-800";
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}
      >
        {typeLabels[type] || (type ? type.charAt(0).toUpperCase() + type.slice(1) : "N/A")}
      </span>
    );
  };

  // Filter espaces based on search term and type
  const filteredEspaces = espaces.filter((espace) => {
    const matchesSearch =
      searchTerm === "" ||
      (espace.nom &&
        espace.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (espace.description &&
        espace.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === "" || espace.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEspaces.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEspaces.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    );
  }

  if (error && espaces.length === 0) {
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Tous les types</option>
            {allTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {!limit && (
          <button
            onClick={handleAddEspace}
            className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
          >
            Ajouter un espace
          </button>
        )}
      </div>

      {filteredEspaces.length === 0 ? (
        <div className="text-center py-8 border border-gray-200 rounded-lg bg-white">
          <p className="text-gray-500 mb-4">Aucun espace trouvé</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((espace) => (
                  <tr key={espace.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {espace.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {espace.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(espace.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {espace.capacite || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewEspace(espace)}
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
                        onClick={() => handleEditEspace(espace)}
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
                          onClick={() => handleDeleteClick(espace.id)}
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

          {/* Pagination */}
          {filteredEspaces.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-4">
              {/* Affichage du texte indiquant la plage d'éléments affichés */}
              <div className="text-sm text-gray-500">
                Affichage de {indexOfFirstItem + 1} à{" "}
                {Math.min(indexOfLastItem, filteredEspaces.length)} sur{" "}
                {filteredEspaces.length} espaces
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
          Êtes-vous sûr de vouloir supprimer cet espace ? Cette action est
          irréversible.
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
          setShowEspaceDetails(false);
          setEditingEspace(viewingEspace);
          setShowEspaceForm(true);
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
