/**
 * Serviço para gestão de taxas e serviços adicionais
 */
import { createClient } from '@supabase/supabase-js'
import { ServicoAdicional, SolicitacaoServico, StatusSolicitacao, TipoServico } from '@/types/financeiro'
import { uploadDocumento } from './documentos'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Buscar todos os serviços disponíveis para o aluno
 */
export async function listarServicosDisponiveis(): Promise<ServicoAdicional[]> {
  try {
    const { data, error } = await supabase
      .from('servicos_adicionais')
      .select('*')
      .eq('ativo', true)
      .order('nome')

    if (error) throw error

    return data
  } catch (error) {
    console.error('Erro ao listar serviços disponíveis:', error)
    throw new Error('Falha ao carregar serviços disponíveis')
  }
}

/**
 * Buscar detalhes de um serviço específico
 */
export async function obterServicoDetalhes(servicoId: string): Promise<ServicoAdicional> {
  try {
    const { data, error } = await supabase
      .from('servicos_adicionais')
      .select('*')
      .eq('id', servicoId)
      .single()

    if (error) throw error
    if (!data) throw new Error('Serviço não encontrado')

    return data
  } catch (error) {
    console.error('Erro ao obter detalhes do serviço:', error)
    throw new Error('Falha ao carregar detalhes do serviço')
  }
}

/**
 * Solicitar um serviço com documentos opcionais
 */
export async function solicitarServico(
  alunoId: string, 
  servicoId: string, 
  justificativa?: string,
  documentos?: File[]
): Promise<SolicitacaoServico> {
  try {
    // 1. Buscar informações do serviço
    const servico = await obterServicoDetalhes(servicoId)
    
    // 2. Validar se o serviço requer justificativa
    if (servico.requerJustificativa && !justificativa) {
      throw new Error('Este serviço requer uma justificativa')
    }
    
    // 3. Validar se o serviço requer documentos
    if (servico.requerDocumentos && (!documentos || documentos.length === 0)) {
      throw new Error('Este serviço requer documentos')
    }
    
    // 4. Upload de documentos, se fornecidos
    const documentosIds: string[] = []
    if (documentos && documentos.length > 0) {
      for (const doc of documentos) {
        const documento = await uploadDocumento(
          doc, 
          'OUTROS', 
          alunoId
        )
        documentosIds.push(documento.id)
      }
    }
    
    // 5. Calcular prazo de entrega
    const dataAtual = new Date()
    const prazoConclusao = new Date(dataAtual)
    prazoConclusao.setDate(prazoConclusao.getDate() + servico.prazoEntrega)
    
    // 6. Criar a solicitação
    const novaSolicitacao: Omit<SolicitacaoServico, 'id' | 'created_at' | 'updated_at'> = {
      alunoId,
      servicoId,
      valorCobrado: servico.valor,
      dataEmissao: new Date().toISOString(),
      status: 'PENDENTE_PAGAMENTO',
      justificativa,
      documentosEnviados: documentosIds.length > 0 ? documentosIds : undefined,
      prazoConclusao: prazoConclusao.toISOString(),
      notificacaoEnviada: false
    }
    
    const { data, error } = await supabase
      .from('solicitacoes_servicos')
      .insert(novaSolicitacao)
      .select()
      .single()
      
    if (error) throw error
    
    // 7. Gerar cobrança para o aluno
    await gerarCobrancaServico(data.id)
    
    return data
  } catch (error) {
    console.error('Erro ao solicitar serviço:', error)
    throw new Error('Falha ao solicitar serviço')
  }
}

/**
 * Gera link de cobrança para um serviço solicitado
 * @param solicitacaoId ID da solicitação de serviço
 * @returns URL do link de pagamento
 */
export async function gerarCobrancaServico(solicitacaoId: string): Promise<string> {
  try {
    console.log(`Gerando cobrança para solicitação ${solicitacaoId}`)
    
    // Em produção: integrar com gateway de pagamento
    // Simulação: aguardar 1.5 segundos e retornar um link fictício
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simular integração com gateway de pagamento
    const linkPagamento = `https://pagamento.edunexia.com.br/servicos/${solicitacaoId}?token=${Date.now()}`
    
    // Atualizar status no banco (simulado)
    console.log(`Link de pagamento gerado: ${linkPagamento}`)
    
    return linkPagamento
  } catch (erro) {
    console.error('Erro ao gerar cobrança:', erro)
    throw new Error('Não foi possível gerar o link de pagamento.')
  }
}

/**
 * Listar solicitações de serviços do aluno
 */
export async function listarSolicitacoesServicos(
  alunoId: string,
  status?: StatusSolicitacao
): Promise<SolicitacaoServico[]> {
  try {
    let query = supabase
      .from('solicitacoes_servicos')
      .select('*, servico:servicos_adicionais(*)')
      .eq('alunoId', alunoId)
      .order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Erro ao listar solicitações de serviços:', error)
    throw new Error('Falha ao carregar solicitações')
  }
}

/**
 * Obter detalhes de uma solicitação
 */
export async function obterDetalhesSolicitacao(
  solicitacaoId: string
): Promise<SolicitacaoServico> {
  try {
    const { data, error } = await supabase
      .from('solicitacoes_servicos')
      .select('*, servico:servicos_adicionais(*)')
      .eq('id', solicitacaoId)
      .single()
    
    if (error) throw error
    if (!data) throw new Error('Solicitação não encontrada')
    
    return data
  } catch (error) {
    console.error('Erro ao obter detalhes da solicitação:', error)
    throw new Error('Falha ao carregar detalhes da solicitação')
  }
}

/**
 * Cancelar uma solicitação de serviço
 */
export async function cancelarSolicitacao(
  solicitacaoId: string
): Promise<SolicitacaoServico> {
  try {
    // Verificar status atual
    const { data: solicitacao } = await supabase
      .from('solicitacoes_servicos')
      .select('status')
      .eq('id', solicitacaoId)
      .single()
    
    if (!solicitacao) throw new Error('Solicitação não encontrada')
    
    // Só é possível cancelar se ainda estiver pendente
    if (solicitacao.status !== 'PENDENTE_PAGAMENTO') {
      throw new Error('Não é possível cancelar uma solicitação que já está em processamento ou concluída')
    }
    
    // Atualizar status
    const { data, error } = await supabase
      .from('solicitacoes_servicos')
      .update({
        status: 'CANCELADO',
        updated_at: new Date().toISOString()
      })
      .eq('id', solicitacaoId)
      .select('*')
      .single()
    
    if (error) throw error
    
    // Cancelar cobrança aqui, se necessário
    // (integração com gateway de pagamento)
    
    return data
  } catch (error) {
    console.error('Erro ao cancelar solicitação:', error)
    throw new Error('Falha ao cancelar solicitação')
  }
}

/**
 * Atualizar status de pagamento (webhook)
 */
export async function atualizarStatusPagamento(
  transacaoId: string,
  statusPagamento: 'aprovado' | 'rejeitado' | 'cancelado'
): Promise<void> {
  try {
    // Buscar solicitação pelo ID da transação
    const { data: solicitacao, error: searchError } = await supabase
      .from('solicitacoes_servicos')
      .select('id, status')
      .eq('transacaoId', transacaoId)
      .single()
    
    if (searchError) throw searchError
    if (!solicitacao) throw new Error('Solicitação não encontrada para esta transação')
    
    // Mapear status do pagamento para status da solicitação
    let novoStatus: StatusSolicitacao
    let dataPagamento: string | null = null
    
    switch (statusPagamento) {
      case 'aprovado':
        novoStatus = 'PROCESSANDO'
        dataPagamento = new Date().toISOString()
        break
      case 'rejeitado':
        novoStatus = 'REJEITADO'
        break
      case 'cancelado':
        novoStatus = 'CANCELADO'
        break
      default:
        throw new Error('Status de pagamento inválido')
    }
    
    // Atualizar a solicitação
    const { error: updateError } = await supabase
      .from('solicitacoes_servicos')
      .update({
        status: novoStatus,
        dataPagamento,
        updated_at: new Date().toISOString()
      })
      .eq('id', solicitacao.id)
    
    if (updateError) throw updateError
    
    // Se o pagamento foi aprovado, iniciar processamento do serviço
    if (statusPagamento === 'aprovado') {
      await iniciarProcessamentoServico(solicitacao.id)
    }
  } catch (error) {
    console.error('Erro ao atualizar status de pagamento:', error)
    throw new Error('Falha ao atualizar status de pagamento')
  }
}

/**
 * Iniciar processamento do serviço após pagamento
 */
async function iniciarProcessamentoServico(solicitacaoId: string): Promise<void> {
  try {
    // Buscar detalhes da solicitação
    const solicitacao = await obterDetalhesSolicitacao(solicitacaoId)
    
    // Verificar tipo de serviço e processar de acordo
    // Isso poderia acionar uma tarefa em background ou notificar equipe administrativa
    
    // Enviar notificação ao aluno sobre o início do processamento
    await enviarNotificacaoAoAluno(
      solicitacao.alunoId,
      `Seu pedido de ${solicitacao.servico!.nome} começou a ser processado`,
      `Acompanhe o status da sua solicitação na área de serviços. Prazo de conclusão: ${new Date(solicitacao.prazoConclusao!).toLocaleDateString('pt-BR')}`
    )
    
    // Marcar notificação como enviada
    await supabase
      .from('solicitacoes_servicos')
      .update({
        notificacaoEnviada: true
      })
      .eq('id', solicitacaoId)
  } catch (error) {
    console.error('Erro ao iniciar processamento de serviço:', error)
    // Não lançamos o erro para não impedir a continuidade do fluxo
  }
}

/**
 * Enviar notificação ao aluno (mock, seria implementado com um serviço de notificações)
 */
async function enviarNotificacaoAoAluno(
  alunoId: string,
  titulo: string,
  mensagem: string
): Promise<void> {
  try {
    // Mock da notificação
    console.log(`Notificação para ${alunoId}: ${titulo} - ${mensagem}`)
    
    // Aqui seria integrado com um serviço de notificações real
    await supabase
      .from('notificacoes')
      .insert({
        alunoId,
        titulo,
        mensagem,
        lida: false,
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Erro ao enviar notificação:', error)
  }
}

/**
 * Verificar e aplicar taxas automáticas para uma situação específica
 * (por exemplo, ao trancar matrícula, solicitar segunda via, etc.)
 */
export async function verificarAplicacaoTaxaAutomatica(
  alunoId: string,
  situacao: string,
  dadosContexto: Record<string, any>
): Promise<ServicoAdicional[]> {
  try {
    // Buscar serviços que possuem aplicação automática
    const { data: servicos, error } = await supabase
      .from('servicos_adicionais')
      .select('*')
      .eq('ativo', true)
      .eq('aplicarAutomaticamente', true)
    
    if (error) throw error
    
    // Filtrar serviços aplicáveis a esta situação
    const servicosAplicaveis = servicos.filter(servico => {
      // Se não tem regras condicionais definidas, não é aplicável automaticamente
      if (!servico.condicionaisAplicacaoAutomatica) return false;
      
      try {
        // Analisar regras de aplicação (formato JSON)
        const regras = JSON.parse(servico.condicionaisAplicacaoAutomatica);
        
        // Verificar se a situação está nas regras
        if (regras.situacao !== situacao) return false;
        
        // Verificar condições adicionais (exemplo básico)
        if (regras.condicoes) {
          // Para cada condição, verificar se é satisfeita pelo contexto
          return regras.condicoes.every((condicao: any) => {
            const valorContexto = dadosContexto[condicao.campo];
            
            switch (condicao.operador) {
              case 'igual':
                return valorContexto === condicao.valor;
              case 'diferente':
                return valorContexto !== condicao.valor;
              case 'maior':
                return valorContexto > condicao.valor;
              case 'menor':
                return valorContexto < condicao.valor;
              default:
                return false;
            }
          });
        }
        
        return true;
      } catch (e) {
        console.error('Erro ao analisar regras condicionais:', e);
        return false;
      }
    });
    
    // Para cada serviço aplicável, criar uma solicitação automática
    for (const servico of servicosAplicaveis) {
      await solicitarServico(
        alunoId,
        servico.id,
        `Aplicado automaticamente devido a: ${situacao}`,
        [] // Sem documentos iniciais
      );
    }
    
    return servicosAplicaveis;
  } catch (error) {
    console.error('Erro ao verificar aplicação de taxas automáticas:', error);
    throw new Error('Falha ao verificar taxas automáticas');
  }
} 