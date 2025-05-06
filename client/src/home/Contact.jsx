import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import complex_logo_final_white from '../assets/img/logo/complex_logo_final_white.png';
import Image_de_centre from '../assets/img/imgAtelier/Image_de_centre.jpeg'
const Contact = () => {
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
              Contact
            </h1>
            <div className="mt-6">
              <a
                href="/accueil"
                className="inline-block bg-[#8B4513] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#6e3d20] transition duration-300"
              >
                Accueil
              </a>
              <a
                href="/cc0"
                className="ml-4 inline-block bg-[#8B4513] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#6e3d20] transition duration-300"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div><br />

      {/* Section Contact */}
      <div className="text-[#8B4513]">
        <h2 className="text-3xl font-bold text-center mb-8">Contactez-nous</h2>
        <p className="text-max-w-3xl font-medium text-center mb-8">
          Nous sommes à votre écoute ! N’hésitez pas à nous contacter pour toute question <br /> ou demande d’informations.
        </p>
      </div>

      {/* Section formulaire */}
      <div className="flex items-center justify-center min-h-screen bg-white p-6">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2">
          {/* Section gauche */}
          <div className="bg-[#8B4513] text-white p-8 flex flex-col justify-center items-center rounded-l-lg">
            <img
              src={complex_logo_final_white}// Remplacez par le chemin correct de votre logo
              alt="Logo"
              className="w-32 h-32 mb-4"
            />
            <h2 className="text-3xl font-bold mb-4">Discutons</h2>
            <p className="text-lg text-center">
              Que vous ayez une question, que vous souhaitiez lancer un projet ou
              simplement vous connecter.
            </p>
            <p className="mt-4 text-center">
              N'hésitez pas à m'envoyer un message via le formulaire de contact.
            </p>
          </div>

          {/* Section droite */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: "#8B4513" }}>
              Contact
            </h2>
            <form className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: "#8B4513" }}
                >
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  placeholder="Votre Nom"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: "#8B4513" }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  placeholder="Votre Email"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: "#8B4513" }}
                >
                  Téléphone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  placeholder="Votre Numéro de Téléphone"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium"
                  style={{ color: "#8B4513" }}
                >
                  Message
                </label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                  placeholder="Votre Message"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition"
                style={{ backgroundColor: "#8B4513" }}
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Section Google Maps */}
      <div className="mt-8">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345091844!2d-122.41941508468148!3d37.774929579759316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c23e04577%3A0xaaa8a2b1a07ed6bc!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1635060028657!5m2!1sen!2s"
          width="100%"
          height="450"
          style={{ border: "0" }}
          allowFullScreen=""
          loading="lazy"
          title="Google Maps Location"
        ></iframe>
      </div><br />

      {/* Section Footer */}
      <div>
      <Footer />
      </div>
      
    </div>
  );
};

export default Contact;
