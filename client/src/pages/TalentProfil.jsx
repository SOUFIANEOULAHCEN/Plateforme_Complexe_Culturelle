"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import Cookies from "js-cookie"
import Toast from "../components/Toast"
import {
  Lock,
  LogOut,
  User,
  Camera,
  Edit2,
  Key,
  Shield,
  Briefcase,
  Award,
  FileText,
  Plus,
  Trash2,
  Save,
  X,
  CheckCircle,
  Calendar,
  Star,
  Globe,
  Download,
} from "lucide-react"

export default function TalentProfile() {
  const navigate = useNavigate()
  const [talent, setTalent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    domaine_artiste: "",
    description_talent: "",
    specialite: "",
    annees_experience: "",
    competences: "",
    disponibilites: "",
    reseaux_sociaux: {},
    experience: [],
    cv: null,
    image_profil: null,
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [toast, setToast] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [cvPreview, setCvPreview] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")
  const userEmail = Cookies.get("userEmail")

  const fetchTalentData = async () => {
    try {
      const response = await api.get(`/talent?email=${userEmail}`)
      const user = response.data

      if (!user) throw new Error("Talent non trouvé")

      const userWithExperience = {
        ...user,
        experience: Array.isArray(user.experience)
          ? user.experience
          : typeof user.experience === "string"
            ? JSON.parse(user.experience || "[]")
            : [],
        reseaux_sociaux:
          user.reseaux_sociaux && typeof user.reseaux_sociaux === "object"
            ? user.reseaux_sociaux
            : typeof user.reseaux_sociaux === "string" && user.reseaux_sociaux !== ""
              ? JSON.parse(user.reseaux_sociaux)
              : {},
      }

      setTalent(userWithExperience)
      setFormData({
        nom: user.nom || "",
        email: user.email || "",
        telephone: user.telephone || "",
        adresse: user.adresse || "",
        domaine_artiste: user.domaine_artiste || "",
        description_talent: user.description_talent || "",
        specialite: user.specialite || "",
        annees_experience: user.annees_experience || "",
        competences: user.competences || "",
        disponibilites: user.disponibilites || "",
        reseaux_sociaux:
          user.reseaux_sociaux && typeof user.reseaux_sociaux === "object"
            ? user.reseaux_sociaux
            : typeof user.reseaux_sociaux === "string" && user.reseaux_sociaux !== ""
              ? JSON.parse(user.reseaux_sociaux)
              : {},
        experience: Array.isArray(user.experience)
          ? user.experience
          : typeof user.experience === "string"
            ? JSON.parse(user.experience || "[]")
            : [],
        cv: null,
        image_profil: null,
      })
    } catch (error) {
      setToast({ message: "Erreur lors de la récupération des données", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTalentData()
  }, [userEmail])

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCvChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.includes('pdf') && !file.type.includes('doc') && !file.type.includes('docx')) {
        setToast({ message: "Le fichier doit être au format PDF ou DOC", type: "error" })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setToast({ message: "Le fichier ne doit pas dépasser 5MB", type: "error" })
        return
      }
      setFormData((prev) => ({ ...prev, cv: file }))
      const reader = new FileReader()
      reader.onloadend = () => setCvPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const downloadCV = async () => {
    try {
      const token = Cookies.get("token")
      const response = await api.get(`/talent/${talent.id}/cv`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `CV_${talent.nom}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      setToast({ message: "Erreur lors du téléchargement du CV", type: "error" })
    }
  }

  const handleSocialMediaChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      reseaux_sociaux: { ...prev.reseaux_sociaux, [platform]: value },
    }))
  }

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    setFormData((prev) => ({ ...prev, experience: newExperience }))
  }

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      const token = Cookies.get("token")

      formDataToSend.append("nom", formData.nom)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("telephone", formData.telephone)
      formDataToSend.append("domaine_artiste", formData.domaine_artiste)
      formDataToSend.append("description_talent", formData.description_talent)
      formDataToSend.append("specialite", formData.specialite)
      formDataToSend.append("annees_experience", formData.annees_experience)
      formDataToSend.append("competences", formData.competences)
      formDataToSend.append("disponibilites", formData.disponibilites)

      formDataToSend.append("reseaux_sociaux", JSON.stringify(formData.reseaux_sociaux))
      formDataToSend.append("experience", JSON.stringify(formData.experience))

      if (formData.image_profil) {
        formDataToSend.append("image_profil", formData.image_profil)
      }
      if (formData.cv instanceof File) {
        formDataToSend.append("cv", formData.cv)
      }

      const response = await api.put(`/talent/${talent.id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      setToast({ message: "Profil mis à jour avec succès!", type: "success" })
      setEditing(false)
      await fetchTalentData()

      if (talent.image_profil) {
        setTalent((prev) => ({
          ...prev,
          image_profil: prev.image_profil + "?t=" + new Date().getTime(),
        }))
      }
    } catch (error) {
      console.error("Erreur détaillée:", error)
      setToast({
        message: error.response?.data?.message || error.message || "Erreur lors de la mise à jour",
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
      await api.put(`/talent/${talent.id}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      setToast({ message: "Mot de passe mis à jour!", type: "success" })
      setShowPasswordForm(false)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Erreur lors de la mise à jour",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image_profil: file }))
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          poste: "",
          entreprise: "",
          duree: "",
          description: "",
        },
      ],
    }))
  }

  const handleLogout = () => {
    Cookies.remove("userEmail")
    Cookies.remove("authToken")
    navigate("/")
  }

  if (loading && !talent) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#FDF8F5] to-[#F9F0E8]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#8B4513]/20 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#8B4513] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF8F5] to-[#F9F0E8] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-6">Aucun profil talent trouvé.</p>
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

  const socialMediaPlatforms = [
    { id: "facebook", name: "Facebook", icon: "📘" },
    { id: "instagram", name: "Instagram", icon: "📸" },
    { id: "twitter", name: "Twitter", icon: "🐦" },
    { id: "linkedin", name: "LinkedIn", icon: "💼" },
  ]

  const navItems = [
    { id: "profile", icon: User, label: "Profil", color: "bg-[#8B4513]" },
    { id: "security", icon: Lock, label: "Sécurité", color: "bg-[#8B4513]" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F5] via-[#F9F0E8] to-[#F0DCC5]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] bg-clip-text text-transparent">
              Mon Compte Talent
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
                        <img
                          src={
                            imagePreview ||
                            (talent.image_profil
                              ? talent.image_profil.startsWith("http")
                                ? talent.image_profil
                                : `http://localhost:3000${talent.image_profil}`
                              : "/default-avatar.png")
                          }
                          alt={talent.nom}
                          className="h-full w-full object-cover rounded-xl"
                        />
                      </div>
                      {editing && (
                        <label
                          htmlFor="image_profil"
                          className="absolute -bottom-2 -right-2 bg-white text-[#8B4513] p-2 rounded-xl cursor-pointer hover:bg-[#FDF8F5] transition-all duration-200 shadow-lg transform hover:scale-110"
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
                      <h2 className="font-bold text-xl">{talent.nom}</h2>
                      <p className="text-white/90 text-sm">{talent.email}</p>
                      <div className="flex items-center mt-2">
                        <Award className="w-4 h-4 mr-1" />
                        <span className="text-sm">{talent.domaine_artiste || "Artiste"}</span>
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
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        talent.statut_talent === "actif"
                          ? "bg-green-100 text-green-800"
                          : talent.statut_talent === "inactif"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {talent.statut_talent === "actif"
                        ? "Actif"
                        : talent.statut_talent === "inactif"
                          ? "Inactif"
                          : "En validation"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-[#8B4513]" />
                      Membre depuis
                    </span>
                    <span className="text-sm font-medium">
                      {new Date(talent.date_inscription).toLocaleDateString()}
                    </span>
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
                    <div className="w-10 h-10 bg-[#8B4513] rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Profil Talent</h2>
                  </div>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-xl hover:from-[#A0522D] hover:to-[#CD853F] transition-all duration-200 transform hover:scale-105 shadow-lg"
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
                            nom: talent.nom || "",
                            email: talent.email || "",
                            telephone: talent.telephone || "",
                            adresse: talent.adresse || "",
                            domaine_artiste: talent.domaine_artiste || "",
                            description_talent: talent.description_talent || "",
                            specialite: talent.specialite || "",
                            annees_experience: talent.annees_experience || "",
                            competences: talent.competences || "",
                            disponibilites: talent.disponibilites || "",
                            reseaux_sociaux:
                              talent.reseaux_sociaux && typeof talent.reseaux_sociaux === "object"
                                ? talent.reseaux_sociaux
                                : typeof talent.reseaux_sociaux === "string" && talent.reseaux_sociaux !== ""
                                  ? JSON.parse(talent.reseaux_sociaux)
                                  : {},
                            experience: Array.isArray(talent.experience)
                              ? talent.experience
                              : typeof talent.experience === "string"
                                ? JSON.parse(talent.experience || "[]")
                                : [],
                            cv: null,
                            image_profil: null,
                          })
                          setImagePreview(null)
                          setCvPreview(null)
                        }}
                        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                      >
                        <X className="h-4 w-4 mr-2 inline" />
                        Annuler
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#CD853F] text-white rounded-xl hover:from-[#A0522D] hover:to-[#D4A373] transition-all duration-200 transform hover:scale-105 shadow-lg"
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
                    {/* Personal Information */}
                    <div className="bg-gradient-to-r from-[#FDF8F5] to-[#F9F0E8] p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
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
                              {talent.nom}
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
                              {talent.email}
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
                              pattern="^[+]?[0-9\\s-]{7,19}$"
                              title="Format : 0123456789 ou +33 1 23 45 67 89"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-800 border border-gray-200">
                              {talent.telephone || "Non renseigné"}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Domaine artistique</label>
                          {editing ? (
                            <input
                              type="text"
                              name="domaine_artiste"
                              value={formData.domaine_artiste}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-800 border border-gray-200">
                              {talent.domaine_artiste || "Non renseigné"}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Spécialité</label>
                          {editing ? (
                            <input
                              type="text"
                              name="specialite"
                              value={formData.specialite}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-800 border border-gray-200">
                              {talent.specialite || "Non renseigné"}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Années d'expérience</label>
                          {editing ? (
                            <input
                              type="number"
                              name="annees_experience"
                              value={formData.annees_experience}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-800 border border-gray-200">
                              {talent.annees_experience || "Non renseigné"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-gradient-to-r from-[#F9F0E8] to-[#F0DCC5] p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-[#8B4513]" />
                        Informations professionnelles
                      </h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Description du talent</label>
                          {editing ? (
                            <textarea
                              name="description_talent"
                              value={formData.description_talent}
                              onChange={handleChange}
                              rows="4"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                              placeholder="Décrivez votre talent et votre style artistique"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-800 border border-gray-200 whitespace-pre-line">
                              {talent.description_talent || "Aucune description renseignée"}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Compétences</label>
                          {editing ? (
                            <textarea
                              name="competences"
                              value={formData.competences}
                              onChange={handleChange}
                              rows="3"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                              placeholder="Listez vos compétences, séparées par des virgules"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-800 border border-gray-200 whitespace-pre-line">
                              {talent.competences || "Aucune compétence renseignée"}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Disponibilités</label>
                          {editing ? (
                            <textarea
                              name="disponibilites"
                              value={formData.disponibilites}
                              onChange={handleChange}
                              rows="3"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                              placeholder="Décrivez vos disponibilités"
                            />
                          ) : (
                            <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-800 border border-gray-200 whitespace-pre-line">
                              {talent.disponibilites || "Aucune disponibilité renseignée"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-gradient-to-r from-[#F0DCC5] to-[#E4C29D] p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Globe className="w-5 h-5 mr-2 text-[#8B4513]" />
                        Réseaux sociaux
                      </h3>
                      {editing ? (
                        <div className="space-y-4">
                          {socialMediaPlatforms.map((platform) => (
                            <div key={platform.id} className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm">
                                {platform.icon}
                              </div>
                              <input
                                type="text"
                                value={formData.reseaux_sociaux[platform.id] || ""}
                                onChange={(e) => handleSocialMediaChange(platform.id, e.target.value)}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                placeholder={`Lien ${platform.name}`}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200">
                          {Object.keys(talent.reseaux_sociaux || {}).length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                              {socialMediaPlatforms.map(
                                (platform) =>
                                  talent.reseaux_sociaux[platform.id] && (
                                    <a
                                      key={platform.id}
                                      href={talent.reseaux_sociaux[platform.id]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center px-4 py-2 bg-gradient-to-r from-[#F9F0E8] to-[#F0DCC5] rounded-xl hover:from-[#F0DCC5] hover:to-[#E4C29D] transition-all duration-200 transform hover:scale-105"
                                    >
                                      <span className="mr-2">{platform.icon}</span>
                                      <span className="text-sm font-medium">{platform.name}</span>
                                    </a>
                                  ),
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-800">Aucun réseau social renseigné</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Experience */}
                    <div className="bg-gradient-to-r from-[#E4C29D] to-[#D4A373] p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-[#8B4513]" />
                        Expérience professionnelle
                      </h3>
                      {editing ? (
                        <div className="space-y-6">
                          {formData.experience.map((exp, index) => (
                            <div
                              key={index}
                              className="p-6 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                  <label className="block text-xs font-medium text-gray-500">Poste</label>
                                  <input
                                    type="text"
                                    value={exp.poste || ""}
                                    onChange={(e) => handleExperienceChange(index, "poste", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-xs font-medium text-gray-500">Entreprise</label>
                                  <input
                                    type="text"
                                    value={exp.entreprise || ""}
                                    onChange={(e) => handleExperienceChange(index, "entreprise", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="block text-xs font-medium text-gray-500">Durée</label>
                                  <input
                                    type="text"
                                    value={exp.duree || ""}
                                    onChange={(e) => handleExperienceChange(index, "duree", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200"
                                    placeholder="Ex: 2018-2020"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2 mb-4">
                                <label className="block text-xs font-medium text-gray-500">Description</label>
                                <textarea
                                  value={exp.description || ""}
                                  onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                                  rows="2"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition-all duration-200"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                className="flex items-center text-red-500 text-sm hover:text-red-700 transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Supprimer
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addExperience}
                            className="flex items-center px-4 py-3 text-sm bg-gradient-to-r from-[#F9F0E8] to-[#F0DCC5] hover:from-[#F0DCC5] hover:to-[#E4C29D] rounded-xl transition-all duration-200 transform hover:scale-105"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter une expérience
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {Array.isArray(talent.experience) && talent.experience.length > 0 ? (
                            talent.experience.map((exp, index) => (
                              <div
                                key={index}
                                className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-lg text-gray-900">{exp.poste}</h4>
                                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {exp.duree}
                                  </span>
                                </div>
                                <p className="text-gray-600 font-medium mb-2">{exp.entreprise}</p>
                                {exp.description && (
                                  <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-800 border border-gray-200">
                              Aucune expérience renseignée
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CV Upload */}
                    <div className="bg-gradient-to-r from-[#D4A373] to-[#FDF8F5] p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-[#8B4513]" />
                        Curriculum Vitae
                      </h3>
                      {editing ? (
                        <div className="space-y-4">
                          <input
                            type="file"
                            id="cv"
                            name="cv"
                            accept=".pdf,.doc,.docx"
                            onChange={handleCvChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="cv"
                            className="inline-flex items-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#8B4513] hover:bg-[#FDF8F5] transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          >
                            <FileText className="w-5 h-5 mr-2 text-gray-500" />
                            Choisir un fichier CV
                          </label>
                          {formData.cv?.name && (
                            <div className="flex items-center space-x-2 text-sm text-gray-700 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200">
                              <FileText className="w-4 h-4 text-[#8B4513]" />
                              <span>{formData.cv.name}</span>
                            </div>
                          )}
                        </div>
                      ) : talent.cv ? (
                        <button
                          onClick={downloadCV}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-xl hover:from-[#A0522D] hover:to-[#CD853F] transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger le CV
                        </button>
                      ) : (
                        <p className="px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-gray-800 border border-gray-200">
                          Aucun CV téléchargé
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#FDF8F5] to-[#F9F0E8]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] rounded-xl flex items-center justify-center">
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
                              className="px-6 py-3 bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-white rounded-xl hover:from-[#A0522D] hover:to-[#CD853F] transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                              Enregistrer
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => setShowPasswordForm(true)}
                          className="flex items-center px-6 py-3 bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-white rounded-xl hover:from-[#A0522D] hover:to-[#CD853F] transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          <Key className="h-4 w-4 mr-2" />
                          Changer le mot de passe
                        </button>
                      )}
                    </div>

                    {/* Advanced Security */}
                    <div className="bg-gradient-to-r from-[#FDF8F5] to-[#F9F0E8] p-6 rounded-xl">
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
                          <button className="px-6 py-3 bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] text-white rounded-xl hover:from-[#A0522D] hover:to-[#CD853F] transition-all duration-200 transform hover:scale-105 shadow-lg">
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
