"use client";

import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const EventModal = ({ isOpen, onClose, event }) => {
  // ... (conservez le même code pour EventModal)
};

const EventSlider = () => {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/evenements")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeEventModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  if (loading)
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#8B4513]"></div>
      </div>
    );

  return (
    <section className="py-20 bg-gradient-to-b from-[#FDF8F5] to-[#f5ece4]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#8B4513] mb-4">
            {t("events_title")}
          </h2>
          <div className="w-24 h-1 bg-[#8B4513] mx-auto"></div>
        </div>

        <div className="relative group">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={40}
            slidesPerView={3}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              renderBullet: (index, className) => {
                return `<span class="${className} bg-[#8B4513] opacity-40 w-3 h-3 mx-1 rounded-full transition-all duration-300 hover:opacity-100"></span>`;
              },
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 1.5,
                spaceBetween: 25,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="py-4 px-2"
          >
            {events.map((event, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-full transform transition-all duration-500 hover:scale-[1.02] bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl group/card">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={
                        event.affiche_url
                          ? `http://localhost:3000${event.affiche_url}`
                          : "/placeholder.svg"
                      }
                      alt={event.title || event.titre}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800 group-hover/card:text-[#8B4513] transition-colors duration-300 line-clamp-2">
                        {event.title || event.titre}
                      </h3>
                      <span className="bg-[#8B4513]/10 text-[#8B4513] text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap ml-3">
                        {event.date
                          ? new Date(event.date).toLocaleDateString(
                              i18n.language === "ar" ? "ar-MA" : "fr-FR"
                            )
                          : event.date_debut
                          ? new Date(event.date_debut).toLocaleDateString(
                              i18n.language === "ar" ? "ar-MA" : "fr-FR"
                            )
                          : ""}
                      </span>
                    </div>
                    <Link
                      to="/evenements"
                      className="mt-4 w-full bg-[#8B4513] text-white py-3 px-6 rounded-lg hover:bg-[#6f3610] transition-all duration-300 group-hover/card:bg-[#6f3610] group-hover/card:shadow-md flex items-center justify-center gap-2"
                    >
                      {t("events_details")}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Boutons de navigation personnalisés */}
          <button className="swiper-button-prev hidden md:flex absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-2 h-14 w-14 bg-white rounded-full shadow-xl items-center justify-center hover:bg-[#8B4513] text-[#8B4513] hover:text-white transition-all duration-300 group-hover:opacity-100 opacity-0">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>

          <button className="swiper-button-next hidden md:flex absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-2 h-14 w-14 bg-white rounded-full shadow-xl items-center justify-center hover:bg-[#8B4513] text-[#8B4513] hover:text-white transition-all duration-300 group-hover:opacity-100 opacity-0">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>

          {/* Pagination */}
          <div className="swiper-pagination !relative !bottom-0 mt-8 flex justify-center gap-2"></div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/evenements")}
            className="inline-flex items-center px-8 py-3 border-2 border-[#8B4513] text-[#8B4513] font-medium rounded-full hover:bg-[#8B4513] hover:text-white transition-all duration-300"
          >
            {t("view_all_events")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
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
