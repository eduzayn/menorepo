import React, { ReactNode } from 'react';

export interface SettingsTabProps {
  /**
   * ID único para a aba
   */
  id: string;
  
  /**
   * Título da aba
   */
  title: string;
  
  /**
   * Descrição ou subtítulo da aba
   */
  description?: string;
  
  /**
   * Ícone da aba (opcional)
   */
  icon?: ReactNode;
  
  /**
   * Conteúdo da aba
   */
  content: ReactNode;
}

export interface SettingsPageTemplateProps {
  /**
   * Título da página
   */
  title: string;
  
  /**
   * Subtítulo ou descrição da página
   */
  subtitle?: string;
  
  /**
   * Lista de abas de configurações
   */
  tabs: SettingsTabProps[];
  
  /**
   * Aba ativa inicialmente
   */
  defaultActiveTab?: string;
  
  /**
   * Indicador de carregamento
   */
  isLoading?: boolean;
  
  /**
   * Mensagem de erro (se houver)
   */
  error?: string | null;
  
  /**
   * Callback quando uma aba é alterada
   */
  onTabChange?: (tabId: string) => void;
}

/**
 * Template padronizado para páginas de configurações
 * 
 * @example
 * ```tsx
 * <SettingsPageTemplate
 *   title="Configurações"
 *   subtitle="Gerencie as configurações do sistema"
 *   tabs={[
 *     {
 *       id: 'general',
 *       title: 'Geral',
 *       icon: <Settings />,
 *       content: <GeneralSettingsForm />
 *     },
 *     {
 *       id: 'security',
 *       title: 'Segurança',
 *       icon: <Lock />,
 *       content: <SecuritySettingsForm />
 *     }
 *   ]}
 * />
 * ```
 */
export const SettingsPageTemplate: React.FC<SettingsPageTemplateProps> = ({
  title,
  subtitle,
  tabs,
  defaultActiveTab,
  isLoading = false,
  error,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = React.useState<string>(defaultActiveTab || (tabs[0]?.id || ''));

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // Encontra a aba ativa
  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="py-6">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-700">{subtitle}</p>
          )}
        </div>
        
        {/* Exibe erro se houver */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {/* Navegação de abas */}
            <div className="border-b border-gray-200">
              <div className="flex -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon && <span className="mr-2">{tab.icon}</span>}
                    {tab.title}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Conteúdo da aba ativa */}
            <div className="p-6">
              {activeTabData?.content || (
                <div className="text-center py-8 text-gray-500">
                  Selecione uma aba para ver seu conteúdo
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPageTemplate; 