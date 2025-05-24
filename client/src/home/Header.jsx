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
    setReservationModalOpen(true)
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
              <div className="absolute left-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <Link
                    to="/cco"
                    className="block px-4 py-2 text-sm text-[#824B26] hover:bg-[#F8F1E9]"
                    onClick={() => setIsCcoDropdownOpen(false)}
                  >
                    {t("about_us")}
                  </Link>
                  <Link
                    to="/espaces"
                    className="block px-4 py-2 text-sm text-[#824B26] hover:bg-[#F8F1E9]"
                    onClick={() => setIsCcoDropdownOpen(false)}
                  >
                    {t("spaces")}
                  </Link>
                  <Link
                    to="/bibliotheque"
                    className="block px-4 py-2 text-sm text-[#824B26] hover:bg-[#F8F1E9]"
                    onClick={() => setIsCcoDropdownOpen(false)}
                  >
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
                <div className="pl-6 mt-1 space-y-1">
                  <Link
                    to="/cco"
                    className="block py-2 text-sm hover:text-[#6e3d20]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("about_us")}
                  </Link>
                  <Link
                    to="/espaces"
                    className="block py-2 text-sm hover:text-[#6e3d20]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("spaces")}
                  </Link>
                  <Link
                    to="/bibliotheque"
                    className="block py-2 text-sm hover:text-[#6e3d20]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
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
