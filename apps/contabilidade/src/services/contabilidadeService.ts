import { ApiClient } from '@edunexia/api-client';
import { 
  ContaContabil, 
  LancamentoContabil, 
  ObrigacaoFiscal, 
  Balancete, 
  DocumentoFiscal,
  IntegracaoFinanceira,
  IntegracaoRhResponse
} from '../types/contabilidade';

/**
 * Serviço de contabilidade que se integra com a API
 * @param apiClient Cliente da API
 * @returns Objeto com métodos para operações contábeis
 */
export const createContabilidadeService = (apiClient: ApiClient) => ({
  /**
   * Obtém o plano de contas da empresa
   */
  obterPlanoContas: async (): Promise<ContaContabil[]> => {
    const { data, error } = await apiClient.supabase
      .from('contas_contabeis')
      .select('*')
      .order('codigo');
      
    if (error) throw new Error(error.message);
    return data;
  },
  
  /**
   * Obtém uma conta contábil pelo ID
   */
  obterContaContabil: async (id: string): Promise<ContaContabil> => {
    const { data, error } = await apiClient.supabase
      .from('contas_contabeis')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  },
  
  /**
   * Cria uma nova conta contábil
   */
  criarContaContabil: async (conta: Omit<ContaContabil, 'id'>): Promise<ContaContabil> => {
    const { data, error } = await apiClient.supabase
      .from('contas_contabeis')
      .insert(conta)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  },
  
  /**
   * Atualiza uma conta contábil
   */
  atualizarContaContabil: async (id: string, conta: Partial<ContaContabil>): Promise<ContaContabil> => {
    const { data, error } = await apiClient.supabase
      .from('contas_contabeis')
      .update(conta)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  },
  
  /**
   * Lista lançamentos contábeis com filtros
   */
  listarLancamentos: async (filtros: {
    dataInicio?: string;
    dataFim?: string;
    contaId?: string;
    tipoLancamento?: string;
  }): Promise<LancamentoContabil[]> => {
    let query = apiClient.supabase
      .from('lancamentos_contabeis')
      .select('*')
      .order('data', { ascending: false });
      
    if (filtros.dataInicio) {
      query = query.gte('data', filtros.dataInicio);
    }
    
    if (filtros.dataFim) {
      query = query.lte('data', filtros.dataFim);
    }
    
    if (filtros.contaId) {
      query = query.or(`contaDebito.eq.${filtros.contaId},contaCredito.eq.${filtros.contaId}`);
    }
    
    if (filtros.tipoLancamento) {
      query = query.eq('tipoLancamento', filtros.tipoLancamento);
    }
    
    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    return data;
  },
  
  /**
   * Cria um novo lançamento contábil
   */
  criarLancamento: async (lancamento: Omit<LancamentoContabil, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<LancamentoContabil> => {
    const { data, error } = await apiClient.supabase
      .from('lancamentos_contabeis')
      .insert(lancamento)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  },
  
  /**
   * Obtém obrigações fiscais pendentes
   */
  obterObrigacoesFiscais: async (filtros: {
    status?: string;
    regimeTributario?: string;
  }): Promise<ObrigacaoFiscal[]> => {
    let query = apiClient.supabase
      .from('obrigacoes_fiscais')
      .select('*')
      .order('dataVencimento');
      
    if (filtros.status) {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros.regimeTributario) {
      query = query.contains('regimesTributarios', [filtros.regimeTributario]);
    }
    
    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    return data;
  },
  
  /**
   * Gera balancete para um período específico
   */
  gerarBalancete: async (mesAno: string): Promise<Balancete> => {
    const { data, error } = await apiClient.functions.invoke('gerar-balancete', {
      body: { mesAno }
    });
    
    if (error) throw new Error(error.message);
    return data;
  },
  
  /**
   * Registra documento fiscal no sistema
   */
  registrarDocumentoFiscal: async (documento: Omit<DocumentoFiscal, 'id'>): Promise<DocumentoFiscal> => {
    const { data, error } = await apiClient.supabase
      .from('documentos_fiscais')
      .insert(documento)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  },
  
  /**
   * Obtém integrações com o módulo financeiro
   */
  obterIntegracoes: async (status?: string): Promise<IntegracaoFinanceira[]> => {
    let query = apiClient.supabase
      .from('integracoes_financeiras')
      .select('*')
      .order('criadoEm', { ascending: false });
      
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    return data;
  },
  
  /**
   * Sincroniza dados com o módulo financeiro
   */
  sincronizarComFinanceiro: async (): Promise<{ sucesso: boolean; mensagem: string }> => {
    const { data, error } = await apiClient.functions.invoke('sincronizar-contabilidade-financeiro');
    
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Integração com o módulo RH - Busca dados de folha de pagamento para contabilização
   */
  obterDadosFolhaPagamento: async (mesAno: string): Promise<IntegracaoRhResponse> => {
    const { data, error } = await apiClient.functions.invoke('integrar-rh-folha-pagamento', {
      body: { mesAno }
    });
    
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Integração com o módulo RH - Contabiliza folha de pagamento
   */
  contabilizarFolhaPagamento: async (mesAno: string, idFolha: string): Promise<{ 
    sucesso: boolean; 
    lancamentosGerados: number; 
    mensagem: string 
  }> => {
    const { data, error } = await apiClient.functions.invoke('contabilizar-folha-pagamento', {
      body: { mesAno, idFolha }
    });
    
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Integração com o módulo RH - Busca dados de férias para contabilização
   */
  obterDadosFerias: async (filtros: {
    dataInicio?: string;
    dataFim?: string;
    status?: string;
  }): Promise<IntegracaoRhResponse> => {
    const { data, error } = await apiClient.functions.invoke('integrar-rh-ferias', {
      body: filtros
    });
    
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Integração com o módulo RH - Contabiliza provisão de férias
   */
  contabilizarProvisaoFerias: async (mesAno: string): Promise<{ 
    sucesso: boolean; 
    lancamentosGerados: number; 
    mensagem: string 
  }> => {
    const { data, error } = await apiClient.functions.invoke('contabilizar-provisao-ferias', {
      body: { mesAno }
    });
    
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Integração com o módulo RH - Busca dados de benefícios para contabilização
   */
  obterDadosBeneficios: async (mesAno: string): Promise<IntegracaoRhResponse> => {
    const { data, error } = await apiClient.functions.invoke('integrar-rh-beneficios', {
      body: { mesAno }
    });
    
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Integração com o módulo RH - Contabiliza benefícios
   */
  contabilizarBeneficios: async (mesAno: string, idPeriodo: string): Promise<{ 
    sucesso: boolean; 
    lancamentosGerados: number; 
    mensagem: string 
  }> => {
    const { data, error } = await apiClient.functions.invoke('contabilizar-beneficios', {
      body: { mesAno, idPeriodo }
    });
    
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Integração com o módulo RH - Gera relatório de custos de pessoal
   */
  gerarRelatorioCustosPessoal: async (filtros: {
    dataInicio: string;
    dataFim: string;
    departamento?: string;
    cargo?: string;
  }): Promise<any> => {
    const { data, error } = await apiClient.functions.invoke('relatorio-custos-pessoal', {
      body: filtros
    });
    
    if (error) throw new Error(error.message);
    return data;
  }
});

// Chaves para React Query
export const contabilidadeKeys = {
  all: ['contabilidade'] as const,
  planoContas: () => [...contabilidadeKeys.all, 'plano-contas'] as const,
  lancamentos: (filtros?: any) => [...contabilidadeKeys.all, 'lancamentos', filtros] as const,
  obrigacoesFiscais: (filtros?: any) => [...contabilidadeKeys.all, 'obrigacoes-fiscais', filtros] as const,
  balancete: (mesAno: string) => [...contabilidadeKeys.all, 'balancete', mesAno] as const,
  integracoes: (status?: string) => [...contabilidadeKeys.all, 'integracoes', status] as const,
  // Novas chaves para integração com RH
  rh: {
    all: [...contabilidadeKeys.all, 'rh'] as const,
    folhaPagamento: (mesAno: string) => [...contabilidadeKeys.rh.all, 'folha-pagamento', mesAno] as const,
    ferias: (filtros?: any) => [...contabilidadeKeys.rh.all, 'ferias', filtros] as const,
    beneficios: (mesAno: string) => [...contabilidadeKeys.rh.all, 'beneficios', mesAno] as const,
    relatorios: (filtros?: any) => [...contabilidadeKeys.rh.all, 'relatorios', filtros] as const,
  }
}; 