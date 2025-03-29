import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTE_PREFIXES } from '@edunexia/core';
import { useAuth } from '@edunexia/auth';
import {
  ConversasPage,
  LoginPage,
  UnauthorizedPage,
  ConfiguracoesPage,
  RespostasRapidasPage,
  CampanhasPage,
  DetalheCampanhaPage,
  LeadsPage,
  LeadsKanbanPage,
  CRMPage,
  GruposPage,
  NotificacoesPage,
  AnalyticsPage
} from './pages';
import { MainLayout } from './components/layout/MainLayout';

// Prefixo para todas as rotas deste módulo
const PREFIX = ROUTE_PREFIXES.COMUNICACAO;

// Componente para proteção de rotas
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) => {
  const { user, isAuthenticated, loading, loginPath } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace />;
  }
  
  if (requiredRole && !user?.app_metadata?.roles?.includes(requiredRole)) {
    return <Navigate to={`${PREFIX}/unauthorized`} replace />;
  }
  
  return <>{children}</>;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas de autenticação */}
      <Route path={`${PREFIX}/auth/login`} element={<LoginPage />} />
      <Route path={`${PREFIX}/unauthorized`} element={<UnauthorizedPage />} />
      
      {/* Rotas protegidas */}
      <Route path={`${PREFIX}`} element={
        <ProtectedRoute>
          <ConversasPage />
        </ProtectedRoute>
      } />
      
      <Route path={`${PREFIX}/configuracoes`} element={
        <ProtectedRoute>
          <ConfiguracoesPage />
        </ProtectedRoute>
      } />
      
      <Route path={`${PREFIX}/configuracoes/widget`} element={
        <ProtectedRoute requiredRole="admin">
          <MainLayout>
            <ConfiguracoesPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path={`${PREFIX}/configuracoes/automacoes`} element={
        <ProtectedRoute requiredRole="admin">
          <MainLayout>
            <ConfiguracoesPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path={`${PREFIX}/respostas-rapidas`} element={
        <ProtectedRoute>
          <RespostasRapidasPage />
        </ProtectedRoute>
      } />
      
      <Route path={`${PREFIX}/campanhas`} element={
        <ProtectedRoute>
          <MainLayout>
            <CampanhasPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path={`${PREFIX}/campanhas/:id`} element={
        <ProtectedRoute>
          <MainLayout>
            <DetalheCampanhaPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path={`${PREFIX}/leads`} element={
        <ProtectedRoute>
          <LeadsPage />
        </ProtectedRoute>
      } />
      
      <Route path={`${PREFIX}/leads/kanban`} element={
        <ProtectedRoute>
          <LeadsKanbanPage />
        </ProtectedRoute>
      } />
      
      <Route path={`${PREFIX}/crm`} element={
        <ProtectedRoute>
          <MainLayout>
            <CRMPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path={`${PREFIX}/grupos`} element={
        <ProtectedRoute requiredRole="admin">
          <GruposPage />
        </ProtectedRoute>
      } />
      
      <Route path={`${PREFIX}/notificacoes`} element={
        <ProtectedRoute>
          <NotificacoesPage />
        </ProtectedRoute>
      } />
      
      <Route path={`${PREFIX}/analytics`} element={
        <ProtectedRoute>
          <MainLayout>
            <AnalyticsPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Redirecionamentos para compatibilidade */}
      <Route path="/login" element={<Navigate to={`${PREFIX}/auth/login`} replace />} />
      <Route path="/" element={<Navigate to={PREFIX} replace />} />
      <Route path="/configuracoes" element={<Navigate to={`${PREFIX}/configuracoes`} replace />} />
      <Route path="/configuracoes/widget" element={<Navigate to={`${PREFIX}/configuracoes/widget`} replace />} />
      <Route path="/respostas-rapidas" element={<Navigate to={`${PREFIX}/respostas-rapidas`} replace />} />
      <Route path="/campanhas" element={<Navigate to={`${PREFIX}/campanhas`} replace />} />
      <Route path="/leads" element={<Navigate to={`${PREFIX}/leads`} replace />} />
      <Route path="/crm" element={<Navigate to={`${PREFIX}/crm`} replace />} />
      <Route path="/grupos" element={<Navigate to={`${PREFIX}/grupos`} replace />} />
      <Route path="/notificacoes" element={<Navigate to={`${PREFIX}/notificacoes`} replace />} />
      <Route path="/analytics" element={<Navigate to={`${PREFIX}/analytics`} replace />} />
      
      {/* Página não encontrada */}
      <Route path="*" element={<Navigate to={PREFIX} replace />} />
    </Routes>
  );
} 