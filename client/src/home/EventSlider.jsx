"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const events = [
  {
    id: 1,
    image: "/assets/event1.jpg",
    title: "Festival Tizouran",
    date: "20-21 Octobre 2024",
  },
  {
    id: 2,
    image: "/assets/event2.jpg",
    title: "Festival du Tapis",
    date: "15-20 Mai 2024",
  },
  {
    id: 3,
    image: "/assets/event3.jpg",
    title: "Festival Igrar",
    date: "8-10 Mai 2024",
  },
  {
    id: 4,
    image: "/assets/event4.jpg",
    title: "Festival D'ahwach",
    date: "24-26 Septembre 2024",
  },
  {
    id:5,
    image: "/assets/event5.jpg",
    title: "Festival Ayeed Asgas",
    date: "13-15 Janvier 2024",
  },
  {
    id:6,
    image: "/assets/event3.jpg",
    title: "Festival du Tapish",
    date: "24-26 Septembre 2024",
  },
]

export default function EventSlider() {
  return (
    <section className="py-16 bg-[#FDF8F5]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif text-[#8B4513] text-center mb-12">Événements</h2>
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
          className="event-slider"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <div className="relative group cursor-pointer">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-[400px] object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-10"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col items-center justify-center text-white">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p>{event.date}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

