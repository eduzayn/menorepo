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
  BookOpenIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

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
  { name: 'Base de Conhecimento', path: '/base-conhecimento', icon: BookOpenIcon },
  { name: 'Atribuição Automática', path: '/atribuicao-automatica', icon: ArrowsRightLeftIcon },
  { name: 'Respostas Rápidas', path: '/respostas-rapidas', icon: DocumentTextIcon },
  { name: 'Notificações', path: '/notificacoes', icon: BellIcon },
  { name: 'Configurações', path: '/configuracoes', icon: Cog6ToothIcon },
];

// Subnavegação para configurações
const configSubnav = [
  { name: 'Perfil', path: '/configuracoes?tab=perfil' },
  { name: 'Notificações', path: '/configuracoes?tab=notificacoes' },
  { name: 'Assistente IA', path: '/configuracoes?tab=ia' },
  { name: 'Automações', path: '/configuracoes?tab=automacoes' },
  { name: 'Listas', path: '/configuracoes?tab=automacoes&subtab=listas' },
  { name: 'Campanhas', path: '/configuracoes?tab=automacoes&subtab=campanhas' },
  { name: 'Geral', path: '/configuracoes?tab=geral' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Verificar se está em alguma subpágina de configurações
  const isConfigPage = location.pathname.startsWith('/configuracoes');

  // Toggle submenu
  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(prev => prev === menu ? null : menu);
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
            const isConfigItem = item.path === '/configuracoes';
            const showSubmenu = isConfigItem && (openSubmenu === 'config' || isConfigPage);

            return (
              <div key={item.name}>
                {isConfigItem ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu('config')}
                      className={`
                        w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
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
                      <span className="flex-1 text-left">{item.name}</span>
                      <svg
                        className={`ml-2 h-4 w-4 transform transition-transform ${showSubmenu ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showSubmenu && (
                      <div className="pl-10 pr-2 mt-1 space-y-1">
                        {configSubnav.map((subItem) => {
                          const isSubActive = location.pathname === subItem.path;
                          
                          return (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className={`
                                block px-3 py-2 text-sm rounded-md transition-colors
                                ${isSubActive
                                  ? 'bg-primary-lighter text-primary-dark font-medium'
                                  : 'text-neutral-dark hover:bg-neutral-lighter hover:text-primary'
                                }
                              `}
                            >
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
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
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center px-4 py-3 border-t border-primary-light bg-neutral-light">
        <div className="flex-shrink-0">
          <img
            className="h-8 w-8 rounded-full"
            src={(user as any)?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}`}
            alt={user?.email}
          />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{user?.email}</p>
          <p className="text-xs text-neutral-dark">
            {(user as any)?.user_metadata?.role || 'Usuário'}
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