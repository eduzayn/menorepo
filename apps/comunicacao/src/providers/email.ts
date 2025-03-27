import { supabase } from '../services/supabase';

// Interfaces para configurações dos provedores de email
interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

interface SendGridConfig {
  apiKey: string;
  from: string;
}

interface MailgunConfig {
  apiKey: string;
  domain: string;
  from: string;
}

// Interface de email
export interface EmailMessage {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    path?: string;
    contentType?: string;
  }>;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

// Interface de resposta
export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: Error;
}

// Classe para provedores de email
export class EmailProvider {
  private providerType: 'smtp' | 'sendgrid' | 'mailgun';
  private config: SMTPConfig | SendGridConfig | MailgunConfig;
  
  constructor(providerType: 'smtp' | 'sendgrid' | 'mailgun', config: SMTPConfig | SendGridConfig | MailgunConfig) {
    this.providerType = providerType;
    this.config = config;
  }
  
  // Método para enviar email
  async sendEmail(message: EmailMessage): Promise<EmailResponse> {
    try {
      // Adicionar registro de email na tabela
      const { data, error } = await supabase
        .from('email_logs')
        .insert([{
          provider: this.providerType,
          recipient: Array.isArray(message.to) ? message.to.join(', ') : message.to,
          subject: message.subject,
          content: message.text || message.html || '',
          status: 'PENDENTE'
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      // Com base no provedor, chame a API apropriada
      switch (this.providerType) {
        case 'smtp':
          return await this.sendSMTP(message);
        case 'sendgrid':
          return await this.sendSendGrid(message);
        case 'mailgun':
          return await this.sendMailgun(message);
        default:
          throw new Error(`Provedor de email não suportado: ${this.providerType}`);
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return {
        success: false,
        error: error as Error
      };
    }
  }
  
  // Implementação de envio via SMTP
  private async sendSMTP(message: EmailMessage): Promise<EmailResponse> {
    try {
      const config = this.config as SMTPConfig;
      
      // Simulando envio via SMTP (em produção usaria nodemailer ou biblioteca equivalente)
      console.log(`Enviando email via SMTP: 
        Host: ${config.host}
        Para: ${message.to}
        Assunto: ${message.subject}
      `);
      
      // Atualizar status na tabela
      await this.updateEmailStatus(message, true);
      
      return {
        success: true,
        messageId: `smtp_${Date.now()}`
      };
    } catch (error) {
      await this.updateEmailStatus(message, false, error as Error);
      throw error;
    }
  }
  
  // Implementação de envio via SendGrid
  private async sendSendGrid(message: EmailMessage): Promise<EmailResponse> {
    try {
      const config = this.config as SendGridConfig;
      
      // Simulando envio via SendGrid (em produção usaria a API oficial do SendGrid)
      console.log(`Enviando email via SendGrid: 
        API Key: ${config.apiKey.substring(0, 5)}...
        De: ${config.from}
        Para: ${message.to}
        Assunto: ${message.subject}
      `);
      
      // Atualizar status na tabela
      await this.updateEmailStatus(message, true);
      
      return {
        success: true,
        messageId: `sendgrid_${Date.now()}`
      };
    } catch (error) {
      await this.updateEmailStatus(message, false, error as Error);
      throw error;
    }
  }
  
  // Implementação de envio via Mailgun
  private async sendMailgun(message: EmailMessage): Promise<EmailResponse> {
    try {
      const config = this.config as MailgunConfig;
      
      // Simulando envio via Mailgun (em produção usaria a API oficial do Mailgun)
      console.log(`Enviando email via Mailgun: 
        API Key: ${config.apiKey.substring(0, 5)}...
        Domínio: ${config.domain}
        De: ${config.from}
        Para: ${message.to}
        Assunto: ${message.subject}
      `);
      
      // Atualizar status na tabela
      await this.updateEmailStatus(message, true);
      
      return {
        success: true,
        messageId: `mailgun_${Date.now()}`
      };
    } catch (error) {
      await this.updateEmailStatus(message, false, error as Error);
      throw error;
    }
  }
  
  // Método para atualizar o status do email no banco de dados
  private async updateEmailStatus(message: EmailMessage, success: boolean, error?: Error) {
    await supabase
      .from('email_logs')
      .update({
        status: success ? 'ENVIADO' : 'ERRO',
        error_message: error ? error.message : null,
        enviado_at: success ? new Date().toISOString() : null
      })
      .eq('recipient', Array.isArray(message.to) ? message.to.join(', ') : message.to)
      .eq('subject', message.subject);
  }
}

// Função para criar um provedor de email
export function createEmailProvider(
  type: 'smtp' | 'sendgrid' | 'mailgun',
  config: SMTPConfig | SendGridConfig | MailgunConfig
): EmailProvider {
  return new EmailProvider(type, config);
} 