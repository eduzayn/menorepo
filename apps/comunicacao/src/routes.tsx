import { Routes, Route, Navigate } from 'react-router-dom';
import {
  ConversasPage,
  ConfiguracoesPage,
  RespostasRapidasPage,
  CampanhasPage,
  LeadsPage,
  CRMPage,
  GruposPage,
  NotificacoesPage,
  LoginPage,
  UnauthorizedPage,
  DetalheCampanhaPage,
  LeadsKanbanPage
} from './pages';
import WidgetConfigPage from './pages/WidgetConfigPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';

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
        path="/configuracoes/widget"
        element={
          <ProtectedRoute requiredRole="admin">
            <MainLayout>
              <WidgetConfigPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracoes/automacoes"
        element={
          <ProtectedRoute requiredRole="admin">
            <MainLayout>
              <ConfiguracoesPage />
            </MainLayout>
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
            <MainLayout>
              <CampanhasPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/campanhas/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DetalheCampanhaPage />
            </MainLayout>
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
        path="/leads/kanban"
        element={
          <ProtectedRoute>
            <LeadsKanbanPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crm"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CRMPage />
            </MainLayout>
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