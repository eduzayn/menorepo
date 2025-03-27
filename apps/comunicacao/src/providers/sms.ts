import { supabase } from '../services/supabase';

// Interfaces para configurações dos provedores de SMS
interface TwilioConfig {
  accountSid: string;
  authToken: string;
  from: string;
}

interface InfobipConfig {
  apiKey: string;
  from: string;
}

interface TotalVoiceConfig {
  apiKey: string;
  from: string;
}

// Interface de mensagem SMS
export interface SMSMessage {
  to: string | string[];
  body: string;
  mediaUrl?: string;
}

// Interface de resposta
export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: Error;
}

// Classe para provedores de SMS
export class SMSProvider {
  private providerType: 'twilio' | 'infobip' | 'totalvoice';
  private config: TwilioConfig | InfobipConfig | TotalVoiceConfig;
  
  constructor(providerType: 'twilio' | 'infobip' | 'totalvoice', 
              config: TwilioConfig | InfobipConfig | TotalVoiceConfig) {
    this.providerType = providerType;
    this.config = config;
  }
  
  // Método para enviar SMS
  async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    try {
      // Adicionar registro de SMS na tabela
      const { data, error } = await supabase
        .from('sms_logs')
        .insert([{
          provider: this.providerType,
          recipient: Array.isArray(message.to) ? message.to.join(', ') : message.to,
          content: message.body,
          status: 'PENDENTE'
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      // Com base no provedor, chame a API apropriada
      switch (this.providerType) {
        case 'twilio':
          return await this.sendTwilio(message);
        case 'infobip':
          return await this.sendInfobip(message);
        case 'totalvoice':
          return await this.sendTotalVoice(message);
        default:
          throw new Error(`Provedor de SMS não suportado: ${this.providerType}`);
      }
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      return {
        success: false,
        error: error as Error
      };
    }
  }
  
  // Implementação de envio via Twilio
  private async sendTwilio(message: SMSMessage): Promise<SMSResponse> {
    try {
      const config = this.config as TwilioConfig;
      
      // Simulando envio via Twilio (em produção usaria a API oficial do Twilio)
      console.log(`Enviando SMS via Twilio: 
        Account SID: ${config.accountSid.substring(0, 5)}...
        De: ${config.from}
        Para: ${message.to}
        Mensagem: ${message.body}
      `);
      
      // Atualizar status na tabela
      await this.updateSMSStatus(message, true);
      
      return {
        success: true,
        messageId: `twilio_${Date.now()}`
      };
    } catch (error) {
      await this.updateSMSStatus(message, false, error as Error);
      throw error;
    }
  }
  
  // Implementação de envio via Infobip
  private async sendInfobip(message: SMSMessage): Promise<SMSResponse> {
    try {
      const config = this.config as InfobipConfig;
      
      // Simulando envio via Infobip (em produção usaria a API oficial do Infobip)
      console.log(`Enviando SMS via Infobip: 
        API Key: ${config.apiKey.substring(0, 5)}...
        De: ${config.from}
        Para: ${message.to}
        Mensagem: ${message.body}
      `);
      
      // Atualizar status na tabela
      await this.updateSMSStatus(message, true);
      
      return {
        success: true,
        messageId: `infobip_${Date.now()}`
      };
    } catch (error) {
      await this.updateSMSStatus(message, false, error as Error);
      throw error;
    }
  }
  
  // Implementação de envio via TotalVoice
  private async sendTotalVoice(message: SMSMessage): Promise<SMSResponse> {
    try {
      const config = this.config as TotalVoiceConfig;
      
      // Simulando envio via TotalVoice (em produção usaria a API oficial do TotalVoice)
      console.log(`Enviando SMS via TotalVoice: 
        API Key: ${config.apiKey.substring(0, 5)}...
        De: ${config.from}
        Para: ${message.to}
        Mensagem: ${message.body}
      `);
      
      // Atualizar status na tabela
      await this.updateSMSStatus(message, true);
      
      return {
        success: true,
        messageId: `totalvoice_${Date.now()}`
      };
    } catch (error) {
      await this.updateSMSStatus(message, false, error as Error);
      throw error;
    }
  }
  
  // Método para atualizar o status do SMS no banco de dados
  private async updateSMSStatus(message: SMSMessage, success: boolean, error?: Error) {
    await supabase
      .from('sms_logs')
      .update({
        status: success ? 'ENVIADO' : 'ERRO',
        error_message: error ? error.message : null,
        enviado_at: success ? new Date().toISOString() : null
      })
      .eq('recipient', Array.isArray(message.to) ? message.to.join(', ') : message.to)
      .eq('content', message.body);
  }
}

// Função para criar um provedor de SMS
export function createSMSProvider(
  type: 'twilio' | 'infobip' | 'totalvoice',
  config: TwilioConfig | InfobipConfig | TotalVoiceConfig
): SMSProvider {
  return new SMSProvider(type, config);
} 