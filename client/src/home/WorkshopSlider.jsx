"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const workshops = [
  {
    id: 1,
    title: "Atelier de Peinture",
    image: "/assets/art.jpeg",
    description: "Découvrez l'art de la peinture",
  },
  {
    id: 2,
    title: "Atelier de Musique",
    image: "/assets/music.jpg",
    description: "Apprenez à jouer des instruments",
  },
  {
    id: 3,
    title: "Atelier de Théâtre",
    image: "/assets/atelier-theater.jpg",
    description: "Explorez l'art dramatique",
  },
  {
    id: 4,
    title: "Atelier de Danse",
    image: "/assets/danse.jpg",
    description: "Initiez-vous à la danse",
  },
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
              <a href="#" className="block">
                <div className="relative group overflow-hidden rounded-lg">
                  <img
                    src={workshop.image || "/placeholder.svg"}
                    alt={workshop.title}
                    className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white text-xl font-semibold mb-2">{workshop.title}</h3>
                    <p className="text-white/90">{workshop.description}</p>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

