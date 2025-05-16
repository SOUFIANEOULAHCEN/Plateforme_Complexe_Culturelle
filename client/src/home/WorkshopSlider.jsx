"use client"

import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import { useTranslation } from "react-i18next"
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
    titleKey: "workshop_theater_title",
    descriptionKey: "workshop_theater_description",
    image: atelierTheater,
    scheduleKey: "workshop_schedule_saturday",
    duration: "2 heures",
    levelKey: "workshop_level_all"
  },
  {
    id: 2,
    titleKey: "workshop_art_title",
    descriptionKey: "workshop_art_description",
    image: art,
    scheduleKey: "workshop_schedule_wednesday_sunday",
    duration: "1h30",
    levelKey: "workshop_level_beginner_advanced"
  },
  {
    id: 3,
    titleKey: "workshop_music_title",
    descriptionKey: "workshop_music_description",
    image: music,
    scheduleKey: "workshop_schedule_monday_thursday",
    duration: "1 heure",
    levelKey: "workshop_level_all"
  },
  {
    id: 4,
    titleKey: "workshop_dance_title",
    descriptionKey: "workshop_dance_description",
    image: danse,
    scheduleKey: "workshop_schedule_tuesday_friday",
    duration: "1h30",
    levelKey: "workshop_level_beginner"
  }
]

export default function WorkshopSlider() {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-[#FDF8F5]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif text-[#8B4513] text-center mb-12">{t('workshops_title')}</h2>
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
                    alt={t(workshop.titleKey)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white text-xl font-bold">{t(workshop.titleKey)}</h3>
                    <p className="text-white/90 text-sm">{t(workshop.descriptionKey)}</p>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold text-[#8B4513] mb-2">{t(workshop.titleKey)}</h3>
                  <div className="space-y-2 text-[#8B4513]/80">
                    <p className="flex items-center">
                      <span className="font-medium mr-2">{t('workshop_schedule')}:</span>
                      {t(workshop.scheduleKey)}
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-2">{t('workshop_duration')}:</span>
                      {workshop.duration}
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-2">{t('workshop_level')}:</span>
                      {t(workshop.levelKey)}
                    </p>
                  </div>
                  <button className="mt-4 w-full bg-[#8B4513] text-white py-2 px-4 rounded-md hover:bg-[#6f3610] transition duration-300">
                    {t('workshops_join')}
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

