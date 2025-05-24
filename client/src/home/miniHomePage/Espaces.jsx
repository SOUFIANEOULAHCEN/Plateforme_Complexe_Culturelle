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
    <div className="w-full bg-white">
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={theater5}
            alt="CCO Ouarzazate"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="px-4">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">{t("spaces")}</h1>
            <div className="mt-6">
              <a
                href="/"
                className="inline-block bg-[#8B4513] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#6e3d20] transition duration-300"
              >
                {t("home")}
              </a>
              <a
                href="/espaces"
                className="ml-4 inline-block bg-[#8B4513] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#6e3d20] transition duration-300"
              >
                {t("spaces")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />

      <div className="mx-auto max-w-7xl px-4 py-16 bg-[#FDF8F5]">
        <div className="space-y-8">
          {espaces.map((espace, index) => (
            <div
              key={espace.id}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-6 bg-white rounded-lg shadow-lg overflow-hidden`}
            >
              <div className="relative w-96 h-96">
                <img
                  src={espace.image || "/placeholder.svg"}
                  alt={t(espace.titleKey)}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6 text-center">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-3 h-3 bg-[#824B26] rounded-full mr-2"></div>
                  <div className="w-full h-0.5 bg-[#824B26]"></div>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: "#824B26" }}>
                  {t(espace.titleKey)}
                </h3>
                <p className="text-gray-700" style={{ color: "#824B26" }}>
                  {t(espace.descriptionKey)}
                </p>
                <button className="bg-[#824B26] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#6e3d20] mt-4">
                  {t("reserve")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <br />
      <br />
      <Footer />
    </div>
  )
}

export default Espaces
