import { FaEye, FaBullseye, FaBuilding, FaQuoteLeft } from "react-icons/fa"
import { useTranslation } from "react-i18next"
import Footer from "../Footer"
import complexeCulturel from "../../assets/img/IMGCCO/complexeculturel.jpg"
import ouarzazate from "../../assets/img/IMGCCO/ouarzazate.webp"
import teamMember1 from "../../assets/img/IMGCCO/Нужен профессиональный деловой портрет_ Выезжаю в офис_.jpeg"
import teamMember2 from "../../assets/img/IMGCCO/Photographie _ Portrait corporate femme avec fond clair.jpeg"
import teamMember3 from "../../assets/img/IMGCCO/bf4cf03b-f6fa-48f6-9e20-01b37312d549.jpeg"
import teamMember4 from "../../assets/img/IMGCCO/ba64a0ab-62a7-455d-8dff-6b0f4e58f7f3.jpeg"
import teamMember5 from "../../assets/img/IMGCCO/ea63fa89-026a-4ff4-8691-02db157a6cb2.jpeg"
import director from "../../assets/img/IMGCCO/fc213b55-3fdd-4b20-a0b6-478bf8174c83.jpeg"

export default function CCO() {
  const { t } = useTranslation()

  const team = [
    {
      name: "Ahmed Alami",
      role: "Responsable Événements",
      image: teamMember1,
    },
    {
      name: "Fatima Zahra",
      role: "Coordinatrice Culturelle",
      image: teamMember2,
    },
    {
      name: "Karim Mansouri",
      role: "Technicien Audiovisuel",
      image: teamMember3,
    },
    {
      name: "Nadia Benani",
      role: "Responsable Communication",
      image: teamMember4,
    },
    {
      name: "Youssef Tahiri",
      role: "Administrateur",
      image: teamMember5,
    },
  ]

  return (
    <div className="w-full bg-gradient-to-b from-[#FDF8F5] to-white">
      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={complexeCulturel}
            alt="CCO Ouarzazate"
            className="h-full w-full object-cover transition-transform duration-1000 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
          <div className="max-w-4xl transform transition-all duration-700 hover:scale-[1.02]">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl font-serif">
              {t("cco_title")}
            </h1>
            <p className="text-xl text-white/90 md:text-2xl mb-8">
              {t("cco_subtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/"
                className="inline-flex items-center bg-[#8B4513] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#6e3d20] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                {t("home")}
              </a>
              <a
                href="/cco"
                className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                {t("cco")}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Complex Description Section */}
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="flex justify-center rounded-2xl overflow-hidden shadow-2xl">
              <video
                src="/src/assets/img/IMGCCO/video5798505470813541954.mp4"
                width={600}
                height={600}
                controls
                autoPlay
                muted
                loop
                className="w-full h-auto rounded-2xl transition-transform duration-500 hover:scale-[1.02]"
              >
                {t("video_not_supported")}
              </video>
            </div>
            <div className="text-center md:text-left">
              <h2 className="mb-6 text-3xl md:text-4xl font-bold text-[#8B4513] font-serif relative inline-block">
                {t("cco_complex_title")}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#8B4513] transform translate-y-2"></span>
              </h2>
              <p className="text-lg text-[#8B4513] mb-4">
                {t("cco_complex_description")}
              </p>
              <p className="text-lg text-[#8B4513]">
                {t("cco_complex_description_2")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div className="py-20 bg-[#FDF8F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="group rounded-2xl bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[#8B4513]/10">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF8F5] p-4 text-[#8B4513] transition-all duration-300 group-hover:bg-[#8B4513] group-hover:text-white">
                <FaEye className="h-8 w-8" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-[#8B4513]">
                {t("our_vision")}
              </h2>
              <p className="text-[#8B4513]/90">
                {t("vision_description")}
              </p>
            </div>

            <div className="group rounded-2xl bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[#8B4513]/10">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF8F5] p-4 text-[#8B4513] transition-all duration-300 group-hover:bg-[#8B4513] group-hover:text-white">
                <FaBullseye className="h-8 w-8" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-[#8B4513]">
                {t("our_mission")}
              </h2>
              <p className="text-[#8B4513]/90">
                {t("mission_description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Municipality Section */}
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF8F5] p-4 text-[#8B4513]">
                <FaBuilding className="h-8 w-8" />
              </div>
              <h2 className="mb-6 text-3xl md:text-4xl font-bold text-[#8B4513] font-serif relative inline-block">
                {t("municipality_title")}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#8B4513] transform translate-y-2"></span>
              </h2>
              <p className="text-lg text-[#8B4513]">
                {t("municipality_description")}
              </p>
            </div>
            <div className="flex justify-center rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={ouarzazate}
                alt="Logo Municipalité"
                className="w-full h-auto rounded-2xl transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-[#FDF8F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#8B4513] font-serif relative inline-block">
              {t("our_team")}
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#8B4513] transform translate-y-2"></span>
            </h2>
            <p className="text-lg text-[#8B4513] max-w-3xl mx-auto">
              {t("team_description")}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {team.map((member, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-white/90">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Director Section */}
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="flex justify-center rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={director}
                alt="Directeur du Complexe Culturel Ouarzazate"
                className="w-full h-auto rounded-2xl transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
            <div className="relative">
              <FaQuoteLeft className="absolute -top-8 -left-8 h-16 w-16 text-[#8B4513]/10" />
              <h2 className="mb-6 text-3xl md:text-4xl font-bold text-[#8B4513] font-serif relative inline-block">
                {t("director_title")}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#8B4513] transform translate-y-2"></span>
              </h2>
              <p className="text-lg text-[#8B4513] mb-4">
                {t("director_description")}
              </p>
              <p className="text-lg text-[#8B4513]">
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