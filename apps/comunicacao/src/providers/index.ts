import { createEmailProvider, EmailProvider, EmailMessage, EmailResponse } from './email';
import { createSMSProvider, SMSProvider, SMSMessage, SMSResponse } from './sms';
import { createPushProvider, PushProvider, PushMessage, PushResponse } from './push';

// Definindo tipos diretamente para garantir que estejam disponíveis mesmo com problemas de importação
export interface EmailMessageType {
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

export interface SMSMessageType {
  to: string | string[];
  body: string;
  mediaUrl?: string;
}

export interface PushMessageType {
  to: string | string[];
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

export {
  // Email
  createEmailProvider,
  EmailProvider,
  // SMS
  createSMSProvider,
  SMSProvider,
  // Push Notifications
  createPushProvider,
  PushProvider,
};

// Usar 'export type' para os tipos
export type { 
  // Email
  EmailMessage, 
  EmailResponse,
  // SMS
  SMSMessage, 
  SMSResponse,
  // Push Notifications
  PushMessage, 
  PushResponse 
}; 