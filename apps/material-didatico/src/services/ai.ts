import { AISuggestion, BlockType } from '@/types/editor'

class AIService {
  private static instance: AIService
  private apiKey: string
  private model: string

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
    this.model = process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-4'
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  private async makeRequest(prompt: string, type: AISuggestion['type'] = 'text', blockType?: BlockType): Promise<AISuggestion> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente especializado em educação, ajudando a criar conteúdo didático de alta qualidade.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao fazer requisição para a API de IA')
      }

      const data = await response.json()
      return {
        content: data.choices[0].message.content,
        confidence: 0.8, // Valor fixo por enquanto
        type: type,
        blockType: blockType
      }
    } catch (error) {
      console.error('Erro no serviço de IA:', error)
      throw error
    }
  }

  public async generateContentSuggestion(content: string): Promise<AISuggestion> {
    const prompt = `Com base no seguinte conteúdo, sugira melhorias e adições para torná-lo mais completo e didático:\n\n${content}`
    return this.makeRequest(prompt)
  }

  public async generateSummary(content: string): Promise<AISuggestion> {
    const prompt = `Crie um resumo conciso e informativo do seguinte conteúdo:\n\n${content}`
    return this.makeRequest(prompt, 'summary')
  }

  public async generateLearningObjectives(content: string): Promise<AISuggestion> {
    const prompt = `Com base no seguinte conteúdo, liste os objetivos de aprendizagem principais:\n\n${content}`
    return this.makeRequest(prompt, 'objectives')
  }

  public async generateActivity(content: string): Promise<AISuggestion> {
    const prompt = `Crie uma atividade prática relacionada ao seguinte conteúdo:\n\n${content}`
    return this.makeRequest(prompt, 'activity')
  }

  public async correctContent(content: string): Promise<AISuggestion> {
    const prompt = `Revise e corrija o seguinte conteúdo, mantendo a precisão e clareza:\n\n${content}`
    return this.makeRequest(prompt, 'correction')
  }

  // Novos métodos para sugestão de blocos

  public async suggestBlockType(content: string): Promise<AISuggestion> {
    const prompt = `Analise o contexto do seguinte conteúdo e sugira qual tipo de bloco educacional seria mais eficaz para complementá-lo. 
    As opções são: texto explicativo, vídeo demonstrativo, quiz de fixação, atividade prática, simulação interativa, ou link para recurso externo. 
    Explique brevemente sua sugestão:\n\n${content}`
    return this.makeRequest(prompt, 'block')
  }

  public async generateTextBlock(content: string): Promise<AISuggestion> {
    const prompt = `Crie um bloco de texto educacional para complementar o seguinte conteúdo. 
    O texto deve ser claro, didático e incluir exemplos quando apropriado:\n\n${content}`
    return this.makeRequest(prompt, 'block', 'text')
  }

  public async generateQuizBlock(content: string): Promise<AISuggestion> {
    const prompt = `Crie um quiz de múltipla escolha com 3-5 questões para avaliar a compreensão do seguinte conteúdo. 
    Para cada questão, forneça o texto da pergunta, 4 alternativas e indique qual é a correta:\n\n${content}`
    return this.makeRequest(prompt, 'block', 'quiz')
  }

  public async generateActivityBlock(content: string): Promise<AISuggestion> {
    const prompt = `Crie uma atividade prática completa relacionada ao seguinte conteúdo. 
    Inclua título, descrição, instruções detalhadas, recursos necessários e nível de dificuldade:\n\n${content}`
    return this.makeRequest(prompt, 'block', 'activity')
  }

  public async generateVideoSuggestion(content: string): Promise<AISuggestion> {
    const prompt = `Com base no seguinte conteúdo, sugira tópicos e aspectos importantes para incluir em um vídeo educacional. 
    Considere demonstrações visuais, explicações conceituais e exemplos práticos:\n\n${content}`
    return this.makeRequest(prompt, 'block', 'video')
  }

  public async generateSimulationIdeas(content: string): Promise<AISuggestion> {
    const prompt = `Sugira ideias para uma simulação interativa que poderia complementar o seguinte conteúdo educacional. 
    Inclua conceitos a serem explorados, parâmetros que poderiam ser manipulados e resultados esperados:\n\n${content}`
    return this.makeRequest(prompt, 'block', 'simulation')
  }
}

export { AIService }
export const aiService = AIService.getInstance() 