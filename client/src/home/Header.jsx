"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import complex_logo_final_brown from "../assets/img/logo/complex_logo_final_brown.png"
import AuthForms from "../pages/AuthForms"
import ReservationModal from "../components/ReservationModal"
import LanguageSwitcher from "../components/LanguageSwitcher"

export default function Header() {
  const { t } = useTranslation()
  const [isConnexionModalOpen, setConnexionModalOpen] = useState(false)
  const [isReservationModalOpen, setReservationModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCcoDropdownOpen, setIsCcoDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const openConnexionModal = () => {
    setConnexionModalOpen(true)
  }

  const closeConnexionModal = () => {
    setConnexionModalOpen(false)
  }

  const closeReservationModal = () => {
    setReservationModalOpen(false)
  }

  const handleReservationClick = () => {
    navigate('/reservations')
  }

  const toggleCcoDropdown = () => {
    setIsCcoDropdownOpen(!isCcoDropdownOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    setIsCcoDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-[#824B26] text-2xl font-bold">
          <Link to="/" onClick={() => scrollToSection("hero")}>
            <img
              className="w-[100px] h-auto transition-transform hover:scale-105"
              src={complex_logo_final_brown || "/placeholder.svg"}
              alt="Logo"
            />
          </Link>
        </div>

        {/* Bouton du menu hamburger */}
        <button onClick={toggleMobileMenu} className="md:hidden text-[#824B26] focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Navigation Links (desktop) */}
        <ul className="hidden md:flex space-x-6 text-[#824B26] text-lg font-medium">
          <li>
            <Link to="/" className="hover:text-[#6e3d20] transition-colors duration-200 relative group">
              {t("home")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#824B26] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>

          {/* Dropdown CCO */}
          <li className="relative">
            <button
              onClick={toggleCcoDropdown}
              className="flex items-center space-x-1 hover:text-[#6e3d20] transition-colors duration-200 group"
            >
              <span>{t("cco")}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isCcoDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isCcoDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 origin-top-right bg-white rounded-xl shadow-2xl ring-1 ring-[#824B26]/10 focus:outline-none z-50 transform transition-all duration-200 ease-out backdrop-blur-sm">
                <div className="py-2">
                  <Link
                    to="/cco"
                    className="flex items-center px-4 py-3 text-sm text-[#824B26] hover:bg-[#F8F1E9] transition-all duration-200 group/item"
                    onClick={() => setIsCcoDropdownOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#824B26]/70 group-hover/item:text-[#824B26] transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t("about_us")}
                  </Link>
                  <Link
                    to="/espaces"
                    className="flex items-center px-4 py-3 text-sm text-[#824B26] hover:bg-[#F8F1E9] transition-all duration-200 group/item"
                    onClick={() => setIsCcoDropdownOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#824B26]/70 group-hover/item:text-[#824B26] transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {t("spaces")}
                  </Link>
                  <Link
                    to="/bibliotheque"
                    className="flex items-center px-4 py-3 text-sm text-[#824B26] hover:bg-[#F8F1E9] transition-all duration-200 group/item"
                    onClick={() => setIsCcoDropdownOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#824B26]/70 group-hover/item:text-[#824B26] transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {t("library")}
                  </Link>
                </div>
              </div>
            )}
          </li>

          <li>
            <Link to="/evenements" className="hover:text-[#6e3d20] transition-colors duration-200 relative group">
              {t("events")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#824B26] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>

          <li>
            <Link to="/ateliers" className="hover:text-[#6e3d20] transition-colors duration-200 relative group">
              {t("workshops")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#824B26] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>

          <li>
            <button
              onClick={() => scrollToSection("gallery")}
              className="hover:text-[#6e3d20] transition-colors duration-200 relative group"
            >
              {t("gallery")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#824B26] transition-all duration-300 group-hover:w-full"></span>
            </button>
          </li>

          <li>
            <Link to="/contact" className="hover:text-[#6e3d20] transition-colors duration-200 relative group">
              {t("contact")}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#824B26] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
        </ul>

        {/* Flags and Buttons (desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <LanguageSwitcher />
          <button
            onClick={openConnexionModal}
            className="bg-[#824B26] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#6e3d20] transition duration-300 shadow-sm"
          >
            {t("login")}
          </button>
          <button
            onClick={handleReservationClick}
            className="bg-[#f5f5f5] text-[#824B26] font-semibold py-2 px-6 rounded-md hover:bg-[#eaeaea] transition duration-300 border border-[#824B26]"
          >
            {t("reserve")}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="py-2 px-6">
            <li>
              <Link to="/" className="block py-2 hover:text-[#6e3d20]" onClick={() => setIsMobileMenuOpen(false)}>
                {t("home")}
              </Link>
            </li>

            {/* CCO Mobile Dropdown */}
            <li>
              <button
                onClick={toggleCcoDropdown}
                className="flex items-center justify-between w-full py-2 hover:text-[#6e3d20]"
              >
                <span>{t("cco")}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isCcoDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCcoDropdownOpen && (
                <div className="pl-6 mt-1 space-y-1 bg-[#F8F1E9]/50 rounded-xl py-2 backdrop-blur-sm">
                  <Link
                    to="/cco"
                    className="flex items-center py-2 text-sm hover:text-[#6e3d20] transition-all duration-200 group/item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#824B26]/70 group-hover/item:text-[#824B26] transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t("about_us")}
                  </Link>
                  <Link
                    to="/espaces"
                    className="flex items-center py-2 text-sm hover:text-[#6e3d20] transition-all duration-200 group/item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#824B26]/70 group-hover/item:text-[#824B26] transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {t("spaces")}
                  </Link>
                  <Link
                    to="/bibliotheque"
                    className="flex items-center py-2 text-sm hover:text-[#6e3d20] transition-all duration-200 group/item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#824B26]/70 group-hover/item:text-[#824B26] transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {t("library")}
                  </Link>
                </div>
              )}
            </li>

            <li>
              <Link
                to="/evenements"
                className="block py-2 hover:text-[#6e3d20]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("events")}
              </Link>
            </li>

            <li>
              <Link
                to="/ateliers"
                className="block py-2 hover:text-[#6e3d20]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("workshops")}
              </Link>
            </li>

            <li>
              <button
                onClick={() => scrollToSection("gallery")}
                className="block w-full text-left py-2 hover:text-[#6e3d20]"
              >
                {t("gallery")}
              </button>
            </li>

            <li>
              <Link
                to="/contact"
                className="block py-2 hover:text-[#6e3d20]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("contact")}
              </Link>
            </li>
          </ul>

          {/* Flags and Buttons dans le menu mobile */}
          <div className="flex items-center justify-center space-x-6 p-6 border-t border-gray-200">
            <LanguageSwitcher />
            <button
              onClick={openConnexionModal}
              className="bg-[#824B26] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#6e3d20] transition duration-300"
            >
              {t("login")}
            </button>
            <button
              onClick={handleReservationClick}
              className="bg-[#f5f5f5] text-[#824B26] font-semibold py-2 px-6 rounded-md hover:bg-[#eaeaea] transition duration-300 border border-[#824B26]"
            >
              {t("reserve")}
            </button>
          </div>
        </div>
      )}

      {/* Modal de Connexion/Inscription */}
      <AuthForms isOpen={isConnexionModalOpen} onClose={closeConnexionModal} />

      {/* Modal de Réservation */}
      <ReservationModal isOpen={isReservationModalOpen} onClose={closeReservationModal} />
    </div>
  )
}
