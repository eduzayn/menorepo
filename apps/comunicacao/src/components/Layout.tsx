import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Barra lateral de navegação */}
      <div className="w-64 bg-gray-100 border-r">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">Edunéxia Comunicação</h2>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <Link to="/conversacoes" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                Conversações
              </Link>
            </li>
            <li>
              <Link to="/mensagens" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                Mensagens
              </Link>
            </li>
            <li>
              <Link to="/crm" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                CRM
              </Link>
            </li>
            <li>
              <Link to="/notificacoes" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                Notificações
              </Link>
            </li>
            <li>
              <Link to="/analytics" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                Analytics
              </Link>
            </li>
            <li>
              <Link to="/configuracoes" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                Configurações
              </Link>
            </li>
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

export default Layout; 