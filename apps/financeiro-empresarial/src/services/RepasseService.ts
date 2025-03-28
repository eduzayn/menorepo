import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';

/**
 * Serviço para gerenciamento de comissões e repasses para polos e consultores
 */

// Tipos de beneficiários
export type TipoBeneficiario = 'polo' | 'consultor';

// Status de comissão
export type StatusComissao = 'pendente' | 'processando' | 'pago' | 'cancelado' | 'estornado';

// Status de repasse
export type StatusRepasse = 'pendente' | 'processando' | 'pago' | 'cancelado' | 'estornado';

// Tipo de comissão
export type TipoComissao = 'matricula' | 'mensalidade' | 'certificacao' | 'material';

// Interface para comissão
export interface Comissao {
  id: string;
  beneficiario_id: string;
  beneficiario_tipo: TipoBeneficiario;
  aluno_id?: string;
  matricula_id?: string;
  curso_id?: string;
  pagamento_id?: string;
  valor: number;
  percentual: number;
  base_calculo: number;
  tipo: TipoComissao;
  data_referencia: string;
  data_calculo: string;
  status: StatusComissao;
  repasse_id?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

// Interface para repasse financeiro
export interface Repasse {
  id: string;
  beneficiario_id: string;
  beneficiario_tipo: TipoBeneficiario;
  valor_total: number;
  quantidade_comissoes: number;
  data_prevista: string;
  data_pagamento?: string;
  comprovante_url?: string;
  forma_pagamento?: string;
  numero_documento?: string;
  status: StatusRepasse;
  observacoes?: string;
  gerado_por: string;
  aprovado_por?: string;
  data_aprovacao?: string;
  instituicao_id: string;
  created_at: string;
  updated_at: string;
}

// Interface para regra de comissão
export interface RegraComissao {
  id: string;
  beneficiario_tipo: TipoBeneficiario;
  curso_id?: string;
  valor_fixo?: number;
  percentual?: number;
  recorrente: boolean;
  parcelas_aplicaveis?: number[];
  instituicao_id: string;
  created_at: string;
  updated_at: string;
}

// Filtros para busca de comissões
export interface FiltroComissao {
  beneficiario_id?: string;
  beneficiario_tipo?: TipoBeneficiario;
  curso_id?: string;
  status?: StatusComissao;
  tipo?: TipoComissao;
  data_inicio?: string;
  data_fim?: string;
  repasse_id?: string;
  instituicao_id?: string;
}

// Filtros para busca de repasses
export interface FiltroRepasse {
  beneficiario_id?: string;
  beneficiario_tipo?: TipoBeneficiario;
  status?: StatusRepasse;
  data_inicio?: string;
  data_fim?: string;
  instituicao_id?: string;
}

// Input para criação de comissão
export interface ComissaoInput {
  beneficiario_id: string;
  beneficiario_tipo: TipoBeneficiario;
  aluno_id?: string;
  matricula_id?: string;
  curso_id?: string;
  pagamento_id?: string;
  valor: number;
  percentual: number;
  base_calculo: number;
  tipo: TipoComissao;
  data_referencia: string;
  observacoes?: string;
  instituicao_id: string;
}

// Input para criação de repasse
export interface RepasseInput {
  beneficiario_id: string;
  beneficiario_tipo: TipoBeneficiario;
  comissoes_ids: string[];
  data_prevista: string;
  observacoes?: string;
  instituicao_id: string;
  gerado_por: string;
}

// Resposta de operações de comissões
interface RespostaComissao {
  dados: Comissao | Comissao[] | null;
  erro: Error | null;
}

// Resposta de operações de repasses
interface RespostaRepasse {
  dados: Repasse | Repasse[] | null;
  erro: Error | null;
}

// Classe principal para gerenciamento de repasses
export class RepasseService {
  private supabase: SupabaseClient;

  constructor(client: { supabase: SupabaseClient }) {
    this.supabase = client.supabase;
  }

  /**
   * Busca comissões aplicando os filtros fornecidos
   */
  async buscarComissoes(filtros: FiltroComissao): Promise<RespostaComissao> {
    try {
      let query = this.supabase
        .from('comissoes')
        .select('*');

      // Aplicando filtros
      if (filtros.beneficiario_id) {
        query = query.eq('beneficiario_id', filtros.beneficiario_id);
      }
      
      if (filtros.beneficiario_tipo) {
        query = query.eq('beneficiario_tipo', filtros.beneficiario_tipo);
      }
      
      if (filtros.curso_id) {
        query = query.eq('curso_id', filtros.curso_id);
      }
      
      if (filtros.status) {
        query = query.eq('status', filtros.status);
      }
      
      if (filtros.tipo) {
        query = query.eq('tipo', filtros.tipo);
      }
      
      if (filtros.repasse_id) {
        query = query.eq('repasse_id', filtros.repasse_id);
      }

      if (filtros.instituicao_id) {
        query = query.eq('instituicao_id', filtros.instituicao_id);
      }
      
      if (filtros.data_inicio && filtros.data_fim) {
        query = query
          .gte('data_referencia', filtros.data_inicio)
          .lte('data_referencia', filtros.data_fim);
      }

      const { data, error } = await query.order('data_referencia', { ascending: false });

      if (error) throw error;

      return { dados: data as Comissao[], erro: null };
    } catch (error) {
      console.error('Erro ao buscar comissões:', error);
      return { dados: null, erro: error as Error };
    }
  }

  /**
   * Busca uma comissão específica pelo ID
   */
  async buscarComissaoPorId(id: string): Promise<RespostaComissao> {
    try {
      const { data, error } = await this.supabase
        .from('comissoes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { dados: data as Comissao, erro: null };
    } catch (error) {
      console.error(`Erro ao buscar comissão com ID ${id}:`, error);
      return { dados: null, erro: error as Error };
    }
  }

  /**
   * Cria uma nova comissão
   */
  async criarComissao(comissao: ComissaoInput): Promise<RespostaComissao> {
    try {
      // Adicionar campos automáticos
      const novaComissao = {
        ...comissao,
        status: 'pendente' as StatusComissao,
        data_calculo: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('comissoes')
        .insert([novaComissao])
        .select()
        .single();

      if (error) throw error;

      return { dados: data as Comissao, erro: null };
    } catch (error) {
      console.error('Erro ao criar comissão:', error);
      return { dados: null, erro: error as Error };
    }
  }

  /**
   * Atualiza uma comissão existente
   */
  async atualizarComissao(id: string, alteracoes: Partial<Comissao>): Promise<RespostaComissao> {
    try {
      // Adicionar updated_at
      const atualizacao = {
        ...alteracoes,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('comissoes')
        .update(atualizacao)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { dados: data as Comissao, erro: null };
    } catch (error) {
      console.error(`Erro ao atualizar comissão com ID ${id}:`, error);
      return { dados: null, erro: error as Error };
    }
  }

  /**
   * Cancela uma comissão
   */
  async cancelarComissao(id: string, motivo: string): Promise<RespostaComissao> {
    try {
      // Verificar se a comissão já está em um repasse
      const { data: comissaoAtual, error: erroConsulta } = await this.supabase
        .from('comissoes')
        .select('repasse_id, status')
        .eq('id', id)
        .single();

      if (erroConsulta) throw erroConsulta;

      // Se já estiver em um repasse, não permite cancelar
      if (comissaoAtual.repasse_id && comissaoAtual.status !== 'pendente') {
        throw new Error('Não é possível cancelar uma comissão que já está em um repasse processado');
      }

      const atualizacao = {
        status: 'cancelado' as StatusComissao,
        observacoes: `Cancelado: ${motivo}`,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('comissoes')
        .update(atualizacao)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { dados: data as Comissao, erro: null };
    } catch (error) {
      console.error(`Erro ao cancelar comissão com ID ${id}:`, error);
      return { dados: null, erro: error as Error };
    }
  }

  /**
   * Busca repasses aplicando os filtros fornecidos
   */
  async buscarRepasses(filtros: FiltroRepasse): Promise<RespostaRepasse> {
    try {
      let query = this.supabase
        .from('repasses')
        .select('*');

      // Aplicando filtros
      if (filtros.beneficiario_id) {
        query = query.eq('beneficiario_id', filtros.beneficiario_id);
      }
      
      if (filtros.beneficiario_tipo) {
        query = query.eq('beneficiario_tipo', filtros.beneficiario_tipo);
      }
      
      if (filtros.status) {
        query = query.eq('status', filtros.status);
      }

      if (filtros.instituicao_id) {
        query = query.eq('instituicao_id', filtros.instituicao_id);
      }
      
      if (filtros.data_inicio && filtros.data_fim) {
        query = query
          .gte('data_prevista', filtros.data_inicio)
          .lte('data_prevista', filtros.data_fim);
      }

      const { data, error } = await query.order('data_prevista', { ascending: false });

      if (error) throw error;

      return { dados: data as Repasse[], erro: null };
    } catch (error) {
      console.error('Erro ao buscar repasses:', error);
      return { dados: null, erro: error as Error };
    }
  }

  /**
   * Busca um repasse específico pelo ID
   */
  async buscarRepassePorId(id: string): Promise<RespostaRepasse> {
    try {
      const { data, error } = await this.supabase
        .from('repasses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { dados: data as Repasse, erro: null };
    } catch (error) {
      console.error(`Erro ao buscar repasse com ID ${id}:`, error);
      return { dados: null, erro: error as Error };
    }
  }

  /**
   * Cria um novo repasse a partir de comissões selecionadas
   */
  async criarRepasse(repasse: RepasseInput): Promise<RespostaRepasse> {
    try {
      // 1. Obter as comissões selecionadas e verificar status
      const { data: comissoes, error: erroComissoes } = await this.supabase
        .from('comissoes')
        .select('id, valor, status')
        .in('id', repasse.comissoes_ids)
        .eq('status', 'pendente');

      if (erroComissoes) throw erroComissoes;
      if (!comissoes || comissoes.length === 0) {
        throw new Error('Nenhuma comissão válida selecionada para repasse');
      }

      // Verificar se todas as comissões solicitadas estão disponíveis
      if (comissoes.length !== repasse.comissoes_ids.length) {
        throw new Error('Algumas comissões selecionadas não estão pendentes ou não existem');
      }

      // 2. Calcular valor total
      const valorTotal = comissoes.reduce((total, comissao) => total + comissao.valor, 0);

      // 3. Criar o repasse
      const novoRepasse = {
        beneficiario_id: repasse.beneficiario_id,
        beneficiario_tipo: repasse.beneficiario_tipo,
        valor_total: valorTotal,
        quantidade_comissoes: comissoes.length,
        data_prevista: repasse.data_prevista,
        status: 'pendente' as StatusRepasse,
        observacoes: repasse.observacoes,
        gerado_por: repasse.gerado_por,
        instituicao_id: repasse.instituicao_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: repasseInserido, error: erroRepasse } = await this.supabase
        .from('repasses')
        .insert([novoRepasse])
        .select()
        .single();

      if (erroRepasse) throw erroRepasse;

      // 4. Atualizar o status das comissões para associá-las ao repasse
      const { error: erroUpdate } = await this.supabase
        .from('comissoes')
        .update({
          repasse_id: repasseInserido.id,
          status: 'processando',
          updated_at: new Date().toISOString()
        })
        .in('id', repasse.comissoes_ids);

      if (erroUpdate) throw erroUpdate;

      return { dados: repasseInserido as Repasse, erro: null };
    } catch (error) {
      console.error('Erro ao criar repasse:', error);
      return { dados: null, erro: error as Error };
    }
  }

  /**
   * Atualiza um repasse existente
   */
  async atualizarRepasse(id: string, alteracoes: Partial<Repasse>): Promise<RespostaRepasse> {
    try {
      // Adicionar updated_at
      const atualizacao = {
        ...alteracoes,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('repasses')
        .update(atualizacao)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { dados: data as Repasse, erro: null };
    } catch (error) {
      console.error(`Erro ao atualizar repasse com ID ${id}:`, error);
      return { dados: null, erro: error as Error };
    }
  }

  /**
   * Confirma o pagamento de um repasse
   */
  async confirmarPagamentoRepasse(id: string, dataPagemento: string, comprovante?: string, formaPagamento?: string, numeroDocumento?: string, aprovador?: string): Promise<RespostaRepasse> {
    try {
      // 1. Atualizar o repasse
      const atualizacaoRepasse = {
        status: 'pago' as StatusRepasse,
        data_pagamento: dataPagemento,
        comprovante_url: comprovante,
        forma_pagamento: formaPagamento,
        numero_documento: numeroDocumento,
        aprovado_por: aprovador,
        data_aprovacao: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: repasseAtualizado, error: erroRepasse } = await this.supabase
        .from('repasses')
        .update(atualizacaoRepasse)
        .eq('id', id)
        .select()
        .single();

      if (erroRepasse) throw erroRepasse;

      // 2. Atualizar o status das comissões associadas
      const { error: erroComissoes } = await this.supabase
        .from('comissoes')
        .update({
          status: 'pago',
          updated_at: new Date().toISOString()
        })
        .eq('repasse_id', id);

      if (erroComissoes) throw erroComissoes;

      return { dados: repasseAtualizado as Repasse, erro: null };
    } catch (error) {
      console.error(`Erro ao confirmar pagamento do repasse ${id}:`, error);
      return { dados: null, erro: error as Error };
    }
  }

  /**
   * Cancela um repasse
   */
  async cancelarRepasse(id: string, motivo: string): Promise<RespostaRepasse> {
    try {
      // 1. Obter o repasse para verificar se pode ser cancelado
      const { data: repasse, error: erroConsulta } = await this.supabase
        .from('repasses')
        .select('status')
        .eq('id', id)
        .single();

      if (erroConsulta) throw erroConsulta;

      // Repasses já pagos não podem ser cancelados
      if (repasse.status === 'pago') {
        throw new Error('Não é possível cancelar um repasse já pago');
      }

      // 2. Atualizar o repasse
      const atualizacaoRepasse = {
        status: 'cancelado' as StatusRepasse,
        observacoes: `Cancelado: ${motivo}`,
        updated_at: new Date().toISOString()
      };

      const { data: repasseAtualizado, error: erroRepasse } = await this.supabase
        .from('repasses')
        .update(atualizacaoRepasse)
        .eq('id', id)
        .select()
        .single();

      if (erroRepasse) throw erroRepasse;

      // 3. Retornar as comissões ao status pendente
      const { error: erroComissoes } = await this.supabase
        .from('comissoes')
        .update({
          repasse_id: null,
          status: 'pendente',
          updated_at: new Date().toISOString()
        })
        .eq('repasse_id', id);

      if (erroComissoes) throw erroComissoes;

      return { dados: repasseAtualizado as Repasse, erro: null };
    } catch (error) {
      console.error(`Erro ao cancelar repasse ${id}:`, error);
      return { dados: null, erro: error as Error };
    }
  }

  /**
   * Calcula e gera comissões automaticamente a partir de um pagamento
   */
  async gerarComissoesAutomaticas(pagamentoId: string, aluno_id: string, curso_id: string, valor: number, parcela: number, instituicao_id: string): Promise<RespostaComissao> {
    try {
      // 1. Buscar regras de comissão aplicáveis
      const { data: regras, error: erroRegras } = await this.supabase
        .from('regras_comissao')
        .select('*')
        .or(`curso_id.eq.${curso_id},curso_id.is.null`)
        .eq('instituicao_id', instituicao_id);

      if (erroRegras) throw erroRegras;

      if (!regras || regras.length === 0) {
        return { dados: [], erro: null }; // Nenhuma regra configurada
      }

      // 2. Filtrar regras aplicáveis à parcela atual
      const regrasAplicaveis = regras.filter(regra => {
        // Se a regra não é recorrente, só se aplica à primeira parcela
        if (!regra.recorrente && parcela > 1) return false;
        
        // Se tem parcelas específicas, verificar se a parcela atual está incluída
        if (regra.parcelas_aplicaveis && regra.parcelas_aplicaveis.length > 0) {
          return regra.parcelas_aplicaveis.includes(parcela);
        }
        
        return true;
      });

      // 3. Aplicar cada regra e gerar as comissões
      const comissoesGeradas: ComissaoInput[] = [];
      
      for (const regra of regrasAplicaveis) {
        let valorComissao = 0;
        
        // Calcular valor da comissão
        if (regra.percentual) {
          valorComissao = valor * (regra.percentual / 100);
        } else if (regra.valor_fixo) {
          valorComissao = regra.valor_fixo;
        }
        
        // Buscar o beneficiário
        // Implementação depende da estrutura de dados de polos e consultores
        // Para simplificar, vamos assumir que temos um relacionamento na tabela alunos
        const { data: aluno, error: erroAluno } = await this.supabase
          .from('alunos')
          .select('polo_id, consultor_id')
          .eq('id', aluno_id)
          .single();

        if (erroAluno) throw erroAluno;
        
        let beneficiarioId = '';
        
        if (regra.beneficiario_tipo === 'polo' && aluno.polo_id) {
          beneficiarioId = aluno.polo_id;
        } else if (regra.beneficiario_tipo === 'consultor' && aluno.consultor_id) {
          beneficiarioId = aluno.consultor_id;
        } else {
          continue; // Pular esta regra se não houver beneficiário
        }

        // Criar a comissão
        comissoesGeradas.push({
          beneficiario_id: beneficiarioId,
          beneficiario_tipo: regra.beneficiario_tipo,
          aluno_id,
          curso_id,
          pagamento_id: pagamentoId,
          valor: valorComissao,
          percentual: regra.percentual || 0,
          base_calculo: valor,
          tipo: parcela === 1 ? 'matricula' : 'mensalidade',
          data_referencia: new Date().toISOString(),
          observacoes: `Comissão gerada automaticamente para parcela ${parcela}`,
          instituicao_id
        });
      }

      // 4. Inserir as comissões geradas
      if (comissoesGeradas.length === 0) {
        return { dados: [], erro: null }; // Nenhuma comissão gerada
      }

      const { data: comissoesInseridas, error: erroInsercao } = await this.supabase
        .from('comissoes')
        .insert(comissoesGeradas.map(c => ({
          ...c,
          status: 'pendente',
          data_calculo: new Date().toISOString()
        })))
        .select();

      if (erroInsercao) throw erroInsercao;

      return { dados: comissoesInseridas as Comissao[], erro: null };
    } catch (error) {
      console.error(`Erro ao gerar comissões automáticas para o pagamento ${pagamentoId}:`, error);
      return { dados: null, erro: error as Error };
    }
  }
} 