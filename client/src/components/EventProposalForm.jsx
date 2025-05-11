import { useEffect, useState } from "react";
import Modal from "./Modal";
import api from "../api";
import Toast from "./Toast";

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

  // Charger les espaces pour le select
  useEffect(() => {
    if (isOpen) {
      api.get("/espaces").then(res => setEspaces(res.data)).catch(() => setEspaces([]));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "prix" ? Number.parseFloat(value) : (name === "espace_id" ? Number(value) : value) });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, affiche: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "affiche" && value) {
          formData.append("affiche", value);
        } else {
          formData.append(key, value);
        }
      });
      await api.post("/event-proposals", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setToast({ message: "Proposition envoyée avec succès", type: "success" });
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 4000);
    } catch (error) {
      setToast({ message: "Une erreur est survenue, veuillez réessayer", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Proposer un événement culturel"
      footer={
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
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
          <label className="block mb-1 text-sm font-medium text-[#824B26]">Prix (en €)</label>
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
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Modal>
  );
}