import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TermsModal from '../components/TermsModal';
import api from '../api';
import Toast from '../components/Toast';
import Header from '../home/Header';
import Footer from '../home/Footer';

const ReservationFormPage = () => {
  const navigate = useNavigate();
  const [showTermsModal, setShowTermsModal] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [espaces, setEspaces] = useState([]);
  const [formData, setFormData] = useState({
    type: 'reservation', // 'reservation' ou 'evenement'
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
    heure_debut: '',
    heure_fin: '',
    espace_id: '',
    materiel: '',
    documents: [],
    type_activite: '',
  });

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Utilisation de l'endpoint profile sans le préfixe /api car il est déjà dans la baseURL
        const response = await api.get('/auth/profile');
        // Si la requête réussit, l'utilisateur est authentifié
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        setIsLoggedIn(false);
        
        // Rediriger vers la page de connexion si l'utilisateur accepte les conditions mais n'est pas connecté
        if (termsAccepted) {
          navigate('/login', { state: { from: '/reservation', message: 'Veuillez vous connecter pour continuer votre réservation' } });
        }
      }
    };

    checkAuth();
  }, [navigate, termsAccepted]);

  // Charger les espaces disponibles
  useEffect(() => {
    const fetchEspaces = async () => {
      try {
        const response = await api.get('/espaces');
        setEspaces(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des espaces:', error);
        setToast({
          type: 'error',
          message: 'Impossible de charger les espaces disponibles',
        });
      }
    };

    if (termsAccepted && isLoggedIn) {
      fetchEspaces();
    }
  }, [termsAccepted, isLoggedIn]);

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      documents: e.target.files,
    });
  };

  const handleTypeChange = (e) => {
    setFormData({
      ...formData,
      type: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Créer un FormData pour l'envoi des fichiers
      const data = new FormData();
      
      // Ajouter tous les champs du formulaire
      Object.keys(formData).forEach(key => {
        if (key !== 'documents') {
          data.append(key, formData[key]);
        }
      });
      
      // Ajouter les documents
      if (formData.documents.length > 0) {
        for (let i = 0; i < formData.documents.length; i++) {
          data.append('documents', formData.documents[i]);
        }
      }

      // Déterminer l'endpoint en fonction du type de demande
      const endpoint = formData.type === 'evenement' ? '/propositions-evenements' : '/reservations';
      
      const response = await api.post(endpoint, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setToast({
        type: 'success',
        message: formData.type === 'evenement' 
          ? 'Votre proposition d\'événement a été soumise avec succès!' 
          : 'Votre demande de réservation a été soumise avec succès!',
      });

      // Réinitialiser le formulaire après soumission réussie
      setFormData({
        type: 'reservation',
        titre: '',
        description: '',
        date_debut: '',
        date_fin: '',
        heure_debut: '',
        heure_fin: '',
        espace_id: '',
        materiel: '',
        documents: [],
        type_activite: '',
      });

      // Rediriger vers le profil utilisateur après un court délai
      setTimeout(() => {
        navigate('/UserProfil');
      }, 3000);

    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      setToast({
        type: 'error',
        message: 'Une erreur est survenue lors de la soumission de votre demande',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        {/* Modal des conditions générales */}
        <TermsModal
          isOpen={showTermsModal}
          onClose={() => navigate('/')}
          onAccept={handleTermsAccept}
        />

        {termsAccepted && isLoggedIn && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h1 className="text-2xl font-bold text-center mb-6">
              {formData.type === 'evenement' ? 'Proposer un événement' : 'Réserver un espace'}
            </h1>

            <div className="mb-6">
              <div className="flex justify-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="reservation"
                    checked={formData.type === 'reservation'}
                    onChange={handleTypeChange}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Réservation d'espace</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="evenement"
                    checked={formData.type === 'evenement'}
                    onChange={handleTypeChange}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Proposition d'événement</span>
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
                    Titre {formData.type === 'evenement' ? "de l'événement" : "de la réservation"} *
                  </label>
                  <input
                    type="text"
                    id="titre"
                    name="titre"
                    value={formData.titre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="type_activite" className="block text-sm font-medium text-gray-700 mb-1">
                    Type d'activité *
                  </label>
                  <select
                    id="type_activite"
                    name="type_activite"
                    value={formData.type_activite}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez un type d'activité</option>
                    <option value="conference">Conférence</option>
                    <option value="exposition">Exposition</option>
                    <option value="atelier">Atelier</option>
                    <option value="spectacle">Spectacle</option>
                    <option value="projection">Projection</option>
                    <option value="reunion">Réunion</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début *
                  </label>
                  <input
                    type="date"
                    id="date_debut"
                    name="date_debut"
                    value={formData.date_debut}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin *
                  </label>
                  <input
                    type="date"
                    id="date_fin"
                    name="date_fin"
                    value={formData.date_fin}
                    onChange={handleInputChange}
                    required
                    min={formData.date_debut || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="heure_debut" className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de début *
                  </label>
                  <input
                    type="time"
                    id="heure_debut"
                    name="heure_debut"
                    value={formData.heure_debut}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="heure_fin" className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de fin *
                  </label>
                  <input
                    type="time"
                    id="heure_fin"
                    name="heure_fin"
                    value={formData.heure_fin}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="espace_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Espace souhaité *
                  </label>
                  <select
                    id="espace_id"
                    name="espace_id"
                    value={formData.espace_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez un espace</option>
                    {espaces.map((espace) => (
                      <option key={espace.id} value={espace.id}>
                        {espace.nom} - {espace.type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-1">
                    Documents justificatifs *
                  </label>
                  <input
                    type="file"
                    id="documents"
                    name="documents"
                    onChange={handleFileChange}
                    multiple
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Formats acceptés: PDF, JPG, JPEG, PNG. Taille maximale: 5MB par fichier.
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="materiel" className="block text-sm font-medium text-gray-700 mb-1">
                  Matériel nécessaire
                </label>
                <textarea
                  id="materiel"
                  name="materiel"
                  value={formData.materiel}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Décrivez le matériel dont vous aurez besoin (optionnel)"
                ></textarea>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description détaillée *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Décrivez ${formData.type === 'evenement' ? 'votre événement' : 'votre besoin de réservation'} en détail`}
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Envoi en cours...' : 'Soumettre la demande'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ReservationFormPage;