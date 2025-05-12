import { useEffect, useState } from "react";
import Modal from "./Modal";
import api from "../api";
import Toast from "./Toast";
import Cookies from "js-cookie";

export default function EventProposalForm({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    espace_id: "",
    type: "spectacle",
    affiche: null,
    proposeur_email: "",
    proposeur_nom: "",
    proposeur_telephone: "",
    prix: 0,
    statut: "en_attente",
    commentaires: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [espaces, setEspaces] = useState([]);
  const [modalVisible, setModalVisible] = useState(isOpen);

  // Charger les espaces pour le select
  useEffect(() => {
    if (isOpen) {
      setModalVisible(true);
      api.get("/espaces")
        .then(res => setEspaces(res.data))
        .catch((error) => {
          setEspaces([]);
          if (error.response && error.response.status === 401) {
            showToast("Vous devez être connecté pour proposer un événement.", "error");
          } else {
            showToast("Erreur lors du chargement des espaces.", "error");
          }
        });
      
      // Récupérer l'email de l'utilisateur connecté et pré-remplir le champ proposeur_email
      const email = Cookies.get("userEmail");
      if (email) {
        setForm(prev => ({...prev, proposeur_email: email }));
      }
    }
  }, [isOpen]);

  const showToast = (message, type = "success", duration = 5000) => {
    setToast({ message, type, duration });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "prix" ? Number.parseFloat(value) : (name === "espace_id" ? Number(value) : value) });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, affiche: e.target.files[0] });
  };

  const validateForm = () => {
    const requiredFields = [
      'titre', 'description', 'date_debut', 'date_fin', 
      'espace_id', 'proposeur_nom', 'proposeur_email'
    ];
    
    const missingFields = requiredFields.filter(field => !form[field]);
    
    if (missingFields.length > 0) {
      showToast(`Veuillez remplir les champs obligatoires: ${missingFields.join(', ')}`, "error");
      return false;
    }
    
    if (new Date(form.date_debut) >= new Date(form.date_fin)) {
      showToast("La date de fin doit être après la date de début", "error");
      return false;
    }
    
    if (!form.proposeur_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showToast("Veuillez entrer une adresse email valide", "error");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "affiche" && value) {
          formData.append("affiche", value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      
      await api.post("/event-proposals", formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      
      // Afficher d'abord le toast de succès AVANT toute autre action
      setToast({ message: "Proposition envoyée avec succès", type: "success", duration: 5000 });
      
      // Réinitialiser le formulaire après succès
      setForm({
        titre: "",
        description: "",
        date_debut: "",
        date_fin: "",
        espace_id: "",
        type: "spectacle",
        affiche: null,
        proposeur_email: Cookies.get("userEmail") || "",
        proposeur_nom: "",
        proposeur_telephone: "",
        prix: 0,
        statut: "en_attente",
        commentaires: ""
      });
      
      if (onSuccess) onSuccess();
      
      // Attendre avant de fermer le modal pour s'assurer que le toast est bien affiché
      setTimeout(() => {
        // Fermer seulement le modal mais garder le component actif pour que le toast reste visible
        setModalVisible(false);
      }, 800);
      
      // Ne fermer complètement qu'après un délai plus long
      setTimeout(() => {
        onClose();
      }, 4000);
    } catch (error) {
      let errorMessage = "Une erreur est survenue, veuillez réessayer";
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Vous devez être connecté pour proposer un événement";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setToast({ message: errorMessage, type: "error", duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    // Fermer le modal mais garder les toasts actifs
    setModalVisible(false);
    
    // Attendre un moment avant de vraiment fermer le composant
    // pour laisser le temps au toast de s'afficher
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => {
            // Attendre que l'animation de fermeture soit terminée avant de réinitialiser le toast
            setTimeout(() => setToast(null), 300);
          }}
        />
      )}
      <Modal
        isOpen={modalVisible && isOpen}
        onClose={handleModalClose}
        title="Proposer un événement culturel"
        footer={
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleModalClose}
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#824B26] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#6e3d20] transition duration-300 disabled:opacity-50"
            >
              {loading ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#824B26]">Titre de l'événement</label>
            <input
              type="text"
              name="titre"
              value={form.titre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#824B26]">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-[#824B26]">Date de début</label>
              <input
                type="datetime-local"
                name="date_debut"
                value={form.date_debut}
                onChange={handleChange}
                required
                min={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#824B26]">Date de fin</label>
              <input
                type="datetime-local"
                name="date_fin"
                value={form.date_fin}
                onChange={handleChange}
                required
                min={form.date_debut || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#824B26]">Espace</label>
            <select
              name="espace_id"
              value={form.espace_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            >
              <option value="">Sélectionner un espace</option>
              {espaces.map(espace => (
                <option key={espace.id} value={espace.id}>{espace.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#824B26]">Type d'événement</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            >
              <option value="spectacle">Spectacle</option>
              <option value="atelier">Atelier</option>
              <option value="conference">Conférence</option>
              <option value="exposition">Exposition</option>
              <option value="rencontre">Rencontre</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#824B26]">Affiche de l'événement (optionnel)</label>
            <input
              type="file"
              name="affiche"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-[#824B26]">Nom du proposeur</label>
              <input
                type="text"
                name="proposeur_nom"
                value={form.proposeur_nom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#824B26]">Email du proposeur</label>
              <input
                type="email"
                name="proposeur_email"
                value={form.proposeur_email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#824B26]">Téléphone du proposeur</label>
            <input
              type="text"
              name="proposeur_telephone"
              value={form.proposeur_telephone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#824B26]">Prix (en Dh)</label>
            <input
              type="number"
              name="prix"
              value={form.prix}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-[#824B26]">Commentaires</label>
            <textarea
              name="commentaires"
              value={form.commentaires}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            />
          </div>
        </form>
      </Modal>
    </>
  );
}