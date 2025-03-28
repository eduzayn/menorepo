import { 
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs } from '../navigation/Breadcrumbs';

const pageTitle: { [key: string]: string } = {
  '/': 'Dashboard',
  '/conversas': 'Conversas',
  '/leads': 'Leads',
  '/campanhas': 'Campanhas',
  '/grupos': 'Grupos',
  '/respostas-rapidas': 'Respostas Rápidas',
  '/notificacoes': 'Notificações',
  '/configuracoes': 'Configurações'
};

export default function TopBar() {
  const location = useLocation();
  const currentTitle = pageTitle[location.pathname] || 'Dashboard';

  return (
    <div className="flex-1 flex flex-col">
      {/* Breadcrumbs */}
      <div className="px-4">
        <Breadcrumbs />
      </div>

      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Page Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{currentTitle}</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-neutral-dark" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                className="block w-full pl-10 pr-3 py-2 border border-primary-light rounded-md leading-5 bg-neutral-lightest placeholder-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="p-2 rounded-full text-neutral-dark hover:bg-neutral-light hover:text-primary transition-colors relative"
          >
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* User Menu */}
          <button
            type="button"
            className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <img
              className="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <ChevronDownIcon className="ml-2 h-5 w-5 text-neutral-dark" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
} 