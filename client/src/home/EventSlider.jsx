"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import theater4 from "../assets/theater4.jpg"
import art from "../assets/art.jpeg"
import music from "../assets/music.jpg"
import danse from "../assets/danse.jpg"
import library from "../assets/library.jpg"

const events = [
  {
    id: 1,
    title: "Festival de Théâtre",
    image: theater4,
    date: "15-20 Mai 2025",
    description: "Une semaine dédiée aux arts dramatiques"
  },
  {
    id: 2,
    title: "Exposition d'Art",
    image: art,
    date: "1-10 Juin 2025",
    description: "Découvrez les talents locaux"
  },
  {
    id: 3,
    title: "Concert de Musique",
    image: music,
    date: "25 Juin 2025",
    description: "Une soirée musicale exceptionnelle"
  },
  {
    id: 4,
    title: "Atelier de Danse",
    image: danse,
    date: "2-3 Juillet 2025",
    description: "Initiation aux danses traditionnelles"
  },
  {
    id: 5,
    title: "Rencontre Littéraire",
    image: library,
    date: "15 Juillet 2025",
    description: "Échanges avec des auteurs locaux"
  }
]

export default function EventSlider() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif text-[#8B4513] text-center mb-12">Événements à venir</h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="event-slider"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-white text-xl font-semibold">{event.title}</h3>
                    <p className="text-white/80">{event.date}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[#8B4513] mb-4">{event.description}</p>
                  <button className="w-full bg-[#8B4513] text-white py-2 px-4 rounded-md hover:bg-[#6f3610] transition duration-300">
                    En savoir plus
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}