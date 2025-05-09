import { useState, useEffect } from 'react';
import api from '../api';
import Toast from './Toast';
import Cookies from 'js-cookie';

const UserReservationsHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [eventProposals, setEventProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('reservations');
  const userEmail = Cookies.get("userEmail");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Récupérer les réservations de l'utilisateur connecté uniquement
        const reservationsResponse = await api.get(`/reservations?utilisateur_email=${userEmail}`);
        setReservations(reservationsResponse.data || []);

        // Récupérer les propositions d'événements de l'utilisateur connecté uniquement
        const proposalsResponse = await api.get(`/evenements?createur_email=${userEmail}`);
        setEventProposals(proposalsResponse.data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        setToast({
          type: 'error',
          message: 'Impossible de charger votre historique de réservations',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userEmail]);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour obtenir la classe de couleur en fonction du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepte':
        return 'bg-green-100 text-green-800';
      case 'refuse':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour traduire le statut
  const translateStatus = (status) => {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'accepte':
        return 'Accepté';
      case 'refuse':
        return 'Refusé';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'reservations' ? 'border-[#824B26] text-[#824B26]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Réservations d'espaces
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-[#824B26] text-[#824B26]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Propositions d'événements
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-4">
            <svg className="animate-spin h-8 w-8 mx-auto text-[#824B26]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-600">Chargement en cours...</p>
          </div>
        ) : (
          <>
            {activeTab === 'reservations' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Vos réservations d'espaces</h3>
                {reservations.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Vous n'avez pas encore de réservations.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espace</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reservations.map((reservation) => (
                          <tr key={reservation.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reservation.titre}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.espace?.nom || 'Non spécifié'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(reservation.date_debut)} - {formatDate(reservation.date_fin)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reservation.statut)}`}>
                                {translateStatus(reservation.statut)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Vos propositions d'événements</h3>
                {eventProposals.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Vous n'avez pas encore proposé d'événements.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {eventProposals.map((event) => (
                          <tr key={event.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.titre}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.type_activite}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(event.date_debut)} - {formatDate(event.date_fin)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(event.statut)}`}>
                                {translateStatus(event.statut)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserReservationsHistory;