import { ApiClient } from '../client';
import { ApiError } from '../types';

/**
 * Interface para os dados de um polo
 */
export interface Polo {
  id: string;
  nome: string;
  razao_social: string;
  cnpj: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  telefone: string;
  email: string;
  site?: string;
  status: 'ativo' | 'inativo' | 'pendente' | 'suspenso';
  responsavel_nome: string;
  responsavel_cpf: string;
  responsavel_email: string;
  responsavel_telefone: string;
  data_inicio: string;
  data_fim?: string;
  logo_url?: string;
  observacoes?: string;
  instituicao_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface para os dados de um aluno vinculado a um polo
 */
export interface AlunosPolo {
  id: string;
  polo_id: string;
  aluno_id: string;
  matricula_id?: string;
  curso_id?: string;
  data_vinculo: string;
  captado_por?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface para os dados de comissão de um polo
 */
export interface ComissaoPolo {
  id: string;
  polo_id: string;
  aluno_id: string;
  matricula_id?: string;
  curso_id?: string;
  pagamento_id?: string;
  valor: number;
  percentual: number;
  base_calculo: number;
  tipo: 'matricula' | 'mensalidade' | 'certificacao' | 'material';
  data_referencia: string;
  data_calculo: string;
  status: 'pendente' | 'processando' | 'pago' | 'cancelado' | 'estornado';
  repasse_id?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface para os dados de repasse financeiro
 */
export interface Repasse {
  id: string;
  polo_id: string;
  valor_total: number;
  quantidade_comissoes: number;
  data_prevista: string;
  data_pagamento?: string;
  numero_documento?: string;
  status: 'pendente' | 'processando' | 'pago' | 'cancelado' | 'estornado';
  comprovante_url?: string;
  observacoes?: string;
  gerado_por: string;
  aprovado_por?: string;
  data_aprovacao?: string;
  instituicao_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Serviço para gerenciamento de polos
 */
export class PolosService {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Busca todos os polos disponíveis para o usuário
   */
  async listarPolos(): Promise<Polo[]> {
    try {
      const { data, error } = await this.client.from('polos.polos').select('*');
      
      if (error) throw error;
      return data as Polo[];
    } catch (error) {
      throw new ApiError('Erro ao listar polos', error);
    }
  }

  /**
   * Busca um polo específico pelo ID
   */
  async obterPolo(id: string): Promise<Polo> {
    try {
      const { data, error } = await this.client.from('polos.polos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Polo;
    } catch (error) {
      throw new ApiError(`Erro ao obter polo ${id}`, error);
    }
  }

  /**
   * Busca alunos vinculados a um polo
   */
  async listarAlunosPolo(poloId: string): Promise<AlunosPolo[]> {
    try {
      const { data, error } = await this.client.from('polos.alunos_polo')
        .select('*, auth.users!inner(*), public.matriculas!inner(*), public.cursos!inner(*)')
        .eq('polo_id', poloId);
      
      if (error) throw error;
      return data as AlunosPolo[];
    } catch (error) {
      throw new ApiError(`Erro ao listar alunos do polo ${poloId}`, error);
    }
  }

  /**
   * Busca comissões de um polo
   */
  async listarComissoesPolo(poloId: string): Promise<ComissaoPolo[]> {
    try {
      const { data, error } = await this.client.from('polos.comissoes_polos')
        .select('*')
        .eq('polo_id', poloId);
      
      if (error) throw error;
      return data as ComissaoPolo[];
    } catch (error) {
      throw new ApiError(`Erro ao listar comissões do polo ${poloId}`, error);
    }
  }

  /**
   * Busca repasses de um polo
   */
  async listarRepassesPolo(poloId: string): Promise<Repasse[]> {
    try {
      const { data, error } = await this.client.from('polos.repasses')
        .select('*')
        .eq('polo_id', poloId);
      
      if (error) throw error;
      return data as Repasse[];
    } catch (error) {
      throw new ApiError(`Erro ao listar repasses do polo ${poloId}`, error);
    }
  }

  /**
   * Busca dashboard do polo
   */
  async obterDashboardPolo(poloId: string): Promise<any> {
    try {
      const { data, error } = await this.client.from('polos.vw_dashboard_polo')
        .select('*')
        .eq('polo_id', poloId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new ApiError(`Erro ao obter dashboard do polo ${poloId}`, error);
    }
  }
} 