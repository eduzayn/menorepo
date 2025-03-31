import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Componentes de páginas
const ConversacoesPage = React.lazy(() => import('./pages/ConversacoesPage'));
const MensagensPage = React.lazy(() => import('./pages/MensagensPage'));
const CRMPage = React.lazy(() => import('./pages/CRMPage'));
const ConfiguracoesPage = React.lazy(() => import('./pages/ConfiguracoesPage'));
const NotificacoesPage = React.lazy(() => import('./pages/NotificacoesPage'));
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'));
const LeadsPage = React.lazy(() => import('./pages/LeadsPage'));
const LeadsKanbanPage = React.lazy(() => import('./pages/LeadsKanbanPage'));
const CampanhasPage = React.lazy(() => import('./pages/CampanhasPage'));
const DetalheCampanhaPage = React.lazy(() => import('./pages/DetalheCampanhaPage'));
const RespostasRapidasPage = React.lazy(() => import('./pages/RespostasRapidasPage'));
const GruposPage = React.lazy(() => import('./pages/GruposPage'));
const BaseConhecimentoPage = React.lazy(() => import('./pages/BaseConhecimentoPage'));
const AtribuicaoAutomaticaPage = React.lazy(() => import('./pages/AtribuicaoAutomaticaPage'));
const WidgetConfigPage = React.lazy(() => import('./pages/WidgetConfigPage'));

// Layout principal
import Layout from './components/Layout';

// Componente de carregamento
const Loading = () => <div className="p-6 text-center">Carregando...</div>;

export default function AppRoutes() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/conversas" replace />} />
          <Route path="conversas" element={<ConversacoesPage />} />
          <Route path="mensagens" element={<MensagensPage />} />
          <Route path="crm" element={<CRMPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="leads/kanban" element={<LeadsKanbanPage />} />
          <Route path="campanhas" element={<CampanhasPage />} />
          <Route path="campanhas/:id" element={<DetalheCampanhaPage />} />
          <Route path="respostas-rapidas" element={<RespostasRapidasPage />} />
          <Route path="grupos" element={<GruposPage />} />
          <Route path="base-conhecimento" element={<BaseConhecimentoPage />} />
          <Route path="atribuicao-automatica" element={<AtribuicaoAutomaticaPage />} />
          <Route path="widget-config" element={<WidgetConfigPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
          <Route path="notificacoes" element={<NotificacoesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Route>
      </Routes>
    </React.Suspense>
  );
} 