import { AISuggestion } from '@/types/editor'

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

  private async makeRequest(prompt: string): Promise<AISuggestion> {
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
        type: 'text',
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
    return this.makeRequest(prompt)
  }

  public async generateLearningObjectives(content: string): Promise<AISuggestion> {
    const prompt = `Com base no seguinte conteúdo, liste os objetivos de aprendizagem principais:\n\n${content}`
    return this.makeRequest(prompt)
  }

  public async generateActivity(content: string): Promise<AISuggestion> {
    const prompt = `Crie uma atividade prática relacionada ao seguinte conteúdo:\n\n${content}`
    return this.makeRequest(prompt)
  }

  public async correctContent(content: string): Promise<AISuggestion> {
    const prompt = `Revise e corrija o seguinte conteúdo, mantendo a precisão e clareza:\n\n${content}`
    return this.makeRequest(prompt)
  }
}

export const aiService = AIService.getInstance() 