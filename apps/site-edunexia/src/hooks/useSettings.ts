import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import * as SiteSettingsService from '../services/site-settings';
import { SETTING_TYPES } from '../services/site-settings';
import { SiteSetting } from '@edunexia/database-schema/src/site-edunexia';

/**
 * Hook para obter uma configuração específica
 */
export function useSetting(id: string) {
  const { client } = useApi();
  
  return useQuery({
    queryKey: ['site-setting', id],
    queryFn: async () => {
      // Durante o desenvolvimento, usar dados mockados
      if (process.env.NODE_ENV === 'development') {
        return SiteSettingsService.getMockSetting(id);
      }
      
      const { setting, error } = await SiteSettingsService.getSetting(client, id);
      if (error) throw error;
      return setting;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obter todas as configurações
 */
export function useAllSettings() {
  const { client } = useApi();
  
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      // Durante o desenvolvimento, usar dados mockados
      if (process.env.NODE_ENV === 'development') {
        return Object.values(SiteSettingsService.MOCK_SETTINGS);
      }
      
      const { settings, error } = await SiteSettingsService.getAllSettings(client);
      if (error) throw error;
      return settings;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para atualizar uma configuração
 */
export function useUpdateSetting() {
  const queryClient = useQueryClient();
  const { client } = useApi();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SiteSettingsService.SettingInput }) => {
      // Durante o desenvolvimento, simular atualização
      if (process.env.NODE_ENV === 'development') {
        console.log('Simulando atualização de configuração:', id, data);
        // Simular a atualização no objeto mockado
        if (SiteSettingsService.MOCK_SETTINGS[id]) {
          SiteSettingsService.MOCK_SETTINGS[id] = {
            ...SiteSettingsService.MOCK_SETTINGS[id],
            value: data.value,
            updated_at: new Date().toISOString()
          };
        }
        return true;
      }
      
      const { success, error } = await SiteSettingsService.updateSetting(client, id, data);
      if (error) throw error;
      return success;
    },
    onSuccess: (_data, variables) => {
      // Invalidar queries relevantes
      queryClient.invalidateQueries({ queryKey: ['site-setting', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });
}

// Funções auxiliares para obter configurações específicas comuns
export function useGeneralSettings() {
  return useSetting(SETTING_TYPES.GENERAL);
}

export function useSeoSettings() {
  return useSetting(SETTING_TYPES.SEO);
}

export function useContactSettings() {
  return useSetting(SETTING_TYPES.CONTACT);
}

export function useSocialSettings() {
  return useSetting(SETTING_TYPES.SOCIAL);
}

export function useAppearanceSettings() {
  return useSetting(SETTING_TYPES.APPEARANCE);
}

export function useIntegrationSettings() {
  return useSetting(SETTING_TYPES.INTEGRATIONS);
} 