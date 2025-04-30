import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthForms from "./pages/AuthForms";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardSuperAdmin from "./pages/DashboardSuperAdmin";
import ReservationsPage from "./pages/ReservationsPage";
import EventsPage from "./pages/EventsPage";
import TalentsPage from "./pages/TalentsPage";
import UsersPage from "./pages/UsersPage";
import EspacesPage from "./pages/EspacesPage";
import CommentairesPage from "./pages/CommentairesPage";
import ReportsPage from "./pages/ReportsPage";
import SocialPage from "./pages/SocialPage";
import ConfigPage from "./pages/ConfigPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserProfil from "./pages/UserProfil";
import TalentProfil from "./pages/TalentProfil";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<AuthForms />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin routes */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reservations"
          element={
            <ProtectedRoute>
              <ReservationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/talents"
          element={
            <ProtectedRoute>
              <TalentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/espaces"
          element={
            <ProtectedRoute>
              <EspacesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/commentaires"
          element={
            <ProtectedRoute>
              <CommentairesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/social"
          element={
            <ProtectedRoute>
              <SocialPage />
            </ProtectedRoute>
          }
        />

        {/* SuperAdmin routes */}
        <Route
          path="/dashboard/superadmin"
          element={
            <ProtectedRoute>
              <DashboardSuperAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/config"
          element={
            <ProtectedRoute>
              <ConfigPage />
            </ProtectedRoute>
          }
        />

        {/* Detail routes */}
        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
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
          path="/talents/:id"
          element={
            <ProtectedRoute>
              <TalentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/talents/:id/edit"
          element={
            <ProtectedRoute>
              <TalentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/talents/new"
          element={
            <ProtectedRoute>
              <TalentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/new"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/espaces/:id"
          element={
            <ProtectedRoute>
              <EspacesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/espaces/:id/edit"
          element={
            <ProtectedRoute>
              <EspacesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/espaces/new"
          element={
            <ProtectedRoute>
              <EspacesPage />
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
        <Route path="/UserProfil" element={<UserProfil />} />
        <Route path="/TalentProfil" element={<TalentProfil />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
