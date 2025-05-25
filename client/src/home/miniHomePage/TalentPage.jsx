import { FaStar, FaHandsHelping, FaUsers, FaMicrophoneAlt, FaPalette } from 'react-icons/fa';
// import Footer from "../components/Footer";

export default function TalentPage() {
    const benefits = [
        {
            icon: <FaStar className="h-8 w-8" />,
            title: "Visibilité Accrue",
            description: "Bénéficiez d'une exposition nationale et internationale à travers nos événements et plateformes."
        },
        {
            icon: <FaHandsHelping className="h-8 w-8" />,
            title: "Soutien Professionnel",
            description: "Accès à des ressources, formations et mentors pour perfectionner votre art."
        },
        {
            icon: <FaUsers className="h-8 w-8" />,
            title: "Réseautage",
            description: "Rencontrez d'autres artistes et professionnels de l'industrie culturelle."
        },
        {
            icon: <FaMicrophoneAlt className="h-8 w-8" />,
            title: "Opportunités de Spectacles",
            description: "Participation privilégiée à nos événements et festivals."
        },
        {
            icon: <FaPalette className="h-8 w-8" />,
            title: "Espace de Création",
            description: "Accès à nos studios et espaces de travail équipés."
        }
    ];

    return (
        <div className="w-full bg-white">
            {/* Hero Section */}
            <div className="relative h-[70vh] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/IMGCCO/talent-hero.jpg"
                        alt="Talent au Palais de la Culture"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 flex h-full items-center justify-center text-center">
                    <div className="px-4">
                        <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
                            Devenez un Talent
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-200">
                            Rejoignez la communauté artistique du Palais de la Culture Mohamed 6 Ouarzazate
                        </p>
                        <div className="mt-6">
                            <a
                                href="#pourquoi"
                                className="inline-block bg-[#8B4513] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#6e3d20] transition duration-300"
                            >
                                Découvrir les avantages
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pourquoi rejoindre */}
            <div id="pourquoi" className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="text-center mb-12">
                        <h2 className="mb-4 text-3xl font-bold" style={{ color: '#8B4513' }}>Pourquoi nous rejoindre ?</h2>
                        <p className="mx-auto max-w-3xl text-gray-600" style={{ color: '#8B4513' }}>
                            Le Palais de la Culture Mohamed 6 Ouarzazate s'engage à soutenir et promouvoir les talents émergents et établis. 
                            Nous offrons une plateforme unique pour développer votre art et le partager avec un public passionné.
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
                    <h2 className="mb-12 text-center text-3xl font-bold" style={{ color: '#824B26' }}>Ils nous ont rejoint</h2>
                    
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="rounded-xl bg-white p-8 shadow-lg">
                            <p className="mb-6 italic text-gray-600" style={{ color: '#824B26' }}>
                                "Rejoindre le Palais de la Culture a transformé ma carrière. J'ai pu exposer mes œuvres à un public international et rencontrer des mentors exceptionnels."
                            </p>
                            <div className="flex items-center">
                                <img 
                                    src="/IMGCCO/artist1.jpg" 
                                    alt="Artiste" 
                                    className="h-12 w-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-semibold" style={{ color: '#824B26' }}>Leila Benali</h4>
                                    <p className="text-sm text-gray-500">Artiste Peintre</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-8 shadow-lg">
                            <p className="mb-6 italic text-gray-600" style={{ color: '#824B26' }}>
                                "Grâce aux ressources du Palais, j'ai pu enregistrer mon premier album dans des conditions professionnelles. Une opportunité inestimable !"
                            </p>
                            <div className="flex items-center">
                                <img 
                                    src="/IMGCCO/artist2.jpg" 
                                    alt="Musicien" 
                                    className="h-12 w-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-semibold" style={{ color: '#824B26' }}>Youssef Amrani</h4>
                                    <p className="text-sm text-gray-500">Musicien</p>
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
                        <h2 className="mb-6 text-3xl font-bold text-white">Prêt à nous rejoindre ?</h2>
                        <p className="mx-auto mb-8 max-w-2xl text-gray-200">
                            Soumettez votre candidature dès aujourd'hui et faites partie de notre communauté artistique dynamique.
                        </p>
                        <a
                            href="/contact"
                            className="inline-block bg-white text-[#8B4513] font-semibold py-2 px-8 rounded-md hover:bg-gray-100 transition duration-300"
                        >
                            Postuler maintenant
                        </a>
                    </div>
                </div>
            </div>

            {/* <Footer /> */}
        </div>
    );
}