import React from "react"
import { useTranslation } from "react-i18next"

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('hero_title')}</h1>
        <p className="text-gray-600 mb-8">
          {t('hero_subtitle')}
        </p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">{t('about_read_more')}</button>
      </div>
    </div>
  )
}

export default Hero