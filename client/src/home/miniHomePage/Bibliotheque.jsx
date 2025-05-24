import { useTranslation } from "react-i18next"
import Footer from "../Footer"
import complexeCulturel from "../../assets/img/imgAtelier/Image_de_centre.jpeg"
import sahihBukhari from "../../assets/img/IMGCCO/sahih_bukhari.jpeg"
import islamicArt from "../../assets/img/IMGCCO/Islamic Art and Quotes.jpeg"
import tafsirMukhtasar from "../../assets/img/IMGCCO/كتاب المصباح المنير مختصر تفسير ابن كثير….jpeg"
import lesMiserables from "../../assets/img/IMGCCO/Los miserables - Wikipedia, la enciclopedia libre.jpeg"
import pereGoriot from "../../assets/img/IMGCCO/Le Père Goriot.jpeg"
import oscarDameRose from "../../assets/img/IMGCCO/Oscar et la dame rose (ebook), Eric-Emmanuel Schmitt _ 9782226197368 _ Boeken _ bol_com.jpeg"

const books = [
  {
    id: 1,
    title: "صحيح البخاري",
    author: "الإمام البخاري",
    cover: sahihBukhari,
  },
  {
    id: 2,
    title: "الرحيق المختوم",
    author: "صفى الرحمن المباركفورى",
    cover: islamicArt,
  },
  {
    id: 3,
    title: "تفسير مختصر",
    author: "ابن كثير",
    cover: tafsirMukhtasar,
  },
  {
    id: 4,
    title: "Les Misérables",
    author: "Victor Hugo",
    cover: lesMiserables,
  },
  {
    id: 5,
    title: "Le Père Goriot",
    author: "BALZAC",
    cover: pereGoriot,
  },
  {
    id: 6,
    title: "Oscar et la Dame rose",
    author: 'Éric-Emmanuel Schmitt',
    cover: oscarDameRose,
  },
]

export default function Bibliotheque() {
  const { t } = useTranslation()

  return (
    <main>
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={complexeCulturel}
            alt="CCO Ouarzazate"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="px-4">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">{t("library")}</h1>
            <div className="mt-6">
              <a
                href="/"
                className="inline-block bg-[#8B4513] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#6e3d20] transition duration-300"
              >
                {t("home")}
              </a>
              <a
                href="/bibliotheque"
                className="ml-4 inline-block bg-[#8B4513] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#6e3d20] transition duration-300"
              >
                {t("library")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />

      <div className="relative mb-16 text-center">
        <h1 className="text-[8rem] font-bold select-none [text-shadow:_1px_1px_#8B4513] [-webkit-text-stroke:_2px_rgba(139,69,19,0.5)] text-white">
          {t("library")}
        </h1>
        <h2
          className="text-5xl font-bold absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ color: "#8B4513" }}
        >
          {t("library")}
        </h2>
      </div>

      <p className="max-w-3xl mx-auto text-center text-muted-foreground mb-11 -mt-8" style={{ color: "#8B4513" }}>
        {t("library_description")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {books.map((book) => (
          <div key={book.id} className="group overflow-hidden bg-white shadow-lg rounded-lg">
            <div className="relative overflow-hidden">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                  <p className="text-sm text-gray-300 mb-4">{book.author}</p>
                  <button className="px-4 py-2 bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all">
                    {t("read_more")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <br />
      <br />
      <Footer />
    </main>
  )
}
