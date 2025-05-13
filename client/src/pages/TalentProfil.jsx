import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Cookies from "js-cookie";
import Toast from "../components/Toast";
import { 
  Bell, Lock, LogOut, User, Camera, Edit2, Key, Shield, 
  Briefcase, Award, Clock, Link as LinkIcon, FileText 
} from 'lucide-react';

export default function TalentProfile() {
  const navigate = useNavigate();
  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
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
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [toast, setToast] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cvPreview, setCvPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const userEmail = Cookies.get("userEmail");

  const fetchTalentData = async () => {
    try {
      const response = await api.get(`/talent?email=${userEmail}`);
      const user = response.data;
      
      if (!user) throw new Error("Talent non trouvé");

      // S'assurer que experience et reseaux_sociaux sont bien des objets/arrays
      const userWithExperience = {
        ...user,
        experience: Array.isArray(user.experience)
          ? user.experience
          : (typeof user.experience === 'string' ? JSON.parse(user.experience || '[]') : []),
        reseaux_sociaux: (user.reseaux_sociaux && typeof user.reseaux_sociaux === 'object')
          ? user.reseaux_sociaux
          : (typeof user.reseaux_sociaux === 'string' && user.reseaux_sociaux !== ''
              ? JSON.parse(user.reseaux_sociaux)
              : {}),
      };

      setTalent(userWithExperience);
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
        reseaux_sociaux: (user.reseaux_sociaux && typeof user.reseaux_sociaux === 'object')
          ? user.reseaux_sociaux
          : (typeof user.reseaux_sociaux === 'string' && user.reseaux_sociaux !== ''
              ? JSON.parse(user.reseaux_sociaux)
              : {}),
        experience: Array.isArray(user.experience)
          ? user.experience
          : (typeof user.experience === 'string' ? JSON.parse(user.experience || '[]') : []),
        cv: null,
        image_profil: null,
      });
    } catch (error) {
      setToast({ message: "Erreur lors de la récupération des données", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalentData();
  }, [userEmail]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, cv: file }));
      const reader = new FileReader();
      reader.onloadend = () => setCvPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      reseaux_sociaux: { ...prev.reseaux_sociaux, [platform]: value }
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setFormData(prev => ({ ...prev, experience: newExperience }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formDataToSend = new FormData();
      const token = Cookies.get('token');
  
      // Ajoutez chaque champ un par un
    formDataToSend.append('nom', formData.nom);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('telephone', formData.telephone);
    formDataToSend.append('domaine_artiste', formData.domaine_artiste);
    formDataToSend.append('description_talent', formData.description_talent);
    formDataToSend.append('specialite', formData.specialite);
    formDataToSend.append('annees_experience', formData.annees_experience);
    formDataToSend.append('competences', formData.competences);
    formDataToSend.append('disponibilites', formData.disponibilites);
    

    // Pour les objets JSON
    formDataToSend.append('reseaux_sociaux', JSON.stringify(formData.reseaux_sociaux));
    formDataToSend.append('experience', JSON.stringify(formData.experience));
    
    // Pour les fichiers (si existants)
    if (formData.image_profil) {
      formDataToSend.append('image_profil', formData.image_profil);
    }
    if (formData.cv instanceof File) {
      formDataToSend.append('cv', formData.cv);
    }
    
    // Debug: Affichez le contenu de FormData
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }
    

    console.log("Envoi des données:", formDataToSend); 
    const response = await api.put(`/talent/${talent.id}`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
  
      setToast({ message: "Profil mis à jour avec succès!", type: "success" });
      setEditing(false);
      // Rafraîchir les données depuis le serveur pour garantir l'affichage à jour
      await fetchTalentData();
      // Forcer le rafraîchissement de l'image (ajouter un timestamp)
      if (talent.image_profil) {
        setTalent(prev => ({
          ...prev,
          image_profil: prev.image_profil + '?t=' + new Date().getTime()
        }));
      }
  
    } catch (error) {
      console.error("Erreur détaillée:", error);
      setToast({
        message: error.response?.data?.message || error.message || "Erreur lors de la mise à jour",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ message: "Les mots de passe ne correspondent pas", type: "error" });
      return;
    }

    setLoading(true);
    try {
      console.log("ID du talent pour changement de mot de passe:", talent.id);
      await api.put(`/talent/${talent.id}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setToast({ message: "Mot de passe mis à jour!", type: "success" });
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Erreur lors de la mise à jour",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Dans votre composant TalentProfile
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData(prev => ({ ...prev, image_profil: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const addExperience = () => {
  setFormData(prev => ({
    ...prev,
    experience: [...prev.experience, { 
      poste: "", 
      entreprise: "", 
      duree: "", 
      description: "" 
    }]
  }));
};
// Dans votre composant de login
const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, is_talent } = response.data;
    
    if (is_talent) {
      navigate('/TalentProfil');
    } else {
      navigate('/UserProfil');
    }
  } catch (error) {
    setError("Identifiants incorrects");
  }
};
  const handleLogout = () => {
    Cookies.remove("userEmail");
    Cookies.remove("authToken");
    navigate("/");
  };

  if (loading && !talent) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="mb-6">Aucun profil talent trouvé.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(52.3%_0.137_46.201)] transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const socialMediaPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: <span className="text-blue-600">f</span> },
    { id: 'instagram', name: 'Instagram', icon: <span className="text-pink-600">📸</span> },
    { id: 'twitter', name: 'Twitter', icon: <span className="text-blue-400">𝕏</span> },
    { id: 'linkedin', name: 'LinkedIn', icon: <span className="text-blue-700">in</span> },
  ];

  const navItems = [
    { id: "profile", icon: User, label: "Profil" },
    { id: "security", icon: Lock, label: "Sécurité" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Mon Compte Talent</h1>
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
                      <img 
                        src={
                          talent.image_profil
                            ? talent.image_profil.startsWith('http')
                              ? talent.image_profil
                              : `http://localhost:3000${talent.image_profil}`
                            : '/default-avatar.png'
                        } 
                        alt={talent.nom} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {editing && (
                      <label
                        htmlFor="image_profil"
                        className="absolute bottom-0 right-0 bg-white text-blue-600 p-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
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
                    <h2 className="font-bold text-lg">{talent.nom}</h2>
                    <p className="text-sm opacity-90">{talent.email}</p>
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
                            : 'hover:bg-[oklch(52.3%_0.137_46.201)]'
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-4 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Compte {talent.statut_talent === 'actif' ? 'vérifié' : 'non vérifié'}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      talent.statut_talent === 'actif' ? 'bg-green-100 text-green-800' : 
                      talent.statut_talent === 'inactif' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {talent.statut_talent === 'actif' ? 'Actif' : 
                       talent.statut_talent === 'inactif' ? 'Inactif' : 
                       'En validation'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Membre depuis</span>
                    <span className="text-sm font-medium">
                      {new Date(talent.date_inscription).toLocaleDateString()}
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
                  <h2 className="text-xl font-bold text-gray-900">Profil Talent</h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(52.3%_0.137_46.201)] transition-all duration-200"
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
                            reseaux_sociaux: (talent.reseaux_sociaux && typeof talent.reseaux_sociaux === 'object')
                              ? talent.reseaux_sociaux
                              : (typeof talent.reseaux_sociaux === 'string' && talent.reseaux_sociaux !== ''
                                  ? JSON.parse(talent.reseaux_sociaux)
                                  : {}),
                            experience: Array.isArray(talent.experience)
                              ? talent.experience
                              : (typeof talent.experience === 'string' ? JSON.parse(talent.experience || '[]') : []),
                            cv: null,
                            image_profil: null,
                          });
                          setImagePreview(null);
                          setCvPreview(null);
                        }}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(52.3%_0.137_46.201)] transition-all duration-200"
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
                          Nom complet
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                            {talent.nom}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        {editing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                            {talent.email}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        {editing ? (
                          <input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          pattern="^[+]?[0-9\\s-]{7,19}$"
                          title="Format : 0123456789 ou +33 1 23 45 67 89"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                            {talent.telephone || "Non renseigné"}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Domaine artistique
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            name="domaine_artiste"
                            value={formData.domaine_artiste}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                            {talent.domaine_artiste || "Non renseigné"}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Spécialité
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            name="specialite"
                            value={formData.specialite}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                            {talent.specialite || "Non renseigné"}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Années d'expérience
                        </label>
                        {editing ? (
                          <input
                            type="number"
                            name="annees_experience"
                            value={formData.annees_experience}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                            {talent.annees_experience || "Non renseigné"}
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Compétences
                        </label>
                        {editing ? (
                          <textarea
                            name="competences"
                            value={formData.competences}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Listez vos compétences, séparées par des virgules"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 whitespace-pre-line">
                            {talent.competences || "Aucune compétence renseignée"}
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Disponibilités
                        </label>
                        {editing ? (
                          <textarea
                            name="disponibilites"
                            value={formData.disponibilites}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Décrivez vos disponibilités"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 whitespace-pre-line">
                            {talent.disponibilites || "Aucune disponibilité renseignée"}
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Réseaux sociaux
                        </label>
                        {editing ? (
                          <div className="space-y-3">
                            {socialMediaPlatforms.map(platform => (
                              <div key={platform.id} className="flex items-center">
                                <span className="w-8">{platform.icon}</span>
                                <input
                                  type="text"
                                  value={formData.reseaux_sociaux[platform.id] || ""}
                                  onChange={(e) => handleSocialMediaChange(platform.id, e.target.value)}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder={`Lien ${platform.name}`}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-lg">
                            {Object.keys(talent.reseaux_sociaux || {}).length > 0 ? (
                              <div className="flex flex-wrap gap-3">
                                {socialMediaPlatforms.map(platform => (
                                  talent.reseaux_sociaux[platform.id] && (
                                    <a 
                                      key={platform.id} 
                                      href={talent.reseaux_sociaux[platform.id]} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300"
                                    >
                                      {platform.icon}
                                      <span className="ml-1 text-sm">{platform.name}</span>
                                    </a>
                                  )
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-800">Aucun réseau social renseigné</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expérience professionnelle
                        </label>
                        {editing ? (
                          <div className="space-y-4">
                            {formData.experience.map((exp, index) => (
                              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Poste</label>
                                    <input
                                      type="text"
                                      value={exp.poste || ""}
                                      onChange={(e) => handleExperienceChange(index, 'poste', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Entreprise</label>
                                    <input
                                      type="text"
                                      value={exp.entreprise || ""}
                                      onChange={(e) => handleExperienceChange(index, 'entreprise', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500 mb-1">Durée</label>
                                    <input
                                      type="text"
                                      value={exp.duree || ""}
                                      onChange={(e) => handleExperienceChange(index, 'duree', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                      placeholder="Ex: 2018-2020"
                                    />
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <label className="block text-xs text-gray-500 mb-1">Description</label>
                                  <textarea
                                    value={exp.description || ""}
                                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeExperience(index)}
                                  className="text-red-500 text-sm hover:text-red-700"
                                >
                                  Supprimer
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addExperience}
                              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                            >
                              + Ajouter une expérience
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {Array.isArray(talent.experience) && talent.experience.length > 0 ? (
                              talent.experience.map((exp, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                  <h4 className="font-medium">{exp.poste}</h4>
                                  <p className="text-gray-600">{exp.entreprise} • {exp.duree}</p>
                                  {exp.description && (
                                    <p className="mt-1 text-gray-700 whitespace-pre-line">{exp.description}</p>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">Aucune expérience renseignée</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CV
                        </label>
                        {editing ? (
                          <div>
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
                              className="inline-block px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                            >
                              Choisir un fichier
                            </label>
                            {formData.cv?.name && (
                              <span className="ml-3 text-sm text-gray-700">{formData.cv.name}</span>
                            )}
                          </div>
                        ) : talent.cv ? (
                          <a
                            href={talent.cv}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-[oklch(45.9%_0.137_46.201)] text-gray-50 rounded-lg hover:bg-[oklch(52.3%_0.137_46.201)]"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Télécharger le CV
                          </a>
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">Aucun CV téléchargé</p>
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
                  <h2 className="text-xl font-bold text-gray-900">Sécurité du compte</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Changer le mot de passe</h3>
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setShowPasswordForm(false)}
                              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                              Annuler
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(52.3%_0.137_46.201)]"
                            >
                              Enregistrer
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => setShowPasswordForm(true)}
                          className="px-4 py-2 bg-[oklch(47.3%_0.137_46.201)] text-white rounded-lg hover:bg-[oklch(52.3%_0.137_46.201)]"
                        >
                          <Key className="h-4 w-4 inline-block mr-2" />
                          Changer le mot de passe
                        </button>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium mb-2">Sécurité avancée</h3>
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
                          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
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
  );
}