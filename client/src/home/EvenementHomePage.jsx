import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const API_URL = "http://localhost:5000/api/events";

// Simuler l'utilisateur connecté et ses inscriptions (à remplacer par votre logique réelle)
const userId = "user123"; // À remplacer par l'auth réelle

const EvenementHomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({});
  const [userInscriptions, setUserInscriptions] = useState([]); // Liste des IDs d'événements auxquels l'utilisateur est inscrit

  // Récupérer les événements
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      });
    // Simuler la récupération des inscriptions utilisateur (à remplacer par un vrai fetch)
    setUserInscriptions(["event1", "event2"]); // Remplacez par les vrais IDs d'événements inscrits
  }, []);

  // Filtrer les événements du mois courant
  const now = new Date();
  const eventsThisMonth = events.filter((event) => {
    const date = new Date(event.date);
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  // Gestion des commentaires (simulé, à remplacer par API réelle)
  const handleCommentChange = (eventId, value) => {
    setCommentInputs((prev) => ({ ...prev, [eventId]: value }));
  };
  const handleCommentSubmit = (eventId) => {
    if (!commentInputs[eventId]) return;
    setComments((prev) => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), { user: userId, text: commentInputs[eventId] }],
    }));
    setCommentInputs((prev) => ({ ...prev, [eventId]: "" }));
  };

  if (loading) return <div className="text-center py-10">Chargement...</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Header - Style du 2ème écran */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-red-700 object-cover transition-transform duration-700" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="px-4">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
              Événements
            </h1>
            <div className="mt-6 flex items-center justify-center space-x-2 text-white">
              <a
                href="/accueil"
                className="font-semibold hover:underline"
              >
                Home
              </a>
              <span>•</span>
              <a
                href="/evenements"
                className="font-semibold hover:underline"
              >
                Événement
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Slider d'affiches */}
      <div className="max-w-5xl mx-auto mt-12">
        <h2 className="text-3xl font-serif text-[#8B4513] text-center mb-8">Événements à venir</h2>
        <Swiper
          slidesPerView={4}
          spaceBetween={30}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="mySwiper"
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {events.map((event) => (
            <SwiperSlide key={event._id}>
              <div className="rounded-lg overflow-hidden shadow-lg group relative h-[420px]">
                <img
                  src={event.affiche_url ? `http://localhost:3000${event.affiche_url}` : "/default-event.jpg"}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{event.title}</h3>
                    <p className="text-lg text-white drop-shadow-lg">{event.date ? new Date(event.date).toLocaleDateString('fr-FR') : ''}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Timeline des Événements à Venir - Style amélioré */}
      <div className="max-w-5xl mx-auto mt-16 mb-16 bg-white py-10 px-4 min-h-[400px] flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-center mb-2 text-[#8B4513]">Calendrier des Événements à Venir</h2>
        <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
          Consultez notre calendrier pour rester informé des prochains événements. 
          Planifiez votre participation en fonction des dates et horaires disponibles.
        </p>
        <div className="relative min-h-[200px]">
          {/* Ligne centrale verticale */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-red-700"></div>
          <div className="space-y-12">
            {events.length === 0 && (
              <div className="text-center text-gray-400 py-8">Aucun événement à venir.</div>
            )}
            {[...events]
              .filter(event => event.date)
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 5)
              .map((event, idx) => (
                <div key={event._id || idx} className={`flex items-center relative ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Point central sur la timeline */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-red-700 border-4 border-white shadow-lg z-10"></div>
                  {/* Date côté opposé de la carte d'événement */}
                  <div className={`w-1/2 ${idx % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}> 
                    <div className="text-red-700 font-bold mb-1">
                      {event.date ? new Date(event.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'}) : ''}
                    </div>
                    <div className="text-sm text-gray-500">Centre Culturel Said Hajji</div>
                  </div>
                  {/* Carte d'événement */}
                  <div className={`w-1/2 ${idx % 2 === 0 ? 'pl-12' : 'pr-12'}`}> 
                    <div className="bg-white rounded-lg shadow-lg p-5 relative">
                      {/* Icône rouge */}
                      <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-red-700 flex items-center justify-center text-white shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                        </svg>
                      </div>
                      {/* Contenu de l'événement */}
                      <div className="text-xs text-red-700 font-semibold mb-1">
                        {event.organisateur}
                      </div>
                      <div className="font-bold text-lg mb-2 text-[#8B4513]">
                        {event.title}
                      </div>
                      <div className="text-gray-700 text-sm mb-2">
                        {event.description?.slice(0, 100)}
                      </div>
                      {/* Commentaires et formulaire si inscrit */}
                      {userInscriptions.includes(event._id) && (
                        <div className="mt-4">
                          <form onSubmit={e => { e.preventDefault(); handleCommentSubmit(event._id); }} className="flex gap-2 items-center">
                            <input
                              type="text"
                              className="border rounded px-2 py-1 flex-1"
                              placeholder="Ajouter un commentaire..."
                              value={commentInputs[event._id] || ""}
                              onChange={e => handleCommentChange(event._id, e.target.value)}
                            />
                            <button type="submit" className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800">Envoyer</button>
                          </form>
                        </div>
                      )}
                      {/* Liste des commentaires */}
                      {comments[event._id] && comments[event._id].length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs font-semibold text-gray-600 mb-1">Commentaires :</div>
                          <ul className="space-y-1">
                            {comments[event._id].map((c, i) => (
                              <li key={i} className="text-xs text-gray-700 bg-gray-100 rounded px-2 py-1">
                                <span className="font-bold text-red-700">{c.user}:</span> {c.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Événements du mois */}
      <div className="max-w-4xl mx-auto mt-12 mb-16">
        <h2 className="text-xl font-semibold mb-4 text-center text-red-700">Événements de ce mois</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eventsThisMonth.length === 0 && (
            <div className="col-span-2 text-center text-gray-500">Aucun événement ce mois-ci.</div>
          )}
          {eventsThisMonth.map((event) => (
            <div key={event._id} className="bg-gray-100 rounded-lg p-4 shadow">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <div className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</div>
              <p className="mt-2">{event.description?.slice(0, 80)}...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvenementHomePage;