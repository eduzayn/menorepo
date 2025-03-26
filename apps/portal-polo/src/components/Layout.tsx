import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePoloContext } from '../contexts';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout principal do Portal do Polo
 */
export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { poloData, isPolo, isAdmin } = usePoloContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊', role: ['admin_instituicao', 'admin_polo', 'atendente_polo'] },
    { name: 'Alunos', path: '/alunos', icon: '👨‍🎓', role: ['admin_instituicao', 'admin_polo', 'atendente_polo'] },
    { name: 'Comissões', path: '/comissoes', icon: '💰', role: ['admin_instituicao', 'admin_polo', 'atendente_polo'] },
    { name: 'Repasses', path: '/repasses', icon: '💸', role: ['admin_instituicao', 'admin_polo', 'atendente_polo'] },
    { name: 'Relatórios', path: '/relatorios', icon: '📈', role: ['admin_instituicao', 'admin_polo', 'atendente_polo'] },
    { name: 'Configurações', path: '/configuracoes', icon: '⚙️', role: ['admin_instituicao', 'admin_polo'] },
    { name: 'Gestão de Polos', path: '/polos', icon: '🏢', role: ['admin_instituicao'] },
  ];

  // Filtra os itens do menu com base no tipo de usuário
  const filteredMenuItems = menuItems.filter(item => {
    if (isAdmin) return true;
    if (isPolo && item.path !== '/polos') return true;
    return false;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar para Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="flex items-center justify-center h-20 border-b">
          <h1 className="text-xl font-bold text-blue-600">Portal do Polo</h1>
        </div>
        <div className="overflow-y-auto flex-grow">
          <div className="px-4 py-6 border-b">
            <p className="text-sm font-medium text-gray-500">Polo</p>
            <p className="text-base font-semibold truncate">{poloData?.nome || 'Selecione um polo'}</p>
          </div>
          <nav className="mt-6">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${
                  location.pathname === item.path ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar para Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Fechar menu</span>
                <span className="text-white text-2xl">&times;</span>
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-blue-600">Portal do Polo</h1>
              </div>
              <div className="px-4 py-6 border-b">
                <p className="text-sm font-medium text-gray-500">Polo</p>
                <p className="text-base font-semibold truncate">{poloData?.nome || 'Selecione um polo'}</p>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {filteredMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-4">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow">
          <div className="px-4 sm:px-6 md:px-8 h-16 flex justify-between items-center border-b">
            <button
              type="button"
              className="md:hidden px-4 text-gray-500 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Abrir menu</span>
              <span className="block h-6 w-6">☰</span>
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              {filteredMenuItems.find(item => item.path === location.pathname)?.name || 'Portal do Polo'}
            </h2>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="max-w-xs bg-gray-100 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Abrir menu de usuário</span>
                    <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                      <span className="text-sm">U</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
} 