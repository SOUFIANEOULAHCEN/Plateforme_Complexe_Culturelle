import { FaEye, FaBullseye, FaBuilding } from "react-icons/fa"
import { useTranslation } from "react-i18next"
import Footer from "../Footer"
import theater5 from "../../assets/theater5.jpg"
import municipalite from "../../assets/municipalite.png"
import adminImg from "../../assets/img/admin_img.jpeg"

export default function CCO() {
  const { t } = useTranslation()

  const team = [
    {
      name: "Ahmed Alami",
      role: "Responsable Événements",
      image: adminImg,
    },
    {
      name: "Fatima Zahra",
      role: "Coordinatrice Culturelle",
      image: adminImg,
    },
    {
      name: "Karim Mansouri",
      role: "Technicien Audiovisuel",
      image: adminImg,
    },
    {
      name: "Nadia Benani",
      role: "Responsable Communication",
      image: adminImg,
    },
    {
      name: "Youssef Tahiri",
      role: "Administrateur",
      image: adminImg,
    },
  ]

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
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
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">{t("cco_title")}</h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-200">{t("cco_subtitle")}</p>
            <div className="mt-6">
              <a
                href="/"
                className="inline-block bg-[#8B4513] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#6e3d20] transition duration-300"
              >
                {t("home")}
              </a>
              <a
                href="/cco"
                className="ml-4 inline-block bg-[#8B4513] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#6e3d20] transition duration-300"
              >
                {t("cco")}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section Description du Complexe Culturel Ouarzazate */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-8 md:grid-cols-2">
            {/* Vidéo du Complexe */}
            <div className="flex justify-center">
              <video
                src="/src/assets/videos/complexe_culturel.mp4"
                width={600}
                height={600}
                controls
                autoPlay
                muted
                loop
                className="rounded-xl transition-all hover:scale-105"
              >
                {t("video_not_supported")}
              </video>
            </div>
            {/* Description */}
            <div className="text-center mx-auto">
              <h2 className="mb-6 text-3xl font-bold" style={{ color: "#8B4513" }}>
                {t("cco_complex_title")}
              </h2>
              <p className="text-gray-600" style={{ color: "#8B4513" }}>
                {t("cco_complex_description")}
              </p>
              <p className="mt-4 text-gray-600" style={{ color: "#8B4513" }}>
                {t("cco_complex_description_2")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Vision et Mission */}
      <div className="mx-auto max-w-7xl px-4 py-16 bg-[#FDF8F5]">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="group rounded-xl bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 inline-block rounded-full bg-white border-2 border-[#8B4513] p-3">
              <FaEye className="h-6 w-6" style={{ color: "#8B4513" }} />
            </div>
            <h2 className="mb-4 text-2xl font-bold" style={{ color: "#8B4513" }}>
              {t("our_vision")}
            </h2>
            <p className="text-gray-600" style={{ color: "#8B4513" }}>
              {t("vision_description")}
            </p>
          </div>

          <div className="group rounded-xl bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 inline-block rounded-full bg-white border-2 border-[#8B4513] p-3">
              <FaBullseye className="h-6 w-6 text-[#8B4513]" />
            </div>
            <h2 className="mb-4 text-2xl font-bold" style={{ color: "#8B4513" }}>
              {t("our_mission")}
            </h2>
            <p className="text-gray-600" style={{ color: "#8B4513" }}>
              {t("mission_description")}
            </p>
          </div>
        </div>
      </div>

      {/* Section Municipalité */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-block rounded-full bg-white border-2 border-[#824B26] p-3">
                <FaBuilding className="h-6 w-6" style={{ color: "#8B4513" }} />
              </div>
              <h2 className="mb-6 text-3xl font-bold" style={{ color: "#8B4513" }}>
                {t("municipality_title")}
              </h2>
              <p className="text-gray-600" style={{ color: "#8B4513" }}>
                {t("municipality_description")}
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src={municipalite}
                alt="Logo Municipalité"
                width={500}
                height={500}
                className="rounded-lg transition-all hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Équipe */}
      <div className="bg-[#FDF8F5] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold" style={{ color: "#824B26" }}>
            {t("our_team")}
          </h2>
          <p className="mb-12 text-center text-lg text-gray-600" style={{ color: "#824B26" }}>
            {t("team_description")}
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {team.map((member, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl bg-white shadow-lg">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={300}
                  height={400}
                  className="h-[400px] w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Directeur */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="flex justify-center">
              <img
                src="/src/assets/img/admin_img.jpeg"
                alt="Directeur du Complexe Culturel Ouarzazate"
                className="rounded-xl transition-all hover:scale-105"
                width={300}
                height={400}
              />
            </div>
            <div>
              <h2 className="mb-6 text-3xl font-bold" style={{ color: "#824B26" }}>
                {t("director_title")}
              </h2>
              <p className="text-gray-600" style={{ color: "#824B26" }}>
                {t("director_description")}
              </p>
              <p className="mt-4 text-gray-600" style={{ color: "#824B26" }}>
                {t("director_description_2")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
