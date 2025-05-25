import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "./Footer";
import Header from "./Header";
import complex_logo_final_white from '../assets/img/logo/complex_logo_final_white.png';
import Image_de_centre from '../assets/img/imgAtelier/Image_de_centre.jpeg';
import api from "../api";
import Toast from "../components/Toast";

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/contact", formData);
      setToast({
        message: t('contact_success'),
        type: "success"
      });
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        message: ""
      });
    } catch (error) {
      setToast({
        message: error.response?.data?.message || t('contact_error'),
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F9F5F0]">
      {/* Section Hero */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={Image_de_centre}
            alt="CCO Ouarzazate"
            className="h-full w-full object-cover transition-all duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="px-4 transform transition-all duration-700 hover:scale-105">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl animate-fade-in">
              {t('contact')}
            </h1>
            <div className="mt-6 space-x-4">
              <a
                href="/accueil"
                className="inline-block bg-[#8B4513] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#6e3d20] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                {t('home')}
              </a>
              <a
                href="/cc0"
                className="inline-block bg-[#8B4513] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#6e3d20] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                {t('contact')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section Contact */}
      <div className="text-[#8B4513] py-16 relative">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl font-bold text-center mb-6 animate-fade-in">
            {t('contact_title')}
          </h2>
          <p className="text-lg font-medium text-center mb-8 max-w-3xl mx-auto animate-fade-in delay-100">
            {t('contact_subtitle')}
          </p>
        </div>
      </div>

      {/* Section formulaire et carte */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <div className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 text-[#8B4513] relative inline-block">
              {t('contact_send_message')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8B4513] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="transform transition-all duration-300 hover:translate-x-2">
                <label className="block text-sm font-medium text-[#8B4513] mb-2">
                  {t('contact_name')} *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513] transition-all duration-300"
                  placeholder={t('contact_name_placeholder')}
                />
              </div>

              <div className="transform transition-all duration-300 hover:translate-x-2">
                <label className="block text-sm font-medium text-[#8B4513] mb-2">
                  {t('contact_email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513] transition-all duration-300"
                  placeholder={t('contact_email_placeholder')}
                />
              </div>

              <div className="transform transition-all duration-300 hover:translate-x-2">
                <label className="block text-sm font-medium text-[#8B4513] mb-2">
                  {t('contact_phone')}
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513] transition-all duration-300"
                  placeholder={t('contact_phone_placeholder')}
                />
              </div>

              <div className="transform transition-all duration-300 hover:translate-x-2">
                <label className="block text-sm font-medium text-[#8B4513] mb-2">
                  {t('contact_message')} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513] transition-all duration-300"
                  placeholder={t('contact_message_placeholder')}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8B4513] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#6e3d20] transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('contact_sending')}
                  </span>
                ) : (
                  t('contact_send')
                )}
              </button>
            </form>
          </div>

          {/* Carte et informations */}
          <div className="space-y-8">
            {/* Carte Google Maps */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
              <iframe
                src="https://www.google.com/maps?q=Le+Complexe+Culturel+Mohammed+VI,+Ouarzazate&output=embed"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="transition-all duration-500 hover:scale-105"
              ></iframe>
            </div>

            {/* Informations de contact */}
            <div className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
              <h2 className="text-3xl font-bold mb-8 text-[#8B4513] relative inline-block">
                {t('contact_info')}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8B4513] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group transform transition-all duration-300 hover:translate-x-2">
                  <svg
                    className="w-8 h-8 text-[#8B4513] mt-1 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-lg text-[#8B4513] group-hover:text-[#6e3d20] transition-colors duration-300">
                      {t('contact_address')}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      {t('contact_address_details')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group transform transition-all duration-300 hover:translate-x-2">
                  <svg
                    className="w-8 h-8 text-[#8B4513] mt-1 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-lg text-[#8B4513] group-hover:text-[#6e3d20] transition-colors duration-300">
                      {t('contact_phone')}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      (+212) 528-888-888
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group transform transition-all duration-300 hover:translate-x-2">
                  <svg
                    className="w-8 h-8 text-[#8B4513] mt-1 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-lg text-[#8B4513] group-hover:text-[#6e3d20] transition-colors duration-300">
                      {t('contact_email')}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      contact@cc-ouarzazate.ma
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Footer />

      {/* Styles */}
      <style global="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 100ms;
        }
      `}</style>
    </div>
  );
};

export default Contact;
