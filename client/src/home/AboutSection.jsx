export default function AboutSection() {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-4xl font-serif text-[#8B4513]">
                Complexe Culturel
                <br />
                OUARZAZATE
              </h2>
              <p className="text-[#8B4513] leading-relaxed">
                Le Complexe Culturel de Ouarzazatevalorise la culture et les talents locaux en accueillant divers événements artistiques et culturels. 
                Pour répondre à l’évolution des besoins,
                il adopte un système numérique pour moderniser la gestion, améliorer la visibilité et renforcer la participation citoyenne.
              </p>
              <p className="text-[#8B4513] leading-relaxed">
              Ce lieu emblématique aspire à devenir un espace de rencontre et d’échange, favorisant la créativité et l’engagement communautaire.
              </p>
              <button className="border-2 border-[#8B4513] text-[#8B4513] px-8 py-2 rounded-md hover:bg-[#8B4513] hover:text-white transition-colors duration-300">
                Voir Plus
              </button>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-6">
              <img
                src="/assets/atelier-theater.jpg"
                alt="Cultural Activity 1"
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
              <img
                src="/assets/library.jpg"
                alt="Cultural Activity 2"
                className="w-full h-[400px] object-cover rounded-lg shadow-lg transform translate-y-10"
              />
            </div>

          </div>
        </div>
      </section>
    )
  }
  
  