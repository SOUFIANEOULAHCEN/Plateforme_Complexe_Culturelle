import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  
  // Réinitialiser l'état lorsque la modal s'ouvre ou se ferme
  useEffect(() => {
    if (!isOpen) {
      setAccepted(false);
    }
  }, [isOpen]);

  const handleAccept = () => {
    setAccepted(true);
    onAccept();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Conditions Générales d'Utilisation">
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        <h2 className="text-xl font-bold mb-4">Conditions Générales de Réservation</h2>
        
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">1. Éligibilité</h3>
          <p className="text-gray-700 mb-2">
            Les individus, associations, entreprises ou institutions peuvent réserver des espaces au Centre Culturel Mohammed VI de Ouarzazate, sous réserve de disponibilité et d'approbation par l'administration.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">2. Documents requis</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Individus : CIN ou acte de naissance</li>
            <li>Associations/Organisations : Statuts + justificatifs légaux</li>
            <li>Entreprises : Dossier légal complet</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">3. Espaces disponibles</h3>
          <p className="text-gray-700 mb-2">
            Le Centre Culturel Mohammed VI met à disposition plusieurs types d'espaces :
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Salles de conférence</li>
            <li>Ateliers</li>
            <li>Galeries d'exposition</li>
            <li>Espaces de lecture</li>
            <li>Salles de cinéma</li>
            <li>Autres espaces polyvalents</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">4. Règles de réservation</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Les demandes doivent être soumises au minimum 15 jours avant la date prévue de l'événement</li>
            <li>La durée de réservation est définie par la direction selon la nature de l'activité</li>
            <li>Du matériel additionnel peut être mis à disposition moyennant des frais supplémentaires</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">5. Règlement intérieur</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Respect strict des horaires convenus</li>
            <li>Comportement responsable et respectueux des lieux</li>
            <li>Interdiction de fumer dans l'enceinte du centre</li>
            <li>Interdiction d'introduire des produits dangereux</li>
            <li>Interdiction de toute activité illégale</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">6. Annulation et modification</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Toute annulation doit être signalée au moins 7 jours à l'avance</li>
            <li>Les modifications sont possibles selon la disponibilité des espaces</li>
          </ul>
        </section>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="accept-terms"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="accept-terms" className="ml-2 text-sm text-gray-700">
            J'ai lu et j'accepte les conditions générales
          </label>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Annuler
          </button>
          <button
            onClick={handleAccept}
            disabled={!accepted}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${accepted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
          >
            Accepter et continuer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TermsModal;