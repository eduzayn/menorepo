import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { 
  DashboardPage,
  ColaboradoresPage,
  NovoColaboradorPage,
  DetalhesColaboradorPage,
  VagasPage,
  NovaVagaPage,
  DetalhesVagaPage,
  CandidatosPage,
  NovoCandidatoPage,
  DetalhesCandidatoPage,
  AvaliacoesPage,
  NovaAvaliacaoPage,
  DetalhesAvaliacaoPage,
  ConfiguracoesPage,
  RedesSociaisPage,
  NotFoundPage
} from './pages';

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
        element={<DashboardPage />}
      />

      {/* Rotas de Recrutamento */}
      <Route
        path={`${basePath}/vagas`}
        element={<VagasPage />}
      />
      <Route
        path={`${basePath}/vagas/nova`}
        element={<NovaVagaPage />}
      />
      <Route
        path={`${basePath}/vagas/:id`}
        element={<DetalhesVagaPage />}
      />

      {/* Rotas de Candidatos */}
      <Route
        path={`${basePath}/candidatos`}
        element={<CandidatosPage />}
      />
      <Route
        path={`${basePath}/candidatos/:id`}
        element={<DetalhesCandidatoPage />}
      />

      {/* Rotas de Colaboradores */}
      <Route
        path={`${basePath}/colaboradores`}
        element={<ColaboradoresPage />}
      />
      <Route
        path={`${basePath}/colaboradores/:id`}
        element={<DetalhesColaboradorPage />}
      />
      <Route
        path={`${basePath}/colaboradores/novo`}
        element={<NovoColaboradorPage />}
      />

      {/* Rotas de Avaliação */}
      <Route
        path={`${basePath}/avaliacoes`}
        element={<AvaliacoesPage />}
      />
      <Route
        path={`${basePath}/avaliacoes/:id`}
        element={<DetalhesAvaliacaoPage />}
      />
      <Route
        path={`${basePath}/avaliacoes/nova`}
        element={<NovaAvaliacaoPage />}
      />

      {/* Rotas de Redes Sociais */}
      <Route
        path={`${basePath}/redes-sociais`}
        element={<RedesSociaisPage />}
      />

      {/* Página 404 - Para rotas não encontradas dentro do módulo */}
      <Route
        path={`${basePath}/*`}
        element={<NotFoundPage />}
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