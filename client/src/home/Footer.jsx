import { Facebook, Instagram, Youtube, Twitter } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"
import LogoOfppt from "../assets/Logo_ofppt.png"
import municipalite from "../assets/municipalite.png"
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation();
  
  const logos = [
    {
      src: LogoOfppt,
      alt: t('footer_partner_ofppt')
    },
    {
      src: municipalite,
      alt: t('footer_partner_municipality')
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Section des Logos */}
      <div className="bg-[#FDF8F5] py-8">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-serif text-[#8B4513] text-center mb-8">{t('footer_partners')}</h3>
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            modules={[Autoplay]}
            className="flex justify-center items-center"
          >
            {logos.map((logo, index) => (
              <SwiperSlide
                key={index}
                className="flex justify-center hover:animate-none"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-20 w-auto object-contain cursor-pointer transition-transform duration-300 hover:scale-110"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#8B4513] py-12 text-[#FDF8F5]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Navigation rapide */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold mb-4">{t('footer_quick_nav')}</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('hero')} className="hover:text-white">
                    {t('home')}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-white">
                    {t('footer_about')}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('events')} className="hover:text-white">
                    {t('events')}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('workshops')} className="hover:text-white">
                    {t('workshops')}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('gallery')} className="hover:text-white">
                    {t('gallery')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold mb-4">{t('contact')}</h4>
              <div className="space-y-2">
                <p>{t('contact_address_details')}</p>
                <p>{t('contact_phone_number')}</p>
                <p>{t('contact_email')}: complexe.culturel@ouarzazate.ma</p>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold mb-4">{t('footer_follow_us')}</h4>
              <div className="flex gap-4">
                <a href="#" className="text-[#FDF8F5] hover:text-[#1877F2] transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-[#FDF8F5] hover:text-[#E1306C] transition-colors">
                  <Instagram size={24} />
                </a>
                <a href="#" className="text-[#FDF8F5] hover:text-[#FF0000] transition-colors">
                  <Youtube size={24} />
                </a>
                <a href="#" className="text-[#FDF8F5] hover:text-[#1DA1F2] transition-colors">
                  <Twitter size={24} />
                </a>
              </div>
              <p className="mt-4 text-sm opacity-80">
                {t('footer_newsletter_text')}
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-[#FDF8F5] opacity-60 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} {t('footer_copyright')}</p>
          </div>
        </div>
      </footer>
    </>
  );
}