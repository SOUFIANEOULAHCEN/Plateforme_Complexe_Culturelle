import { useTranslation } from "react-i18next"
import atelierTheater from "../assets/atelier-theater.jpg"
import library from "../assets/library.jpg"
import music from "../assets/music.jpg"
import art from "../assets/art.jpeg"

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 space-y-6">
            <div className="relative inline-block">
              <h2 className="text-4xl font-serif text-[#8B4513] relative z-10">
                {t('about_title')}
              </h2>
              <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#8B4513]/20"></div>
            </div>
            <p className="text-[#8B4513] leading-relaxed text-lg">
              {t('about_description')}
            </p>
            <div className="pt-6">
              <button 
                className="bg-[#8B4513] text-white px-8 py-3 rounded-md hover:bg-[#6f3610] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('about_read_more')}
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <img
                src={atelierTheater}
                alt={t('workshops')}
                className="w-full h-[300px] object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
              <img
                src={library}
                alt={t('library')}
                className="w-full h-[200px] object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-6 pt-12">
              <img
                src={music}
                alt={t('music')}
                className="w-full h-[200px] object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
              <img
                src={art}
                alt={t('art')}
                className="w-full h-[300px] object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

