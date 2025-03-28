import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { UserRole } from '@edunexia/core-types';

// Importação de páginas
import { HomePage, DetailPage, EditPage, CreatePage, NotFoundPage } from './pages';

/**
 * Propriedades do componente de rotas
 */
interface ModuleRoutesProps {
  /** Caminho base do módulo (opcional) */
  basePath?: string;
}

/**
 * Componente de rotas do módulo
 * Define todas as rotas disponíveis no módulo e suas permissões
 */
export function ModuleRoutes({ basePath = '' }: ModuleRoutesProps) {
  return (
    <Routes>
      {/* Rota principal (listagem) */}
      <Route 
        path={`${basePath}`} 
        element={<HomePage />} 
      />
      
      {/* Rota de criação */}
      <Route 
        path={`${basePath}/criar`} 
        element={<CreatePage />} 
      />
      
      {/* Rota de detalhes */}
      <Route 
        path={`${basePath}/detalhe/:id`} 
        element={<DetailPage />} 
      />
      
      {/* Rota de edição */}
      <Route 
        path={`${basePath}/editar/:id`} 
        element={<EditPage />} 
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
export const MODULE_ROUTES = {
  home: {
    path: '/',
    label: 'Página Inicial',
    permissions: ['aluno', 'professor', 'admin'] as UserRole[]
  },
  create: {
    path: '/criar',
    label: 'Criar Novo',
    permissions: ['professor', 'admin'] as UserRole[]
  },
  detail: {
    path: '/detalhe/:id',
    label: 'Visualizar',
    permissions: ['aluno', 'professor', 'admin'] as UserRole[]
  },
  edit: {
    path: '/editar/:id',
    label: 'Editar',
    permissions: ['professor', 'admin'] as UserRole[]
  }
};

/**
 * Componente auxiliar para redirecionar quando o usuário 
 * tenta acessar uma rota sem permissão
 */
export function RequirePermission({ 
  children, 
  userRole, 
  requiredRoles 
}: { 
  children: React.ReactNode; 
  userRole: UserRole; 
  requiredRoles: UserRole[];
}) {
  // Verifica se o usuário tem permissão para a rota
  const hasPermission = requiredRoles.includes(userRole);
  
  // Se não tiver permissão, redireciona para a página inicial
  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }
  
  // Se tiver permissão, renderiza o conteúdo
  return <>{children}</>;
} 