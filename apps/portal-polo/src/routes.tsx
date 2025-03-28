import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { 
  Dashboard, 
  AlunosLista, 
  AlunoDetalhe,
  Comissoes, 
  Repasses, 
  Relatorios, 
  Configuracoes, 
  PolosLista, 
  PoloDetalhe, 
  NotFoundPage as NotFound 
} from './pages';

export function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alunos" element={<AlunosLista />} />
        <Route path="/alunos/:id" element={<AlunoDetalhe />} />
        <Route path="/comissoes" element={<Comissoes />} />
        <Route path="/repasses" element={<Repasses />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/polos" element={<PolosLista />} />
        <Route path="/polos/:id" element={<PoloDetalhe />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
} 