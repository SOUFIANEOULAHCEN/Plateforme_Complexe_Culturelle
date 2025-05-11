import { useState } from "react";
import Modal from "./Modal";
import api from "../api";
import Toast from "./Toast";

export default function EventProposalForm({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    lieu: "",
    type_evenement: "conférence",
    organisateur: "",
    contact: "",
    statut: "en_attente",
    commentaires: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    try {
      await api.post("/event-proposals", form);
      setToast({ message: "Proposition envoyée avec succès", type: "success" });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setToast({ message: "Erreur lors de l'envoi de la proposition", type: "error" });
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-[#824B26]">Lieu</label>
          <input
            type="text"
            name="lieu"
            value={form.lieu}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-[#824B26]">Type d'événement</label>
          <select
            name="type_evenement"
            value={form.type_evenement}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
          >
            <option value="conférence">Conférence</option>
            <option value="exposition">Exposition</option>
            <option value="atelier">Atelier</option>
            <option value="concert">Concert</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-[#824B26]">Organisateur</label>
          <input
            type="text"
            name="organisateur"
            value={form.organisateur}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#824B26]"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-[#824B26]">Contact</label>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            required
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