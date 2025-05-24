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
      // Réinitialiser le formulaire
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
    <div>
      {/* Section Hero */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={Image_de_centre}
            alt="CCO Ouarzazate"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="px-4">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
              {t('contact')}
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
                {t('contact')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section Contact */}
      <div className="text-[#8B4513] py-12">
        <h2 className="text-3xl font-bold text-center mb-8">{t('contact_title')}</h2>
        <p className="text-max-w-3xl font-medium text-center mb-8">
          {t('contact_subtitle')}
        </p>
      </div>

      {/* Section formulaire et carte */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de contact */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: "#8B4513" }}>
              {t('contact_send_message')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: "#8B4513" }}
                >
                  {t('contact_name')} *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  placeholder={t('contact_name_placeholder')}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: "#8B4513" }}
                >
                  {t('contact_email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  placeholder={t('contact_email_placeholder')}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: "#8B4513" }}
                >
                  {t('contact_phone')}
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  placeholder={t('contact_phone_placeholder')}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: "#8B4513" }}
                >
                  {t('contact_message')} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  placeholder={t('contact_message_placeholder')}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
                style={{ backgroundColor: "#8B4513" }}
              >
                {loading ? t('contact_sending') : t('contact_send')}
              </button>
            </form>
          </div>

          {/* Carte et informations */}
          <div className="space-y-8">
            {/* Carte Google Maps */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps?q=Le+Complexe+Culturel+Mohammed+VI,+Ouarzazate&output=embed"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Informations de contact */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#8B4513" }}>
                {t('contact_info')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <svg
                    className="w-6 h-6 text-[#8B4513] mt-1"
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
                    <h3 className="font-semibold">{t('contact_address')}</h3>
                    <p className="text-gray-600">
                      {t('contact_address_details')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <svg
                    className="w-6 h-6 text-[#8B4513] mt-1"
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
                    <h3 className="font-semibold">{t('contact_phone')}</h3>
                    <p className="text-gray-600">{t('contact_phone_number')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
