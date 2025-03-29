import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import * as Pages from './pages';

// Define o caminho base do módulo
const MODULE_BASE_PATH = '/rh';

interface ModuleRoutesProps {
  basePath?: string;
}

/**
 * Componente de rotas do módulo RH
 * Permite definir um caminho base personalizado
 */
export function ModuleRoutes({ basePath = MODULE_BASE_PATH }: ModuleRoutesProps) {
  return (
    <Routes>
      {/* Página inicial - Dashboard */}
      <Route
        path={`${basePath}`}
        element={<Pages.DashboardPage />}
      />

      {/* Rotas de Recrutamento */}
      <Route
        path={`${basePath}/vagas`}
        element={<Pages.VagasPage />}
      />
      <Route
        path={`${basePath}/vagas/nova`}
        element={<Pages.NovaVagaPage />}
      />
      <Route
        path={`${basePath}/vagas/:id`}
        element={<Pages.DetalhesVagaPage />}
      />

      {/* Rotas de Candidatos */}
      <Route
        path={`${basePath}/candidatos`}
        element={<Pages.CandidatosPage />}
      />
      <Route
        path={`${basePath}/candidatos/:id`}
        element={<Pages.DetalhesCandidatoPage />}
      />

      {/* Rotas de Colaboradores */}
      <Route
        path={`${basePath}/colaboradores`}
        element={<Pages.ColaboradoresPage />}
      />
      <Route
        path={`${basePath}/colaboradores/:id`}
        element={<Pages.DetalhesColaboradorPage />}
      />
      <Route
        path={`${basePath}/colaboradores/novo`}
        element={<Pages.NovoColaboradorPage />}
      />

      {/* Rotas de Avaliação */}
      <Route
        path={`${basePath}/avaliacoes`}
        element={<Pages.AvaliacoesPage />}
      />
      <Route
        path={`${basePath}/avaliacoes/:id`}
        element={<Pages.DetalhesAvaliacaoPage />}
      />
      <Route
        path={`${basePath}/avaliacoes/nova`}
        element={<Pages.NovaAvaliacaoPage />}
      />

      {/* Rotas de Redes Sociais */}
      <Route
        path={`${basePath}/redes-sociais`}
        element={<Pages.RedesSociaisPage />}
      />

      {/* Página 404 - Para rotas não encontradas dentro do módulo */}
      <Route
        path={`${basePath}/*`}
        element={<Pages.NotFoundPage />}
      />
    </Routes>
  );
}

/**
 * Redireciona para a página principal do módulo
 */
export function RedirectToRh() {
  return <Navigate to="/rh" replace />;
}

/**
 * Wrapper para páginas que precisam de autenticação
 */
export function AuthRequired({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthenticated = true; // Usar hook real de autenticação em produção

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 