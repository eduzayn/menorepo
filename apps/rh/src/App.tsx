import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@edunexia/ui-components';
import { AppLayout } from './components/layout/AppLayout';
import * as Pages from './pages';

const App: React.FC = () => {
  return (
    <Router basename="/rh">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Dashboard */}
          <Route index element={<Pages.DashboardPage />} />
          
          {/* Colaboradores */}
          <Route path="colaboradores">
            <Route index element={<Pages.ColaboradoresPage />} />
            <Route path="novo" element={<Pages.NovoColaboradorPage />} />
            <Route path=":id" element={<Pages.DetalhesColaboradorPage />} />
          </Route>
          
          {/* Vagas */}
          <Route path="vagas">
            <Route index element={<Pages.VagasPage />} />
            <Route path="nova" element={<Pages.NovaVagaPage />} />
            <Route path=":id" element={<Pages.DetalhesVagaPage />} />
          </Route>
          
          {/* Candidatos */}
          <Route path="candidatos">
            <Route index element={<Pages.CandidatosPage />} />
            <Route path="novo" element={<Pages.NovoCandidatoPage />} />
            <Route path=":id" element={<Pages.DetalhesCandidatoPage />} />
          </Route>
          
          {/* Avaliações */}
          <Route path="avaliacoes">
            <Route index element={<Pages.AvaliacoesPage />} />
            <Route path="nova" element={<Pages.NovaAvaliacaoPage />} />
            <Route path=":id" element={<Pages.DetalhesAvaliacaoPage />} />
          </Route>
          
          {/* Configurações */}
          <Route path="configuracoes" element={<Pages.ConfiguracoesPage />} />
          
          {/* Social Media */}
          <Route path="social" element={<Pages.SocialMediaPage />} />
        </Route>
        
        {/* 404 Not Found */}
        <Route path="*" element={<Pages.NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App; 