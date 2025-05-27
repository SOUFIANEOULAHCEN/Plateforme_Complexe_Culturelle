import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';  // ✅ Correct (Swiper v10)
import { Autoplay } from 'swiper/modules';           // ✅ Correct (Swiper v10)
import 'swiper/css';                                 // ✅ Correct (Swiper v10)
import LogoOfppt from "../assets/Logo_ofppt.png";
import Municipalite from "../assets/municipalite.png";
import LogoAlliance from "../assets/logo_alliance.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const logos = [
    LogoOfppt,
    Municipalite,
    LogoAlliance,
    LogoOfppt,
    Municipalite,
    LogoAlliance,
  ];

  return (
    <>
      {/* Section des Logos */}
      <div className="bg-gradient-to-r from-[#F9F5F0] to-[#F0E6D8] py-8">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-xl font-bold mb-6">{t('footer_partners')}</h3>
          <Swiper
            spaceBetween={40}
            slidesPerView={4}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            modules={[Autoplay]}
            className="partner-slider"
          >
            {logos.map((logo, index) => (
              <SwiperSlide key={index}>
                <div className="flex justify-center items-center h-24 p-4">
                  <img
                    src={logo}
                    alt={`Partner Logo ${index + 1}`}
                    className="h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Footer principal */}
      <footer className="bg-gradient-to-b from-[#8B4513] to-[#6B4D3D] text-[#FDF8F5] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Colonne 1 - À propos */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b-2 border-[#D4A017] pb-2">{t('footer_about_title')}</h3>
              <p className="text-sm">
                {t('footer_about_description')}
              </p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#FDF8F5] hover:text-[#D4A017] transition-colors duration-300">
                  <Facebook size={20} />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#FDF8F5] hover:text-[#D4A017] transition-colors duration-300">
                  <Twitter size={20} />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#FDF8F5] hover:text-[#D4A017] transition-colors duration-300">
                  <Instagram size={20} />
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-[#FDF8F5] hover:text-[#D4A017] transition-colors duration-300">
                  <Youtube size={20} />
                </a>
              </div>
            </div>

            {/* Colonne 2 - Liens rapides */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b-2 border-[#D4A017] pb-2">{t('footer_quick_links')}</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-[#D4A017] transition-colors duration-300">{t('home')}</Link></li>
                <li><Link to="/evenements" className="hover:text-[#D4A017] transition-colors duration-300">{t('events')}</Link></li>
                <li><Link to="/ateliers" className="hover:text-[#D4A017] transition-colors duration-300">{t('workshops')}</Link></li>
                <li><Link to="/reservations" className="hover:text-[#D4A017] transition-colors duration-300">{t('reservations')}</Link></li>
                <li><Link to="/bibliotheque" className="hover:text-[#D4A017] transition-colors duration-300">{t('library')}</Link></li>
                <li><Link to="/contact" className="hover:text-[#D4A017] transition-colors duration-300">{t('contact')}</Link></li>
              </ul>
            </div>

            {/* Colonne 3 - Contact */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b-2 border-[#D4A017] pb-2">{t('footer_contact_info')}</h3>
              <address className="not-italic space-y-2">
                <p className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('footer_address')}
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {t('footer_phone')}
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t('footer_email')}
                </p>
              </address>
            </div>

            {/* Colonne 4 - Horaires */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b-2 border-[#D4A017] pb-2">{t('footer_hours')}</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>{t('footer_weekdays')}</span>
                  <span>{t('footer_weekdays_hours')}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t('footer_weekend')}</span>
                  <span>{t('footer_weekend_hours')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-[#D4A017]/30 mt-12 pt-6 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} {t('footer_copyright')}</p>
          </div>
        </div>
      </footer>

      {/* Styles pour le slider */}
      <style global="true">{`
        .partner-slider .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
          transition: transform 0.3s ease;
        }
        
        .partner-slider .swiper-slide:hover {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
}