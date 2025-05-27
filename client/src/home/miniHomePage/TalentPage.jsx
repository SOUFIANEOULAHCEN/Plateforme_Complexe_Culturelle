import { FaStar, FaHandsHelping, FaUsers, FaMicrophoneAlt, FaPalette, FaQuoteLeft } from 'react-icons/fa';
import Footer from "../Footer"
import talentHero from "../../assets/img/IMGCCO/telents-hero.jpg"
import AuthForms from "../../pages/AuthForms"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function TalentPage() {
    const { t } = useTranslation()
    const [isConnexionModalOpen, setConnexionModalOpen] = useState(false)
    const [authFormMode, setAuthFormMode] = useState({ isLogin: true, isTalent: false })

    const openConnexionModal = () => {
        setAuthFormMode({ isLogin: false, isTalent: true })
        setConnexionModalOpen(true)
    }

    const closeConnexionModal = () => {
        setConnexionModalOpen(false)
    }

    const benefits = [
        {
            icon: <FaStar className="h-8 w-8 text-[#8B4513] group-hover:text-white" />,
            title: t("talent_benefit_visibility_title"),
            description: t("talent_benefit_visibility_desc")
        },
        {
            icon: <FaHandsHelping className="h-8 w-8 text-[#8B4513] group-hover:text-white" />,
            title: t("talent_benefit_support_title"),
            description: t("talent_benefit_support_desc")
        },
        {
            icon: <FaUsers className="h-8 w-8 text-[#8B4513] group-hover:text-white" />,
            title: t("talent_benefit_networking_title"),
            description: t("talent_benefit_networking_desc")
        },
        {
            icon: <FaMicrophoneAlt className="h-8 w-8 text-[#8B4513] group-hover:text-white" />,
            title: t("talent_benefit_opportunities_title"),
            description: t("talent_benefit_opportunities_desc")
        },
        {
            icon: <FaPalette className="h-8 w-8 text-[#8B4513] group-hover:text-white" />,
            title: t("talent_benefit_space_title"),
            description: t("talent_benefit_space_desc")
        }
    ];

    return (
        <div className="w-full bg-gradient-to-b from-[#FDF8F5] to-white">
            {/* Hero Section */}
            <div className="relative h-[80vh] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={talentHero}
                        alt="Talent au Palais de la Culture"
                        className="h-full w-full object-cover transition-transform duration-1000 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                </div>
                <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
                    <div className="max-w-4xl transform transition-all duration-700 hover:scale-[1.02]">
                        <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl font-serif">
                            {t("talent_hero_title")}
                        </h1>
                        <p className="text-xl text-white/90 md:text-2xl mb-8">
                            {t("talent_hero_subtitle")}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="#pourquoi"
                                className="inline-flex items-center bg-[#8B4513] text-white font-semibold py-3 px-8 rounded-full hover:bg-[#6e3d20] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                {t("talent_discover_benefits")}
                            </a>
                            <button
                                onClick={openConnexionModal}
                                className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                {t("talent_apply_now")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div id="pourquoi" className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#8B4513] font-serif relative inline-block">
                            {t("talent_why_join_title")}
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#8B4513] transform translate-y-2"></span>
                        </h2>
                        <p className="text-lg text-[#8B4513] max-w-3xl mx-auto">
                            {t("talent_why_join_description")}
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {benefits.map((benefit, index) => (
                            <div 
                                key={index} 
                                className="group rounded-2xl bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[#8B4513]/10"
                            >
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF8F5] p-4 transition-all duration-300 group-hover:bg-[#8B4513]">
                                    {benefit.icon}
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-[#8B4513]">{benefit.title}</h3>
                                <p className="text-[#8B4513]/90">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-20 bg-[#FDF8F5]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#8B4513] font-serif relative inline-block">
                            {t("talent_testimonials_title")}
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#8B4513] transform translate-y-2"></span>
                        </h2>
                    </div>
                    
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="relative rounded-2xl bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                            <FaQuoteLeft className="absolute top-8 left-8 h-8 w-8 text-[#8B4513]/20" />
                            <p className="mb-8 text-lg italic text-[#8B4513] pl-12">
                                {t("talent_testimonial_1")}
                            </p>
                            <div className="flex items-center">
                                <img 
                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                                    alt="Leila Benali" 
                                    className="h-14 w-14 rounded-full object-cover mr-4 border-2 border-[#8B4513]"
                                />
                                <div>
                                    <h4 className="font-bold text-[#8B4513]">{t("talent_artist_1_name")}</h4>
                                    <p className="text-sm text-[#8B4513]/70">{t("talent_artist_1_role")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative rounded-2xl bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                            <FaQuoteLeft className="absolute top-8 left-8 h-8 w-8 text-[#8B4513]/20" />
                            <p className="mb-8 text-lg italic text-[#8B4513] pl-12">
                                {t("talent_testimonial_2")}
                            </p>
                            <div className="flex items-center">
                                <img 
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                                    alt="Youssef Amrani" 
                                    className="h-14 w-14 rounded-full object-cover mr-4 border-2 border-[#8B4513]"
                                />
                                <div>
                                    <h4 className="font-bold text-[#8B4513]">{t("talent_artist_2_name")}</h4>
                                    <p className="text-sm text-[#8B4513]/70">{t("talent_artist_2_role")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-2xl bg-gradient-to-r from-[#8B4513] to-[#6e3d20] p-12 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/path/to/texture.png')] opacity-10"></div>
                        <div className="relative z-10">
                            <h2 className="mb-6 text-3xl md:text-4xl font-bold text-white">{t("talent_cta_title")}</h2>
                            <p className="mx-auto mb-8 max-w-2xl text-gray-200 text-lg">
                                {t("talent_cta_description")}
                            </p>
                            <button
                                onClick={openConnexionModal}
                                className="inline-flex items-center bg-white text-[#8B4513] font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                {t("talent_apply_now")}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Connexion/Inscription */}
            <AuthForms
                isOpen={isConnexionModalOpen}
                onClose={closeConnexionModal}
                initialIsLogin={authFormMode.isLogin}
                initialIsTalent={authFormMode.isTalent}
            />

            <Footer />
        </div>
    );
}