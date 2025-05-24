import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { Suspense, lazy } from "react"
import ProtectedRoute from "./components/ProtectedRoute"
import Header from "./home/Header"

// Lazy loading des composants
const AuthForms = lazy(() => import("./pages/AuthForms"))
const DashboardAdmin = lazy(() => import("./pages/DashboardAdmin"))
const DashboardSuperAdmin = lazy(() => import("./pages/DashboardSuperAdmin"))
const ReservationsPage = lazy(() => import("./pages/ReservationsPage"))
const EventsPage = lazy(() => import("./pages/EventsPage"))
const TalentsPage = lazy(() => import("./pages/TalentsPage"))
const UsersPage = lazy(() => import("./pages/UsersPage"))
const EspacesPage = lazy(() => import("./pages/EspacesPage"))
const CommentairesPage = lazy(() => import("./pages/CommentairesPage"))
const ReportsPage = lazy(() => import("./pages/ReportsPage"))
const SocialPage = lazy(() => import("./pages/SocialPage"))
const ConfigPage = lazy(() => import("./pages/ConfigPage"))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
const ResetPassword = lazy(() => import("./pages/ResetPassword"))
const UserProfil = lazy(() => import("./pages/UserProfil"))
const TalentProfil = lazy(() => import("./pages/TalentProfil"))
const EventProposalsPage = lazy(() => import("./pages/EventProposalsPage"))
const ContactMessagesPage = lazy(() => import("./pages/ContactMessagesPage"))
const ChatbotQAPage = lazy(() => import("./pages/ChatbotQAPage"))
const Home = lazy(() => import("./pages/Home"))
const Contact = lazy(() => import("./home/Contact"))

// Mini Home Pages
const CCO = lazy(() => import("./home/miniHomePage/CCO"))
const Atelier = lazy(() => import("./home/miniHomePage/Atelier"))
const Evenements = lazy(() => import("./home/miniHomePage/Evenements"))
const Bibliotheque = lazy(() => import("./home/miniHomePage/Bibliotheque"))
const Espaces = lazy(() => import("./home/miniHomePage/Espaces"))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#8B4513]"></div>
  </div>
)

// Layout component pour les pages publiques
function PublicLayout() {
  return (
    <>
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </>
  )
}

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
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
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <EventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/new"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <EventsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/commentaires/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <CommentairesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/commentaires/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <CommentairesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/commentaires/new"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <CommentairesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reservations/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations/new"
            element={
              <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                <ReservationsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App 