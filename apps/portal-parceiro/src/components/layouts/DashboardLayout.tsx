import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  AcademicCapIcon, 
  DocumentCheckIcon, 
  BanknotesIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Instituições Parceiras', path: '/instituicoes-parceiras', icon: BuildingOfficeIcon },
    { name: 'Cursos', path: '/cursos', icon: AcademicCapIcon },
    { name: 'Certificações', path: '/certificacoes', icon: DocumentCheckIcon },
    { name: 'Financeiro', path: '/financeiro', icon: BanknotesIcon },
    { name: 'Relatórios', path: '/relatorios', icon: ChartBarIcon },
    { name: 'Configurações', path: '/configuracoes', icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-indigo-700 border-r">
            <div className="flex flex-col items-center flex-shrink-0 px-4">
              <img
                className="w-auto h-12"
                src="/logo.svg"
                alt="Edunéxia Portal do Parceiro"
              />
              <h2 className="mt-2 text-xl font-semibold text-white">Portal do Parceiro</h2>
            </div>
            <div className="flex flex-col flex-grow px-4 mt-5">
              <nav className="flex-1 space-y-1 bg-indigo-700">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `${
                        isActive
                          ? 'bg-indigo-800 text-white'
                          : 'text-indigo-100 hover:bg-indigo-600'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`
                    }
                  >
                    <item.icon
                      className="flex-shrink-0 w-6 h-6 mr-3 text-indigo-300"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex flex-shrink-0 p-4 border-t border-indigo-800">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700">
                  {user?.name.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name || 'Usuário'}</p>
                  <p className="text-xs font-medium text-indigo-200">
                    {user?.email || 'usuario@exemplo.com'}
                  </p>
                </div>
              </div>
              <button
                className="ml-auto text-indigo-200 hover:text-white"
                onClick={handleLogout}
              >
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Portal do Parceiro
            </h1>
          </div>
        </header>
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 