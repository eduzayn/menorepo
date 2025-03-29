import { ApiClient } from "@edunexia/api-client";

export interface Mensagem {
  id: string;
  conteudo: string;
  remetente: string;
  destinatario: string;
  data_envio: string;
  lida: boolean;
}

export interface Conversa {
  id: string;
  participantes: string[];
  ultima_mensagem?: Mensagem;
  titulo?: string;
  data_criacao: string;
  data_atualizacao: string;
}

export interface MensagemInput {
  conteudo: string;
  destinatario: string;
}

export interface FiltroBuscaMensagens {
  remetente?: string;
  destinatario?: string;
  dataInicio?: string;
  dataFim?: string;
  lida?: boolean;
}

export class ComunicacaoService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Envia uma nova mensagem
   */
  async enviarMensagem(mensagem: MensagemInput): Promise<Mensagem> {
    try {
      // Simulação de chamada API
      const novaMensagem: Mensagem = {
        id: `msg-${Date.now()}`,
        conteudo: mensagem.conteudo,
        remetente: 'usuario-atual',
        destinatario: mensagem.destinatario,
        data_envio: new Date().toISOString(),
        lida: false,
      };
      
      return novaMensagem;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw new Error('Não foi possível enviar a mensagem');
    }
  }

  /**
   * Busca conversas do usuário atual
   */
  async buscarConversas(): Promise<Conversa[]> {
    try {
      // Simulação de chamada API
      return [
        {
          id: 'conv-1',
          participantes: ['usuario-atual', 'usuario-2'],
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString(),
        },
        {
          id: 'conv-2',
          participantes: ['usuario-atual', 'usuario-3'],
          titulo: 'Suporte Técnico',
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString(),
        }
      ];
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      throw new Error('Não foi possível buscar as conversas');
    }
  }

  /**
   * Busca mensagens de uma conversa específica
   */
  async buscarMensagensConversa(conversaId: string): Promise<Mensagem[]> {
    try {
      // Simulação de chamada API
      return [
        {
          id: 'msg-1',
          conteudo: 'Olá, como posso ajudar?',
          remetente: 'usuario-2',
          destinatario: 'usuario-atual',
          data_envio: new Date().toISOString(),
          lida: true,
        },
        {
          id: 'msg-2',
          conteudo: 'Estou com uma dúvida sobre o curso',
          remetente: 'usuario-atual',
          destinatario: 'usuario-2',
          data_envio: new Date().toISOString(),
          lida: true,
        }
      ];
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      throw new Error('Não foi possível buscar as mensagens');
    }
  }

  /**
   * Marca mensagem como lida
   */
  async marcarComoLida(mensagemId: string): Promise<boolean> {
    try {
      // Simulação de chamada API
      return true;
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
      throw new Error('Não foi possível marcar a mensagem como lida');
    }
  }
} 