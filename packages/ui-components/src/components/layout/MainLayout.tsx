import React, { ReactNode } from 'react';
import { 
  Users, 
  Calendar, 
  Inbox, 
  FileText, 
  BarChart2, 
  Home, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft
} from 'lucide-react';

export interface NavigationItem {
  /**
   * Nome do item de navegação
   */
  name: string;
  
  /**
   * Caminho/rota do item
   */
  href: string;
  
  /**
   * Ícone do item (componente React)
   */
  icon: React.ElementType;
  
  /**
   * Se o item requer privilégio de administrador
   */
  admin?: boolean;
}

export interface MainLayoutProps {
  /**
   * Conteúdo principal a ser renderizado dentro do layout
   */
  children: ReactNode;
  
  /**
   * Título da página ou do módulo (exibido no header)
   */
  title?: string;
  
  /**
   * Itens de navegação personalizados
   */
  navigationItems?: NavigationItem[];
  
  /**
   * Conteúdo personalizado para a sidebar
   */
  sidebarContent?: ReactNode;
  
  /**
   * Conteúdo adicional para o cabeçalho
   */
  headerContent?: ReactNode;
  
  /**
   * Conteúdo personalizado para o rodapé
   */
  footer?: ReactNode;
  
  /**
   * Usuário logado
   */
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    roles?: string[];
  };
  
  /**
   * Função para renderizar um item de navegação personalizado
   */
  renderNavigationItem?: (item: NavigationItem, isActive: boolean) => ReactNode;
  
  /**
   * Painel de detalhes lateral (para módulos como comunicação)
   */
  detailsPanel?: ReactNode;
  
  /**
   * Se o painel de detalhes deve ser exibido
   */
  showDetailsPanel?: boolean;
  
  /**
   * Eventos de autenticação
   */
  onLogout?: () => void;
  
  /**
   * Classe CSS adicional para o elemento raiz
   */
  className?: string;
}

const defaultNavigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Alunos', href: '/alunos', icon: Users },
  { name: 'Calendário', href: '/calendario', icon: Calendar },
  { name: 'Mensagens', href: '/mensagens', icon: Inbox },
  { name: 'Documentos', href: '/documentos', icon: FileText },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart2 },
  { name: 'Configurações', href: '/configuracoes', icon: Settings, admin: true },
];

export default function MainLayout({
  children,
  title = 'Dashboard',
  navigationItems = defaultNavigationItems,
  sidebarContent,
  headerContent,
  footer,
  user,
  renderNavigationItem,
  detailsPanel,
  showDetailsPanel = false,
  onLogout,
  className = '',
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  // Filter navigation items based on user roles
  const filteredNavigationItems = React.useMemo(() => {
    if (!user?.roles || user.roles.includes('admin')) {
      return navigationItems;
    }
    return navigationItems.filter(item => !item.admin);
  }, [navigationItems, user?.roles]);
  
  // Determine if a navigation item is active
  const isActive = (item: NavigationItem) => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path === item.href || path.startsWith(`${item.href}/`);
    }
    return false;
  };
  
  // Default rendering for navigation items
  const defaultRenderNavigationItem = (item: NavigationItem, active: boolean) => (
    <a
      key={item.name}
      href={item.href}
      className={`
        flex items-center px-3 py-2 text-sm font-medium rounded-md
        ${active 
          ? 'bg-indigo-100 text-indigo-700' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
      `}
    >
      <item.icon className="mr-3 h-5 w-5" />
      {item.name}
    </a>
  );
  
  return (
    <div className={`h-screen flex overflow-hidden bg-gray-50 ${className}`}>
      {/* Mobile Sidebar */}
      <div
        className={`
          fixed inset-0 z-40 flex md:hidden
          ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          transition-opacity ease-linear duration-300
        `}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Fechar menu</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h2 className="text-xl font-bold text-gray-900">Edunéxia</h2>
            </div>
            
            {sidebarContent ? (
              sidebarContent
            ) : (
              <nav className="mt-5 px-2 space-y-1">
                {filteredNavigationItems.map((item) => {
                  const active = isActive(item);
                  return renderNavigationItem 
                    ? renderNavigationItem(item, active)
                    : defaultRenderNavigationItem(item, active);
                })}
              </nav>
            )}
          </div>
          
          {user && (
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 group block">
                <div className="flex items-center">
                  <div>
                    {user.avatar ? (
                      <img className="inline-block h-10 w-10 rounded-full" src={user.avatar} alt={user.name || 'Avatar'} />
                    ) : (
                      <div className="inline-flex h-10 w-10 rounded-full bg-gray-200 items-center justify-center text-gray-500">
                        <span className="text-sm font-medium">{user.name ? user.name.charAt(0) : '?'}</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{user.name}</p>
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h2 className="text-xl font-bold text-gray-900">Edunéxia</h2>
              </div>
              
              {sidebarContent ? (
                sidebarContent
              ) : (
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  {filteredNavigationItems.map((item) => {
                    const active = isActive(item);
                    return renderNavigationItem 
                      ? renderNavigationItem(item, active)
                      : defaultRenderNavigationItem(item, active);
                  })}
                </nav>
              )}
            </div>
            
            {user && (
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      {user.avatar ? (
                        <img className="inline-block h-10 w-10 rounded-full" src={user.avatar} alt={user.name || 'Avatar'} />
                      ) : (
                        <div className="inline-flex h-10 w-10 rounded-full bg-gray-200 items-center justify-center text-gray-500">
                          <span className="text-sm font-medium">{user.name ? user.name.charAt(0) : '?'}</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{user.name}</p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir menu</span>
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
              {headerContent && <div className="ml-4">{headerContent}</div>}
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {onLogout && (
                <button
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={onLogout}
                >
                  <span className="sr-only">Sair</span>
                  <LogOut className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
            <div className="py-6 px-4 sm:px-6 md:px-8">
              {children}
            </div>
            {footer && (
              <footer className="bg-white border-t border-gray-200 p-4">
                {footer}
              </footer>
            )}
          </main>
          
          {detailsPanel && (
            <aside 
              className={`
                border-l border-gray-200 bg-white overflow-y-auto
                transform transition-all duration-300 ease-in-out
                ${showDetailsPanel ? 'translate-x-0 w-96' : 'translate-x-full w-0'}
              `}
            >
              <div className="h-full relative">
                <button
                  type="button"
                  className="absolute top-4 left-4 text-gray-400 hover:text-gray-500 md:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Fechar painel de detalhes</span>
                </button>
                {detailsPanel}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Exemplo de uso:
 * 
 * <MainLayout
 *   title="Módulo de Comunicação"
 *   user={{
 *     name: "João Silva",
 *     email: "joao@edunexia.com",
 *     roles: ["admin"]
 *   }}
 *   onLogout={() => handleLogout()}
 * >
 *   <div>Conteúdo principal aqui...</div>
 * </MainLayout>
 */ 