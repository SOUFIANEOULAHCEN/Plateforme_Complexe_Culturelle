"use client"

import { useState, useEffect, useRef } from "react";
import Footer from "../Footer"
import { useTranslation } from "react-i18next";
import bibliotheque from '../../assets/img/imgAtelier/bibliotheque.jfif';
import theatre from '../../assets/img/imgAtelier/theatre.jpg';
import musique from '../../assets/img/imgAtelier/musique.jpg';
import pientre from '../../assets/img/imgAtelier/pientre.jpeg';
import informatique from '../../assets/img/imgAtelier/informatique.jpg';
import etrangere from '../../assets/img/imgAtelier/etrangere.jpg';
import prof2 from '../../assets/img/imgAtelier/prof2.jpg';
import prof5 from '../../assets/img/imgAtelier/prof5.jpg';
import prof11 from '../../assets/img/imgAtelier/prof11.jpg';
import prof3 from '../../assets/img/imgAtelier/prof3.jpg';
import prof6 from '../../assets/img/imgAtelier/prof6.jpg';
import Image_de_centre from '../../assets/img/imgAtelier/Image_de_centre.jpeg'

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

  // Logique pour le Slider des Ateliers
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

  // Logique pour le Slider de l'Équipe
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#FDF8F5] to-[#f5ece4]">
      <main className="flex-grow">
        {/* Section Hero */}
        <div className="relative h-[80vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={Image_de_centre}
              alt={t('workshops_hero_alt')}
              className="h-full w-full object-cover transition-transform duration-1000 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </div>
          <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
            <div className="max-w-4xl transform transition-all duration-700 hover:scale-[1.02]">
              <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl font-serif">
                {t('workshops_title')}
              </h1>
              <p className="text-xl text-white/90 md:text-2xl mb-8">
                {t('workshops_subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/accueil"
                  className="inline-flex items-center bg-[#8B4513] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#6e3d20] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  {t('home')}
                </a>
                <a
                  href="/cc0"
                  className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {t('workshops')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section Ateliers */}
        <section id="ateliers" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#8B4513] font-serif relative inline-block">
                {t('workshops_title')}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#8B4513] transform translate-y-2"></span>
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                {t('workshops_description')}
              </p>
            </div>

            {/* Slider Ateliers */}
            <div className="relative group">
              <div className="overflow-hidden px-2">
                <div
                  className="flex transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
                  style={{
                    transform: `translateX(-${currentIndexAteliers * 33.333}%)`,
                  }}
                >
                  {items.map((item, index) => (
                    <div key={index} className="w-full sm:w-1/2 md:w-1/3 flex-shrink-0 px-3">
                      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col transform hover:-translate-y-2">
                        <div className="relative overflow-hidden aspect-[4/3]">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={t(item.titleKey)}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <h3 className="text-xl font-bold text-white mb-2">{t(item.titleKey)}</h3>
                          </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-xl font-semibold text-[#8B4513] mb-3">{t(item.titleKey)}</h3>
                          <p className="text-gray-600 mb-4 flex-grow">{t(item.descriptionKey)}</p>
                          <button className="mt-auto text-[#8B4513] hover:text-[#6f3610] transition-colors duration-300 flex items-center justify-end">
                            <span className="mr-2 text-sm font-medium">En savoir plus</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contrôles du Slider */}
              <button
                onClick={() => {
                  prevSlideAteliers();
                  stopAutoSlideAteliers();
                  startAutoSlideAteliers();
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-xl hover:bg-gray-50 z-10 transform hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label={t('previous')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#8B4513]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => {
                  nextSlideAteliers();
                  stopAutoSlideAteliers();
                  startAutoSlideAteliers();
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-xl hover:bg-gray-50 z-10 transform hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label={t('next')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#8B4513]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Indicateurs de position */}
            <div className="flex justify-center mt-10">
              <div className="flex space-x-2">
                {Array.from({ length: Math.ceil(items.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndexAteliers(index * 3);
                      stopAutoSlideAteliers();
                      startAutoSlideAteliers();
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      Math.floor(currentIndexAteliers / 3) === index ? "w-6 bg-[#8B4513]" : "w-2 bg-gray-300"
                    }`}
                    aria-label={t('go_to_slide', { number: index + 1 })}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section Équipe */}
        <section id="equipe" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#8B4513] font-serif relative inline-block">
                {t('workshops_team_title')}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#8B4513] transform translate-y-2"></span>
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                {t('workshops_team_description')}
              </p>
            </div>

            {/* Slider Équipe */}
            <div className="relative group">
              <div className="overflow-hidden px-2">
                <div
                  className="flex transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
                  style={{
                    transform: `translateX(-${currentIndexEquipe * 25}%)`,
                  }}
                >
                  {teamMembers.map((member, index) => (
                    <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 px-3">
                      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col transform hover:-translate-y-2">
                        <div className="relative overflow-hidden aspect-square">
                          <img
                            src={member.image || "/placeholder.svg"}
                            alt={member.name}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-xl font-semibold text-[#8B4513] mb-2">{member.name}</h3>
                          <p className="text-gray-600 mb-4">{t(member.roleKey)}</p>
                          <div className="mt-auto pt-4 border-t border-gray-100 flex justify-center">
                            <div className="flex space-x-4">
                              <a href="#" className="text-gray-400 hover:text-[#8B4513] transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                              </a>
                              <a href="#" className="text-gray-400 hover:text-[#8B4513] transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                              </a>
                              <a href="#" className="text-gray-400 hover:text-[#8B4513] transition-colors duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contrôles du Slider */}
              <button
                onClick={() => {
                  prevSlideEquipe();
                  stopAutoSlideEquipe();
                  startAutoSlideEquipe();
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-xl hover:bg-gray-50 z-10 transform hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label={t('previous')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#8B4513]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => {
                  nextSlideEquipe();
                  stopAutoSlideEquipe();
                  startAutoSlideEquipe();
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-xl hover:bg-gray-50 z-10 transform hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label={t('next')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#8B4513]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Indicateurs de position */}
            <div className="flex justify-center mt-10">
              <div className="flex space-x-2">
                {teamMembers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndexEquipe(index);
                      stopAutoSlideEquipe();
                      startAutoSlideEquipe();
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndexEquipe === index ? "w-6 bg-[#8B4513]" : "w-2 bg-gray-300"
                    }`}
                    aria-label={t('go_to_slide', { number: index + 1 })}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Atelier;