import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import DetailPanel from './DetailPanel';
import { useComunicacao } from '@/contexts/ComunicacaoContext';
import type { Conversa } from '@/lib/config';
import {
  HomeIcon,
  UsersIcon,
  CogIcon,
  BellIcon,
  EnvelopeIcon as MailIcon,
  DocumentTextIcon as DocumentReportIcon,
  UserGroupIcon,
  PhoneIcon,
  UserIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ComunicacaoProvider } from '../../contexts/ComunicacaoContext';

interface MainLayoutProps {
  children: React.ReactNode;
  showDetails?: boolean;
  detailsProps?: {
    conversa?: Conversa;
    onClose?: () => void;
  };
}

const navigation = [
  { name: 'Chat', href: '/', icon: HomeIcon },
  { name: 'Campanhas', href: '/campanhas', icon: MailIcon },
  { name: 'CRM', href: '/crm', icon: ChartBarIcon },
  { name: 'Leads', href: '/leads', icon: UserIcon },
  { name: 'Respostas Rápidas', href: '/respostas-rapidas', icon: DocumentReportIcon },
  { name: 'Grupos', href: '/grupos', icon: UserGroupIcon, admin: true },
  { name: 'Notificações', href: '/notificacoes', icon: BellIcon },
  { name: 'Configurações', href: '/configuracoes', icon: CogIcon },
];

export function MainLayout({ children, showDetails = false, detailsProps }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(showDetails);
  const { conversaAtual } = useComunicacao();
  const { user } = useAuth();

  // Determina se deve mostrar o painel de detalhes
  const shouldShowDetails = showDetails || !!conversaAtual;

  const filteredNavigation = navigation.filter(item => 
    !item.admin || (item.admin && user?.roles.includes('admin'))
  );

  return (
    <ComunicacaoProvider>
      <div className="h-screen flex overflow-hidden bg-gray-100">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                  <span className="text-xl font-bold text-indigo-600">Edunéxia</span>
                </div>
                <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                  {filteredNavigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `${
                          isActive
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md`
                      }
                    >
                      <item.icon
                        className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      {item.name}
                    </NavLink>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      <img
                        className="inline-block h-9 w-9 rounded-full"
                        src={user?.avatar_url || 'https://avatar.vercel.sh/' + user?.nome}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {user?.nome}
                      </p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                        {user?.roles.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none p-6">
            {children}
          </main>
        </div>
      </div>
    </ComunicacaoProvider>
  );
} 