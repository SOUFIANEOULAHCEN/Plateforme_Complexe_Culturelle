import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import complex_logo_final_brown from "../assets/img/logo/complex_logo_final_brown.png";
import france from "../assets/img/france.png";
import morocco from "../assets/img/morocco.png";
import AuthForms from "../pages/AuthForms";
import ReservationModal from "../components/ReservationModal";
import LanguageSwitcher from "../components/LanguageSwitcher";
import background from "../assets/img/background.webp";

export default function Header() {
  const { t } = useTranslation();
  const [isConnexionModalOpen, setConnexionModalOpen] = useState(false);
  const [isReservationModalOpen, setReservationModalOpen] = useState(false);
  const [showConnexion, setShowConnexion] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const openConnexionModal = () => {
    setConnexionModalOpen(true);
    setShowConnexion(true);
  };

  const closeConnexionModal = () => {
    setConnexionModalOpen(false);
  };
  
  const closeReservationModal = () => {
    setReservationModalOpen(false);
  };

  const handleReservationClick = () => {
    setReservationModalOpen(true);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Attendre que la navigation soit terminée
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-[#824B26] text-2xl font-bold">
          <Link to="/" onClick={() => scrollToSection('hero')}>
            <img
              className="w-[100px] h-auto"
              src={complex_logo_final_brown}
              alt="Logo"
            />
          </Link>
        </div>

        {/* Bouton du menu hamburger */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-[#824B26] focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        {/* Navigation Links (desktop) */}
        <ul className="hidden md:flex space-x-8 text-[#824B26] text-lg font-medium">
          <li>
            <button onClick={() => scrollToSection('hero')} className="hover:text-[#6e3d20]">
              {t('home')}
            </button>
          </li>
          <li className="relative">
            <button
              onClick={() => scrollToSection('about')}
              className="flex items-center space-x-1 hover:text-[#6e3d20]"
            >
              <span>{t('cco')}</span>
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('events')} className="hover:text-[#6e3d20]">
              {t('events')}
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('workshops')} className="hover:text-[#6e3d20]">
              {t('workshops')}
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('gallery')} className="hover:text-[#6e3d20]">
              {t('gallery')}
            </button>
          </li>
          <li>
            <Link to="/Contact" className="hover:text-[#6e3d20]">
              {t('contact')}
            </Link>
          </li>
        </ul>

        {/* Flags and Buttons (desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <LanguageSwitcher />
          <button
            onClick={openConnexionModal}
            className="bg-[#824B26] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#6e3d20] transition duration-300"
          >
            {t('login')}
          </button>
          <button
            onClick={handleReservationClick}
            className="bg-[#f5f5f5] text-[#824B26] font-semibold py-2 px-6 rounded-md hover:bg-[#eaeaea] transition duration-300"
          >
            {t('reserve')}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col space-y-4 p-6 text-[#824B26] text-lg font-medium">
            <li>
              <button onClick={() => scrollToSection('hero')} className="hover:text-[#6e3d20] w-full text-left">
                {t('home')}
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('about')} className="hover:text-[#6e3d20] w-full text-left">
                {t('cco')}
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('events')} className="hover:text-[#6e3d20] w-full text-left">
                {t('events')}
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('workshops')} className="hover:text-[#6e3d20] w-full text-left">
                {t('workshops')}
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('gallery')} className="hover:text-[#6e3d20] w-full text-left">
                {t('gallery')}
              </button>
            </li>
          </ul>

          {/* Flags and Buttons dans le menu mobile */}
          <div className="flex items-center justify-center space-x-6 p-6">
            <LanguageSwitcher />
            <button
              onClick={openConnexionModal}
              className="bg-[#824B26] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#6e3d20] transition duration-300"
            >
              {t('login')}
            </button>
            <button
              onClick={handleReservationClick}
              className="bg-[#f5f5f5] text-[#824B26] font-semibold py-2 px-6 rounded-md hover:bg-[#eaeaea] transition duration-300"
            >
              {t('reserve')}
            </button>
          </div>
        </div>
      )}

      {/* Modal de Connexion/Inscription */}
      <AuthForms 
        isOpen={isConnexionModalOpen}
        onClose={closeConnexionModal}
      />
      
      {/* Modal de Réservation */}
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={closeReservationModal}
      />
    </div>
  );
}
