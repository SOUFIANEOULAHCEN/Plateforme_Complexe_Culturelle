"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, Edit, Trash2, Search, Filter, ChevronUp, ChevronDown } from "lucide-react";
import Modal from "./Modal";
import api from "../api";
import Cookies from "js-cookie";
import TalentForm from "./TalentForm";
import TalentDetails from "./TalentDetails";
import Toast from "./Toast";

export default function TalentsTable({ limit }) {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showTalentForm, setShowTalentForm] = useState(false);
  const [showTalentDetails, setShowTalentDetails] = useState(false);
  const [editingTalentId, setEditingTalentId] = useState(null);
  const [viewingTalentId, setViewingTalentId] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("desc");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef();
  const userRole = Cookies.get("userRole");
  const canDelete = userRole === "superadmin";

  useEffect(() => {
    fetchTalents();
  }, [limit]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchTalents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/utilisateurs?is_talent=true");
      let data = response.data;

      if (limit) {
        data = data.slice(0, limit);
      }

      setTalents(data);
      setError(null);
      setToast({
        message: "Talents chargés avec succès",
        type: "success",
      });
    } catch (err) {
      console.error("Error fetching talents:", err);
      setError("Impossible de charger les talents");
      setToast({
        message: "Erreur lors du chargement des talents",
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
      await api.delete(`/utilisateurs/${selectedId}`);
      setTalents(talents.filter((talent) => talent.id !== selectedId));
      setShowConfirmModal(false);
      setToast({
        message: "Talent supprimé avec succès",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting talent:", error);
      let errorMessage = "Erreur lors de la suppression du talent";
      
      if (error.response) {
        switch (error.response.status) {
          case 403:
            errorMessage = error.response.data.message || "Vous n'avez pas les droits pour effectuer cette action";
            break;
          case 404:
            errorMessage = "Le talent n'existe plus";
            break;
          case 500:
            errorMessage = "Une erreur est survenue lors de la suppression. Veuillez réessayer plus tard.";
            break;
          default:
            errorMessage = error.response.data.message || "Une erreur est survenue";
        }
      }
      
      setToast({
        message: errorMessage,
        type: "error",
      });
    }
  };

  const handleAddTalent = () => {
    setEditingTalentId(null);
    setShowTalentForm(true);
  };

  const handleEditTalent = (id) => {
    setEditingTalentId(id);
    setShowTalentForm(true);
  };

  const handleViewTalent = (id) => {
    setViewingTalentId(id);
    setShowTalentDetails(true);
  };

  const handleTalentFormSuccess = () => {
    fetchTalents();
    setToast({
      message: editingTalentId
        ? "Talent modifié avec succès"
        : "Talent ajouté avec succès",
      type: "success",
    });
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      actif: "bg-green-50 text-green-700 border-green-200",
      inactif: "bg-red-50 text-red-700 border-red-200",
      en_validation: "bg-yellow-50 text-yellow-700 border-yellow-200",
    };

    const statusText = {
      actif: "Actif",
      inactif: "Inactif",
      en_validation: "En validation",
    };

    const className = statusMap[status] || "bg-gray-50 text-gray-700 border-gray-200";
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
        {statusText[status] || status || "N/A"}
      </span>
    );
  };

  // Filter talents based on search term and status
  const filteredTalents = talents.filter((talent) => {
    const matchesSearch =
      searchTerm === "" ||
      (talent.nom && talent.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (talent.domaine_artiste && talent.domaine_artiste.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "" || talent.statut_talent === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTalents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTalents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[oklch(47.3%_0.137_46.201)] border-t-transparent"></div>
      </div>
    );
  }

  if (error && talents.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-4">
        <p>{error}</p>
      </div>
    );
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="en_validation">En validation</option>
            </select>
          </div>
        </div>
        {!limit && (
          <button
            onClick={handleAddTalent}
            className="px-4 py-2.5 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
          >
            Ajouter un talent
          </button>
        )}
      </div>

      {filteredTalents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-4">Aucun talent trouvé</p>
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
                      Domaine
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
                  {currentItems.map((talent) => (
                    <tr key={talent.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{talent.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {talent.nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {talent.domaine_artiste || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(talent.statut_talent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewTalent(talent.id)}
                            className="p-2 text-gray-400 hover:text-[oklch(47.3%_0.137_46.201)] hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditTalent(talent.id)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteClick(talent.id)}
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

          {filteredTalents.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-6 px-2">
              <div className="text-sm text-gray-600">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredTalents.length)} sur{" "}
                {filteredTalents.length} talents
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
          Êtes-vous sûr de vouloir supprimer ce talent ? Cette action est irréversible.
        </p>
      </Modal>

      <TalentForm
        isOpen={showTalentForm}
        onClose={() => setShowTalentForm(false)}
        talentId={editingTalentId}
        onSuccess={handleTalentFormSuccess}
      />

      <TalentDetails
        isOpen={showTalentDetails}
        onClose={() => setShowTalentDetails(false)}
        talentId={viewingTalentId}
        onEdit={handleEditTalent}
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