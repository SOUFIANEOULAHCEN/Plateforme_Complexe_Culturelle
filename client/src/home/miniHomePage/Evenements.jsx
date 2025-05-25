"use client"

import { useState, useEffect } from "react"
import api from "../../api"
import ImageDeCentre from '../../assets/img/imgAtelier/Image_de_centre.jpeg'
import { useTranslation } from "react-i18next"
import Footer from "../Footer"

const Evenements = () => {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/evenements')
        // Trier les événements par date de début
        const sortedEvents = response.data.sort((a, b) => 
          new Date(a.date_debut) - new Date(b.date_debut)
        );
        setEvents(sortedEvents)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching events:', err)
        setError(t('events_error'))
        setLoading(false)
      }
    }

    fetchEvents()
  }, [t])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-MA' : 'fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Fonction pour naviguer dans le carousel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === events.length - 4 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? events.length - 4 : prev - 1))
  }

  // Fonction pour générer les points de navigation du carousel
  const generateDots = () => {
    const dots = []
    const slidesCount = Math.min(events.length, 4) // Limite à 4 slides max
    for (let i = 0; i <= events.length - slidesCount; i++) {
      dots.push(
        <button
          key={i}
          onClick={() => setCurrentSlide(i)}
          className={`h-1.5 rounded-full mx-1 ${
            currentSlide === i ? "w-6 bg-[#8B4513]" : "w-1.5 bg-gray-300"
          } transition-all duration-300`}
          aria-label={`Aller à la diapositive ${i + 1}`}
        />,
      )
    }
    return dots
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B4513]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section avec image de fond */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ImageDeCentre}
            alt={t('events_hero_alt')}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="px-4 transform transition-all duration-700 hover:scale-105">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl animate-fade-in">
              {t('events_title')}
            </h1>
            <p className="text-lg text-white/90 md:text-xl animate-fade-in-delay">
              {t('events_subtitle')}
            </p>
            <div className="mt-6 space-x-4">
              <a
                href="/accueil"
                className="inline-block bg-[#8B4513] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#6e3d20] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                {t('home')}
              </a>
              <a
                href="/evenements"
                className="inline-block bg-white/10 backdrop-blur-sm text-white font-semibold py-2 px-6 rounded-md hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                {t('events')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Events Carousel */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-3 text-[#8B4513] relative">
            {t('events_featured')}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#8B4513] rounded-full"></div>
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            {t('events_featured_description')}
          </p>

          {/* Carousel */}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${currentSlide * 25}%)`,
                }}
              >
                {events.map((event) => (
                  <div key={event.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 px-3">
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
                      <div className="relative overflow-hidden">
                        <img
                          src={event.affiche_url ? `http://localhost:3000${event.affiche_url}` : '/default-event.jpg'}
                          alt={event.titre}
                          className="w-full h-64 object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <p className="text-sm font-medium">{formatDate(event.date_debut)}</p>
                            <p className="text-xs opacity-75">{event.type}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-[#8B4513] mb-2">{event.titre}</h3>
                        <p className="text-sm text-gray-600 mb-2">{event.type}</p>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {event.description?.slice(0, 100)}
                          {event.description?.length > 100 ? '...' : ''}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs text-gray-500">{formatDate(event.date_debut)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.statut === 'confirme' ? 'bg-green-100 text-green-800' :
                            event.statut === 'planifie' ? 'bg-blue-100 text-blue-800' :
                            event.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.statut}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 z-10 transform hover:scale-110 transition-all duration-300"
              aria-label={t('previous')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#8B4513]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 z-10 transform hover:scale-110 transition-all duration-300"
              aria-label={t('next')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#8B4513]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center mt-8 space-x-2">{generateDots()}</div>
        </section>

        {/* Calendar Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-3 text-[#8B4513] relative">
            {t('events_calendar_title')}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#8B4513] rounded-full"></div>
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            {t('events_calendar_description')}
          </p>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[#8B4513]/50 via-[#8B4513] to-[#8B4513]/50"></div>

            {/* Timeline Events */}
            <div className="space-y-16">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} transform transition-all duration-500 hover:scale-105`}
                >
                  {/* Date */}
                  <div className={`w-1/2 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                    <div className="text-gray-500 text-sm font-medium">{formatDate(event.date_debut)}</div>
                    <div className="text-xs text-gray-400">
                      {event.date_debut && new Date(event.date_debut).toLocaleDateString(i18n.language === 'ar' ? 'ar-MA' : 'fr-FR')}
                    </div>
                  </div>

                  {/* Center Point */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#8B4513] z-10 flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>

                  {/* Event Content */}
                  <div className={`w-1/2 ${index % 2 === 0 ? "pl-8" : "pr-8"}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className="text-xs text-[#8B4513] font-semibold mb-2 uppercase tracking-wider">
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {event.titre}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.statut === 'confirme' ? 'bg-green-100 text-green-800' :
                          event.statut === 'planifie' ? 'bg-blue-100 text-blue-800' :
                          event.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.statut}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default Evenements