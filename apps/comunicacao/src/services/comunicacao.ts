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
  EmailMessageType as EmailMessage,
  SMSMessageType as SMSMessage,
  PushMessageType as PushMessage
} from '../providers';
import { consentimentoService } from './consentimento';
import { auditoriaService } from './auditoria';
import { segurancaService } from './seguranca';

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

// Dados mock para campanhas
const MOCK_CAMPANHAS: Campanha[] = [
  {
    id: '1',
    titulo: 'Campanha de Boas-vindas',
    descricao: 'Mensagens automáticas de boas-vindas para novos leads',
    tipo: 'marketing',
    status: 'ATIVO',
    data_inicio: new Date().toISOString(),
    criado_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    atualizado_at: new Date().toISOString()
  },
  {
    id: '2',
    titulo: 'Lembrete de Matrícula 2024',
    descricao: 'Lembrete para alunos sobre o período de matrícula',
    tipo: 'lembrete',
    status: 'ATIVO',
    data_inicio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    criado_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    atualizado_at: new Date().toISOString()
  },
  {
    id: '3',
    titulo: 'Pesquisa de Satisfação Q1',
    descricao: 'Pesquisa trimestral de satisfação com os alunos',
    tipo: 'pesquisa',
    status: 'FINALIZADO',
    data_inicio: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    data_fim: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    criado_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    atualizado_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    titulo: 'Notificação de Novas Funcionalidades',
    descricao: 'Aviso sobre novas funcionalidades da plataforma',
    tipo: 'notificacao',
    status: 'ARQUIVADO',
    data_inicio: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    data_fim: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
    criado_at: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    atualizado_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Função para simular atraso de rede
const simulateNetworkDelay = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
};

/**
 * Busca todas as campanhas
 */
export const getCampanhas = async (): Promise<Campanha[]> => {
  try {
    // Simular chamada de API
    await simulateNetworkDelay();
    
    // Ordenar campanhas por data de criação (mais recentes primeiro)
    return [...MOCK_CAMPANHAS].sort((a, b) => 
      new Date(b.criado_at).getTime() - new Date(a.criado_at).getTime()
    );
  } catch (error) {
    console.error('Erro ao buscar campanhas:', error);
    throw error;
  }
};

/**
 * Busca uma campanha pelo ID
 */
export const getCampanhaPorId = async (id: string): Promise<Campanha | null> => {
  try {
    await simulateNetworkDelay();
    const campanha = MOCK_CAMPANHAS.find(c => c.id === id);
    return campanha || null;
  } catch (error) {
    console.error(`Erro ao buscar campanha ${id}:`, error);
    throw error;
  }
};

/**
 * Cria uma nova campanha
 */
export const criarCampanha = async (campanha: InsertCampanha): Promise<Campanha> => {
  try {
    await simulateNetworkDelay();
    
    const novaCampanha: Campanha = {
      id: `mock-${Date.now()}`,
      ...campanha,
      criado_at: new Date().toISOString(),
      atualizado_at: new Date().toISOString()
    };
    
    MOCK_CAMPANHAS.push(novaCampanha);
    return novaCampanha;
  } catch (error) {
    console.error('Erro ao criar campanha:', error);
    throw error;
  }
};

/**
 * Atualiza uma campanha existente
 */
export const atualizarCampanha = async (id: string, campanha: UpdateCampanha): Promise<Campanha | null> => {
  try {
    await simulateNetworkDelay();
    
    const index = MOCK_CAMPANHAS.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    const campanhaAtualizada: Campanha = {
      ...MOCK_CAMPANHAS[index],
      ...campanha,
      atualizado_at: new Date().toISOString()
    };
    
    MOCK_CAMPANHAS[index] = campanhaAtualizada;
    return campanhaAtualizada;
  } catch (error) {
    console.error(`Erro ao atualizar campanha ${id}:`, error);
    throw error;
  }
};

/**
 * Deleta uma campanha pelo ID
 */
export const deletarCampanha = async (id: string): Promise<{ success: boolean }> => {
  try {
    await simulateNetworkDelay();
    
    const index = MOCK_CAMPANHAS.findIndex(c => c.id === id);
    if (index === -1) return { success: false };
    
    MOCK_CAMPANHAS.splice(index, 1);
    return { success: true };
  } catch (error) {
    console.error(`Erro ao deletar campanha ${id}:`, error);
    throw error;
  }
};

/**
 * Envia uma campanha (simula envio) e altera o status para FINALIZADO
 */
export const enviarCampanha = async (id: string, destinatarios: string[]): Promise<{ success: boolean, enviados: number }> => {
  try {
    await simulateNetworkDelay();
    
    const index = MOCK_CAMPANHAS.findIndex(c => c.id === id);
    if (index === -1) return { success: false, enviados: 0 };
    
    // Atualizar status da campanha para FINALIZADO
    MOCK_CAMPANHAS[index] = {
      ...MOCK_CAMPANHAS[index],
      status: 'FINALIZADO',
      data_fim: new Date().toISOString(),
      atualizado_at: new Date().toISOString()
    };
    
    return { success: true, enviados: destinatarios.length };
  } catch (error) {
    console.error(`Erro ao enviar campanha ${id}:`, error);
    throw error;
  }
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
  canal: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH',
  usuarioId: string
) => {
  // Verificar consentimento para cada destinatário
  for (const destinatario of destinatarios) {
    const consentimento = await consentimentoService.verificarConsentimento(
      destinatario,
      canal
    );

    if (!consentimento) {
      throw new Error(`Usuário ${destinatario} não consentiu com ${canal}`);
    }
  }

  // Registrar na auditoria
  await auditoriaService.registrarLog({
    usuario_id: usuarioId,
    acao: `Envio de mensagem por ${canal}`,
    tipo: 'CRIACAO',
    entidade: 'mensagens',
    entidade_id: `temp_${Date.now()}`,
    dados_novos: {
      destinatarios,
      assunto,
      canal
    }
  });

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
      console.log('Enviando por WhatsApp:', { destinatarios, conteudo });
      return { success: true, messageId: `whatsapp_${Date.now()}` };
    
    default:
      throw new Error(`Canal não suportado: ${canal}`);
  }
};

// Função para enviar campanha por múltiplos canais
export const enviarCampanhaMulticanal = async (
  campanha: Campanha,
  destinatarios: { id: string, email: string, telefone: string, pushToken?: string }[],
  canais: ('EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH')[],
  usuarioId: string
) => {
  // Verificar consentimento para cada destinatário e canal
  for (const destinatario of destinatarios) {
    for (const canal of canais) {
      const consentimento = await consentimentoService.verificarConsentimento(
        destinatario.id,
        canal
      );

      if (!consentimento) {
        throw new Error(`Usuário ${destinatario.id} não consentiu com ${canal}`);
      }
    }
  }

  // Registrar na auditoria
  await auditoriaService.registrarLog({
    usuario_id: usuarioId,
    acao: 'Envio de campanha',
    tipo: 'CRIACAO',
    entidade: 'campanhas',
    entidade_id: campanha.id,
    dados_novos: {
      campanha,
      destinatarios: destinatarios.map(d => d.id),
      canais
    }
  });

  const resultados: Record<string, { sucesso: number, falha: number }> = {
    'EMAIL': { sucesso: 0, falha: 0 },
    'SMS': { sucesso: 0, falha: 0 },
    'WHATSAPP': { sucesso: 0, falha: 0 },
    'PUSH': { sucesso: 0, falha: 0 }
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