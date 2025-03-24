import { Link, useLocation } from 'react-router-dom';
import {
  ChatBubbleLeftIcon,
  UserGroupIcon,
  MegaphoneIcon,
  DocumentTextIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  path: string;
  icon: typeof ChatBubbleLeftIcon;
}

const navigation: NavItem[] = [
  { name: 'Conversas', path: '/conversas', icon: ChatBubbleLeftIcon },
  { name: 'Leads', path: '/leads', icon: UserGroupIcon },
  { name: 'Campanhas', path: '/campanhas', icon: MegaphoneIcon },
  { name: 'Respostas Rápidas', path: '/respostas-rapidas', icon: DocumentTextIcon },
  { name: 'Configurações', path: '/configuracoes', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        {/* Sidebar Header */}
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b border-gray-200">
          <img
            className="h-8 w-auto"
            src="/logo.svg"
            alt="Edunexia"
          />
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col flex-1 bg-white border-r border-gray-200">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon
                    className={`
                      mr-3 h-6 w-6
                      ${isActive
                        ? 'text-gray-500'
                        : 'text-gray-400 group-hover:text-gray-500'
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
      </div>
    </div>
  );
} 