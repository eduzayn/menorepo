import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { UserRole } from '@edunexia/core-types';

// Páginas do módulo de contabilidade
import Dashboard from './pages/Dashboard';
import PlanoContas from './pages/PlanoContas';
import Lancamentos from './pages/Lancamentos';
import RelatoriosContabeis from './pages/RelatoriosContabeis';
import ImpostosFiscais from './pages/ImpostosFiscais';
import IntegracaoFinanceira from './pages/IntegracaoFinanceira';
import IntegracaoRh from './pages/IntegracaoRh';
import AuditoriaFiscal from './pages/AuditoriaFiscal';
import TesteIntegracoes from './pages/TesteIntegracoes';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Propriedades do componente de rotas
 */
interface ContabilidadeRoutesProps {
  /** Caminho base do módulo (opcional) */
  basePath?: string;
}

/**
 * Componente de rotas do módulo de contabilidade
 * Define todas as rotas disponíveis no módulo e suas permissões
 */
export function ContabilidadeRoutes({ basePath = '' }: ContabilidadeRoutesProps) {
  return (
    <Routes>
      {/* Rota principal (dashboard) */}
      <Route 
        path={`${basePath}/`} 
        element={<Dashboard />} 
      />
      
      {/* Plano de Contas */}
      <Route 
        path={`${basePath}/plano-de-contas`} 
        element={<PlanoContas />} 
      />
      
      {/* Lançamentos contábeis */}
      <Route 
        path={`${basePath}/lancamentos`} 
        element={<Lancamentos />} 
      />
      
      {/* Relatórios Contábeis */}
      <Route 
        path={`${basePath}/relatorios`} 
        element={<RelatoriosContabeis />} 
      />
      
      {/* Impostos e Obrigações Fiscais */}
      <Route 
        path={`${basePath}/impostos-fiscais`} 
        element={<ImpostosFiscais />} 
      />
      
      {/* Integração com módulo financeiro */}
      <Route 
        path={`${basePath}/integracao-financeira`} 
        element={<IntegracaoFinanceira />} 
      />
      
      {/* Integração com módulo RH */}
      <Route 
        path={`${basePath}/integracao-rh`} 
        element={<IntegracaoRh />} 
      />
      
      {/* Auditoria Fiscal */}
      <Route 
        path={`${basePath}/auditoria-fiscal`} 
        element={<AuditoriaFiscal />} 
      />
      
      {/* Testes de Integração */}
      <Route 
        path={`${basePath}/teste-integracoes`} 
        element={<TesteIntegracoes />} 
      />
      
      {/* Rota para capturar URLs inválidas dentro do módulo */}
      <Route 
        path={`${basePath}/*`} 
        element={<NotFoundPage />} 
      />
    </Routes>
  );
}

/**
 * Mapeamento de rotas do módulo por permissão
 * Usado para construir menus dinâmicos
 */
export const CONTABILIDADE_ROUTES = {
  dashboard: {
    path: '/',
    label: 'Dashboard Contábil',
    icon: 'pie-chart',
    permissions: ['contador', 'admin_instituicao', 'financeiro', 'super_admin'] as UserRole[]
  },
  planoContas: {
    path: '/plano-de-contas',
    label: 'Plano de Contas',
    icon: 'book-open',
    permissions: ['contador', 'admin_instituicao', 'financeiro', 'super_admin'] as UserRole[]
  },
  lancamentos: {
    path: '/lancamentos',
    label: 'Lançamentos Contábeis',
    icon: 'file-text',
    permissions: ['contador', 'financeiro', 'super_admin'] as UserRole[]
  },
  relatorios: {
    path: '/relatorios',
    label: 'Relatórios Contábeis',
    icon: 'bar-chart',
    permissions: ['contador', 'admin_instituicao', 'financeiro', 'super_admin'] as UserRole[]
  },
  impostosFiscais: {
    path: '/impostos-fiscais',
    label: 'Impostos e Obrigações',
    icon: 'file',
    permissions: ['contador', 'financeiro', 'super_admin'] as UserRole[]
  },
  integracaoFinanceira: {
    path: '/integracao-financeira',
    label: 'Integração Financeira',
    icon: 'git-merge',
    permissions: ['contador', 'financeiro', 'super_admin'] as UserRole[]
  },
  integracaoRh: {
    path: '/integracao-rh',
    label: 'Integração RH',
    icon: 'users',
    permissions: ['contador', 'financeiro', 'super_admin'] as UserRole[]
  },
  auditoriaFiscal: {
    path: '/auditoria-fiscal',
    label: 'Auditoria Fiscal',
    icon: 'search',
    permissions: ['contador', 'super_admin'] as UserRole[]
  },
  testeIntegracoes: {
    path: '/teste-integracoes',
    label: 'Testes de Integração',
    icon: 'activity',
    permissions: ['contador', 'super_admin'] as UserRole[]
  }
}; 