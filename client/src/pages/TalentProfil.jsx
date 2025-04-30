import React, { useEffect, useState } from "react";
import api from "../api";
import Cookies from "js-cookie";
import Toast from "../components/Toast";

export default function TalentProfil() {
  const [talent, setTalent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const userEmail = Cookies.get("userEmail");

  useEffect(() => {
    fetchTalent();
  }, [userEmail]);

  const fetchTalent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/utilisateurs?email=${userEmail}`);
      const user = response.data.find(u => u.is_talent);
      
      if (user) {
        setTalent(user);
      } else {
        setError("Aucun profil talent trouvé pour cet utilisateur.");
      }
    } catch (err) {
      console.error("Erreur lors du chargement du profil talent:", err);
      setError("Erreur lors du chargement du profil talent.");
      setToast({
        message: "Erreur lors de la récupération des données du talent",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[oklch(47.3%_0.137_46.201)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 bg-red-100 px-4 py-3 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">Aucun profil talent trouvé.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Profile header with image */}
          <div className="relative bg-gradient-to-r from-[oklch(47.3%_0.137_46.201)] to-[oklch(57.3%_0.137_46.201)] h-40">
            <div className="absolute -bottom-16 left-8 flex items-end">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                {talent.image_profil ? (
                  <img
                    src={talent.image_profil}
                    alt={talent.nom}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-600 text-3xl font-medium">
                    {talent.nom.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-6 mb-4">
                <div className="text-white text-xl font-semibold">{talent.nom}</div>
                <div className="text-white/80 flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                    {talent.domaine_artiste || "Artiste"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile content */}
          <div className="pt-20 px-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{talent.nom}</div>
              </div>

              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{talent.email}</div>
              </div>

              {/* Phone field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                  {talent.telephone || "Non renseigné"}
                </div>
              </div>

              {/* Domain field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domaine artistique</label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                  {talent.domaine_artiste || "Non renseigné"}
                </div>
              </div>

              {/* Status field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${talent.statut_talent === 'actif' ? 'bg-green-100 text-green-800' : 
                      talent.statut_talent === 'inactif' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {talent.statut_talent || "Non défini"}
                  </span>
                </div>
              </div>

              {/* Address field - full width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
                  {talent.adresse || "Non renseignée"}
                </div>
              </div>

              {/* Bio field - full width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 whitespace-pre-line">
                  {talent.bio || "Aucune biographie disponible"}
                </div>
              </div>
            </div>

            {/* Portfolio section */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Portfolio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {talent.portfolio && talent.portfolio.length > 0 ? (
                  talent.portfolio.map((item, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden shadow-md h-48">
                      <img
                        src={item || "/placeholder.svg"}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">Aucune image dans le portfolio</p>
                  </div>
                )}
              </div>
            </div>

            {/* Account info section */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations du compte</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 rounded-full bg-blue-100 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date d'inscription</p>
                      <p className="font-medium">
                        {talent.date_creation ? new Date(talent.date_creation).toLocaleDateString() : "Non disponible"}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 rounded-full bg-green-100 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut du compte</p>
                      <p className="font-medium">
                        {talent.actif ? "Actif" : "Inactif"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}