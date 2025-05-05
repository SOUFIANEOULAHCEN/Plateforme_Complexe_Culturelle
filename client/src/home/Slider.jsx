import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Navigation, Pagination, Autoplay } from "swiper/modules"

const Slider = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      className="h-[700px]" // Updated height
    >
      <SwiperSlide className="relative">
        <img src="/assets/theater3.jpg" alt="Slide 1" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col text-center text-white p-6">
          <h1 className="text-4xl font-bold mb-4">Complexe Culturel de Ouarzazate</h1>
          <button
            className="px-6 py-3 bg-[#8B4513] text-white text-lg font-medium rounded-md shadow-md hover:bg-[#6f3610] transition duration-300 mt-4"
            onClick={() => alert('Réservation en cours...')}
          >
            Réserver
          </button>
        </div>
      </SwiperSlide>
      
      <SwiperSlide className="relative">
        <img src="/assets/atelier-theater.jpg" alt="Slide 2" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col text-center text-white p-6">
          <h1 className="text-4xl font-bold mb-4">Complexe Culturel de Ouarzazate</h1>
          <button
            className="px-6 py-3 bg-[#8B4513] text-white text-lg font-medium rounded-md shadow-md hover:bg-[#6f3610] transition duration-300 mt-4"
            onClick={() => alert('Réservation en cours...')}
          >
            Réserver
          </button>
        </div>
      </SwiperSlide>
      
      <SwiperSlide className="relative">
        <img src="/assets/theater5.jpg" alt="Slide 3" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col text-center text-white p-6">
          <h1 className="text-4xl font-bold mb-4">Complexe Culturel de Ouarzazate</h1>
          <button
            className="px-6 py-3 bg-[#8B4513] text-white text-lg font-medium rounded-md shadow-md hover:bg-[#dfc4b2] transition duration-300 mt-4"
           
          >
            Réserver
          </button>
        </div>
      </SwiperSlide>
    </Swiper>
  )
}

export default Slider
