import { useTranslation } from "react-i18next"
import Footer from "../Footer"
import bibliotheque from "../../assets/img/imgAtelier/bibliotheque.jfif"
import theatre from "../../assets/img/imgAtelier/theatre.jpg"
import musique from "../../assets/img/imgAtelier/musique.jpg"
import pientre from "../../assets/img/imgAtelier/pientre.jpeg"
import informatique from "../../assets/img/imgAtelier/informatique.jpg"
import etrangere from "../../assets/img/imgAtelier/etrangere.jpg"
import prof2 from "../../assets/img/imgAtelier/prof2.jpg"
import prof5 from "../../assets/img/imgAtelier/prof5.jpg"
import prof11 from "../../assets/img/imgAtelier/prof11.jpg"
import prof3 from "../../assets/img/imgAtelier/prof3.jpg"
import prof6 from "../../assets/img/imgAtelier/prof6.jpg"
import Image_de_centre from "../../assets/img/imgAtelier/Image_de_centre.jpeg"

function Atelier() {
  const { t } = useTranslation()

  // Données pour les ateliers
  const items = [
    {
      titleKey: "workshop_library_title",
      descriptionKey: "workshop_library_description",
      image: bibliotheque,
    },
    {
      titleKey: "workshop_theater_title",
      descriptionKey: "workshop_theater_description",
      image: theatre,
    },
    {
      titleKey: "workshop_music_title",
      descriptionKey: "workshop_music_description",
      image: musique,
    },
    {
      titleKey: "workshop_art_title",
      descriptionKey: "workshop_art_description",
      image: pientre,
    },
    {
      titleKey: "workshop_computer_title",
      descriptionKey: "workshop_computer_description",
      image: informatique,
    },
    {
      titleKey: "workshop_language_title",
      descriptionKey: "workshop_language_description",
      image: etrangere,
    },
  ]

  // Données pour l'équipe
  const teamMembers = [
    {
      name: "Hafsa Stifa",
      roleKey: "workshop_language_role",
      image: prof2,
    },
    {
      name: "Mohammed Louahi",
      roleKey: "workshop_art_role",
      image: prof11,
    },
    {
      name: "Meryem Elkhyat",
      roleKey: "workshop_theater_role",
      image: prof11,
    },
    {
      name: "Soufian Oulahssane",
      roleKey: "workshop_music_role",
      image: prof5,
    },
    {
      name: "Hafsa Loukili",
      roleKey: "workshop_art_role",
      image: prof3,
    },
    {
      name: "Imad Dalal",
      roleKey: "workshop_computer_role",
      image: prof6,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F9F5F0] to-[#F0E6D8]">
      {/* Section Hero */}
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={Image_de_centre || "/placeholder.svg"}
            alt={t("workshops_hero_alt")}
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
          <div className="max-w-4xl animate-fade-in-up">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl">{t("workshops_title")}</h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">{t("workshops_subtitle")}</p>
            <div className="flex justify-center gap-4">
              <a
                href="/"
                className="inline-block bg-[#8B4513] hover:bg-[#6e3d20] text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t("home")}
              </a>
              <a
                href="/ateliers"
                className="inline-block bg-transparent border-2 border-white hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
              >
                {t("workshops")}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section Ateliers */}
      <section id="ateliers" className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative mb-16 text-center">
            <h1 className="text-7xl md:text-8xl lg:text-[8rem] font-bold select-none text-white/80 [-webkit-text-stroke:2px_rgba(139,69,19,0.3)]">
              {t("workshops_title")}
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#8B4513]">
              {t("workshops_title")}
            </h2>
          </div>

          <p className="text-lg text-[#6B4D3D] text-center max-w-3xl mx-auto mb-12">{t("workshops_description")}</p>

          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={t(item.titleKey)}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white text-lg font-medium translate-y-4 hover:translate-y-0 transition-transform duration-300">
                        {t(item.titleKey)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#8B4513] mb-3">{t(item.titleKey)}</h3>
                    <p className="text-[#6B4D3D] mb-4">{t(item.descriptionKey)}</p>
                    <button className="px-4 py-2 text-sm font-medium text-[#8B4513] border border-[#8B4513] rounded-lg hover:bg-[#8B4513] hover:text-white transition-colors duration-300">
                      {t("learn_more")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Équipe */}
      <section id="equipe" className="py-20 bg-[#8B4513]/10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-[#8B4513]">{t("workshops_team_title")}</h2>
          <p className="text-lg text-[#6B4D3D] text-center max-w-3xl mx-auto mb-12">
            {t("workshops_team_description")}
          </p>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-[#8B4513] mb-1">{member.name}</h3>
                    <p className="text-[#6B4D3D] mb-4">{t(member.roleKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Atelier
