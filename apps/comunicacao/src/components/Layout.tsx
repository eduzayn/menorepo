import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();
  
  // Função auxiliar para verificar se o link está ativo
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex h-screen">
      {/* Barra lateral de navegação */}
      <div className="w-64 bg-gray-100 border-r">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">Edunéxia Comunicação</h2>
        </div>
        
        <nav className="mt-4">
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Comunicação
            </h3>
          </div>
          <ul className="space-y-1">
            <NavItem to="/conversas" label="Conversas" isActive={isActive('/conversas')} />
            <NavItem to="/mensagens" label="Mensagens" isActive={isActive('/mensagens')} />
            <NavItem to="/notificacoes" label="Notificações" isActive={isActive('/notificacoes')} />
          </ul>
          
          <div className="px-4 py-2 mt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              CRM
            </h3>
          </div>
          <ul className="space-y-1">
            <NavItem to="/crm" label="Dashboard CRM" isActive={isActive('/crm')} />
            <NavItem to="/leads" label="Leads" isActive={isActive('/leads')} />
            <NavItem to="/leads/kanban" label="Kanban de Leads" isActive={isActive('/leads/kanban')} />
            <NavItem to="/campanhas" label="Campanhas" isActive={isActive('/campanhas')} />
          </ul>
          
          <div className="px-4 py-2 mt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Ferramentas
            </h3>
          </div>
          <ul className="space-y-1">
            <NavItem to="/respostas-rapidas" label="Respostas Rápidas" isActive={isActive('/respostas-rapidas')} />
            <NavItem to="/base-conhecimento" label="Base de Conhecimento" isActive={isActive('/base-conhecimento')} />
            <NavItem to="/atribuicao-automatica" label="Atribuição Automática" isActive={isActive('/atribuicao-automatica')} />
            <NavItem to="/grupos" label="Grupos" isActive={isActive('/grupos')} />
          </ul>
          
          <div className="px-4 py-2 mt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Sistema
            </h3>
          </div>
          <ul className="space-y-1">
            <NavItem to="/analytics" label="Analytics" isActive={isActive('/analytics')} />
            <NavItem to="/widget-config" label="Config. Widget" isActive={isActive('/widget-config')} />
            <NavItem to="/configuracoes" label="Configurações" isActive={isActive('/configuracoes')} />
          </ul>
        </nav>
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Módulo de Comunicação</h1>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Componente de item de navegação
const NavItem: React.FC<{
  to: string;
  label: string;
  isActive: boolean;
}> = ({ to, label, isActive }) => {
  return (
    <li>
      <Link
        to={to}
        className={`block px-4 py-2 text-sm rounded-md ${
          isActive
            ? 'bg-indigo-50 text-indigo-700 font-medium'
            : 'text-gray-700 hover:bg-gray-200'
        }`}
      >
        {label}
      </Link>
    </li>
  );
};

export default Layout; 