import { useTranslation } from "react-i18next"
import Footer from "./Footer"
import theater3 from "../assets/theater3.jpg"
import library from "../assets/library.jpg"
import atelierTheater from "../assets/atelier-theater.jpg"
import music from "../assets/music.jpg"
import art from "../assets/art.jpeg"
import danse from "../assets/danse.jpg"
import event1 from "../assets/event1.jpg"
import theater4 from "../assets/theater4.jpg"

export default function Gallery() {
  const { t } = useTranslation();

  const images = [
    {
      src: theater3,
      altKey: "gallery_theater_room",
      categoryKey: "gallery_category_spaces"
    },
    {
      src: library,
      altKey: "gallery_library",
      categoryKey: "gallery_category_spaces"
    },
    {
      src: atelierTheater,
      altKey: "gallery_theater_workshop",
      categoryKey: "gallery_category_workshops"
    },
    {
      src: music,
      altKey: "gallery_music_studio",
      categoryKey: "gallery_category_spaces"
    },
    {
      src: art,
      altKey: "gallery_art_workshop",
      categoryKey: "gallery_category_workshops"
    },
    {
      src: danse,
      altKey: "gallery_dance_room",
      categoryKey: "gallery_category_spaces"
    },
    {
      src: event1,
      altKey: "gallery_cultural_event",
      categoryKey: "gallery_category_events"
    },
    {
      src: theater4,
      altKey: "gallery_theater_performance",
      categoryKey: "gallery_category_events"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-[#8B4513] text-center mb-12 relative">
            {t('gallery_title')}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#8B4513] rounded-full"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-lg aspect-square cursor-pointer transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              >
                <img
                  src={image.src}
                  alt={t(image.altKey)}
                  className="w-full h-full object-cover rounded-lg transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                  <span className="text-white/70 text-sm mb-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    {t(image.categoryKey)}
                  </span>
                  <h3 className="text-white text-xl font-semibold transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    {t(image.altKey)}
                  </h3>
                  <div className="h-0 group-hover:h-px bg-white/30 my-3 transition-all duration-500 delay-300"></div>
                  <button className="opacity-0 group-hover:opacity-100 transition-all duration-500 delay-400 bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-md hover:bg-white/30 transform translate-y-4 group-hover:translate-y-0">
                    {t('gallery_view_more')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

