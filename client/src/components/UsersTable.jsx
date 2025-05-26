"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, Edit, Trash2, Search, Filter, ChevronUp, ChevronDown } from "lucide-react";
import Modal from "./Modal";
import api from "../api";
import Cookies from "js-cookie";
import UserForm from "./UserForm";
import UserDetails from "./UserDetails";
import Toast from "./Toast";

export default function UsersTable({ limit }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [viewingUserId, setViewingUserId] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("desc");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef();
  const userRole = Cookies.get("userRole");
  const canDelete = userRole === "superadmin";

  useEffect(() => {
    fetchUsers();
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/utilisateurs");
      let data = response.data;

      if (limit) {
        data = data.slice(0, limit);
      }

      setUsers(data);
      setError(null);
      setToast({
        message: "Utilisateurs chargés avec succès",
        type: "success",
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Impossible de charger les utilisateurs");
      setToast({
        message: "Erreur lors du chargement des utilisateurs",
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
      setUsers(users.filter((user) => user.id !== selectedId));
      setShowConfirmModal(false);
      setToast({
        message: "Utilisateur supprimé avec succès",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Erreur lors de la suppression de l'utilisateur");
      setToast({
        message: "Erreur lors de la suppression",
        type: "error",
      });
    }
  };

  const handleAddUser = () => {
    setEditingUserId(null);
    setShowUserForm(true);
  };

  const handleEditUser = (id) => {
    setEditingUserId(id);
    setShowUserForm(true);
  };

  const handleViewUser = (id) => {
    setViewingUserId(id);
    setShowUserDetails(true);
  };

  const handleUserFormSuccess = () => {
    fetchUsers();
    setCurrentPage(1);
  };

  const getRoleBadge = (user) => {
    if (user.is_talent) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200">
          Talent
        </span>
      );
    }

    const role = user.role;
    const roleMap = {
      utilisateur: "bg-blue-50 text-blue-700 border-blue-200",
      admin: "bg-purple-50 text-purple-700 border-purple-200",
      superadmin: "bg-red-50 text-red-700 border-red-200",
    };

    const roleText = {
      utilisateur: "Utilisateur",
      admin: "Admin",
      superadmin: "Super Admin",
    };

    const className = roleMap[role] || "bg-gray-50 text-gray-700 border-gray-200";
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
        {roleText[role] || role || "N/A"}
      </span>
    );
  };

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      (user.nom && user.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === "" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[oklch(47.3%_0.137_46.201)] border-t-transparent"></div>
      </div>
    );
  }

  if (error && users.length === 0) {
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
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">Tous les rôles</option>
              <option value="utilisateur">Utilisateur</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
        </div>
        {!limit && (
          <button
            onClick={handleAddUser}
            className="px-4 py-2.5 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg shadow hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
          >
            Ajouter un utilisateur
          </button>
        )}
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-4">Aucun utilisateur trouvé</p>
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
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {currentItems.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewUser(user.id)}
                            className="p-2 text-gray-400 hover:text-[oklch(47.3%_0.137_46.201)] hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {canDelete && user.id !== parseInt(Cookies.get("userId"), 10) && (
                            <button
                              onClick={() => handleDeleteClick(user.id)}
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

          {filteredUsers.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-6 px-2">
              <div className="text-sm text-gray-600">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredUsers.length)} sur{" "}
                {filteredUsers.length} utilisateurs
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
          Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
        </p>
      </Modal>

      <UserForm
        isOpen={showUserForm}
        onClose={() => setShowUserForm(false)}
        userId={editingUserId}
        onSuccess={handleUserFormSuccess}
      />

      <UserDetails
        isOpen={showUserDetails}
        onClose={() => setShowUserDetails(false)}
        userId={viewingUserId}
        onEdit={handleEditUser}
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