import { supabase } from '../lib/supabase';

export type ConfiguracaoTaxa = {
  id: string;
  nome: string;
  tipo: 'percentual' | 'fixo';
  valor: number;
  descricao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type ConfiguracaoServico = {
  id: string;
  nome: string;
  valor: number;
  descricao?: string;
  obrigatorio: boolean;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type ConfiguracaoSplit = {
  id: string;
  nome: string;
  tipo_entidade: 'polo' | 'parceiro' | 'professor' | 'instituicao';
  percentual: number;
  descricao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type ConfiguracaoPagamento = {
  id: string;
  gateway: string;
  chave_api: string;
  chave_secreta: string;
  ambiente: 'producao' | 'teste';
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export const configuracoesService = {
  // Taxas
  async listarTaxas() {
    const { data, error } = await supabase
      .from('configuracoes_taxas')
      .select('*')
      .order('nome');

    if (error) {
      console.error('Erro ao listar taxas:', error);
      throw new Error('Não foi possível listar as taxas');
    }

    return data as ConfiguracaoTaxa[];
  },

  async buscarTaxa(id: string) {
    const { data, error } = await supabase
      .from('configuracoes_taxas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar taxa:', error);
      throw new Error('Não foi possível buscar a taxa');
    }

    return data as ConfiguracaoTaxa;
  },

  async criarTaxa(taxa: Omit<ConfiguracaoTaxa, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('configuracoes_taxas')
      .insert(taxa)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar taxa:', error);
      throw new Error('Não foi possível criar a taxa');
    }

    return data as ConfiguracaoTaxa;
  },

  async atualizarTaxa(id: string, taxa: Partial<ConfiguracaoTaxa>) {
    const { data, error } = await supabase
      .from('configuracoes_taxas')
      .update(taxa)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar taxa:', error);
      throw new Error('Não foi possível atualizar a taxa');
    }

    return data as ConfiguracaoTaxa;
  },

  async excluirTaxa(id: string) {
    const { error } = await supabase
      .from('configuracoes_taxas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir taxa:', error);
      throw new Error('Não foi possível excluir a taxa');
    }

    return true;
  },

  // Serviços
  async listarServicos() {
    const { data, error } = await supabase
      .from('configuracoes_servicos')
      .select('*')
      .order('nome');

    if (error) {
      console.error('Erro ao listar serviços:', error);
      throw new Error('Não foi possível listar os serviços');
    }

    return data as ConfiguracaoServico[];
  },

  async buscarServico(id: string) {
    const { data, error } = await supabase
      .from('configuracoes_servicos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar serviço:', error);
      throw new Error('Não foi possível buscar o serviço');
    }

    return data as ConfiguracaoServico;
  },

  async criarServico(servico: Omit<ConfiguracaoServico, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('configuracoes_servicos')
      .insert(servico)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar serviço:', error);
      throw new Error('Não foi possível criar o serviço');
    }

    return data as ConfiguracaoServico;
  },

  async atualizarServico(id: string, servico: Partial<ConfiguracaoServico>) {
    const { data, error } = await supabase
      .from('configuracoes_servicos')
      .update(servico)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar serviço:', error);
      throw new Error('Não foi possível atualizar o serviço');
    }

    return data as ConfiguracaoServico;
  },

  async excluirServico(id: string) {
    const { error } = await supabase
      .from('configuracoes_servicos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir serviço:', error);
      throw new Error('Não foi possível excluir o serviço');
    }

    return true;
  },

  // Splits
  async listarSplits() {
    const { data, error } = await supabase
      .from('configuracoes_splits')
      .select('*')
      .order('nome');

    if (error) {
      console.error('Erro ao listar splits:', error);
      throw new Error('Não foi possível listar os splits');
    }

    return data as ConfiguracaoSplit[];
  },

  async buscarSplit(id: string) {
    const { data, error } = await supabase
      .from('configuracoes_splits')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar split:', error);
      throw new Error('Não foi possível buscar o split');
    }

    return data as ConfiguracaoSplit;
  },

  async criarSplit(split: Omit<ConfiguracaoSplit, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('configuracoes_splits')
      .insert(split)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar split:', error);
      throw new Error('Não foi possível criar o split');
    }

    return data as ConfiguracaoSplit;
  },

  async atualizarSplit(id: string, split: Partial<ConfiguracaoSplit>) {
    const { data, error } = await supabase
      .from('configuracoes_splits')
      .update(split)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar split:', error);
      throw new Error('Não foi possível atualizar o split');
    }

    return data as ConfiguracaoSplit;
  },

  async excluirSplit(id: string) {
    const { error } = await supabase
      .from('configuracoes_splits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir split:', error);
      throw new Error('Não foi possível excluir o split');
    }

    return true;
  },

  // Gateways de Pagamento
  async listarGateways() {
    const { data, error } = await supabase
      .from('configuracoes_pagamento')
      .select('*')
      .order('gateway');

    if (error) {
      console.error('Erro ao listar gateways:', error);
      throw new Error('Não foi possível listar os gateways');
    }

    return data as ConfiguracaoPagamento[];
  },

  async buscarGateway(id: string) {
    const { data, error } = await supabase
      .from('configuracoes_pagamento')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar gateway:', error);
      throw new Error('Não foi possível buscar o gateway');
    }

    return data as ConfiguracaoPagamento;
  },

  async criarGateway(gateway: Omit<ConfiguracaoPagamento, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('configuracoes_pagamento')
      .insert(gateway)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar gateway:', error);
      throw new Error('Não foi possível criar o gateway');
    }

    return data as ConfiguracaoPagamento;
  },

  async atualizarGateway(id: string, gateway: Partial<ConfiguracaoPagamento>) {
    const { data, error } = await supabase
      .from('configuracoes_pagamento')
      .update(gateway)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar gateway:', error);
      throw new Error('Não foi possível atualizar o gateway');
    }

    return data as ConfiguracaoPagamento;
  },

  async excluirGateway(id: string) {
    const { error } = await supabase
      .from('configuracoes_pagamento')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir gateway:', error);
      throw new Error('Não foi possível excluir o gateway');
    }

    return true;
  },
}; 