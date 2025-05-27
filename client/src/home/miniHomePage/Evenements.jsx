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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === events.length - 4 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? events.length - 4 : prev - 1))
  }

  const generateDots = () => {
    const dots = []
    const slidesCount = Math.min(events.length, 4)
    for (let i = 0; i <= events.length - slidesCount; i++) {
      dots.push(
        <button
          key={i}
          onClick={() => setCurrentSlide(i)}
          className={`h-2 rounded-full mx-1 ${
            currentSlide === i ? "w-6 bg-[#8B4513]" : "w-2 bg-gray-300"
          } transition-all duration-300`}
          aria-label={`Aller à la diapositive ${i + 1}`}
        />,
      )
    }
    return dots
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDF8F5] to-[#f5ece4] flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#8B4513]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDF8F5] to-[#f5ece4] flex justify-center items-center">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-8 max-w-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#8B4513] text-white px-6 py-2 rounded-md hover:bg-[#6f3610] transition-colors duration-300"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F5] to-[#f5ece4]">
      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ImageDeCentre}
            alt={t('events_hero_alt')}
            className="h-full w-full object-cover transition-transform duration-1000 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
          <div className="max-w-4xl transform transition-all duration-700 hover:scale-[1.02]">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl font-serif animate-fade-in">
              {t('events_title')}
            </h1>
            <p className="text-xl text-white/90 md:text-2xl mb-8 animate-fade-in-delay">
              {t('events_subtitle')}
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
                href="/evenements"
                className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {t('events')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Events Carousel */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#8B4513] font-serif relative inline-block">
              {t('events_featured')}
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#8B4513] transform translate-y-2"></span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto mt-6">
              {t('events_featured_description')}
            </p>
          </div>

          {/* Carousel */}
          <div className="relative group">
            <div className="overflow-hidden px-2">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]"
                style={{
                  transform: `translateX(-${currentSlide * 25}%)`,
                }}
              >
                {events.map((event) => (
                  <div key={event.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 px-3">
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col transform hover:-translate-y-2">
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <img
                          src={event.affiche_url ? `http://localhost:3000${event.affiche_url}` : '/default-event.jpg'}
                          alt={event.titre}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                          <h3 className="text-xl font-bold text-white mb-2">{event.titre}</h3>
                          <p className="text-sm text-white/90">{formatDate(event.date_debut)}</p>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            event.statut === 'confirme' ? 'bg-green-100 text-green-800' :
                            event.statut === 'planifie' ? 'bg-blue-100 text-blue-800' :
                            event.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.statut}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.titre}</h3>
                          <p className="text-sm text-gray-500 mb-3">{event.type}</p>
                          <p className="text-gray-600 line-clamp-3 mb-4">
                            {event.description?.slice(0, 120)}
                            {event.description?.length > 120 ? '...' : ''}
                          </p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-sm text-[#8B4513] font-medium">
                            {formatDate(event.date_debut)}
                          </span>
                          <button className="text-[#8B4513] hover:text-[#6f3610] transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
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
              onClick={nextSlide}
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

          {/* Carousel Dots */}
          <div className="flex justify-center mt-10">
            <div className="flex space-x-2">{generateDots()}</div>
          </div>
        </section>

        {/* Events Timeline */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#8B4513] font-serif relative inline-block">
              {t('events_calendar_title')}
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#8B4513] transform translate-y-2"></span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto mt-6">
              {t('events_calendar_description')}
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 h-full w-1 bg-gradient-to-b from-[#8B4513]/20 via-[#8B4513] to-[#8B4513]/20 transform -translate-x-1/2 hidden md:block"></div>

            {/* Timeline Events */}
            <div className="space-y-12 md:space-y-24">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} transition-all duration-500 hover:scale-[1.02]`}
                >
                  {/* Date - Mobile */}
                  <div className="w-full md:hidden mb-4 text-center">
                    <div className="inline-block bg-[#8B4513] text-white text-sm font-medium px-4 py-2 rounded-full">
                      {formatDate(event.date_debut)}
                    </div>
                  </div>

                  {/* Date - Desktop */}
                  <div className={`w-full md:w-2/5 ${index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"} hidden md:block`}>
                    <div className="text-lg text-[#8B4513] font-medium">{formatDate(event.date_debut)}</div>
                    <div className="text-sm text-gray-500">
                      {event.date_debut && new Date(event.date_debut).toLocaleDateString(i18n.language === 'ar' ? 'ar-MA' : 'fr-FR')}
                    </div>
                  </div>

                  {/* Center Point */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-[#8B4513] z-10 items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>

                  {/* Event Content */}
                  <div className={`w-full md:w-2/5 ${index % 2 === 0 ? "md:pl-8" : "md:pr-8"}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-xs text-[#8B4513] font-semibold uppercase tracking-wider mb-1">
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {event.titre}
                          </h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.statut === 'confirme' ? 'bg-green-100 text-green-800' :
                          event.statut === 'planifie' ? 'bg-blue-100 text-blue-800' :
                          event.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.statut}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          {formatDate(event.date_debut)}
                        </span>
                        <button className="text-[#8B4513] hover:text-[#6f3610] transition-colors duration-300 flex items-center">
                          <span className="mr-1 text-sm font-medium">Details</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
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