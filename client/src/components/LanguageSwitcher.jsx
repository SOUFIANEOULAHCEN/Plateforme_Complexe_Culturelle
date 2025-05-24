import React from "react";
import { useTranslation } from "react-i18next";
import france from "../assets/img/france.png";
import morocco from "../assets/img/morocco.png";
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Changer la direction du document pour l'arabe
    document.dir = lng === "ar" ? "rtl" : "ltr";
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage("fr")}
        className={`px-1 py-0.5 rounded ${
          i18n.language === "fr" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        <img src={france} alt="france" className="w-7 h-7" />
      </button>
      <button
        onClick={() => changeLanguage("ar")}
        className={`px-1 py-0.5 rounded ${
          i18n.language === "ar" ? "bg-red-300 text-white" : "bg-gray-200"
        }`}
      >
        <img src={morocco} alt="morocco" className="w-7 h-7" />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
