import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Footer from "./Footer";
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
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('form');

  useEffect(() => {
    setIsMounted(true);
    document.title = `${t('contact_page_title')} | CCO Ouarzazate`;
    return () => setIsMounted(false);
  }, [t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !isFormValid()) return;
    
    setLoading(true);

    try {
      await api.post("/contact", formData);
      if (isMounted) {
        showToast(t('contact_success'), "success");
        setFormData({
          nom: "",
          email: "",
          telephone: "",
          message: ""
        });
      }
    } catch (error) {
      if (isMounted) {
        showToast(error.response?.data?.message || t('contact_error'), "error");
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => {
      if (isMounted) setToast(null);
    }, 5000);
  };

  const isFormValid = () => {
    return (
      formData.nom.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.message.trim().length >= 10
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F9F5F0]">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={Image_de_centre}
            alt="CCO Ouarzazate"
            className="h-full w-full object-cover transition-all duration-1000 hover:scale-110"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="px-4 transform transition-all duration-700 hover:scale-[1.02]">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl animate-fade-in">
              {t('contact')}
            </h1>
            <div className="mt-6 space-x-4">
              <a
                href="/accueil"
                className="inline-flex items-center bg-[#8B4513] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#6e3d20] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                aria-label={t('home_link_aria')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                {t('home')}
              </a>
              <a
                href="/cc0"
                className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                aria-label={t('contact_link_aria')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t('contact')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Tabs */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'form' ? 'bg-[#8B4513] text-white' : 'text-[#8B4513] hover:bg-[#8B4513]/10'
              }`}
            >
              {t('contact_form_tab')}
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'info' ? 'bg-[#8B4513] text-white' : 'text-[#8B4513] hover:bg-[#8B4513]/10'
              }`}
            >
              {t('contact_info_tab')}
            </button>
          </div>
        </div>

        {activeTab === 'form' ? (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
            <h2 className="text-3xl font-bold mb-8 text-[#8B4513] relative inline-block">
              {t('contact_send_message')}
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#8B4513] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="transform transition-all duration-300 hover:translate-x-2">
                  <label htmlFor="nom" className="block text-sm font-medium text-[#8B4513] mb-2">
                    {t('contact_name')} *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    minLength={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513] transition-all duration-300"
                    placeholder={t('contact_name_placeholder')}
                  />
                  {formData.nom && formData.nom.trim().length < 2 && (
                    <p className="mt-1 text-sm text-red-600">
                      {t('validation_name_length')}
                    </p>
                  )}
                </div>

                <div className="transform transition-all duration-300 hover:translate-x-2">
                  <label htmlFor="email" className="block text-sm font-medium text-[#8B4513] mb-2">
                    {t('contact_email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513] transition-all duration-300"
                    placeholder={t('contact_email_placeholder')}
                  />
                  {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <p className="mt-1 text-sm text-red-600">
                      {t('validation_email_format')}
                    </p>
                  )}
                </div>
              </div>

              <div className="transform transition-all duration-300 hover:translate-x-2">
                <label htmlFor="telephone" className="block text-sm font-medium text-[#8B4513] mb-2">
                  {t('contact_phone')}
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513] transition-all duration-300"
                  placeholder={t('contact_phone_placeholder')}
                />
              </div>

              <div className="transform transition-all duration-300 hover:translate-x-2">
                <label htmlFor="message" className="block text-sm font-medium text-[#8B4513] mb-2">
                  {t('contact_message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  minLength={10}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513] transition-all duration-300"
                  placeholder={t('contact_message_placeholder')}
                ></textarea>
                {formData.message && formData.message.trim().length < 10 && (
                  <p className="mt-1 text-sm text-red-600">
                    {t('validation_message_length')}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className={`w-full bg-[#8B4513] text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:transform-none ${
                  !loading && isFormValid() ? 'hover:bg-[#6e3d20]' : ''
                }`}
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
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Address Card */}
              <div className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 text-center">
                <div className="bg-[#8B4513]/10 p-4 rounded-full inline-flex mb-6">
                  <svg className="w-8 h-8 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#8B4513] mb-4">
                  {t('contact_address')}
                </h3>
                <address className="text-gray-600 not-italic">
                  {t('contact_address_details')}
                </address>
              </div>

              {/* Phone Card */}
              <div className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 text-center">
                <div className="bg-[#8B4513]/10 p-4 rounded-full inline-flex mb-6">
                  <svg className="w-8 h-8 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#8B4513] mb-4">
                  {t('contact_phone')}
                </h3>
                <a href="tel:+212528888888" className="text-gray-600 hover:text-[#8B4513] transition-colors duration-300">
                  (+212) 528-888-888
                </a>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 text-center">
                <div className="bg-[#8B4513]/10 p-4 rounded-full inline-flex mb-6">
                  <svg className="w-8 h-8 text-[#8B4513]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#8B4513] mb-4">
                  {t('contact_email')}
                </h3>
                <a href="mailto:contact@cc-ouarzazate.ma" className="text-gray-600 hover:text-[#8B4513] transition-colors duration-300">
                  ouarzazatecomplexe@gmail.com
                </a>
              </div>
            </div>

            {/* Map Section */}
            <div className="mt-16 bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
              <iframe
                title={t('map_location_title')}
                src="https://www.google.com/maps?q=Le+Complexe+Culturel+Mohammed+VI,+Ouarzazate&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="transition-all duration-500 hover:opacity-90"
              />
            </div>
          </div>
        )}
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

      {/* Animation Styles */}
      <style global="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Contact;