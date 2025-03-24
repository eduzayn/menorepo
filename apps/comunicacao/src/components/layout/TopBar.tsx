import { 
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';

const pageTitle: { [key: string]: string } = {
  '/conversas': 'Conversas',
  '/leads': 'Leads',
  '/campanhas': 'Campanhas',
  '/respostas-rapidas': 'Respostas Rápidas',
  '/configuracoes': 'Configurações'
};

export default function TopBar() {
  const location = useLocation();
  const currentTitle = pageTitle[location.pathname] || 'Dashboard';

  return (
    <div className="flex-1 flex items-center justify-between px-4">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{currentTitle}</h1>
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
          className="relative p-2 text-neutral-dark hover:text-primary rounded-full hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <span className="sr-only">Ver notificações</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-accent-mint ring-2 ring-white" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center space-x-3 focus:outline-none"
          >
            <img
              className="h-8 w-8 rounded-full"
              src="https://ui-avatars.com/api/?name=User"
              alt=""
            />
            <div className="hidden md:flex items-center">
              <span className="text-sm font-medium text-gray-900">Usuário</span>
              <ChevronDownIcon className="ml-2 h-5 w-5 text-neutral-dark" aria-hidden="true" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 