import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Client, LocalAuth } from 'whatsapp-web.js';
import puppeteer from 'puppeteer';
import { activeSessions } from './session-store';

export const config = {
  runtime: 'edge',
  unstable_allowDynamic: [
    '**/node_modules/whatsapp-web.js/**',
    '**/node_modules/puppeteer/**',
  ],
};

export default async function handler(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // Endpoint para iniciar sessão e gerar QR Code
  if (req.method === 'POST') {
    try {
      // Gerar um ID de sessão único
      const sessionId = `session_${Date.now()}`;
      
      // Iniciar uma nova instância do cliente WhatsApp
      const client = new Client({
        authStrategy: new LocalAuth({ clientId: sessionId }),
        puppeteer: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });
      
      let qrCodeImage = '';
      
      // Evento de geração de QR Code
      client.on('qr', (qr) => {
        qrCodeImage = qr;
        
        // Atualizar QR Code no banco de dados
        supabase
          .from('canais_integrados')
          .update({
            qrcode_image: `data:image/png;base64,${qr}`,
            qrcode_status: 'PENDING'
          })
          .eq('session_id', sessionId);
      });
      
      // Evento de autenticação bem-sucedida
      client.on('authenticated', () => {
        // Atualizar status no banco de dados
        supabase
          .from('canais_integrados')
          .update({
            qrcode_status: 'CONNECTED',
            last_connection: new Date(),
            ativo: true
          })
          .eq('session_id', sessionId);
          
        // Registrar último momento de atividade
        client._lastActivity = new Date();
      });
      
      // Evento de desconexão
      client.on('disconnected', () => {
        // Atualizar status no banco de dados
        supabase
          .from('canais_integrados')
          .update({
            qrcode_status: 'DISCONNECTED',
            ativo: false
          })
          .eq('session_id', sessionId);
          
        // Remover sessão da memória
        activeSessions.delete(sessionId);
      });
      
      // Iniciar o cliente
      await client.initialize();
      
      // Armazenar o cliente na memória
      activeSessions.set(sessionId, client);
      
      // Salvar o registro inicial no banco de dados
      const { error } = await supabase
        .from('canais_integrados')
        .upsert({
          tipo: 'WHATSAPP',
          modo_integracao: 'QRCODE',
          session_id: sessionId,
          qrcode_image: '',  // Será atualizado pelo evento 'qr'
          qrcode_status: 'PENDING',
          last_connection: new Date(),
          ativo: false
        })
        .select().single();

      if (error) {
        console.error('Erro ao salvar sessão:', error);
        return NextResponse.json(
          { error: 'Erro ao iniciar sessão do WhatsApp' },
          { status: 500 }
        );
      }

      // Aguardar a geração do QR Code (timeout para evitar espera infinita)
      let attempts = 0;
      while (!qrCodeImage && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      if (!qrCodeImage) {
        return NextResponse.json(
          { error: 'Timeout ao gerar QR Code' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        sessionId,
        qrCodeImage
      });
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error);
      return NextResponse.json(
        { error: 'Erro interno ao processar solicitação', details: error.message },
        { status: 500 }
      );
    }
  }
  
  // Endpoint para verificar o status da sessão
  else if (req.method === 'GET') {
    try {
      const url = new URL(req.url);
      const sessionId = url.searchParams.get('sessionId');
      
      if (!sessionId) {
        return NextResponse.json(
          { error: 'ID de sessão não fornecido' },
          { status: 400 }
        );
      }
      
      // Verificar se a sessão está ativa na memória
      const isSessionActive = activeSessions.has(sessionId);
      
      // Buscar status da sessão no banco de dados
      const { data, error } = await supabase
        .from('canais_integrados')
        .select('qrcode_status, last_connection')
        .eq('session_id', sessionId)
        .single();
        
      if (error || !data) {
        return NextResponse.json(
          { error: 'Sessão não encontrada' },
          { status: 404 }
        );
      }
      
      // Se a sessão está no BD mas não na memória, atualizar status para DISCONNECTED
      if (data.qrcode_status === 'CONNECTED' && !isSessionActive) {
        await supabase
          .from('canais_integrados')
          .update({
            qrcode_status: 'DISCONNECTED',
            ativo: false
          })
          .eq('session_id', sessionId);
          
        return NextResponse.json({
          success: true,
          status: 'DISCONNECTED',
          lastConnection: data.last_connection
        });
      }
      
      // Se a sessão está ativa, atualizar o timestamp de atividade
      if (isSessionActive) {
        const client = activeSessions.get(sessionId);
        client._lastActivity = new Date();
      }
      
      return NextResponse.json({
        success: true,
        status: data.qrcode_status,
        lastConnection: data.last_connection
      });
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return NextResponse.json(
        { error: 'Erro interno ao processar solicitação', details: error.message },
        { status: 500 }
      );
    }
  }
  
  // Endpoint para desconectar a sessão
  else if (req.method === 'DELETE') {
    try {
      const url = new URL(req.url);
      const sessionId = url.searchParams.get('sessionId');
      
      if (!sessionId) {
        return NextResponse.json(
          { error: 'ID de sessão não fornecido' },
          { status: 400 }
        );
      }
      
      // Verificar se a sessão está ativa na memória
      const client = activeSessions.get(sessionId);
      
      if (client) {
        // Encerrar a sessão whatsapp-web.js
        await client.destroy();
        activeSessions.delete(sessionId);
      }
      
      // Desativar a integração no banco de dados
      const { error } = await supabase
        .from('canais_integrados')
        .update({
          qrcode_status: 'DISCONNECTED',
          ativo: false
        })
        .eq('session_id', sessionId);
        
      if (error) {
        return NextResponse.json(
          { error: 'Erro ao desativar sessão' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Sessão desconectada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao desconectar sessão:', error);
      return NextResponse.json(
        { error: 'Erro interno ao processar solicitação', details: error.message },
        { status: 500 }
      );
    }
  }
  
  else {
    return NextResponse.json(
      { error: 'Método não suportado' },
      { status: 405 }
    );
  }
} 