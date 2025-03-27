// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface WebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          text?: {
            body: string;
          };
          type: string;
        }>;
        statuses?: Array<{
          id: string;
          recipient_id: string;
          status: string;
          timestamp: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

serve(async (req) => {
  try {
    // Verificar se é uma solicitação de webhook
    const url = new URL(req.url);
    const method = req.method;
    
    // Criar o cliente do Supabase com a chave de serviço
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Buscar a configuração do WhatsApp com o webhook_secret
    const { data: configData, error: configError } = await supabaseAdmin
      .from('comunicacao_whatsapp_config')
      .select('webhook_secret')
      .limit(1)
      .single();
      
    if (configError || !configData) {
      console.error('Configuração do WhatsApp não encontrada');
      return new Response(
        JSON.stringify({ error: 'Configuração do WhatsApp não encontrada' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const webhookSecret = configData.webhook_secret;
    
    // Verificação do webhook pelo Facebook (GET)
    if (method === 'GET') {
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');
      
      if (!mode || !token) {
        return new Response(
          JSON.stringify({ error: 'Parâmetros inválidos' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      if (mode === 'subscribe' && token === webhookSecret) {
        console.log('Webhook verificado com sucesso');
        return new Response(challenge, { status: 200 });
      } else {
        return new Response(
          JSON.stringify({ error: 'Verificação falhou' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Recebimento de eventos do webhook (POST)
    if (method === 'POST') {
      // Verificar a assinatura X-Hub-Signature (opcional, mas recomendado)
      // Para simplificar, não implementamos a verificação de assinatura neste exemplo
      
      // Processar o payload do webhook
      const data: WebhookPayload = await req.json();
      
      // Verificar se é uma notificação válida do WhatsApp
      if (data.object !== 'whatsapp_business_account') {
        return new Response(
          JSON.stringify({ error: 'Notificação inválida' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Processar as entradas do webhook
      for (const entry of data.entry) {
        for (const change of entry.changes) {
          if (change.field !== 'messages') continue;
          
          const value = change.value;
          
          // Processar atualizações de status de mensagens
          if (value.statuses && value.statuses.length > 0) {
            for (const status of value.statuses) {
              await processMessageStatus(supabaseAdmin, status);
            }
          }
          
          // Processar mensagens recebidas
          if (value.messages && value.messages.length > 0) {
            for (const message of value.messages) {
              await processIncomingMessage(supabaseAdmin, message, value);
            }
          }
        }
      }
      
      // Sempre retornar 200 OK para o webhook
      return new Response('OK', { status: 200 });
    }
    
    // Método não suportado
    return new Response(
      JSON.stringify({ error: 'Método não suportado' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    
    return new Response(
      JSON.stringify({ error: 'Erro interno ao processar webhook' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

// Processar atualizações de status de mensagens
async function processMessageStatus(supabaseClient: any, status: any) {
  try {
    // Buscar a mensagem pelo ID do WhatsApp
    const { data, error } = await supabaseClient
      .from('comunicacao_whatsapp_mensagens')
      .select('id')
      .eq('whatsapp_message_id', status.id)
      .limit(1)
      .single();
    
    if (error) {
      console.error('Erro ao buscar mensagem:', error);
      return;
    }
    
    if (data) {
      // Mapear o status do WhatsApp para o formato interno
      let statusMapped = 'pending';
      
      switch (status.status) {
        case 'sent':
          statusMapped = 'sent';
          break;
        case 'delivered':
          statusMapped = 'delivered';
          break;
        case 'read':
          statusMapped = 'read';
          break;
        case 'failed':
          statusMapped = 'failed';
          break;
      }
      
      // Atualizar o status da mensagem
      await supabaseClient
        .from('comunicacao_whatsapp_mensagens')
        .update({
          status: statusMapped,
          atualizado_at: new Date().toISOString()
        })
        .eq('id', data.id);
    }
  } catch (err) {
    console.error('Erro ao processar status da mensagem:', err);
  }
}

// Processar mensagens recebidas
async function processIncomingMessage(supabaseClient: any, message: any, value: any) {
  try {
    // Extrair informações da mensagem
    const senderId = message.from;
    const messageId = message.id;
    const messageText = message.text?.body || '';
    const timestamp = new Date(parseInt(message.timestamp) * 1000).toISOString();
    
    // Verificar se existe um contato para este remetente
    let contatoId = null;
    
    // Buscar contato pelo número do WhatsApp
    const { data: contatoData, error: contatoError } = await supabaseClient
      .from('comunicacao_contatos')
      .select('id, nome')
      .eq('whatsapp', senderId)
      .limit(1)
      .single();
    
    if (contatoError) {
      // Se não encontrar um contato existente, criar um novo
      if (value.contacts && value.contacts.length > 0) {
        const contact = value.contacts[0];
        const contactName = contact.profile.name || 'Contato WhatsApp';
        
        const { data: newContato, error: newContatoError } = await supabaseClient
          .from('comunicacao_contatos')
          .insert({
            nome: contactName,
            whatsapp: senderId,
            tipo: 'LEAD',
            status: 'ATIVO',
            data_cadastro: timestamp
          })
          .select()
          .single();
        
        if (newContatoError) {
          console.error('Erro ao criar novo contato:', newContatoError);
        } else {
          contatoId = newContato.id;
        }
      }
    } else {
      contatoId = contatoData.id;
    }
    
    // Se temos um contato válido, registrar a mensagem
    if (contatoId) {
      // Verificar se já existe uma conversa ativa
      const { data: conversaData, error: conversaError } = await supabaseClient
        .from('comunicacao_conversas')
        .select('id')
        .eq('canal', 'WHATSAPP')
        .eq('status', 'ATIVO')
        .eq('contato_id', contatoId)
        .limit(1)
        .single();
      
      let conversaId = null;
      
      // Se não houver conversa ativa, criar uma nova
      if (conversaError) {
        const { data: newConversa, error: newConversaError } = await supabaseClient
          .from('comunicacao_conversas')
          .insert({
            titulo: `Conversa WhatsApp - ${contatoId}`,
            status: 'ATIVO',
            contato_id: contatoId,
            canal: 'WHATSAPP',
            data_inicio: timestamp
          })
          .select()
          .single();
        
        if (newConversaError) {
          console.error('Erro ao criar nova conversa:', newConversaError);
        } else {
          conversaId = newConversa.id;
        }
      } else {
        conversaId = conversaData.id;
      }
      
      // Registrar a mensagem na conversa
      if (conversaId) {
        await supabaseClient
          .from('comunicacao_mensagens')
          .insert({
            conversa_id: conversaId,
            origem: 'RECEBIDA',
            canal: 'WHATSAPP',
            tipo: 'TEXT',
            conteudo: messageText,
            data_recebimento: timestamp,
            status: 'LIDA',
            metadados: {
              whatsapp_message_id: messageId
            }
          });
      }
    }
  } catch (err) {
    console.error('Erro ao processar mensagem recebida:', err);
  }
} 