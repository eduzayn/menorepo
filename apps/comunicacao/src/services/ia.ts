import { supabase } from './supabase';

// Configurações da IA
interface IAConfig {
  ativo: boolean;
  modeloAtendimento: 'atendimento' | 'sugestao' | 'ambos';
  limiteInteracao: number;
  fraseBoasVindas: string;
  fraseIndisponibilidade: string;
}

// Tipos de mensagens para classificar
export type ClassificacaoMensagem = 
  | 'saudacao'
  | 'duvida_curso'
  | 'duvida_financeira'
  | 'duvida_matricula' 
  | 'pedido_contato'
  | 'reclamacao'
  | 'elogio'
  | 'outros';

// Interface para recomendação de resposta
export interface RecomendacaoResposta {
  mensagem: string;
  confianca: number; // 0-100
  respostas_sugeridas: string[];
  classificacao: ClassificacaoMensagem;
  requer_humano: boolean;
}

/**
 * Gera uma resposta automática com base no histórico da conversa
 */
export async function gerarRespostaAutomatica(
  conversaId: string, 
  ultimaMensagem: string
): Promise<RecomendacaoResposta> {
  try {
    // Recuperar histórico da conversa para contexto
    const { data: historico } = await supabase
      .from('mensagens')
      .select('*')
      .eq('conversa_id', conversaId)
      .order('criado_at', { ascending: true })
      .limit(10);
      
    // Em um ambiente real, aqui enviaria os dados para um modelo de IA
    // como OpenAI GPT, Microsoft Azure OpenAI, ou outro serviço
    
    // Simular análise de IA com lógica básica
    const classificacao = classificarMensagem(ultimaMensagem);
    const resposta = gerarRespostaSimulada(classificacao, ultimaMensagem);
    
    // Registrar interação de IA (útil para análise e melhoria)
    await supabase
      .from('ia_interacoes')
      .insert({
        conversa_id: conversaId,
        mensagem_entrada: ultimaMensagem,
        mensagem_saida: resposta.mensagem,
        classificacao: resposta.classificacao,
        confianca: resposta.confianca
      });
    
    return resposta;
  } catch (error) {
    console.error('Erro ao gerar resposta automática:', error);
    // Resposta fallback em caso de erro
    return {
      mensagem: 'Desculpe, estou com dificuldades para processar sua mensagem. Um atendente humano irá ajudá-lo em breve.',
      confianca: 30,
      respostas_sugeridas: [
        'Poderia reformular sua pergunta?',
        'Em que posso ajudá-lo hoje?',
        'Vou transferir para um atendente humano.'
      ],
      classificacao: 'outros',
      requer_humano: true
    };
  }
}

/**
 * Analisa a mensagem do usuário e sugere respostas para o atendente 
 */
export async function sugerirRespostas(
  mensagem: string
): Promise<string[]> {
  // Em produção, usaria um modelo de IA para gerar sugestões contextuais
  const classificacao = classificarMensagem(mensagem);
  
  // Sugestões básicas baseadas na classificação
  const sugestoes = obterSugestoesPorClassificacao(classificacao);
  return sugestoes;
}

/**
 * Verifica se a mensagem deve ser encaminhada para atendimento humano
 */
export function necessitaAtendimentoHumano(
  mensagem: string, 
  classificacao: ClassificacaoMensagem
): boolean {
  // Regras simples para determinar quando encaminhar para humano
  if (
    classificacao === 'reclamacao' || 
    classificacao === 'pedido_contato' || 
    mensagem.length > 200 ||
    mensagem.includes('falar com humano') ||
    mensagem.includes('atendente') ||
    mensagem.includes('gerente')
  ) {
    return true;
  }
  
  return false;
}

// Funções auxiliares para simulação da IA

function classificarMensagem(mensagem: string): ClassificacaoMensagem {
  const mensagemLower = mensagem.toLowerCase();
  
  if (
    mensagemLower.includes('olá') || 
    mensagemLower.includes('oi') || 
    mensagemLower.includes('bom dia') || 
    mensagemLower.includes('boa tarde') || 
    mensagemLower.includes('boa noite')
  ) {
    return 'saudacao';
  }
  
  if (
    mensagemLower.includes('curso') || 
    mensagemLower.includes('disciplina') || 
    mensagemLower.includes('aula') || 
    mensagemLower.includes('estudar')
  ) {
    return 'duvida_curso';
  }
  
  if (
    mensagemLower.includes('pagar') || 
    mensagemLower.includes('boleto') || 
    mensagemLower.includes('preço') || 
    mensagemLower.includes('valor') || 
    mensagemLower.includes('desconto')
  ) {
    return 'duvida_financeira';
  }
  
  if (
    mensagemLower.includes('matricular') || 
    mensagemLower.includes('matricula') || 
    mensagemLower.includes('inscrever') || 
    mensagemLower.includes('inscrição') || 
    mensagemLower.includes('começar')
  ) {
    return 'duvida_matricula';
  }
  
  if (
    mensagemLower.includes('atendente') || 
    mensagemLower.includes('falar com') || 
    mensagemLower.includes('humano') || 
    mensagemLower.includes('contato')
  ) {
    return 'pedido_contato';
  }
  
  if (
    mensagemLower.includes('problema') || 
    mensagemLower.includes('ruim') || 
    mensagemLower.includes('insatisfeito') || 
    mensagemLower.includes('erro') || 
    mensagemLower.includes('não consegui')
  ) {
    return 'reclamacao';
  }
  
  if (
    mensagemLower.includes('bom') || 
    mensagemLower.includes('gostei') || 
    mensagemLower.includes('parabéns') || 
    mensagemLower.includes('obrigado') || 
    mensagemLower.includes('ótimo')
  ) {
    return 'elogio';
  }
  
  return 'outros';
}

function gerarRespostaSimulada(
  classificacao: ClassificacaoMensagem, 
  mensagem: string
): RecomendacaoResposta {
  const requerHumano = necessitaAtendimentoHumano(mensagem, classificacao);
  const sugestoes = obterSugestoesPorClassificacao(classificacao);
  
  let resposta = '';
  let confianca = 0;
  
  switch (classificacao) {
    case 'saudacao':
      resposta = 'Olá! Sou o assistente virtual da Edunéxia. Como posso ajudar você hoje?';
      confianca = 90;
      break;
      
    case 'duvida_curso':
      resposta = 'Temos diversos cursos disponíveis! Posso dar mais informações sobre áreas específicas como tecnologia, educação, negócios, entre outras. Qual área mais lhe interessa?';
      confianca = 75;
      break;
      
    case 'duvida_financeira':
      resposta = 'Sobre questões financeiras, oferecemos diversas formas de pagamento e condições especiais. Um consultor especializado pode detalhar todas as opções disponíveis para você.';
      confianca = 65;
      break;
      
    case 'duvida_matricula':
      resposta = 'Para realizar sua matrícula, preciso de algumas informações básicas. Posso te mostrar o passo a passo ou, se preferir, um de nossos consultores pode te auxiliar pessoalmente.';
      confianca = 70;
      break;
      
    case 'pedido_contato':
      resposta = 'Entendi que você precisa falar com um atendente humano. Vou transferir seu atendimento imediatamente. Por favor, aguarde um momento.';
      confianca = 85;
      break;
      
    case 'reclamacao':
      resposta = 'Lamento pelos inconvenientes. Vou encaminhar sua mensagem para um de nossos atendentes resolver sua questão o mais rápido possível.';
      confianca = 60;
      break;
      
    case 'elogio':
      resposta = 'Muito obrigado pelo feedback positivo! Ficamos felizes em poder ajudar. Há algo mais em que possamos auxiliá-lo hoje?';
      confianca = 85;
      break;
      
    default:
      resposta = 'Entendi sua mensagem. Como posso ajudar? Você pode perguntar sobre nossos cursos, processo de matrícula ou formas de pagamento.';
      confianca = 40;
  }
  
  return {
    mensagem: resposta,
    confianca,
    respostas_sugeridas: sugestoes,
    classificacao,
    requer_humano: requerHumano
  };
}

function obterSugestoesPorClassificacao(classificacao: ClassificacaoMensagem): string[] {
  switch (classificacao) {
    case 'saudacao':
      return [
        'Olá! Como posso ajudar você hoje?',
        'Bem-vindo à Edunéxia! Em que posso ser útil?',
        'Olá! Estou aqui para ajudar com informações sobre nossos cursos e serviços.'
      ];
      
    case 'duvida_curso':
      return [
        'Temos diversos cursos disponíveis. Qual área específica lhe interessa?',
        'Posso enviar um catálogo completo dos nossos cursos. Você tem preferência por alguma área?',
        'Nossos cursos mais populares são na área de Tecnologia e Gestão. Gostaria de saber mais sobre algum deles?'
      ];
      
    case 'duvida_financeira':
      return [
        'Oferecemos diversos planos de pagamento. Posso detalhar as opções para você.',
        'Temos condições especiais este mês com até 30% de desconto em cursos selecionados.',
        'Além do pagamento à vista, oferecemos parcelamento em até 12x sem juros.'
      ];
      
    case 'duvida_matricula':
      return [
        'Para realizar sua matrícula, preciso dos seguintes documentos: RG, CPF e comprovante de residência.',
        'O processo de matrícula é simples e pode ser feito 100% online.',
        'Posso iniciar seu processo de matrícula agora mesmo. Você já escolheu o curso?'
      ];
      
    case 'pedido_contato':
      return [
        'Vou transferir seu atendimento para um consultor especializado imediatamente.',
        'Entendi que você prefere falar com um atendente humano. Vou providenciar isso agora mesmo.',
        'Um de nossos consultores entrará em contato com você em instantes.'
      ];
      
    case 'reclamacao':
      return [
        'Lamento pelo ocorrido. Vamos resolver isso o mais rápido possível.',
        'Pedimos desculpas pelo inconveniente. Poderia detalhar melhor o problema para que possamos ajudar?',
        'Sua satisfação é nossa prioridade. Vamos trabalhar para resolver essa situação.'
      ];
      
    case 'elogio':
      return [
        'Muito obrigado pelo feedback positivo! Ficamos felizes em poder ajudar.',
        'Agradecemos suas palavras! É gratificante saber que estamos no caminho certo.',
        'Que bom que tivemos a oportunidade de lhe proporcionar uma boa experiência!'
      ];
      
    default:
      return [
        'Como posso ajudar você hoje?',
        'Gostaria de informações sobre nossos cursos?',
        'Posso auxiliar com dúvidas sobre matrícula ou pagamentos.'
      ];
  }
} 