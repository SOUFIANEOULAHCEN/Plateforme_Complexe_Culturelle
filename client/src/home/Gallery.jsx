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
import { useState } from "react"

export default function Gallery() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');

  const images = [
    {
      src: theater3,
      altKey: "gallery_theater_room",
      categoryKey: "gallery_category_spaces",
      category: 'spaces'
    },
    {
      src: library,
      altKey: "gallery_library",
      categoryKey: "gallery_category_spaces",
      category: 'spaces'
    },
    {
      src: atelierTheater,
      altKey: "gallery_theater_workshop",
      categoryKey: "gallery_category_workshops",
      category: 'workshops'
    },
    {
      src: music,
      altKey: "gallery_music_studio",
      categoryKey: "gallery_category_spaces",
      category: 'spaces'
    },
    {
      src: art,
      altKey: "gallery_art_workshop",
      categoryKey: "gallery_category_workshops",
      category: 'workshops'
    },
    {
      src: danse,
      altKey: "gallery_dance_room",
      categoryKey: "gallery_category_spaces",
      category: 'spaces'
    },
    {
      src: event1,
      altKey: "gallery_cultural_event",
      categoryKey: "gallery_category_events",
      category: 'events'
    },
    {
      src: theater4,
      altKey: "gallery_theater_performance",
      categoryKey: "gallery_category_events",
      category: 'events'
    }
  ]

  const categories = [
    { id: 'all', labelKey: 'gallery_all_categories' },
    { id: 'spaces', labelKey: 'gallery_category_spaces' },
    { id: 'workshops', labelKey: 'gallery_category_workshops' },
    { id: 'events', labelKey: 'gallery_category_events' }
  ];

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F5] to-[#f5ece4]">
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-[#8B4513] text-center mb-6 relative inline-block">
              {t('gallery_title')}
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#8B4513] transform translate-y-2"></span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {t('gallery_subtitle')}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-[#8B4513] text-white shadow-md'
                    : 'bg-white text-[#8B4513] hover:bg-[#8B4513]/10 border border-[#8B4513]/20'
                }`}
              >
                {t(category.labelKey)}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-lg aspect-square cursor-pointer transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              >
                <img
                  src={image.src}
                  alt={t(image.altKey)}
                  className="w-full h-full object-cover rounded-xl transition-all duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                  <span className="text-white/70 text-sm mb-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    {t(image.categoryKey)}
                  </span>
                  <h3 className="text-white text-xl font-semibold transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    {t(image.altKey)}
                  </h3>
                  <div className="h-0 group-hover:h-px bg-white/30 my-3 transition-all duration-500 delay-300"></div>
                  <button 
                    className="opacity-0 group-hover:opacity-100 transition-all duration-500 delay-400 bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-md hover:bg-white/30 transform translate-y-4 group-hover:translate-y-0"
                    aria-label={`View ${t(image.altKey)}`}
                  >
                    {t('gallery_view_more')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {t('gallery_no_images')}
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}