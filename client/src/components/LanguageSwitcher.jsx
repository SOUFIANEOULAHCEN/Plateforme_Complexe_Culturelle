import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Changer la direction du document pour l'arabe
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-2 py-1 rounded ${i18n.language === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        🇫🇷
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className={`px-2 py-1 rounded ${i18n.language === 'ar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        🇲🇦
      </button>
    </div>
  );
};

export default LanguageSwitcher; 