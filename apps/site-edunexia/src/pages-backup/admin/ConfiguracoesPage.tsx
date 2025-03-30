import React, { useState } from 'react';
import { SETTING_TYPES } from '../../services/site-settings';
import { 
  useGeneralSettings, 
  useSeoSettings, 
  useContactSettings, 
  useSocialSettings,
  useAppearanceSettings,
  useIntegrationSettings,
  useUpdateSetting
} from '../../hooks/useSettings';
import { FormSection } from '../../components/admin/FormSection';

type SettingTab = 'general' | 'seo' | 'contact' | 'social' | 'appearance' | 'integrations';

const ConfiguracoesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingTab>('general');
  
  // Obter dados de cada tipo de configuração
  const generalSettings = useGeneralSettings();
  const seoSettings = useSeoSettings();
  const contactSettings = useContactSettings();
  const socialSettings = useSocialSettings();
  const appearanceSettings = useAppearanceSettings();
  const integrationSettings = useIntegrationSettings();
  
  // Mutation para atualizar configurações
  const updateSetting = useUpdateSetting();
  
  // Função para lidar com alterações nas configurações
  const handleSettingChange = (settingId: string, field: string, value: any) => {
    // Buscar dados atuais
    let currentData;
    switch (settingId) {
      case SETTING_TYPES.GENERAL:
        currentData = generalSettings.data?.value || {};
        break;
      case SETTING_TYPES.SEO:
        currentData = seoSettings.data?.value || {};
        break;
      case SETTING_TYPES.CONTACT:
        currentData = contactSettings.data?.value || {};
        break;
      case SETTING_TYPES.SOCIAL:
        currentData = socialSettings.data?.value || {};
        break;
      case SETTING_TYPES.APPEARANCE:
        currentData = appearanceSettings.data?.value || {};
        break;
      case SETTING_TYPES.INTEGRATIONS:
        currentData = integrationSettings.data?.value || {};
        break;
      default:
        currentData = {};
    }
    
    // Atualizar valor
    const newValue = {
      ...currentData,
      [field]: value
    };
    
    // Enviar atualização
    updateSetting.mutate({
      id: settingId,
      data: { value: newValue }
    });
  };
  
  // Função para gerar campos de formulário simples
  const renderField = (
    settingId: string, 
    currentValue: Record<string, any>, 
    field: string, 
    label: string, 
    type: 'text' | 'textarea' | 'color' | 'checkbox' | 'number' | 'select' = 'text',
    options?: { value: string, label: string }[],
    placeholder?: string
  ) => {
    const value = currentValue[field] !== undefined ? currentValue[field] : '';
    
    return (
      <div className="mb-4">
        <label htmlFor={`${settingId}-${field}`} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        
        {type === 'textarea' ? (
          <textarea
            id={`${settingId}-${field}`}
            value={value}
            onChange={(e) => handleSettingChange(settingId, field, e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={placeholder}
            rows={4}
          />
        ) : type === 'checkbox' ? (
          <div className="mt-1">
            <input
              type="checkbox"
              id={`${settingId}-${field}`}
              checked={!!value}
              onChange={(e) => handleSettingChange(settingId, field, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-500">{placeholder}</span>
          </div>
        ) : type === 'select' && options ? (
          <select
            id={`${settingId}-${field}`}
            value={value}
            onChange={(e) => handleSettingChange(settingId, field, e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={`${settingId}-${field}`}
            value={value}
            onChange={(e) => {
              const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
              handleSettingChange(settingId, field, newValue);
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={placeholder}
          />
        )}
      </div>
    );
  };
  
  // Renderizar abas
  const tabs = [
    { id: 'general', label: 'Geral' },
    { id: 'seo', label: 'SEO' },
    { id: 'contact', label: 'Contato' },
    { id: 'social', label: 'Redes Sociais' },
    { id: 'appearance', label: 'Aparência' },
    { id: 'integrations', label: 'Integrações' },
  ];
  
  // Exibir estado de carregamento
  const isLoading = 
    generalSettings.isLoading || 
    seoSettings.isLoading || 
    contactSettings.isLoading || 
    socialSettings.isLoading ||
    appearanceSettings.isLoading ||
    integrationSettings.isLoading;
  
  // Estado de salvamento
  const isSaving = updateSetting.isLoading;
  
  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações do Site</h1>
        <p className="text-gray-600 mt-1">
          Personalize as configurações do site institucional
        </p>
      </div>
      
      {/* Abas de navegação */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingTab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Conteúdo da aba selecionada */}
      <div className="space-y-6">
        {activeTab === 'general' && generalSettings.data && (
          <FormSection title="Configurações Gerais">
            {renderField(SETTING_TYPES.GENERAL, generalSettings.data.value, 'site_name', 'Nome do Site')}
            {renderField(SETTING_TYPES.GENERAL, generalSettings.data.value, 'site_description', 'Descrição do Site', 'textarea')}
            {renderField(SETTING_TYPES.GENERAL, generalSettings.data.value, 'logo_url', 'URL do Logo')}
            {renderField(SETTING_TYPES.GENERAL, generalSettings.data.value, 'favicon_url', 'URL do Favicon')}
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {renderField(SETTING_TYPES.GENERAL, generalSettings.data.value, 'primary_color', 'Cor Primária', 'color')}
              {renderField(SETTING_TYPES.GENERAL, generalSettings.data.value, 'secondary_color', 'Cor Secundária', 'color')}
              {renderField(SETTING_TYPES.GENERAL, generalSettings.data.value, 'accent_color', 'Cor de Destaque', 'color')}
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {renderField(SETTING_TYPES.GENERAL, generalSettings.data.value, 'language', 'Idioma', 'select', [
                { value: 'pt-BR', label: 'Português (Brasil)' },
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Español' }
              ])}
              {renderField(SETTING_TYPES.GENERAL, generalSettings.data.value, 'timezone', 'Fuso Horário', 'select', [
                { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
                { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
                { value: 'America/Belem', label: 'Belém (GMT-3)' }
              ])}
            </div>
            
            {renderField(SETTING_TYPES.GENERAL, generalSettings.data.value, 'show_cookie_consent', 'Exibir aviso de cookies', 'checkbox', undefined, 'Exibe um banner informando sobre o uso de cookies no site')}
            {renderField(SETTING_TYPES.GENERAL, generalSettings.data.value, 'cookie_consent_text', 'Texto do aviso de cookies', 'textarea')}
          </FormSection>
        )}
        
        {activeTab === 'seo' && seoSettings.data && (
          <FormSection title="Configurações de SEO">
            {renderField(SETTING_TYPES.SEO, seoSettings.data.value, 'meta_title', 'Título da página (meta title)')}
            {renderField(SETTING_TYPES.SEO, seoSettings.data.value, 'meta_description', 'Descrição da página (meta description)', 'textarea')}
            {renderField(SETTING_TYPES.SEO, seoSettings.data.value, 'meta_keywords', 'Palavras-chave (meta keywords)')}
            {renderField(SETTING_TYPES.SEO, seoSettings.data.value, 'og_image', 'Imagem para compartilhamento (og:image)')}
            {renderField(SETTING_TYPES.SEO, seoSettings.data.value, 'canonical_url', 'URL Canônica')}
            {renderField(SETTING_TYPES.SEO, seoSettings.data.value, 'google_analytics_id', 'ID do Google Analytics')}
            {renderField(SETTING_TYPES.SEO, seoSettings.data.value, 'google_tag_manager_id', 'ID do Google Tag Manager')}
            {renderField(SETTING_TYPES.SEO, seoSettings.data.value, 'google_site_verification', 'Código de verificação do Google')}
            {renderField(SETTING_TYPES.SEO, seoSettings.data.value, 'enable_robots', 'Permitir indexação por robôs', 'checkbox', undefined, 'Permite que mecanismos de busca indexem o site')}
          </FormSection>
        )}
        
        {activeTab === 'contact' && contactSettings.data && (
          <FormSection title="Configurações de Contato">
            {renderField(SETTING_TYPES.CONTACT, contactSettings.data.value, 'address', 'Endereço')}
            {renderField(SETTING_TYPES.CONTACT, contactSettings.data.value, 'email', 'Email de contato')}
            {renderField(SETTING_TYPES.CONTACT, contactSettings.data.value, 'phone', 'Telefone')}
            {renderField(SETTING_TYPES.CONTACT, contactSettings.data.value, 'whatsapp', 'WhatsApp')}
            {renderField(SETTING_TYPES.CONTACT, contactSettings.data.value, 'working_hours', 'Horário de funcionamento')}
            {renderField(SETTING_TYPES.CONTACT, contactSettings.data.value, 'google_maps_embed', 'Código do Google Maps', 'textarea', undefined, 'Código de incorporação (iframe) do Google Maps')}
          </FormSection>
        )}
        
        {activeTab === 'social' && socialSettings.data && (
          <FormSection title="Redes Sociais">
            {renderField(SETTING_TYPES.SOCIAL, socialSettings.data.value, 'facebook', 'Facebook')}
            {renderField(SETTING_TYPES.SOCIAL, socialSettings.data.value, 'instagram', 'Instagram')}
            {renderField(SETTING_TYPES.SOCIAL, socialSettings.data.value, 'twitter', 'Twitter')}
            {renderField(SETTING_TYPES.SOCIAL, socialSettings.data.value, 'youtube', 'YouTube')}
            {renderField(SETTING_TYPES.SOCIAL, socialSettings.data.value, 'linkedin', 'LinkedIn')}
            {renderField(SETTING_TYPES.SOCIAL, socialSettings.data.value, 'tiktok', 'TikTok')}
            {renderField(SETTING_TYPES.SOCIAL, socialSettings.data.value, 'pinterest', 'Pinterest')}
            {renderField(SETTING_TYPES.SOCIAL, socialSettings.data.value, 'display_social_share', 'Exibir botões de compartilhamento', 'checkbox')}
            {renderField(SETTING_TYPES.SOCIAL, socialSettings.data.value, 'display_social_follow', 'Exibir botões de seguir', 'checkbox')}
          </FormSection>
        )}
        
        {activeTab === 'appearance' && appearanceSettings.data && (
          <FormSection title="Aparência">
            {renderField(SETTING_TYPES.APPEARANCE, appearanceSettings.data.value, 'theme', 'Tema', 'select', [
              { value: 'light', label: 'Claro' },
              { value: 'dark', label: 'Escuro' }
            ])}
            {renderField(SETTING_TYPES.APPEARANCE, appearanceSettings.data.value, 'enable_dark_mode', 'Permitir alternar modo escuro', 'checkbox')}
            {renderField(SETTING_TYPES.APPEARANCE, appearanceSettings.data.value, 'hero_style', 'Estilo do Banner Principal', 'select', [
              { value: 'centered', label: 'Centralizado' },
              { value: 'left-aligned', label: 'Alinhado à esquerda' },
              { value: 'split', label: 'Dividido' }
            ])}
            {renderField(SETTING_TYPES.APPEARANCE, appearanceSettings.data.value, 'footer_columns', 'Colunas do Rodapé', 'number')}
            {renderField(SETTING_TYPES.APPEARANCE, appearanceSettings.data.value, 'font_family', 'Família de Fonte', 'select', [
              { value: 'Inter', label: 'Inter' },
              { value: 'Roboto', label: 'Roboto' },
              { value: 'Open Sans', label: 'Open Sans' },
              { value: 'Montserrat', label: 'Montserrat' }
            ])}
            {renderField(SETTING_TYPES.APPEARANCE, appearanceSettings.data.value, 'button_style', 'Estilo dos Botões', 'select', [
              { value: 'rounded', label: 'Arredondado' },
              { value: 'square', label: 'Quadrado' },
              { value: 'pill', label: 'Formato de pílula' }
            ])}
            {renderField(SETTING_TYPES.APPEARANCE, appearanceSettings.data.value, 'show_back_to_top', 'Exibir botão "Voltar ao topo"', 'checkbox')}
            {renderField(SETTING_TYPES.APPEARANCE, appearanceSettings.data.value, 'use_animations', 'Usar animações', 'checkbox')}
            {renderField(SETTING_TYPES.APPEARANCE, appearanceSettings.data.value, 'custom_css', 'CSS Personalizado', 'textarea')}
          </FormSection>
        )}
        
        {activeTab === 'integrations' && integrationSettings.data && (
          <FormSection title="Integrações">
            {renderField(SETTING_TYPES.INTEGRATIONS, integrationSettings.data.value, 'mailchimp_api_key', 'Chave API do Mailchimp')}
            {renderField(SETTING_TYPES.INTEGRATIONS, integrationSettings.data.value, 'recaptcha_site_key', 'Chave de Site do reCAPTCHA')}
            {renderField(SETTING_TYPES.INTEGRATIONS, integrationSettings.data.value, 'recaptcha_secret_key', 'Chave Secreta do reCAPTCHA')}
            {renderField(SETTING_TYPES.INTEGRATIONS, integrationSettings.data.value, 'facebook_pixel_id', 'ID do Pixel do Facebook')}
            {renderField(SETTING_TYPES.INTEGRATIONS, integrationSettings.data.value, 'hotjar_id', 'ID do Hotjar')}
            {renderField(SETTING_TYPES.INTEGRATIONS, integrationSettings.data.value, 'hubspot_portal_id', 'ID do Portal HubSpot')}
            {renderField(SETTING_TYPES.INTEGRATIONS, integrationSettings.data.value, 'intercom_app_id', 'ID do App Intercom')}
            {renderField(SETTING_TYPES.INTEGRATIONS, integrationSettings.data.value, 'enable_chat_widget', 'Habilitar widget de chat', 'checkbox')}
          </FormSection>
        )}
      </div>
      
      {/* Rodapé com botão de salvar */}
      <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => window.location.reload()} // Recarregar para exibir as alterações
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="button"
          disabled={isSaving}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isSaving ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Salvando...
            </>
          ) : (
            'Salvar Alterações'
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfiguracoesPage; 