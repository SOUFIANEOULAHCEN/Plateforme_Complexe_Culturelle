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
            <h2 className="text-4xl font-serif text-[#8B4513]">
              {t('about_title')}
            </h2>
            <p className="text-[#8B4513] leading-relaxed">
              {t('about_description')}
            </p>
            <button className="border-2 border-[#8B4513] text-[#8B4513] px-8 py-2 rounded-md hover:bg-[#8B4513] hover:text-white transition-colors duration-300">
              {t('about_read_more')}
            </button>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <img
                src={atelierTheater}
                alt={t('workshops')}
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
              <img
                src={library}
                alt={t('library')}
                className="w-full h-[400px] object-cover rounded-lg shadow-lg transform translate-y-10"
              />
            </div>
            <div className="space-y-6">
              <img
                src={music}
                alt={t('music')}
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
              <img
                src={art}
                alt={t('art')}
                className="w-full h-[400px] object-cover rounded-lg shadow-lg transform translate-y-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}