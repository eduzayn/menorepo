import { ApiClient } from '@edunexia/api-client';
import { SiteSetting } from '@edunexia/database-schema/src/site-edunexia';

export interface SettingInput {
  value: Record<string, any>;
}

// Tipos de configurações
export const SETTING_TYPES = {
  GENERAL: 'general',
  SEO: 'seo',
  CONTACT: 'contact',
  SOCIAL: 'social',
  APPEARANCE: 'appearance',
  INTEGRATIONS: 'integrations',
};

/**
 * Obtém uma configuração específica do site
 */
export async function getSetting(client: ApiClient, id: string) {
  try {
    const response = await client.post('/api/site-settings/get', { id });
    return { setting: response.data as SiteSetting, error: null };
  } catch (error) {
    console.error('Erro ao obter configuração:', error);
    return { setting: null, error };
  }
}

/**
 * Obtém todas as configurações do site
 */
export async function getAllSettings(client: ApiClient) {
  try {
    const response = await client.get('/api/site-settings');
    return { settings: response.data as SiteSetting[], error: null };
  } catch (error) {
    console.error('Erro ao obter configurações:', error);
    return { settings: [], error };
  }
}

/**
 * Atualiza uma configuração do site
 */
export async function updateSetting(client: ApiClient, id: string, data: SettingInput) {
  try {
    const response = await client.post('/api/site-settings/update', {
      id,
      ...data,
    });
    return { success: true, error: null };
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    return { success: false, error };
  }
}

/**
 * Cria uma nova configuração do site (normalmente não é usado diretamente)
 */
export async function createSetting(client: ApiClient, id: string, data: SettingInput) {
  try {
    const response = await client.post('/api/site-settings/create', {
      id,
      ...data,
    });
    return { setting: response.data as SiteSetting, error: null };
  } catch (error) {
    console.error('Erro ao criar configuração:', error);
    return { setting: null, error };
  }
}

// Dados iniciais mockados para desenvolvimento
export const MOCK_SETTINGS: Record<string, SiteSetting> = {
  [SETTING_TYPES.GENERAL]: {
    id: SETTING_TYPES.GENERAL,
    value: {
      site_name: 'Edunéxia - Plataforma Educacional',
      site_description: 'Transformando a educação através da tecnologia',
      logo_url: 'https://via.placeholder.com/200x80?text=Edunexia',
      favicon_url: 'https://via.placeholder.com/32x32',
      primary_color: '#4F46E5',
      secondary_color: '#10B981',
      accent_color: '#F59E0B',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      show_cookie_consent: true,
      cookie_consent_text: 'Usamos cookies para melhorar sua experiência em nosso site.'
    },
    updated_at: new Date().toISOString(),
    updated_by: null
  },
  [SETTING_TYPES.SEO]: {
    id: SETTING_TYPES.SEO,
    value: {
      meta_title: 'Edunéxia | Plataforma de Educação Digital',
      meta_description: 'A Edunéxia é uma plataforma completa para gestão educacional, com recursos para escolas, professores e alunos.',
      meta_keywords: 'educação, plataforma, escola, aprendizagem, ensino',
      og_image: 'https://via.placeholder.com/1200x630',
      google_analytics_id: '',
      google_tag_manager_id: '',
      enable_robots: true,
      canonical_url: 'https://www.edunexia.com.br',
      google_site_verification: ''
    },
    updated_at: new Date().toISOString(),
    updated_by: null
  },
  [SETTING_TYPES.CONTACT]: {
    id: SETTING_TYPES.CONTACT,
    value: {
      address: 'Av. Paulista, 1000, São Paulo - SP',
      email: 'contato@edunexia.com.br',
      phone: '(11) 3456-7890',
      whatsapp: '5511987654321',
      contact_form_recipients: ['atendimento@edunexia.com.br'],
      google_maps_embed: '',
      working_hours: 'Segunda a Sexta: 8h às 18h'
    },
    updated_at: new Date().toISOString(),
    updated_by: null
  },
  [SETTING_TYPES.SOCIAL]: {
    id: SETTING_TYPES.SOCIAL,
    value: {
      facebook: 'https://facebook.com/edunexia',
      instagram: 'https://instagram.com/edunexia',
      twitter: 'https://twitter.com/edunexia',
      youtube: 'https://youtube.com/edunexia',
      linkedin: 'https://linkedin.com/company/edunexia',
      tiktok: '',
      pinterest: '',
      display_social_share: true,
      display_social_follow: true
    },
    updated_at: new Date().toISOString(),
    updated_by: null
  },
  [SETTING_TYPES.APPEARANCE]: {
    id: SETTING_TYPES.APPEARANCE,
    value: {
      theme: 'light',
      enable_dark_mode: true,
      hero_style: 'centered',
      footer_columns: 3,
      show_back_to_top: true,
      custom_css: '',
      display_blog_sidebar: true,
      font_family: 'Inter',
      button_style: 'rounded',
      use_animations: true
    },
    updated_at: new Date().toISOString(),
    updated_by: null
  },
  [SETTING_TYPES.INTEGRATIONS]: {
    id: SETTING_TYPES.INTEGRATIONS,
    value: {
      mailchimp_api_key: '',
      recaptcha_site_key: '',
      recaptcha_secret_key: '',
      facebook_pixel_id: '',
      hotjar_id: '',
      hubspot_portal_id: '',
      intercom_app_id: '',
      enable_chat_widget: false
    },
    updated_at: new Date().toISOString(),
    updated_by: null
  }
};

// Função para obter configurações mockadas durante desenvolvimento
export function getMockSetting(id: string): SiteSetting | null {
  return MOCK_SETTINGS[id] || null;
} 