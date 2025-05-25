"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import Cookies from "js-cookie"
import Toast from "../components/Toast"
import {
  Bell,
  Lock,
  LogOut,
  User,
  Camera,
  Edit2,
  Key,
  Shield,
  CheckCircle,
  MapPin,
  Calendar,
  Star,
  Save,
  X,
} from "lucide-react"

export default function UserProfile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [events, setEvents] = useState([])
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    role: "",
    image_profil: null,
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [toast, setToast] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")
  const userEmail = Cookies.get("userEmail")
  const token = Cookies.get("authToken")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, notificationsResponse, eventsResponse] = await Promise.all([
          api.get(`/utilisateurs?email=${userEmail}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/reservations?utilisateurEmail=${userEmail}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/evenements", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const utilisateur = userResponse.data.find((u) => u.email === userEmail)

        if (!utilisateur) {
          throw new Error("Utilisateur non trouvé")
        }

        setUser(utilisateur)
        setFormData({
          nom: utilisateur.nom || "",
          email: utilisateur.email || "",
          telephone: utilisateur.telephone || "",
          adresse: utilisateur.adresse || "",
          role: utilisateur.role || "",
          image_profil: null,
        })

        setNotifications(notificationsResponse.data)
        setEvents(eventsResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        setToast({
          message: "Erreur lors de la récupération des données",
          type: "error",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userEmail, token])

  useEffect(() => {
    if (activeTab === "notifications" && notifications.some((notif) => !notif.is_read)) {
      markAllNotificationsAsRead()
    }
  }, [activeTab, notifications])

  const markAllNotificationsAsRead = async () => {
    try {
      await api.put(
        "/notification/mark-all-read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setNotifications(notifications.map((notif) => ({ ...notif, is_read: true })))
    } catch (error) {
      console.error("Error marking notifications as read:", error)
      setToast({
        message: "Erreur lors de la mise à jour des notifications",
        type: "error",
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image_profil: file,
      }))

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key])
        }
      })

      let response
      if (formData.image_profil) {
        response = await api.put(`/profile/me/image`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
      } else {
        const profileData = {
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          adresse: formData.adresse,
        }
        response = await api.put(`/profile/me`, profileData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      }

      setUser(response.data)
      setToast({ message: "Profil mis à jour avec succès!", type: "success" })
      setEditing(false)
    } catch (error) {
      console.error("Erreur de mise à jour:", error)
      setToast({
        message: error.response?.data?.message || "Erreur lors de la mise à jour du profil",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ message: "Les mots de passe ne correspondent pas", type: "error" })
      return
    }

    setLoading(true)

    try {
      await api.put(
        `/profile/me/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setToast({ message: "Mot de passe mis à jour avec succès!", type: "success" })
      setShowPasswordForm(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Erreur lors de la mise à jour du mot de passe",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Cookies.remove("userEmail")
    Cookies.remove("authToken")
    navigate("/")
  }

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-6">Aucun profil utilisateur trouvé.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#8B4513] text-white rounded-xl hover:bg-[#A0522D] transition-all duration-200 transform hover:scale-105"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  const navItems = [
    { id: "profile", icon: User, label: "Profil", color: "bg-[#8B4513]" },
    { id: "notifications", icon: Bell, label: "Notifications", color: "bg-[#8B4513]" },
    { id: "security", icon: Lock, label: "Sécurité", color: "bg-[#8B4513]" },
  ]

  const unreadNotificationsCount = notifications.filter((notif) => !notif.is_read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F5] via-[#F9F0E8] to-[#F0DCC5]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#8B4513] to-[#A0522D] rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8B4513] to-[#A0522D] bg-clip-text text-transparent">
              Mon Compte
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 sticky top-24">
              {/* Profile Header */}
              <div className="p-6 bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="relative group">
                      <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm ring-4 ring-white/30 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                        {imagePreview ? (
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt={user.nom}
                            className="h-full w-full object-cover rounded-xl"
                          />
                        ) : user.image_profil ? (
                          <img
                            src={`http://localhost:3000${user.image_profil}`}
                            alt={user.nom}
                            className="h-full w-full object-cover rounded-xl"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-white">
                            {user?.nom?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                      {editing && (
                        <label
                          htmlFor="image_profil"
                          className="absolute -bottom-2 -right-2 bg-white text-[#8B4513] p-2 rounded-xl cursor-pointer hover:bg-blue-50 transition-all duration-200 shadow-lg transform hover:scale-110"
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
                    <div className="flex-1">
                      <h2 className="font-bold text-xl">{user.nom}</h2>
                      <p className="text-white/90 text-sm">{user.email}</p>
                      <div className="flex items-center mt-2">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-sm capitalize">{user.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                          activeTab === item.id
                            ? "bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white shadow-lg transform scale-105"
                            : "hover:bg-gray-100 text-gray-700 hover:transform hover:scale-102"
                        }`}
                      >
                        <div className={`p-2 rounded-lg mr-3 ${activeTab === item.id ? "bg-white/20" : item.color}`}>
                          <item.icon className={`h-4 w-4 ${activeTab === item.id ? "text-white" : "text-white"}`} />
                        </div>
                        <span className="font-medium">{item.label}</span>
                        {item.id === "notifications" && unreadNotificationsCount > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                            {unreadNotificationsCount}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Status Info */}
              <div className="p-4 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Statut
                    </span>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Actif
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-[#8B4513]" />
                      Membre depuis
                    </span>
                    <span className="text-sm font-medium">{new Date(user.date_creation).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-[#FDF8F5] to-[#F9F0E8]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#8B4513] to-[#A0522D] rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Informations du profil</h2>
                  </div>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-xl hover:from-[#8B4513] hover:to-[#A0522D] transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Modifier
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setEditing(false)
                          setFormData({
                            nom: user.nom || "",
                            email: user.email || "",
                            telephone: user.telephone || "",
                            adresse: user.adresse || "",
                            role: user.role || "",
                            image_profil: null,
                          })
                          setImagePreview(null)
                        }}
                        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                      >
                        <X className="h-4 w-4 mr-2 inline" />
                        Annuler
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#CD853F] text-white rounded-xl hover:from-[#8B4513] hover:to-[#CD853F] transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        <Save className="h-4 w-4 mr-2 inline" />
                        Enregistrer
                      </button>
                    </div>
                  )}
                </div>

                {/* Form Content */}
                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-gradient-to-r from-[#FDF8F5] to-[#F9F0E8] p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <User className="w-5 h-5 mr-2 text-[#8B4513]" />
                        Informations personnelles
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                          {editing ? (
                            <input
                              type="text"
                              name="nom"
                              value={formData.nom}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                              required
                            />
                          ) : (
                            <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-800 border border-gray-200">
                              {user.nom}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          {editing ? (
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                              required
                            />
                          ) : (
                            <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-800 border border-gray-200">
                              {user.email}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                          {editing ? (
                            <input
                              type="tel"
                              name="telephone"
                              value={formData.telephone}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-800 border border-gray-200">
                              {user.telephone || "Non renseigné"}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Rôle</label>
                          {editing ? (
                            <select
                              name="role"
                              value={formData.role}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            >
                              <option value="client">Client</option>
                              <option value="admin">Administrateur</option>
                            </select>
                          ) : (
                            <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-800 border border-gray-200 capitalize">
                              {user.role === "admin" ? "Administrateur" : "Client"}
                            </div>
                          )}
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Adresse</label>
                          {editing ? (
                            <textarea
                              name="adresse"
                              value={formData.adresse}
                              onChange={handleChange}
                              rows="3"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            ></textarea>
                          ) : (
                            <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-800 border border-gray-200">
                              {user.adresse || "Non renseignée"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#F9F0E8] to-[#F0DCC5]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#8B4513] to-[#A0522D] rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {events.length > 0 ? (
                      events
                        .filter((event) => new Date(event.date_debut) > new Date())
                        .sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut))
                        .slice(0, 5)
                        .map((event) => (
                          <div
                            key={event.id}
                            className="flex items-start p-6 bg-gradient-to-r from-[#FDF8F5] to-[#F9F0E8] rounded-xl hover:from-[#F9F0E8] hover:to-[#F0DCC5] transition-all duration-200 transform hover:scale-102 border border-white/50"
                          >
                            <div className="flex-shrink-0">
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-[#8B4513] to-[#A0522D] flex items-center justify-center text-white shadow-lg">
                                <Calendar className="h-6 w-6" />
                              </div>
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-lg font-semibold text-gray-900">{event.titre}</h4>
                                <span className="text-sm text-gray-500 bg-white/80 px-3 py-1 rounded-full">
                                  {new Date(event.date_debut).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-600 mt-2">{event.description}</p>
                              <div className="mt-3 flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{event.type}</span>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bell className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">Aucun événement à venir</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#F0DCC5] to-[#E4C29D]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#8B4513] to-[#A0522D] rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Sécurité du compte</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-8">
                    {/* Password Change */}
                    <div className="bg-gradient-to-r from-[#FDF8F5] to-[#F9F0E8] p-6 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Key className="w-5 h-5 mr-2 text-[#8B4513]" />
                        Changer le mot de passe
                      </h3>
                      {showPasswordForm ? (
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
                              <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                              <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                required
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Confirmer le nouveau mot de passe
                              </label>
                              <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setShowPasswordForm(false)}
                              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                            >
                              Annuler
                            </button>
                            <button
                              type="submit"
                              className="px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#CD853F] text-white rounded-xl hover:from-[#8B4513] hover:to-[#CD853F] transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                              Enregistrer
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => setShowPasswordForm(true)}
                          className="flex items-center px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-xl hover:from-[#8B4513] hover:to-[#A0522D] transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          <Key className="h-4 w-4 mr-2" />
                          Changer le mot de passe
                        </button>
                      )}
                    </div>

                    {/* Advanced Security */}
                    <div className="bg-gradient-to-r from-[#F0DCC5] to-[#E4C29D] p-6 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-[#8B4513]" />
                        Sécurité avancée
                      </h3>
                      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium flex items-center">
                              <Shield className="h-4 w-4 mr-2 text-[#8B4513]" />
                              Authentification à deux facteurs
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Ajoutez une couche de sécurité supplémentaire à votre compte
                            </p>
                          </div>
                          <button className="px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-xl hover:from-[#8B4513] hover:to-[#A0522D] transition-all duration-200 transform hover:scale-105 shadow-lg">
                            Activer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
