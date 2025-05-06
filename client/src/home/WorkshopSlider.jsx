"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import atelierTheater from "../assets/atelier-theater.jpg"
import art from "../assets/art.jpeg"
import music from "../assets/music.jpg"
import danse from "../assets/danse.jpg"

const workshops = [
  {
    id: 1,
    title: "Atelier de Théâtre",
    image: atelierTheater,
    description: "Explorez l'art dramatique",
    schedule: "Tous les samedis",
    duration: "2 heures",
    level: "Tous niveaux"
  },
  {
    id: 2,
    title: "Atelier de Peinture",
    image: art,
    description: "Découvrez l'art de la peinture",
    schedule: "Mercredis et dimanches",
    duration: "1h30",
    level: "Débutant à avancé"
  },
  {
    id: 3,
    title: "Atelier de Musique",
    image: music,
    description: "Apprenez à jouer des instruments",
    schedule: "Lundis et jeudis",
    duration: "1 heure",
    level: "Tous niveaux"
  },
  {
    id: 4,
    title: "Atelier de Danse",
    image: danse,
    description: "Initiez-vous à la danse",
    schedule: "Mardis et vendredis",
    duration: "1h30",
    level: "Débutant"
  }
]

export default function WorkshopSlider() {
  return (
    <section className="py-16 bg-[#FDF8F5]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif text-[#8B4513] text-center mb-12">Nos Ateliers</h2>
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
            1280: { slidesPerView: 4 },
          }}
          className="workshop-slider"
        >
          {workshops.map((workshop) => (
            <SwiperSlide key={workshop.id}>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg group transform transition duration-300 hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white text-xl font-bold">{workshop.title}</h3>
                    <p className="text-white/90 text-sm">{workshop.description}</p>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-[#8B4513] mb-2">{workshop.title}</h3>
                  <div className="space-y-2 text-[#8B4513]/80">
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Horaire:</span>
                      {workshop.schedule}
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Durée:</span>
                      {workshop.duration}
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Niveau:</span>
                      {workshop.level}
                    </p>
                  </div>
                  <button className="mt-4 w-full bg-[#8B4513] text-white py-2 px-4 rounded-md hover:bg-[#6f3610] transition duration-300">
                    S'inscrire
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

