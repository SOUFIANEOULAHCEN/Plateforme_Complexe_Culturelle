import { useTranslation } from "react-i18next"
import Footer from "../Footer"
import complexeCulturel from "../../assets/img/imgAtelier/Image_de_centre.jpeg"
import sahihBukhari from "../../assets/img/IMGCCO/sahih_bukhari.jpeg"
import islamicArt from "../../assets/img/IMGCCO/Islamic Art and Quotes.jpeg"
import tafsirMukhtasar from "../../assets/img/IMGCCO/كتاب المصباح المنير مختصر تفسير ابن كثير….jpeg"
import lesMiserables from "../../assets/img/IMGCCO/Los miserables - Wikipedia, la enciclopedia libre.jpeg"
import pereGoriot from "../../assets/img/IMGCCO/Le Père Goriot.jpeg"
import oscarDameRose from "../../assets/img/IMGCCO/Oscar et la dame rose (ebook), Eric-Emmanuel Schmitt _ 9782226197368 _ Boeken _ bol_com.jpeg"
import { FaArrowRight, FaBookOpen } from "react-icons/fa"

const books = [
  {
    id: 1,
    title: "صحيح البخاري",
    author: "الإمام البخاري",
    cover: sahihBukhari,
    category: "Islamic"
  },
  {
    id: 2,
    title: "الرحيق المختوم",
    author: "صفى الرحمن المباركفورى",
    cover: islamicArt,
    category: "Islamic"
  },
  {
    id: 3,
    title: "تفسير مختصر",
    author: "ابن كثير",
    cover: tafsirMukhtasar,
    category: "Islamic"
  },
  {
    id: 4,
    title: "Les Misérables",
    author: "Victor Hugo",
    cover: lesMiserables,
    category: "Literature"
  },
  {
    id: 5,
    title: "Le Père Goriot",
    author: "BALZAC",
    cover: pereGoriot,
    category: "Literature"
  },
  {
    id: 6,
    title: "Oscar et la Dame rose",
    author: 'Éric-Emmanuel Schmitt',
    cover: oscarDameRose,
    category: "Literature"
  },
]

export default function Bibliotheque() {
  const { t } = useTranslation()

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
              {t("library")}
            </h1>
            <p className="text-xl text-white/90 md:text-2xl mb-8">
              {t("library_subtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/"
                className="inline-flex items-center bg-[#8B4513] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#6e3d20] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                {t("home")}
              </a>
              <a
                href="/bibliotheque"
                className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                {t("library")}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Library Intro Section */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <FaBookOpen className="h-[20rem] w-[20rem] text-[#FDF8F5]" />
        </div>
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-[#8B4513] font-serif relative inline-block">
            {t("library_title")}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#8B4513] transform translate-y-2"></span>
          </h2>
          <p className="text-lg text-[#8B4513] max-w-3xl mx-auto">
            {t("library_description")}
          </p>
        </div>
      </div>

      {/* Books Grid Section */}
      <div className="py-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <div 
                key={book.id}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 h-[500px]"
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="absolute top-4 right-4 bg-[#8B4513] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {book.category}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{book.title}</h3>
                  <p className="text-white/90 mb-4">{book.author}</p>
                  <button className="flex items-center justify-center gap-2 bg-[#8B4513] text-white font-semibold py-2 px-6 rounded-full hover:bg-[#6e3d20] transition-all duration-300 transform group-hover:translate-x-2 w-max">
                    {t("read_more")}
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alternative View for Smaller Screens */}
      <div className="py-10 md:hidden pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {books.map((book) => (
              <div
                key={book.id}
                className="rounded-2xl bg-white shadow-xl overflow-hidden"
              >
                <div className="relative h-64 w-full">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[#8B4513] text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {book.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-[#8B4513]">
                    {book.title}
                  </h3>
                  <p className="text-[#8B4513]/90 mb-4">
                    {book.author}
                  </p>
                  <button className="flex items-center justify-center gap-2 bg-[#8B4513] text-white font-semibold py-2 px-6 rounded-full hover:bg-[#6e3d20] transition-all duration-300 w-full">
                    {t("read_more")}
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