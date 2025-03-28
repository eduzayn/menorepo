import { supabase } from '../services/supabase';

// Interfaces para configurações dos provedores de Push
interface FirebaseConfig {
  apiKey: string;
  projectId: string;
  applicationId: string;
  serviceAccount?: Record<string, any>;
}

interface OneSignalConfig {
  appId: string;
  apiKey: string;
}

// Interface de mensagem Push
export interface PushMessage {
  to: string | string[]; // token de dispositivo ou tópico
  title: string;
  body: string;
  data?: Record<string, any>;
  image?: string;
  icon?: string;
  badge?: number;
  sound?: string;
  clickAction?: string;
  tag?: string;
}

// Interface de resposta
export interface PushResponse {
  success: boolean;
  messageId?: string;
  error?: Error;
  failedTokens?: string[];
}

// Classe para provedores de Push Notification
export class PushProvider {
  private providerType: 'firebase' | 'onesignal';
  private config: FirebaseConfig | OneSignalConfig;
  
  constructor(providerType: 'firebase' | 'onesignal', 
              config: FirebaseConfig | OneSignalConfig) {
    this.providerType = providerType;
    this.config = config;
  }
  
  // Método para enviar notificação push
  async sendPush(message: PushMessage): Promise<PushResponse> {
    try {
      // Adicionar registro de push na tabela
      const { data, error } = await supabase
        .from('push_logs')
        .insert([{
          provider: this.providerType,
          recipient: Array.isArray(message.to) ? message.to.join(', ') : message.to,
          title: message.title,
          body: message.body,
          status: 'PENDENTE'
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      // Com base no provedor, chame a API apropriada
      switch (this.providerType) {
        case 'firebase':
          return await this.sendFirebase(message);
        case 'onesignal':
          return await this.sendOneSignal(message);
        default:
          throw new Error(`Provedor de Push não suportado: ${this.providerType}`);
      }
    } catch (error) {
      console.error('Erro ao enviar notificação push:', error);
      return {
        success: false,
        error: error as Error
      };
    }
  }
  
  // Implementação de envio via Firebase Cloud Messaging
  private async sendFirebase(message: PushMessage): Promise<PushResponse> {
    try {
      const config = this.config as FirebaseConfig;
      
      // Simulando envio via Firebase (em produção usaria firebase-admin ou biblioteca equivalente)
      console.log(`Enviando Push via Firebase: 
        Projeto: ${config.projectId}
        App ID: ${config.applicationId}
        Para: ${message.to}
        Título: ${message.title}
        Corpo: ${message.body}
      `);
      
      // Atualizar status na tabela
      await this.updatePushStatus(message, true);
      
      return {
        success: true,
        messageId: `fcm_${Date.now()}`
      };
    } catch (error) {
      await this.updatePushStatus(message, false, error as Error);
      throw error;
    }
  }
  
  // Implementação de envio via OneSignal
  private async sendOneSignal(message: PushMessage): Promise<PushResponse> {
    try {
      const config = this.config as OneSignalConfig;
      
      // Simulando envio via OneSignal (em produção usaria a API oficial do OneSignal)
      console.log(`Enviando Push via OneSignal: 
        App ID: ${config.appId}
        API Key: ${config.apiKey.substring(0, 5)}...
        Para: ${message.to}
        Título: ${message.title}
        Corpo: ${message.body}
      `);
      
      // Atualizar status na tabela
      await this.updatePushStatus(message, true);
      
      return {
        success: true,
        messageId: `onesignal_${Date.now()}`
      };
    } catch (error) {
      await this.updatePushStatus(message, false, error as Error);
      throw error;
    }
  }
  
  // Método para atualizar o status do push no banco de dados
  private async updatePushStatus(message: PushMessage, success: boolean, error?: Error) {
    await supabase
      .from('push_logs')
      .update({
        status: success ? 'ENVIADO' : 'ERRO',
        error_message: error ? error.message : null,
        enviado_at: success ? new Date().toISOString() : null
      })
      .eq('title', message.title)
      .eq('body', message.body);
  }
  
  // Métodos para gestão de tokens e tópicos
  async registerToken(userId: string, token: string, platform: 'ios' | 'android' | 'web'): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('device_tokens')
        .insert([{
          user_id: userId,
          token,
          platform,
          active: true,
          provider: this.providerType
        }]);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao registrar token:', error);
      return false;
    }
  }
  
  async unregisterToken(token: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('device_tokens')
        .update({ active: false })
        .eq('token', token);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao desregistrar token:', error);
      return false;
    }
  }
  
  async subscribeToTopic(token: string, topic: string): Promise<boolean> {
    try {
      // Simula inscrição em tópico (em produção, usaria FCM ou equivalente)
      console.log(`Inscrevendo ${token} no tópico ${topic}`);
      
      const { data, error } = await supabase
        .from('device_topics')
        .insert([{
          token,
          topic,
          provider: this.providerType
        }]);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao inscrever em tópico:', error);
      return false;
    }
  }
  
  async unsubscribeFromTopic(token: string, topic: string): Promise<boolean> {
    try {
      // Simula desinscrição de tópico
      console.log(`Desinscrevendo ${token} do tópico ${topic}`);
      
      const { data, error } = await supabase
        .from('device_topics')
        .delete()
        .match({ token, topic });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao desinscrever de tópico:', error);
      return false;
    }
  }
}

// Função para criar um provedor de Push
export function createPushProvider(
  type: 'firebase' | 'onesignal',
  config: FirebaseConfig | OneSignalConfig
): PushProvider {
  return new PushProvider(type, config);
} 