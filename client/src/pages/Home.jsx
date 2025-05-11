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
      {/* Choix utilisateur */}
      {/* <section className="flex flex-col items-center justify-center py-8 bg-[#f6f1ed]">
        <h2 className="text-2xl font-bold mb-4 text-[#824B26]">Que souhaitez-vous faire ?</h2>
        <div className="flex gap-6">
          <button onClick={() => handleOpen('event_proposal')} className="px-6 py-3 bg-[#824B26] text-white rounded-lg font-semibold hover:bg-[#6e3d20] transition">Proposer un événement</button>
          <button onClick={() => handleOpen('reservation')} className="px-6 py-3 bg-[#e6b17a] text-[#824B26] rounded-lg font-semibold hover:bg-[#d99a4a] transition">Réserver un espace</button>
        </div>
      </section> */}
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
    </div>
  )
}