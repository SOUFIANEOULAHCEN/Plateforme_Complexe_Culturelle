"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import api from "../api";
import Cookies from "js-cookie";
import CommentaireForm from "./CommentaireForm";
import CommentaireDetails from "./CommentaireDetails";
import Toast from "./Toast";

export default function CommentairesTable({ limit, evenementId = null }) {
  const [commentaires, setCommentaires] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [noteFilter, setNoteFilter] = useState("");
  const [showCommentaireForm, setShowCommentaireForm] = useState(false);
  const [showCommentaireDetails, setShowCommentaireDetails] = useState(false);
  const [editingCommentaire, setEditingCommentaire] = useState(null);
  const [viewingCommentaire, setViewingCommentaire] = useState(null);
  const [toast, setToast] = useState(null);
  const userRole = Cookies.get("userRole");
  const canDelete = userRole === "superadmin" || userRole === "admin";

  useEffect(() => {
    fetchAllData();
  }, [limit, evenementId]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Construire l'URL avec le filtre d'événement optionnel
      const url = evenementId
        ? `/commentaires?evenement_id=${evenementId}`
        : "/commentaires";

      // Récupérer toutes les données en parallèle
      const [commentairesRes, eventsRes, usersRes] = await Promise.all([
        api.get(url),
        api.get("/evenements"),
        api.get("/utilisateurs"),
      ]);

      let commentairesData = commentairesRes.data;

      if (limit) {
        commentairesData = commentairesData.slice(0, limit);
      }

      setCommentaires(commentairesData);
      setEvents(eventsRes.data);
      setUsers(usersRes.data);
      setError(null);
      setToast({
        message: "Commentaires chargés avec succès",
        type: "success",
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir le titre de l'événement par ID
  const getEventTitle = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    return event ? event.titre : "N/A";
  };

  // Fonction pour obtenir le nom de l'utilisateur par ID
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.nom : "N/A";
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/commentaires/${selectedId}`);
      setCommentaires(
        commentaires.filter((commentaire) => commentaire.id !== selectedId)
      );
      setShowConfirmModal(false);
      setToast({
        message: "Commentaire supprimé avec succès",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting commentaire:", error);
      setError("Erreur lors de la suppression du commentaire");
      setToast({
        message: "Erreur lors de la suppression",
        type: "error",
      });
    }
  };

  const handleAddCommentaire = () => {
    setEditingCommentaire(null);
    setShowCommentaireForm(true);
  };

  const handleEditCommentaire = (commentaire) => {
    setEditingCommentaire(commentaire);
    setShowCommentaireForm(true);
  };

  const handleViewCommentaire = (commentaire) => {
    // Créer un objet commentaire amélioré avec tous les détails nécessaires
    const enhancedCommentaire = {
      ...commentaire,
      evenement_titre: getEventTitle(commentaire.evenement_id),
      utilisateur_nom: getUserName(commentaire.utilisateur_id),
    };
    setViewingCommentaire(enhancedCommentaire);
    setShowCommentaireDetails(true);
  };

  const handleCommentaireFormSuccess = () => {
    fetchAllData();
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

  const getNoteBadge = (note) => {
    if (!note) return null;

    const noteMap = {
      1: "bg-red-100 text-red-800",
      2: "bg-orange-100 text-orange-800",
      3: "bg-yellow-100 text-yellow-800",
      4: "bg-lime-100 text-lime-800",
      5: "bg-green-100 text-green-800",
    };

    const className = noteMap[note] || "bg-gray-100 text-gray-800";
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}
      >
        {note} {note > 1 ? "étoiles" : "étoile"}
      </span>
    );
  };

  // Filtrer les commentaires en fonction du terme de recherche et de la note
  const filteredCommentaires = commentaires.filter((commentaire) => {
    const eventTitle = getEventTitle(commentaire.evenement_id);
    const userName = getUserName(commentaire.utilisateur_id);

    const matchesSearch =
      searchTerm === "" ||
      (commentaire.contenu &&
        commentaire.contenu.toLowerCase().includes(searchTerm.toLowerCase())) ||
      eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesNote =
      noteFilter === "" ||
      (commentaire.note && commentaire.note.toString() === noteFilter);

    return matchesSearch && matchesNote;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    );
  }

  if (error && commentaires.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  if (filteredCommentaires.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Aucun commentaire trouvé</p>
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
            value={noteFilter}
            onChange={(e) => setNoteFilter(e.target.value)}
          >
            <option value="">Toutes les notes</option>
            <option value="1">1 étoile</option>
            <option value="2">2 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="5">5 étoiles</option>
          </select>
        </div>
        {!limit && (
          <button
            onClick={handleAddCommentaire}
            className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
          >
            Ajouter un commentaire
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Événement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Note
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCommentaires.map((commentaire) => (
              <tr key={commentaire.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {commentaire.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {getEventTitle(commentaire.evenement_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getUserName(commentaire.utilisateur_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(commentaire.date_creation)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {commentaire.note
                    ? getNoteBadge(commentaire.note)
                    : "Sans note"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewCommentaire(commentaire)}
                    className="text-[oklch(47.3%_0.137_46.201)] hover:text-[oklch(50%_0.137_46.201)] mr-3"
                  >
                    Détails
                  </button>
                  <button
                    onClick={() => handleEditCommentaire(commentaire)}
                    className="text-amber-600 hover:text-amber-900 mr-3"
                  >
                    Modifier
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => handleDeleteClick(commentaire.id)}
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
          Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est
          irréversible.
        </p>
      </Modal>

      <CommentaireForm
        isOpen={showCommentaireForm}
        onClose={() => setShowCommentaireForm(false)}
        commentaire={editingCommentaire}
        onSuccess={handleCommentaireFormSuccess}
        events={events}
        users={users}
        evenementId={evenementId}
      />

      <CommentaireDetails
        isOpen={showCommentaireDetails}
        onClose={() => setShowCommentaireDetails(false)}
        commentaire={viewingCommentaire}
        onEdit={() => {
          setShowCommentaireDetails(false);
          setEditingCommentaire(viewingCommentaire);
          setShowCommentaireForm(true);
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
