import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { AccessDeniedPage } from '../pages/AccessDeniedPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { PublicHomePage } from '../pages/PublicHomePage';
import { CreateTournamentPage } from '../pages/CreateTournamentPage';
import { TournamentsPage } from '../pages/TournamentsPage';
import { TournamentDetailsPage } from '../pages/TournamentDetailsPage';
import { UsersPage } from '../pages/UsersPage';
import { TeamsPage } from '../pages/TeamsPage';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="/public" element={<PublicHomePage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/tournaments/new" element={<CreateTournamentPage />} />
        <Route path="/tournaments/:id" element={<TournamentDetailsPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>

      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/public" replace />} />
    </Routes>
  );
}
