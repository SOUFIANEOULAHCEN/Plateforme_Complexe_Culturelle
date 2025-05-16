"use client"

import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import { Link } from "react-router-dom"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

// EventModal component with modern design and primary color
const EventModal = ({ isOpen, onClose, event }) => {
  // Primary color constants
  const primaryColor = "#8B4513"; // Brown/wood color
  const primaryLightColor = "#D2691E"; // Lighter brown/chocolate color
  
  // Close on escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Close when clicking outside the modal content
  const handleOutsideClick = (e) => {
    if (e.target.id === 'modal-container') {
      onClose();
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Format address for location
  const formatLocation = (location) => {
    if (!location) return "Lieu à confirmer";
    return location;
  };

  if (!isOpen) return null;

  return (
    <div 
      id="modal-container"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-500"
      onClick={handleOutsideClick}
    >
      <div 
        className="relative max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 transform scale-100"
        style={{
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px 0 rgba(139, 69, 19, 0.3)`
        }}
      >
        {/* Close button with primary color */}
        <button 
          className="absolute top-6 right-6 z-20 bg-white/20 hover:bg-white/80 text-white hover:text-[#8B4513] rounded-full p-3 backdrop-blur-md transition-all duration-300 border border-white/30"
          onClick={onClose}
          aria-label="Fermer"
          style={{
            borderColor: `${primaryColor}40` // Adding some transparency to the border
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Event image (full cover background) */}
        <div className="relative w-full h-[85vh]">
          <img 
            src={event?.affiche_url ? `http://localhost:3000${event.affiche_url}` : "/default-event.jpg"}
            alt={event?.title || "Événement"} 
            className="w-full h-full object-cover"
          />
          
          {/* Gradient overlay with primary color */}
          <div 
            className="absolute inset-0" 
            style={{
              background: `linear-gradient(to top, rgba(139, 69, 19, 0.85), rgba(139, 69, 19, 0.4), rgba(0, 0, 0, 0.2))`
            }}
          />
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div 
              className="backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-3/5 
                         transform transition-all duration-700 hover:scale-105 border border-white/20"
              style={{
                backgroundColor: `rgba(139, 69, 19, 0.15)`,
                borderColor: `${primaryLightColor}30`
              }}
            >
              <div className="relative overflow-hidden mb-6">
                <div 
                  className="absolute top-0 left-0 h-1 w-full"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, ${primaryLightColor})`
                  }}
                />
              </div>
              
              <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">
                {event?.title || event?.titre}
              </h2>
              
              <div className="flex items-center mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     style={{ color: primaryLightColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xl text-white font-medium">
                  {formatDate(event?.date || event?.date_debut)}
                </p>
              </div>
              {/* Lieu de l'événement */}
              <div className="flex items-center mb-6 mt-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     style={{ color: primaryLightColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xl text-white font-medium">
                  {formatLocation(event?.lieu || event?.location)}
                </p>
              </div>
              
              {event?.description && (
                <div className="prose prose-lg text-white/90 mt-6 max-w-full">
                  <p>{event.description}</p>
                </div>
              )}
              
              {/* Action button with primary color */}
              <div className="mt-8">
                <button 
                  className="w-full py-3 px-4 rounded-lg text-white transition-all duration-300 transform 
                            hover:-translate-y-1 shadow-md hover:shadow-lg focus:outline-none"
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 4px 6px -1px rgba(139, 69, 19, 0.3), 0 2px 4px -1px rgba(139, 69, 19, 0.15)`
                  }}
                  onClick={onClose}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventSlider = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetch("http://localhost:3000/api/evenements")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Error fetching events:", error);
        setLoading(false);
      })
  }, [])

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeEventModal = () => {
    setIsModalOpen(false);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  if (loading) return (
    <div className="py-10 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B4513]"></div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-[#8B4513] text-center mb-6">Événements à venir</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">Découvrez notre programmation culturelle et rejoignez-nous pour des moments inoubliables.</p>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="event-slider !pb-12"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id || event._id}>
              <div className="bg-white rounded-xl overflow-hidden shadow-xl group hover:shadow-2xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={event.affiche_url ? `http://localhost:3000${event.affiche_url}` : "/default-event.jpg"}
                    alt={event.title || event.titre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white text-2xl font-bold mb-1">{event.title || event.titre}</h3>
                      <div className="flex items-center text-white/80 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#D2691E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {event.date ? new Date(event.date).toLocaleDateString() : 
                         event.date_debut ? new Date(event.date_debut).toLocaleDateString() : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[#8B4513] mb-6 line-clamp-2">
                    {event.description || "Découvrez tous les détails de cet événement."}
                  </p>
                  <button
                    className="w-full bg-[#8B4513] text-white py-3 px-4 rounded-lg hover:bg-[#6f3610] 
                              transition-all duration-300 transform hover:-translate-y-1 shadow-md 
                              hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D2691E]"
                    onClick={() => window.location.href = '/evenementsInfo'}
                  >
                    En savoir plus
                  </button>
                </div>
              </div>
              
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Event Modal */}
      <EventModal 
        isOpen={isModalOpen} 
        onClose={closeEventModal} 
        event={selectedEvent} 
      />
    </section>
  );
};

export default EventSlider;