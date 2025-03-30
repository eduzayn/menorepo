import { ApiClient } from '../client';

/**
 * Serviço para operações de contabilidade e integrações
 */
export const contabilidadeService = {
  /**
   * Gera o balancete contábil
   */
  gerarBalancete: async (params?: { 
    instituicaoId?: string; 
    mes?: number; 
    ano?: number;
  }) => {
    try {
      const { data } = await ApiClient.instance.rpc('gerar_balancete', {
        p_instituicao_id: params?.instituicaoId,
        p_mes: params?.mes,
        p_ano: params?.ano
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao gerar balancete:', error);
      return { success: false, error };
    }
  },

  /**
   * Sincroniza contabilidade com financeiro
   */
  sincronizarContabilidadeFinanceiro: async (params?: {
    instituicaoId?: string;
    dataInicio?: string;
    dataFim?: string;
  }) => {
    try {
      const { data } = await ApiClient.instance.rpc('sincronizar_contabilidade_financeiro', {
        p_instituicao_id: params?.instituicaoId,
        p_data_inicio: params?.dataInicio,
        p_data_fim: params?.dataFim
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao sincronizar contabilidade com financeiro:', error);
      return { success: false, error };
    }
  },

  /**
   * Integra RH - folha de pagamento
   */
  integrarRhFolhaPagamento: async (params?: {
    instituicaoId?: string;
    mes?: number;
    ano?: number;
  }) => {
    try {
      const { data } = await ApiClient.instance.rpc('integrar_rh_folha_pagamento', {
        p_instituicao_id: params?.instituicaoId,
        p_mes: params?.mes,
        p_ano: params?.ano
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao integrar folha de pagamento:', error);
      return { success: false, error };
    }
  },

  /**
   * Contabiliza folha de pagamento
   */
  contabilizarFolhaPagamento: async (params?: {
    instituicaoId?: string;
    mes?: number;
    ano?: number;
  }) => {
    try {
      const { data } = await ApiClient.instance.rpc('contabilizar_folha_pagamento', {
        p_instituicao_id: params?.instituicaoId,
        p_mes: params?.mes,
        p_ano: params?.ano
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao contabilizar folha de pagamento:', error);
      return { success: false, error };
    }
  },

  /**
   * Integra RH - férias
   */
  integrarRhFerias: async (params?: {
    instituicaoId?: string;
    mes?: number;
    ano?: number;
  }) => {
    try {
      const { data } = await ApiClient.instance.rpc('integrar_rh_ferias', {
        p_instituicao_id: params?.instituicaoId,
        p_mes: params?.mes,
        p_ano: params?.ano
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao integrar férias:', error);
      return { success: false, error };
    }
  },

  /**
   * Contabiliza provisão de férias
   */
  contabilizarProvisaoFerias: async (params?: {
    instituicaoId?: string;
    mes?: number;
    ano?: number;
  }) => {
    try {
      const { data } = await ApiClient.instance.rpc('contabilizar_provisao_ferias', {
        p_instituicao_id: params?.instituicaoId,
        p_mes: params?.mes,
        p_ano: params?.ano
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao contabilizar provisão de férias:', error);
      return { success: false, error };
    }
  },

  /**
   * Integra RH - benefícios
   */
  integrarRhBeneficios: async (params?: {
    instituicaoId?: string;
    mes?: number;
    ano?: number;
  }) => {
    try {
      const { data } = await ApiClient.instance.rpc('integrar_rh_beneficios', {
        p_instituicao_id: params?.instituicaoId,
        p_mes: params?.mes,
        p_ano: params?.ano
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao integrar benefícios:', error);
      return { success: false, error };
    }
  },

  /**
   * Contabiliza benefícios
   */
  contabilizarBeneficios: async (params?: {
    instituicaoId?: string;
    mes?: number;
    ano?: number;
  }) => {
    try {
      const { data } = await ApiClient.instance.rpc('contabilizar_beneficios', {
        p_instituicao_id: params?.instituicaoId,
        p_mes: params?.mes,
        p_ano: params?.ano
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao contabilizar benefícios:', error);
      return { success: false, error };
    }
  },

  /**
   * Gera relatório de custos de pessoal
   */
  relatorioCustosPessoal: async (params?: {
    instituicaoId?: string;
    mes?: number;
    ano?: number;
  }) => {
    try {
      const { data } = await ApiClient.instance.rpc('relatorio_custos_pessoal', {
        p_instituicao_id: params?.instituicaoId,
        p_mes: params?.mes,
        p_ano: params?.ano
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao gerar relatório de custos de pessoal:', error);
      return { success: false, error };
    }
  }
}; 