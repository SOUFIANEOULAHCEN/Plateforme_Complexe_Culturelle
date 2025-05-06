import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import theater3 from "../assets/theater3.jpg";
import atelierTheater from "../assets/atelier-theater.jpg";
import library from "../assets/library.jpg";
import event1 from "../assets/event1.jpg";

const slides = [
  {
    image: theater3,
    title: "Complexe Culturel de Ouarzazate",
    description: "Un espace dédié à l'art et la culture",
  },
  {
    image: atelierTheater,
    title: "Découvrez nos ateliers",
    description: "Des activités pour tous les âges",
  },
  {
    image: library,
    title: "Notre bibliothèque",
    description: "Un espace de savoir et de découverte",
  },
  {
    image: event1,
    title: "Événements culturels",
    description: "Des spectacles et expositions toute l'année",
  },
];

const Slider = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]}
      effect="fade"
      spaceBetween={0}
      slidesPerView={1}
      navigation={true}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      autoplay={{
        delay: 1500,
        disableOnInteraction: false,
      }}
      loop={true}
      className="h-[600px]"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index} className="relative">
          <div className="absolute inset-0 bg-black/30" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-[600px] object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-5xl font-bold mb-6 font-serif">
              {slide.title}
            </h1>
            <p className="text-xl mb-10">
              {slide.description}
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => scrollToSection("about")}
                className="px-8 py-3 bg-[#8B4513] text-white rounded-md hover:bg-[#6f3610] transition-colors font-medium"
              >
                En savoir plus
              </button>
              {index === 0 && (
                <button
                  onClick={() => scrollToSection("events")}
                  className="px-8 py-3 bg-white text-[#8B4513] rounded-md hover:bg-gray-100 transition-colors font-medium"
                >
                  Voir les événements
                </button>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
