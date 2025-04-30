import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import Cookies from "js-cookie";
import Toast from "../components/Toast";
import { Bell, Lock, LogOut, User, Camera, Edit2, Key, Shield, CheckCircle, MapPin, Phone, Mail } from 'lucide-react';

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    role: "",
    image_profil: null,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [toast, setToast] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const userEmail = Cookies.get("userEmail");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, notificationsResponse] = await Promise.all([
          api.get(`/utilisateurs?email=${userEmail}`),
          api.get(`/reservations?utilisateurEmail=${userEmail}`),
        ]);

        const utilisateur = userResponse.data.find(u => u.email === userEmail);
        
        if (!utilisateur) {
          throw new Error("Utilisateur non trouvé");
        }

        setUser(utilisateur);
        setFormData({
          nom: utilisateur.nom || "",
          email: utilisateur.email || "",
          telephone: utilisateur.telephone || "",
          adresse: utilisateur.adresse || "",
          role: utilisateur.role || "",
          image_profil: null,
        });

        setNotifications(notificationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setToast({
          message: "Erreur lors de la récupération des données",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image_profil: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await api.put(`/utilisateurs/${user.id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setToast({ message: "✨ Profil mis à jour avec succès!", type: "success" });
      setEditing(false);
      setUser(response.data);
    } catch (error) {
      setToast({
        message: "❌ Erreur lors de la mise à jour du profil",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ message: "❌ Les mots de passe ne correspondent pas", type: "error" });
      return;
    }

    setLoading(true);

    try {
      await api.put(`/utilisateurs/${user.id}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setToast({ message: "🔐 Mot de passe mis à jour avec succès!", type: "success" });
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "❌ Erreur lors de la mise à jour du mot de passe",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("userEmail");
    Cookies.remove("authToken");
    navigate("/login");
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Erreur</h2>
          <p className="mb-6">Aucun profil utilisateur trouvé.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)] transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "profile", icon: User, label: "Profil", emoji: "👤" },
    { id: "notifications", icon: Bell, label: "Notifications", emoji: "🔔" },
    { id: "security", icon: Lock, label: "Sécurité", emoji: "🔒" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">👋 Mon Compte</h1>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-[oklch(47.3%_0.137_46.201)] to-[oklch(57.3%_0.137_46.201)] text-white">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-white ring-4 ring-white/30 flex items-center justify-center overflow-hidden">
                    {user.image_profil ? (
                        <img 
                          src={`http://localhost:3000${user.image_profil}`} 
                          alt={user.nom} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-medium text-gray-700">
                          {user?.nom?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      )}
                    </div>
                    {editing && (
                      <label
                        htmlFor="image_profil"
                        className="absolute bottom-0 right-0 bg-white text-[oklch(47.3%_0.137_46.201)] p-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          id="image_profil"
                          name="image_profil"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{user.nom}</h2>
                    <p className="text-sm opacity-90">{user.email}</p>
                  </div>
                </div>
              </div>

              <nav className="p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                          activeTab === item.id
                            ? 'bg-[oklch(47.3%_0.137_46.201)] text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.emoji} {item.label}</span>
                        {item.id === "notifications" && notifications.length > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {notifications.length}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-4 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">✅ Compte vérifié</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.actif ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">📅 Membre depuis</span>
                    <span className="text-sm font-medium">
                      {new Date(user.date_creation).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">👤 Informations du profil</h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)] transition-all duration-200"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Modifier
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            nom: user.nom || "",
                            email: user.email || "",
                            telephone: user.telephone || "",
                            adresse: user.adresse || "",
                            role: user.role || "",
                            image_profil: null,
                          });
                          setImagePreview(null);
                        }}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)] transition-all duration-200"
                      >
                        Enregistrer
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          👤 Nom complet
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:border-transparent transition-colors"
                            required
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                            {user.nom}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ✉️ Email
                        </label>
                        {editing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:border-transparent transition-colors"
                            required
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                            {user.email}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          📱 Téléphone
                        </label>
                        {editing ? (
                          <input
                            type="tel"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:border-transparent transition-colors"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                            {user.telephone || "Non renseigné"}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          👑 Rôle
                        </label>
                        {editing ? (
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:border-transparent transition-colors"
                          >
                            <option value="client">👤 Client</option>
                            <option value="admin">👑 Administrateur</option>
                          </select>
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 capitalize">
                            {user.role === 'admin' ? '👑 Administrateur' : '👤 Client'}
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          📍 Adresse
                        </label>
                        {editing ? (
                          <textarea
                            name="adresse"
                            value={formData.adresse}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:border-transparent transition-colors"
                          ></textarea>
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                            {user.adresse || "Non renseignée"}
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">🔒 Sécurité du compte</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">🔑 Changer le mot de passe</h3>
                      {showPasswordForm ? (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe actuel
                              </label>
                              <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nouveau mot de passe
                              </label>
                              <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmer le nouveau mot de passe
                              </label>
                              <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:border-transparent transition-colors"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setShowPasswordForm(false)}
                              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            >
                              Annuler
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)] transition-all duration-200"
                            >
                              Enregistrer
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => setShowPasswordForm(true)}
                          className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(50%_0.137_46.201)] transition-all duration-200"
                        >
                          <Key className="h-4 w-4 inline-block mr-2" />
                          Changer le mot de passe
                        </button>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium mb-2">🛡️ Sécurité avancée</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              <Shield className="h-4 w-4 inline-block mr-2" />
                              Authentification à deux facteurs
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Ajoutez une couche de sécurité supplémentaire à votre compte
                            </p>
                          </div>
                          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200">
                            Activer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">🔔 Notifications</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div key={notification.id} className="p-4 hover:bg-gray-50 transition-all duration-200">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-1">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Bell className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium">{notification.titre}</h3>
                              <span className="text-xs text-gray-500">
                                {new Date(notification.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">📭 Aucune notification</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Vous n'avez aucune notification pour le moment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
