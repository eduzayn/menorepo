import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Componentes de páginas
const ConversacoesPage = React.lazy(() => import('./pages/ConversacoesPage'));
const MensagensPage = React.lazy(() => import('./pages/MensagensPage'));
const CRMPage = React.lazy(() => import('./pages/CRMPage'));
const ConfiguracoesPage = React.lazy(() => import('./pages/ConfiguracoesPage'));
const NotificacoesPage = React.lazy(() => import('./pages/NotificacoesPage'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));

// Layout principal
import Layout from './components/Layout';

// Componente de carregamento
const Loading = () => <div className="p-6 text-center">Carregando...</div>;

export default function AppRoutes() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/conversacoes" replace />} />
          <Route path="conversacoes" element={<ConversacoesPage />} />
          <Route path="mensagens" element={<MensagensPage />} />
          <Route path="crm" element={<CRMPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
          <Route path="notificacoes" element={<NotificacoesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Route>
      </Routes>
    </React.Suspense>
  );
} 