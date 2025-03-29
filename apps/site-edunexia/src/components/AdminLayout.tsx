import React, { Suspense } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminNavItem = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
        isActive
          ? 'bg-blue-700 text-white'
          : 'text-gray-200 hover:bg-blue-800 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
};

const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  // Loading placeholder para o conteúdo
  const LoadingFallback = () => (
    <div className="flex items-center justify-center h-full w-full p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-blue-900 text-white w-64 flex flex-col">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Edunéxia Admin</h1>
          <p className="text-sm text-blue-300 mt-1">Painel de Gerenciamento</p>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            <AdminNavItem to="/admin">
              <span className="material-icons text-sm">dashboard</span>
              <span>Dashboard</span>
            </AdminNavItem>
            
            <h3 className="text-xs uppercase text-gray-400 font-bold px-4 pt-4 pb-2">
              Conteúdo
            </h3>
            
            <AdminNavItem to="/admin/paginas">
              <span className="material-icons text-sm">article</span>
              <span>Páginas</span>
            </AdminNavItem>
            
            <AdminNavItem to="/admin/blog">
              <span className="material-icons text-sm">description</span>
              <span>Blog</span>
            </AdminNavItem>
            
            <AdminNavItem to="/admin/categorias">
              <span className="material-icons text-sm">folder</span>
              <span>Categorias</span>
            </AdminNavItem>
            
            <h3 className="text-xs uppercase text-gray-400 font-bold px-4 pt-4 pb-2">
              Gestão
            </h3>
            
            <AdminNavItem to="/admin/leads">
              <span className="material-icons text-sm">people</span>
              <span>Leads/Contatos</span>
            </AdminNavItem>
            
            <AdminNavItem to="/admin/depoimentos">
              <span className="material-icons text-sm">format_quote</span>
              <span>Depoimentos</span>
            </AdminNavItem>
            
            <h3 className="text-xs uppercase text-gray-400 font-bold px-4 pt-4 pb-2">
              Configurações
            </h3>
            
            <AdminNavItem to="/admin/configuracoes">
              <span className="material-icons text-sm">settings</span>
              <span>Configurações</span>
            </AdminNavItem>
            
            <AdminNavItem to="/admin/menu">
              <span className="material-icons text-sm">menu</span>
              <span>Menu</span>
            </AdminNavItem>
          </nav>
        </div>
        
        <div className="border-t border-blue-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">
                <span className="uppercase text-lg font-bold">
                  {user?.nome?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.nome || 'Usuário'}
              </p>
              <p className="text-xs text-blue-300 truncate">
                {user?.email || 'admin@edunexia.com'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 rounded-full hover:bg-blue-800"
              title="Sair"
            >
              <span className="material-icons text-gray-300">logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <div className="flex-1">
            {/* Breadcrumbs ou outros elementos de navegação podem ser adicionados aqui */}
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600" title="Ver site">
              <span className="material-icons">open_in_new</span>
            </Link>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 