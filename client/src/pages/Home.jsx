import Slider from '../home/Slider'
import AboutSection from '../home/AboutSection'
import EventSlider from '../home/EventSlider'
import WorkshopSlider from '../home/WorkshopSlider'
import Gallery from '../home/Gallery'
import { useState } from 'react'
import EventProposalForm from '../components/EventProposalForm'
import ReservationForm from '../components/ReservationForm'
import Cookies from 'js-cookie'
import Modal from '../components/Modal'
import { ChatBot } from '../components/ChatBot/ChatBot'

export default function Home() {
  const [choix, setChoix] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [userEmail, setUserEmail] = useState(Cookies.get('userEmail') || '');

  const handleOpen = (type) => {
    // Vérification de l'email utilisateur
    const email = Cookies.get('userEmail');
    if (email) {
      setUserEmail(email);
      setChoix(type);
      setShowModal(true);
    } else {
      setChoix(type);
      setShowSignup(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setChoix('');
  };
  const handleSuccess = () => {
    setShowModal(false);
    setChoix('');
    setRefresh(r => !r);
  };
  const handleSignupSuccess = (email) => {
    Cookies.set('userEmail', email);
    setUserEmail(email);
    setShowSignup(false);
    setShowModal(true);
  };
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col">

      {/* Modal d'inscription si email manquant */}
      {showSignup && (
        <Modal isOpen={showSignup} onClose={() => setShowSignup(false)} title="Inscription requise">
          <SignupForm onSuccess={handleSignupSuccess} />
        </Modal>
      )}
      {/* Modals dynamiques */}
      {/* {showModal && choix === 'event_proposal' && (
        <EventProposalForm isOpen={showModal} onClose={handleClose} onSuccess={handleSuccess} email={userEmail} />
      )}
      {showModal && choix === 'reservation' && (
        <ReservationForm isOpen={showModal} onClose={handleClose} onSuccess={handleSuccess} email={userEmail} />
      )} */}
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
      <ChatBot />
    </div>
  )
}