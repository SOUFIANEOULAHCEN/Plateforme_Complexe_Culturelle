import { useTranslation } from "react-i18next"
import Footer from "../Footer"
import theater5 from "../../assets/theater5.jpg"
import theater from "../../assets/theater.jpeg"
import art from "../../assets/art.jpeg"
import library from "../../assets/library.jpg"
import computer from "../../assets/computer.jpeg"
import music from "../../assets/music.jpg"
import meeting from "../../assets/meeting.jpg"
import creative from "../../assets/creative.jfif"
import { FaArrowRight } from "react-icons/fa"

const Espaces = () => {
  const { t } = useTranslation()

  const espaces = [
    {
      id: 1,
      titleKey: "space_theater_hall",
      descriptionKey: "space_theater_description",
      image: theater,
    },
    {
      id: 2,
      titleKey: "space_exhibition_hall",
      descriptionKey: "space_exhibition_description",
      image: art,
    },
    {
      id: 3,
      titleKey: "space_library",
      descriptionKey: "space_library_description",
      image: library,
    },
    {
      id: 4,
      titleKey: "space_computer_room",
      descriptionKey: "space_computer_description",
      image: computer,
    },
    {
      id: 5,
      titleKey: "space_music_room",
      descriptionKey: "space_music_description",
      image: music,
    },
    {
      id: 6,
      titleKey: "space_meeting_room",
      descriptionKey: "space_meeting_description",
      image: meeting,
    },
    {
      id: 7,
      titleKey: "space_cultural_cafe",
      descriptionKey: "space_cafe_description",
      image: creative,
    },
    {
      id: 8,
      titleKey: "space_painting_room",
      descriptionKey: "space_painting_description",
      image: art,
    },
  ]

  return (
    <div className="w-full bg-gradient-to-b from-[#FDF8F5] to-white">
      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={theater5}
            alt="CCO Ouarzazate"
            className="h-full w-full object-cover transition-transform duration-1000 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
          <div className="max-w-4xl transform transition-all duration-700 hover:scale-[1.02]">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl font-serif">
              {t("spaces")}
            </h1>
            <p className="text-xl text-white/90 md:text-2xl mb-8">
              {t("spaces_subtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/"
                className="inline-flex items-center bg-[#8B4513] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#6e3d20] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                {t("home")}
              </a>
              <a
                href="/espaces"
                className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                {t("spaces")}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Spaces Grid Section */}
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#8B4513] font-serif relative inline-block">
              {t("our_spaces")}
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#8B4513] transform translate-y-2"></span>
            </h2>
            <p className="text-lg text-[#8B4513] max-w-3xl mx-auto">
              {t("spaces_intro")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {espaces.map((espace) => (
              <div 
                key={espace.id}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 h-[400px]"
              >
                <img
                  src={espace.image}
                  alt={t(espace.titleKey)}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{t(espace.titleKey)}</h3>
                  <p className="text-white/90 mb-4 line-clamp-3">{t(espace.descriptionKey)}</p>
                  <button className="flex items-center justify-center gap-2 bg-[#8B4513] text-white font-semibold py-2 px-6 rounded-full hover:bg-[#6e3d20] transition-all duration-300 transform group-hover:translate-x-2 w-max">
                    {t("reserve")}
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alternative View for Smaller Screens */}
      <div className="py-10 md:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {espaces.map((espace) => (
              <div
                key={espace.id}
                className="rounded-2xl bg-white shadow-xl overflow-hidden"
              >
                <div className="relative h-48 w-full">
                  <img
                    src={espace.image}
                    alt={t(espace.titleKey)}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-[#8B4513]">
                    {t(espace.titleKey)}
                  </h3>
                  <p className="text-[#8B4513]/90 mb-4">
                    {t(espace.descriptionKey)}
                  </p>
                  <button className="flex items-center justify-center gap-2 bg-[#8B4513] text-white font-semibold py-2 px-6 rounded-full hover:bg-[#6e3d20] transition-all duration-300 w-full">
                    {t("reserve")}
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Espaces