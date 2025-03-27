import { supabase } from './supabase';
import type {
  Conversa,
  Mensagem,
  Campanha,
  CampanhaDestinatario,
  RespostaRapida,
  InsertConversa,
  InsertMensagem,
  InsertCampanha,
  InsertCampanhaDestinatario,
  InsertRespostaRapida,
  UpdateConversa,
  UpdateMensagem,
  UpdateCampanha,
  UpdateCampanhaDestinatario,
  UpdateRespostaRapida,
  ComunicacaoCanal,
} from '../types/comunicacao';
import type { Database } from '../types/database';
import {
  createEmailProvider,
  createSMSProvider,
  createPushProvider,
  EmailMessage,
  SMSMessage,
  PushMessage
} from '../providers';

// Configurações dos provedores (em produção, seriam carregados de variáveis de ambiente)
const emailConfig = {
  // SMTP
  smtp: {
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
      user: 'user@example.com',
      pass: 'password'
    },
    from: 'no-reply@edunexia.com'
  },
  // SendGrid
  sendgrid: {
    apiKey: 'SG.your-api-key',
    from: 'no-reply@edunexia.com'
  },
  // Mailgun
  mailgun: {
    apiKey: 'key-your-api-key',
    domain: 'edunexia.com',
    from: 'no-reply@edunexia.com'
  }
};

const smsConfig = {
  // Twilio
  twilio: {
    accountSid: 'AC123456789',
    authToken: 'your-auth-token',
    from: '+5511999999999'
  },
  // Outros provedores conforme necessário
};

const pushConfig = {
  // Firebase
  firebase: {
    apiKey: 'AIzaSyXXXXXXXXXXXXXXXXXXXXX',
    projectId: 'edunexia-app',
    applicationId: '1:123456789:web:abcdef123456'
  },
  // OneSignal
  onesignal: {
    appId: 'your-app-id',
    apiKey: 'your-api-key'
  }
};

// Inicialização de provedores
const emailProvider = createEmailProvider('smtp', emailConfig.smtp);
const smsProvider = createSMSProvider('twilio', smsConfig.twilio);
const pushProvider = createPushProvider('firebase', pushConfig.firebase);

// Conversas
export const getConversas = async () => {
  const { data, error } = await supabase
    .from('conversas')
    .select('*')
    .order('ultima_mensagem_at', { ascending: false });

  if (error) throw error;
  return data as Conversa[];
};

export const getConversa = async (id: string) => {
  const { data, error } = await supabase
    .from('conversas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Conversa;
};

export const criarConversa = async (conversa: InsertConversa) => {
  const { data, error } = await supabase
    .from('conversas')
    .insert([conversa])
    .select()
    .single();

  if (error) throw error;
  return data as Conversa;
};

// Mensagens
export const getMensagens = async (conversaId: string) => {
  const { data, error } = await supabase
    .from('mensagens')
    .select('*')
    .eq('conversa_id', conversaId)
    .order('criado_at', { ascending: true });

  if (error) throw error;
  return data as Mensagem[];
};

export const enviarMensagem = async (mensagem: InsertMensagem) => {
  const { data, error } = await supabase
    .from('mensagens')
    .insert([mensagem])
    .select()
    .single();

  if (error) throw error;
  return data as Mensagem;
};

// Campanhas
export const getCampanhas = async () => {
  const { data, error } = await supabase
    .from('campanhas')
    .select('*')
    .order('criado_at', { ascending: false });

  if (error) throw error;
  return data as Campanha[];
};

export const getCampanha = async (id: string) => {
  const { data, error } = await supabase
    .from('campanhas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Campanha;
};

export const criarCampanha = async (campanha: InsertCampanha) => {
  const { data, error } = await supabase
    .from('campanhas')
    .insert([campanha])
    .select()
    .single();

  if (error) throw error;
  return data as Campanha;
};

// Respostas Rápidas
export const getRespostasRapidas = async () => {
  const { data, error } = await supabase
    .from('respostas_rapidas')
    .select('*')
    .order('criado_at', { ascending: false });

  if (error) throw error;
  return data as RespostaRapida[];
};

export const criarRespostaRapida = async (resposta: InsertRespostaRapida) => {
  const { data, error } = await supabase
    .from('respostas_rapidas')
    .insert([resposta])
    .select()
    .single();

  if (error) throw error;
  return data as RespostaRapida;
};

// Storage
export const uploadArquivo = async (file: File, conversaId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${conversaId}/${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('mensagens')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('mensagens')
    .getPublicUrl(filePath);

  return publicUrl;
};

// Função para enviar mensagem por diferentes canais
export const enviarPorCanal = async (
  destinatarios: string[],
  conteudo: string,
  assunto: string,
  canal: ComunicacaoCanal
) => {
  switch (canal) {
    case 'EMAIL':
      return await emailProvider.sendEmail({
        to: destinatarios,
        subject: assunto,
        html: conteudo
      });
    
    case 'SMS':
      return await smsProvider.sendSMS({
        to: destinatarios,
        body: conteudo
      });
    
    case 'PUSH':
      return await pushProvider.sendPush({
        to: destinatarios,
        title: assunto,
        body: conteudo
      });
    
    case 'WHATSAPP':
      // Para WhatsApp, usamos o serviço existente
      // Aqui seria a integração com a API do WhatsApp Business
      console.log('Enviando por WhatsApp:', { destinatarios, conteudo });
      return { success: true, messageId: `whatsapp_${Date.now()}` };
    
    default:
      throw new Error(`Canal não suportado: ${canal}`);
  }
};

// Função para enviar campanha por múltiplos canais
export const enviarCampanha = async (
  campanha: Campanha,
  destinatarios: { id: string, email: string, telefone: string, pushToken?: string }[],
  canais: ComunicacaoCanal[]
) => {
  const resultados: Record<ComunicacaoCanal, { sucesso: number, falha: number }> = {
    'EMAIL': { sucesso: 0, falha: 0 },
    'SMS': { sucesso: 0, falha: 0 },
    'WHATSAPP': { sucesso: 0, falha: 0 },
    'PUSH': { sucesso: 0, falha: 0 },
    'CHAT': { sucesso: 0, falha: 0 }
  };

  for (const canal of canais) {
    switch (canal) {
      case 'EMAIL':
        const emails = destinatarios.map(d => d.email).filter(Boolean);
        if (emails.length > 0) {
          const resultado = await emailProvider.sendEmail({
            to: emails,
            subject: campanha.titulo,
            html: campanha.descricao
          });
          resultado.success ? resultados.EMAIL.sucesso = emails.length : resultados.EMAIL.falha = emails.length;
        }
        break;
      
      case 'SMS':
        const telefones = destinatarios.map(d => d.telefone).filter(Boolean);
        if (telefones.length > 0) {
          const resultado = await smsProvider.sendSMS({
            to: telefones,
            body: campanha.descricao
          });
          resultado.success ? resultados.SMS.sucesso = telefones.length : resultados.SMS.falha = telefones.length;
        }
        break;
      
      case 'PUSH':
        const tokens = destinatarios
          .map(d => d.pushToken)
          .filter(Boolean) as string[];
        
        if (tokens.length > 0) {
          const resultado = await pushProvider.sendPush({
            to: tokens,
            title: campanha.titulo,
            body: campanha.descricao
          });
          resultado.success ? resultados.PUSH.sucesso = tokens.length : resultados.PUSH.falha = tokens.length;
        }
        break;
      
      // Outros canais podem ser implementados conforme necessário
    }
  }

  return resultados;
}; 