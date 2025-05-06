import Slider from '../home/Slider'
import AboutSection from '../home/AboutSection'
import EventSlider from '../home/EventSlider'
import WorkshopSlider from '../home/WorkshopSlider'
import Gallery from '../home/Gallery'

export default function Home() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section avec Slider */}
      <section id="hero" className="relative">
        <Slider />
      </section>

      {/* À propos Section */}
      <section id="about" className="scroll-mt-16">
        <AboutSection />
      </section>

      {/* Événements Section */}
      <section id="events" className="scroll-mt-16">
        <EventSlider />
      </section>

      {/* Ateliers Section */}
      <section id="workshops" className="scroll-mt-16">
        <WorkshopSlider />
      </section>

      {/* Galerie Section */}
      <section id="gallery" className="scroll-mt-16">
        <Gallery />
      </section>
    </div>
  )
}