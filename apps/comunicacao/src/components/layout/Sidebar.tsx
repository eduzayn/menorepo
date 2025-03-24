import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChatBubbleLeftIcon,
  UserGroupIcon,
  MegaphoneIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  UsersIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  name: string;
  path: string;
  icon: typeof ChatBubbleLeftIcon;
}

const navigation: NavItem[] = [
  { name: 'Conversas', path: '/conversas', icon: ChatBubbleLeftIcon },
  { name: 'Grupos', path: '/grupos', icon: UsersIcon },
  { name: 'Leads', path: '/leads', icon: UserGroupIcon },
  { name: 'Campanhas', path: '/campanhas', icon: MegaphoneIcon },
  { name: 'Respostas Rápidas', path: '/respostas-rapidas', icon: DocumentTextIcon },
  { name: 'Notificações', path: '/notificacoes', icon: BellIcon },
  { name: 'Configurações', path: '/configuracoes', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-lightest">
      {/* Sidebar Header */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-primary-light">
        <img
          className="h-8 w-auto"
          src="/logo.svg"
          alt="Edunexia"
        />
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive
                    ? 'bg-primary-light text-primary-dark'
                    : 'text-neutral-dark hover:bg-neutral-light hover:text-primary'
                  }
                `}
              >
                <Icon
                  className={`
                    mr-3 h-5 w-5 transition-colors
                    ${isActive
                      ? 'text-primary'
                      : 'text-neutral-dark group-hover:text-primary'
                    }
                  `}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center px-4 py-3 border-t border-primary-light bg-neutral-light">
        <div className="flex-shrink-0">
          <img
            className="h-8 w-8 rounded-full"
            src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}`}
            alt={user?.email}
          />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{user?.email}</p>
          <p className="text-xs text-neutral-dark">
            {user?.user_metadata?.role || 'Usuário'}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="ml-2 p-1 rounded-full hover:bg-neutral-lightest transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 text-neutral-dark" />
        </button>
      </div>
    </div>
  );
} 