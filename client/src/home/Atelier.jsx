import { useState, useEffect, useRef } from "react";
import Footer from "./Footer";
import { useTranslation } from "react-i18next";
import bibliotheque from '../assets/img/imgAtelier/bibliotheque.jfif';
import theatre from '../assets/img/imgAtelier/theatre.jpg';
import musique from '../assets/img/imgAtelier/musique.jpg';
import pientre from '../assets/img/imgAtelier/pientre.jpeg';
import informatique from '../assets/img/imgAtelier/informatique.jpg';
import etrangere from '../assets/img/imgAtelier/etrangere.jpg';

import prof2 from '../assets/img/imgAtelier/prof2.jpg';
import prof5 from '../assets/img/imgAtelier/prof5.jpg';
import prof11 from '../assets/img/imgAtelier/prof11.jpg';
import prof3 from '../assets/img/imgAtelier/prof3.jpg';
import prof6 from '../assets/img/imgAtelier/prof6.jpg';

import Image_de_centre from '../assets/img/imgAtelier/Image_de_centre.jpeg'

function Atelier() {
  const { t } = useTranslation();

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
  ];

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
  ];

  // État et logique pour le SliderCards (ateliers)
  const [currentIndexAteliers, setCurrentIndexAteliers] = useState(0);
  const intervalRefAteliers = useRef(null);

  const nextSlideAteliers = () => {
    setCurrentIndexAteliers((prevIndex) =>
      prevIndex + 3 >= items.length ? 0 : prevIndex + 3
    );
  };

  const prevSlideAteliers = () => {
    setCurrentIndexAteliers((prevIndex) =>
      prevIndex - 3 < 0 ? Math.floor((items.length - 1) / 3) * 3 : prevIndex - 3
    );
  };

  useEffect(() => {
    intervalRefAteliers.current = setInterval(() => {
      nextSlideAteliers();
    }, 5000);

    return () => {
      if (intervalRefAteliers.current) {
        clearInterval(intervalRefAteliers.current);
      }
    };
  }, []);

  const stopAutoSlideAteliers = () => {
    if (intervalRefAteliers.current) {
      clearInterval(intervalRefAteliers.current);
    }
  };

  const startAutoSlideAteliers = () => {
    intervalRefAteliers.current = setInterval(() => {
      nextSlideAteliers();
    }, 5000);
  };

  const visibleItemsAteliers = items.slice(
    currentIndexAteliers,
    currentIndexAteliers + 3
  );

  // État et logique pour le TeamSlider (équipe)
  const [currentIndexEquipe, setCurrentIndexEquipe] = useState(0);
  const intervalRefEquipe = useRef(null);

  const nextSlideEquipe = () => {
    setCurrentIndexEquipe((prevIndex) =>
      prevIndex + 1 >= teamMembers.length ? 0 : prevIndex + 1
    );
  };

  const prevSlideEquipe = () => {
    setCurrentIndexEquipe((prevIndex) =>
      prevIndex - 1 < 0 ? teamMembers.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    intervalRefEquipe.current = setInterval(() => {
      nextSlideEquipe();
    }, 6000);

    return () => {
      if (intervalRefEquipe.current) {
        clearInterval(intervalRefEquipe.current);
      }
    };
  }, []);

  const stopAutoSlideEquipe = () => {
    if (intervalRefEquipe.current) {
      clearInterval(intervalRefEquipe.current);
    }
  };

  const startAutoSlideEquipe = () => {
    intervalRefEquipe.current = setInterval(() => {
      nextSlideEquipe();
    }, 6000);
  };

  return (
    <div className="flex flex-col min-h-screen">
     

      <main className="flex-grow">
        {/* Section Hero */}
        <div className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={Image_de_centre}
              alt={t('workshops_hero_alt')}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10 flex h-full items-center justify-center text-center">
            <div className="px-4">
              <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
                {t('workshops_title')}
              </h1>
              <div className="mt-6">
                <a
                  href="/accueil"
                  className="inline-block bg-[#8B4513] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#6e3d20] transition duration-300"
                >
                  {t('home')}
                </a>
                <a
                  href="/cc0"
                  className="ml-4 inline-block bg-[#8B4513] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#6e3d20] transition duration-300"
                >
                  {t('workshops')}
                </a>
              </div>
            </div>
          </div>
        </div><br /> <br />

        {/* Section Ateliers */}
        <section id="ateliers" className="text-[#8B4513]">
          <div className="container mx-auto px-4">
          <div className="relative mb-16 text-center">
                <h1
                    className="text-[8rem] font-bold select-none [text-shadow:_1px_1px_#8B4513] [-webkit-text-stroke:_2px_rgba(139,69,19,0.5)] text-white"
                >
                    {t('workshops_title')}
                </h1>
                <h2
                    className="text-5xl font-bold absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ color: "#8B4513" }}
                >
                    {t('workshops_title')}
                </h2>
            </div>
            <p className="text-max-w-3xl  text-center  mb-8">
              {t('workshops_description')}
            </p>
            <div className="w-full max-w-7xl mx-auto px-4 py-8">
              <div className="relative">
                <div className="flex items-center">
                  {/* Bouton Précédent */}
                  <button
                    onClick={() => {
                      prevSlideAteliers();
                      stopAutoSlideAteliers();
                      startAutoSlideAteliers();
                    }}
                    className="absolute left-0 z-10 -ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
                    aria-label={t('previous')}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>

                  {/* Cartes Visibles */}
                  <div className="flex w-full gap-4 transition-transform duration-500 ease-in-out">
                    {visibleItemsAteliers.map((item, index) => (
                      <div
                        key={currentIndexAteliers + index}
                        className="w-full transform transition-all duration-300 hover:scale-105 bg-white rounded-lg shadow-md overflow-hidden hover:bg-[#8B4513] group"
                      >
                        <div className="p-4">
                          <div className="aspect-video relative mb-4 overflow-hidden rounded-lg">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={t(item.titleKey)}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <h3 className="text-xl font-semibold mb-2 text-[#8B4513] group-hover:text-white">
                            {t(item.titleKey)}
                          </h3>
                          <p className="text-[#8B4513] group-hover:text-white">{t(item.descriptionKey)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bouton Suivant */}
                  <button
                    onClick={() => {
                      nextSlideAteliers();
                      stopAutoSlideAteliers();
                      startAutoSlideAteliers();
                    }}
                    className="absolute right-0 z-10 -mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
                    aria-label={t('next')}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>

                {/* Indicateurs de Position */}
                <div className="mt-4 flex justify-center gap-2">
                  {Array.from({ length: Math.ceil(items.length / 3) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndexAteliers(index * 3);
                        stopAutoSlideAteliers();
                        startAutoSlideAteliers();
                      }}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        Math.floor(currentIndexAteliers / 3) === index
                          ? "bg-primary"
                          : "bg-gray-300"
                      }`}
                      aria-label={t('go_to_slide', { number: index + 1 })}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section><br />

        {/* Section Équipe */}
        <section id="equipe" className="text-[#8B4513]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">{t('workshops_team_title')}</h2>
            <p className="text-max-w-3xl  text-center mb-8">
              {t('workshops_team_description')}
            </p>
            <div className="w-full max-w-7xl mx-auto px-4 py-8">
              <div className="relative">
                <div className="flex items-center justify-center">
                  {/* Bouton Précédent */}
                  <button
                    onClick={() => {
                      prevSlideEquipe();
                      stopAutoSlideEquipe();
                      startAutoSlideEquipe();
                    }}
                    className="absolute left-0 z-10 -ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
                    aria-label={t('previous')}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>

                  {/* Cartes Visibles */}
                  <div className="flex w-full justify-center">
                    {[0, 1, 2, 3].map((offset) => {
                      const memberIndex = (currentIndexEquipe + offset) % teamMembers.length;
                      const member = teamMembers[memberIndex];
                      return (
                        <div
                          key={memberIndex}
                          className="w-1/4 px-2 transform transition-all duration-300 hover:scale-105"
                        >
                          <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4">
                              <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
                                <img
                                  src={member.image || "/placeholder.svg"}
                                  alt={member.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <h3 className="text-xl font-semibold mb-2 text-[#8B4513]">
                                {member.name}
                              </h3>
                              <p className="text-[#8B4513]">{t(member.roleKey)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bouton Suivant */}
                  <button
                    onClick={() => {
                      nextSlideEquipe();
                      stopAutoSlideEquipe();
                      startAutoSlideEquipe();
                    }}
                    className="absolute right-0 z-10 -mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
                    aria-label={t('next')}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>

                {/* Indicateurs de Position */}
                <div className="mt-4 flex justify-center gap-2">
                  {teamMembers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndexEquipe(index);
                        stopAutoSlideEquipe();
                        startAutoSlideEquipe();
                      }}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        currentIndexEquipe === index ? "bg-primary" : "bg-gray-300"
                      }`}
                      aria-label={t('go_to_slide', { number: index + 1 })}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Atelier;