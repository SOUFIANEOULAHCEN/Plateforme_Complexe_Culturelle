"use client";

import { useState, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [toast, setToast] = useState(null); 
  const userRole = Cookies.get("userRole");
  const canDelete = userRole === "superadmin";

  useEffect(() => {
      fetchTalents();
    }, [limit]);

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
      // Ajout du toast pour indiquer le succès du chargement
      setToast({
        message: "Talents chargés avec succès",
        type: "success",
      });
    } catch (err) {
      console.error("Error fetching talents:", err);
      setError("Impossible de charger les talents");
      // Ajout du toast pour indiquer l'erreur
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
      // Ajout du toast pour indiquer le succès de la suppression
      setToast({
        message: "Talent supprimé avec succès",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting talent:", error);
      setError("Erreur lors de la suppression du talent");
      // Ajout du toast pour indiquer l'erreur lors de la suppression
      setToast({
        message: "Erreur lors de la suppression",
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
    // Ajout du toast pour indiquer le succès de l'ajout/modification
    setToast({
      message: editingTalentId ? "Talent modifié avec succès" : "Talent ajouté avec succès",
      type: "success",
    });
    setCurrentPage(1); // Reset to first page after adding/editing
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      actif: "bg-green-100 text-green-800",
      inactif: "bg-red-100 text-red-800",
      en_validation: "bg-yellow-100 text-yellow-800",
    };

    const statusText = {
      actif: "Actif",
      inactif: "Inactif",
      en_validation: "En validation",
    };

    const className = statusMap[status] || "bg-gray-100 text-gray-800";
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}
      >
        {statusText[status] || status || "N/A"}
      </span>
    );
  };

  // Filter talents based on search term and status
  const filteredTalents = talents.filter((talent) => {
    const matchesSearch =
      searchTerm === "" ||
      (talent.nom &&
        talent.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (talent.domaine_artiste &&
        talent.domaine_artiste
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "" || talent.statut_talent === statusFilter;

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    );
  }

  if (error && talents.length === 0) {
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="en_validation">En validation</option>
          </select>
        </div>
        {!limit && (
          <button
            onClick={handleAddTalent}
            className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
          >
            Ajouter un talent
          </button>
        )}
      </div>

      {filteredTalents.length === 0 ? (
        <div className="text-center py-8 border border-gray-200 rounded-lg bg-white">
          <p className="text-gray-500 mb-4">Aucun talent trouvé</p>
          
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
                    Domaine
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
                {currentItems.map((talent) => (
                  <tr key={talent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {talent.id}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewTalent(talent.id)}
                        className="text-[oklch(47.3%_0.137_46.201)] hover:text-[oklch(50%_0.137_46.201)] mr-3"
                      >
                        Détails
                      </button>
                      <button
                        onClick={() => handleEditTalent(talent.id)}
                        className="text-amber-600 hover:text-amber-900 mr-3"
                      >
                        Modifier
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteClick(talent.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredTalents.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-4">
              {/* Affichage du texte indiquant la plage d'éléments affichés */}
              <div className="text-sm text-gray-500 ">
                Affichage de {indexOfFirstItem + 1} à{" "}
                {Math.min(indexOfLastItem, filteredTalents.length)} sur{" "}
                {filteredTalents.length} talents
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
          Êtes-vous sûr de vouloir supprimer ce talent ? Cette action est
          irréversible.
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

      {/* Ajout du composant Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}