import React, { ReactNode } from 'react';

export interface DashboardLayoutProps {
  /**
   * Conteúdo principal a ser renderizado dentro do layout
   */
  children: ReactNode;
  
  /**
   * Título da página (exibido no header)
   */
  title?: string;
  
  /**
   * Menu lateral do dashboard
   */
  sidebar?: ReactNode;
  
  /**
   * Conteúdo adicional para o cabeçalho
   */
  headerContent?: ReactNode;
  
  /**
   * Conteúdo personalizado para o rodapé
   */
  footer?: ReactNode;
  
  /**
   * Usuário logado (opcional)
   */
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  
  /**
   * Eventos de autenticação
   */
  onLogout?: () => void;
}

/**
 * Layout padronizado para páginas de dashboard
 * Inclui estrutura básica com header, menu lateral e área de conteúdo
 * 
 * @example
 * ```tsx
 * <DashboardLayout
 *   title="Módulo de Matrículas"
 *   user={{ name: "João Silva", email: "joao@exemplo.com" }}
 *   onLogout={() => handleLogout()}
 * >
 *   <div>Conteúdo principal do dashboard</div>
 * </DashboardLayout>
 * ```
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  sidebar,
  headerContent,
  footer,
  user,
  onLogout
}) => {
  // Renderização do menu lateral padrão se não for fornecido um personalizado
  const defaultSidebar = (
    <aside className="bg-gray-800 text-white w-64 min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold">Edunéxia</h2>
      </div>
      <nav className="mt-6">
        <ul>
          <li className="px-4 py-2 hover:bg-gray-700">
            <a href="/dashboard" className="block">Dashboard</a>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <a href="/perfil" className="block">Meu Perfil</a>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <a href="/configuracoes" className="block">Configurações</a>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700">
            <button 
              onClick={onLogout} 
              className="block w-full text-left"
            >
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );

  // Renderização do footer padrão se não for fornecido um personalizado
  const defaultFooter = (
    <footer className="bg-white border-t py-4 px-6">
      <p className="text-sm text-gray-600 text-center">
        &copy; {new Date().getFullYear()} Edunéxia - Todos os direitos reservados
      </p>
    </footer>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu lateral */}
      {sidebar || defaultSidebar}
      
      {/* Área principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              {title && <h1 className="text-lg font-semibold">{title}</h1>}
            </div>
            
            {headerContent || (
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="flex items-center">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name || 'Usuário'} 
                        className="w-8 h-8 rounded-full mr-2" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                        <span className="text-sm font-medium text-gray-700">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {user.name || user.email || 'Usuário'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
        
        {/* Conteúdo principal */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        
        {/* Footer */}
        {footer || defaultFooter}
      </div>
    </div>
  );
};

export default DashboardLayout; 