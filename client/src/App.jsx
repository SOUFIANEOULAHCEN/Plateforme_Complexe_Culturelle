import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"
import AuthForms from "./pages/AuthForms"
import DashboardAdmin from "./pages/DashboardAdmin"
import DashboardSuperAdmin from "./pages/DashboardSuperAdmin"
import ReservationsPage from "./pages/ReservationsPage"
import EventsPage from "./pages/EventsPage"
import TalentsPage from "./pages/TalentsPage"
import UsersPage from "./pages/UsersPage"
import EspacesPage from "./pages/EspacesPage"
import CommentairesPage from "./pages/CommentairesPage"
import ReportsPage from "./pages/ReportsPage"
import SocialPage from "./pages/SocialPage"
import ConfigPage from "./pages/ConfigPage"
import ProtectedRoute from "./components/ProtectedRoute"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import UserProfil from "./pages/UserProfil"
import TalentProfil from "./pages/TalentProfil"
import EventProposalsPage from "./pages/EventProposalsPage"
import ContactMessagesPage from "./pages/ContactMessagesPage"
import ChatbotQAPage from "./pages/ChatbotQAPage"
import Home from "./pages/Home"
import Header from "./home/Header"
import Contact from "./home/Contact"
// import Library from "./home/Library"
// Mini Home Pages
import CCO from "./home/miniHomePage/CCO"
import Atelier from "./home/miniHomePage/Atelier"
import Evenements from "./home/miniHomePage/Evenements"
import Bibliotheque from "./home/miniHomePage/Bibliotheque"
import Espaces from "./home/miniHomePage/Espaces"

// Layout component pour les pages publiques
function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public layout routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cco" element={<CCO />} />
          <Route path="/evenements" element={<Evenements />} />
          <Route path="/ateliers" element={<Atelier />} />
          <Route path="/bibliotheque" element={<Bibliotheque />} />
          <Route path="/espaces" element={<Espaces />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/library" element={<Library />} /> */}
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<AuthForms />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Routes utilisateur */}
        <Route
          path="/UserProfil"
          element={
            <ProtectedRoute allowedRoles={["utilisateur", "admin", "superadmin"]}>
              <UserProfil />
            </ProtectedRoute>
          }
        />

        {/* Routes talent */}
        <Route
          path="/TalentProfil"
          element={
            <ProtectedRoute allowedRoles={["talent", "admin", "superadmin"]}>
              <TalentProfil />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/messages"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <ContactMessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reservations"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <ReservationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/events"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/talents"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <TalentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/users"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/espaces"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <EspacesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/commentaires"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <CommentairesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reports"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/social"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <SocialPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/event-proposals"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <EventProposalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/chatbot"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <ChatbotQAPage />
            </ProtectedRoute>
          }
        />

        {/* SuperAdmin routes */}
        <Route
          path="/dashboard/superadmin"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <DashboardSuperAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/config"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <ConfigPage />
            </ProtectedRoute>
          }
        />

        {/* Detail routes */}
        <Route
          path="/events/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/edit"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/new"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/commentaires/:id"
          element={
            <ProtectedRoute>
              <CommentairesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/commentaires/:id/edit"
          element={
            <ProtectedRoute>
              <CommentairesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/commentaires/new"
          element={
            <ProtectedRoute>
              <CommentairesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservations/:id"
          element={
            <ProtectedRoute>
              <ReservationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations/:id/edit"
          element={
            <ProtectedRoute>
              <ReservationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations/new"
          element={
            <ProtectedRoute>
              <ReservationsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
