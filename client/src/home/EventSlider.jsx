"use client"

import React, { useEffect, useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

// EventModal component (le même que précédemment)
const EventModal = ({ isOpen, onClose, event }) => {
  // ... (garder le même code pour EventModal)
};

const EventSlider = () => {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  const swiperRef = useRef(null);

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
    document.body.style.overflow = 'hidden';
  };

  const closeEventModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  if (loading) return (
    <div className="py-10 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B4513]"></div>
    </div>
  );

  return (
    <section className="py-16 bg-[#FDF8F5]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif text-[#8B4513] text-center mb-12">{t('events_title')}</h2>
        
        <div className="relative group">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={3}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="py-8 px-4"
          >
            {events.map((event, index) => (
              <SwiperSlide key={index}>
                <div className="w-full transform transition-all duration-300 hover:scale-105 bg-white rounded-lg shadow-md overflow-hidden hover:bg-[#8B4513] group">
                  <div className="p-4">
                    <div className="aspect-video relative mb-4 overflow-hidden rounded-lg">
                      <img
                        src={event.affiche_url ? `http://localhost:3000${event.affiche_url}` : "/placeholder.svg"}
                        alt={event.title || event.titre}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#8B4513] group-hover:text-white">
                      {event.title || event.titre}
                    </h3>
                    <p className="text-[#8B4513] group-hover:text-white">
                      {event.date ? new Date(event.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-MA' : 'fr-FR') : 
                       event.date_debut ? new Date(event.date_debut).toLocaleDateString(i18n.language === 'ar' ? 'ar-MA' : 'fr-FR') : ""}
                    </p>
                    <button
                      onClick={() => openEventModal(event)}
                      className="mt-4 w-full bg-[#8B4513] text-white py-2 px-4 rounded-md hover:bg-[#6f3610] transition duration-300 group-hover:bg-white group-hover:text-[#8B4513]"
                    >
                      {t('events_details')}
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Boutons de navigation personnalisés */}
          <div className="swiper-button-prev hidden group-hover:block absolute left-0 top-1/2 z-10 -translate-y-1/2 h-12 w-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#8B4513] hover:text-white transition-colors duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          
          <div className="swiper-button-next hidden group-hover:block absolute right-0 top-1/2 z-10 -translate-y-1/2 h-12 w-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#8B4513] hover:text-white transition-colors duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Pagination */}
          <div className="swiper-pagination !relative !bottom-0 mt-4 flex justify-center gap-2"></div>
        </div>
      </div>

      {/* Event Modal */}
      {isModalOpen && selectedEvent && (
        <EventModal
          isOpen={isModalOpen}
          onClose={closeEventModal}
          event={selectedEvent}
        />
      )}
    </section>
  );
};

export default EventSlider;