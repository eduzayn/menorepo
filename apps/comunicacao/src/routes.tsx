import { Routes, Route, Navigate } from 'react-router-dom';
import {
  ConversasPage,
  ConfiguracoesPage,
  RespostasRapidasPage,
  CampanhasPage,
  LeadsPage,
  GruposPage,
  NotificacoesPage,
  LoginPage,
  UnauthorizedPage,
} from './pages';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ConversasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracoes"
        element={
          <ProtectedRoute>
            <ConfiguracoesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/respostas-rapidas"
        element={
          <ProtectedRoute>
            <RespostasRapidasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/campanhas"
        element={
          <ProtectedRoute>
            <CampanhasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leads"
        element={
          <ProtectedRoute>
            <LeadsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/grupos"
        element={
          <ProtectedRoute requiredRole="admin">
            <GruposPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notificacoes"
        element={
          <ProtectedRoute>
            <NotificacoesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
} 