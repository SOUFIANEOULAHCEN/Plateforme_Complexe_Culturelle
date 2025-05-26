import { FaStar, FaHandsHelping, FaUsers, FaMicrophoneAlt, FaPalette } from 'react-icons/fa';
import Footer from "../Footer"
import talentHero from "../../assets/img/IMGCCO/telents-hero.jpg"
import AuthForms from "../../pages/AuthForms"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function TalentPage() {
    const { t } = useTranslation()
    const [isConnexionModalOpen, setConnexionModalOpen] = useState(false)

    const openConnexionModal = () => {
        setConnexionModalOpen(true)
    }

    const closeConnexionModal = () => {
        setConnexionModalOpen(false)
    }

    const benefits = [
        {
            icon: <FaStar className="h-8 w-8" />,
            title: t("talent_benefit_visibility_title"),
            description: t("talent_benefit_visibility_desc")
        },
        {
            icon: <FaHandsHelping className="h-8 w-8" />,
            title: t("talent_benefit_support_title"),
            description: t("talent_benefit_support_desc")
        },
        {
            icon: <FaUsers className="h-8 w-8" />,
            title: t("talent_benefit_networking_title"),
            description: t("talent_benefit_networking_desc")
        },
        {
            icon: <FaMicrophoneAlt className="h-8 w-8" />,
            title: t("talent_benefit_opportunities_title"),
            description: t("talent_benefit_opportunities_desc")
        },
        {
            icon: <FaPalette className="h-8 w-8" />,
            title: t("talent_benefit_space_title"),
            description: t("talent_benefit_space_desc")
        }
    ];

    return (
        <div className="w-full bg-white">
            {/* Hero Section */}
            <div className="relative h-[70vh] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={talentHero}
                        alt="Talent au Palais de la Culture"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 flex h-full items-center justify-center text-center">
                    <div className="px-4">
                        <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
                            {t("talent_hero_title")}
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-200">
                            {t("talent_hero_subtitle")}
                        </p>
                        <div className="mt-6">
                            <a
                                href="#pourquoi"
                                className="inline-block bg-[#8B4513] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#6e3d20] transition duration-300"
                            >
                                {t("talent_discover_benefits")}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pourquoi rejoindre */}
            <div id="pourquoi" className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <h2 className="mb-4 text-3xl font-bold" style={{ color: '#8B4513' }}>{t("talent_why_join_title")}</h2>
                        <p className="mx-auto max-w-3xl text-gray-600" style={{ color: '#8B4513' }}>
                            {t("talent_why_join_description")}
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="group rounded-xl bg-[#FDF8F5] p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                                <div className="mb-4 inline-block rounded-full bg-white border-2 border-[#8B4513] p-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="mb-3 text-xl font-bold" style={{ color: '#8B4513' }}>{benefit.title}</h3>
                                <p className="text-gray-600" style={{ color: '#8B4513' }}>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Témoignages */}
            <div className="bg-[#FDF8F5] py-16">
                <div className="mx-auto max-w-7xl px-4">
                    <h2 className="mb-12 text-center text-3xl font-bold" style={{ color: '#824B26' }}>{t("talent_testimonials_title")}</h2>
                    
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="rounded-xl bg-white p-8 shadow-lg">
                            <p className="mb-6 italic text-gray-600" style={{ color: '#824B26' }}>
                                {t("talent_testimonial_1")}
                            </p>
                            <div className="flex items-center">
                                <img 
                                    src="/IMGCCO/artist1.jpg" 
                                    alt="Artiste" 
                                    className="h-12 w-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-semibold" style={{ color: '#824B26' }}>{t("talent_artist_1_name")}</h4>
                                    <p className="text-sm text-gray-500">{t("talent_artist_1_role")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-8 shadow-lg">
                            <p className="mb-6 italic text-gray-600" style={{ color: '#824B26' }}>
                                {t("talent_testimonial_2")}
                            </p>
                            <div className="flex items-center">
                                <img 
                                    src="/IMGCCO/artist2.jpg" 
                                    alt="Musicien" 
                                    className="h-12 w-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-semibold" style={{ color: '#824B26' }}>{t("talent_artist_2_name")}</h4>
                                    <p className="text-sm text-gray-500">{t("talent_artist_2_role")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="rounded-xl bg-[#8B4513] p-12 text-center">
                        <h2 className="mb-6 text-3xl font-bold text-white">{t("talent_cta_title")}</h2>
                        <p className="mx-auto mb-8 max-w-2xl text-gray-200">
                            {t("talent_cta_description")}
                        </p>
                        <button
                            onClick={openConnexionModal}
                            className="inline-block bg-white text-[#8B4513] font-semibold py-2 px-8 rounded-md hover:bg-gray-100 transition duration-300"
                        >
                            {t("talent_apply_now")}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Connexion/Inscription */}
            <AuthForms isOpen={isConnexionModalOpen} onClose={closeConnexionModal} />

            <Footer />
        </div>
    );
}