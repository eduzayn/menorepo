import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@edunexia/auth';
import type { ModulePermission } from '@edunexia/auth';
import Loading from '../components/Loading';

// Páginas
import LoginPage from '../pages/login';
import PortalSelectorPage from '../pages/portal-selector';
import UnauthorizedPage from '../pages/unauthorized';
import MatriculasPage from '../pages/matriculas';
import PortalAlunoPage from '../pages/portal-aluno';
import MaterialDidaticoPage from '../pages/material-didatico';
import ComunicacaoPage from '../pages/comunicacao';
import FinanceiroPage from '../pages/financeiro';
import RelatoriosPage from '../pages/relatorios';
import ConfiguracoesPage from '../pages/configuracoes';

// Componentes de rota
import ProtectedRoute from '../components/ProtectedRoute';
import ModuleRoute from '../components/ModuleRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Rotas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PortalSelectorPage />
          </ProtectedRoute>
        }
      />

      {/* Rotas de módulos */}
      <Route
        path="/matriculas/*"
        element={
          <ModuleRoute requiredPermission="matriculas.view">
            <MatriculasPage />
          </ModuleRoute>
        }
      />

      <Route
        path="/portal-aluno/*"
        element={
          <ModuleRoute requiredPermission="portal-aluno.view">
            <PortalAlunoPage />
          </ModuleRoute>
        }
      />

      <Route
        path="/material-didatico/*"
        element={
          <ModuleRoute requiredPermission="material-didatico.view">
            <MaterialDidaticoPage />
          </ModuleRoute>
        }
      />

      <Route
        path="/comunicacao/*"
        element={
          <ModuleRoute requiredPermission="comunicacao.view">
            <ComunicacaoPage />
          </ModuleRoute>
        }
      />

      <Route
        path="/financeiro/*"
        element={
          <ModuleRoute requiredPermission="financeiro.view">
            <FinanceiroPage />
          </ModuleRoute>
        }
      />

      <Route
        path="/relatorios/*"
        element={
          <ModuleRoute requiredPermission="relatorios.view">
            <RelatoriosPage />
          </ModuleRoute>
        }
      />

      <Route
        path="/configuracoes/*"
        element={
          <ModuleRoute requiredPermission="configuracoes.view">
            <ConfiguracoesPage />
          </ModuleRoute>
        }
      />

      {/* Fallback para rotas não encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 