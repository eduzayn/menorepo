import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { toast } from 'sonner';

// Interfaces para tipagem
export interface WhatsAppConfig {
  id?: string;
  api_key: string;
  phone_number_id: string;
  business_account_id: string;
  webhook_secret: string;
  ativo: boolean;
  criado_at?: string;
  atualizado_at?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  status: string;
  category: string;
  language: string;
  components_text?: string[];
}

export interface WhatsAppMessage {
  id: string;
  to: string;
  type: 'text' | 'template' | 'media';
  content: string;
  template_name?: string;
  template_params?: Record<string, string>;
  media_url?: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  criado_at: string;
}

/**
 * Hook para gerenciar a integração com o WhatsApp Business API
 */
export const useWhatsAppIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega a configuração do WhatsApp do banco de dados
   */
  const loadConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('comunicacao_whatsapp_config')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      
      setConfig(data);
      return data;
    } catch (err: any) {
      // Se não encontrar nenhuma configuração, retorna null (não é erro)
      if (err.code === 'PGRST116') {
        setConfig(null);
        return null;
      }
      
      setError(err.message || 'Erro ao carregar configuração do WhatsApp');
      toast.error('Erro ao carregar configuração do WhatsApp');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Salva a configuração do WhatsApp no banco de dados
   */
  const saveConfig = useCallback(async (configData: WhatsAppConfig) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      // Se já existe uma configuração, atualiza
      if (config?.id) {
        const { data, error } = await supabase
          .from('comunicacao_whatsapp_config')
          .update({
            api_key: configData.api_key,
            phone_number_id: configData.phone_number_id,
            business_account_id: configData.business_account_id,
            webhook_secret: configData.webhook_secret,
            ativo: configData.ativo,
            atualizado_at: new Date().toISOString()
          })
          .eq('id', config.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Senão, cria uma nova
        const { data, error } = await supabase
          .from('comunicacao_whatsapp_config')
          .insert({
            api_key: configData.api_key,
            phone_number_id: configData.phone_number_id,
            business_account_id: configData.business_account_id,
            webhook_secret: configData.webhook_secret,
            ativo: configData.ativo
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      setConfig(result);
      toast.success('Configuração do WhatsApp salva com sucesso');
      return result;
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar configuração do WhatsApp');
      toast.error('Erro ao salvar configuração do WhatsApp');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [config]);

  /**
   * Testa a conexão com a API do WhatsApp
   */
  const testConnection = useCallback(async () => {
    if (!config) {
      toast.error('Configure a API do WhatsApp primeiro');
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Chamar a função SQL para testar a conexão
      const { data, error } = await supabase.rpc('test_whatsapp_connection', {
        api_key: config.api_key,
        phone_number_id: config.phone_number_id,
        business_account_id: config.business_account_id
      });
      
      if (error) throw error;
      
      toast.success('Conexão com o WhatsApp estabelecida com sucesso');
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao testar conexão com o WhatsApp');
      toast.error('Erro ao testar conexão com o WhatsApp');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [config]);

  /**
   * Envia uma mensagem pelo WhatsApp
   */
  const sendMessage = useCallback(async (message: Omit<WhatsAppMessage, 'id' | 'status' | 'criado_at'>) => {
    if (!config) {
      toast.error('Configure a API do WhatsApp primeiro');
      return null;
    }
    
    if (!config.ativo) {
      toast.error('A integração com o WhatsApp está desativada');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Primeiro, insere a mensagem no banco com status 'pending'
      const { data: messageData, error: messageError } = await supabase
        .from('comunicacao_whatsapp_mensagens')
        .insert({
          to: message.to,
          type: message.type,
          content: message.content,
          template_name: message.template_name,
          template_params: message.template_params,
          media_url: message.media_url,
          status: 'pending'
        })
        .select()
        .single();
      
      if (messageError) throw messageError;
      
      // Envia a mensagem usando a função SQL
      const { data, error } = await supabase.rpc('send_whatsapp_message', {
        phone_number: message.to,
        message_type: message.type,
        content: message.content,
        template_name: message.template_name, 
        template_params: message.template_params,
        media_url: message.media_url
      });
      
      if (error) throw error;
      
      // Atualiza o status da mensagem no banco
      await supabase
        .from('comunicacao_whatsapp_mensagens')
        .update({
          status: 'sent',
          whatsapp_message_id: data?.messageId || null
        })
        .eq('id', messageData.id);
      
      toast.success('Mensagem enviada com sucesso');
      return { ...messageData, status: 'sent', whatsapp_message_id: data?.messageId };
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar mensagem pelo WhatsApp');
      toast.error('Erro ao enviar mensagem pelo WhatsApp');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [config]);

  /**
   * Lista os templates disponíveis para o WhatsApp
   */
  const listTemplates = useCallback(async () => {
    if (!config) {
      toast.error('Configure a API do WhatsApp primeiro');
      return [];
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Chamar a função SQL para listar templates
      const { data, error } = await supabase.rpc('list_whatsapp_templates', {
        api_key: config.api_key,
        business_account_id: config.business_account_id
      });
      
      if (error) throw error;
      
      setTemplates(data?.templates || []);
      return data?.templates || [];
    } catch (err: any) {
      setError(err.message || 'Erro ao listar templates do WhatsApp');
      toast.error('Erro ao listar templates do WhatsApp');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [config]);

  return {
    loading,
    config,
    templates,
    error,
    loadConfig,
    saveConfig,
    testConnection,
    sendMessage,
    listTemplates
  };
}; 