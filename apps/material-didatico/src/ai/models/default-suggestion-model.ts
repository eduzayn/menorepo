import { SuggestionModel, SuggestionRequest, SuggestionResponse } from './suggestion-model';
import { AISuggestion } from '../suggestion-engine';

interface DefaultSuggestionModelOptions {
  temperature?: number;
  maxSuggestions?: number;
}

/**
 * Implementação padrão do modelo de sugestões
 */
export class DefaultSuggestionModel implements SuggestionModel {
  private options: DefaultSuggestionModelOptions;

  constructor(options: DefaultSuggestionModelOptions = {}) {
    this.options = {
      temperature: options.temperature || 0.7,
      maxSuggestions: options.maxSuggestions || 3
    };
  }

  /**
   * Gera sugestões com base na requisição
   */
  public async generateSuggestions(request: SuggestionRequest): Promise<SuggestionResponse> {
    try {
      // Em um cenário real, faria uma chamada para uma API de IA
      // Para fins de simulação, retornamos dados mockados
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Determinar foco das sugestões com base no contexto
      const focusedBlockType = request.targetBlockType;
      
      // Gerar sugestões mockadas
      const suggestions: AISuggestion[] = [];
      
      if (request.contentTitle.includes('Matemática') || request.topic?.includes('Matemática')) {
        suggestions.push({
          title: 'Introdução aos Conceitos Matemáticos',
          type: 'text',
          blockType: 'text',
          confidence: 0.95,
          preview: 'Introdução clara aos princípios fundamentais da matemática abordados neste material.',
          reasoning: 'Uma boa introdução estabelece a base para entendimento dos conceitos matemáticos.'
        });
        
        suggestions.push({
          title: 'Fórmulas e Equações',
          type: 'block',
          blockType: 'text',
          confidence: 0.88,
          preview: 'Seção dedicada às principais fórmulas e equações relacionadas ao tópico.',
          reasoning: 'Materiais de matemática eficazes contêm seções claras para fórmulas.'
        });
        
        suggestions.push({
          title: 'Exercícios Práticos',
          type: 'block',
          blockType: 'activity',
          confidence: 0.91,
          preview: 'Conjunto de exercícios práticos para fixação do conteúdo matemático.',
          reasoning: 'Práticas guiadas aumentam a retenção de conceitos matemáticos em 70%.'
        });
      } else {
        // Sugestões genéricas para qualquer tema
        suggestions.push({
          title: 'Introdução ao Tema',
          type: 'text',
          blockType: 'text',
          confidence: 0.92,
          preview: `Uma introdução sobre ${request.topic || 'o tema'} seria útil para contextualizar os alunos.`,
          reasoning: `Os materiais didáticos eficazes geralmente começam com uma introdução clara.`
        });
        
        suggestions.push({
          title: 'Recurso Visual',
          type: 'block',
          blockType: 'video',
          confidence: 0.85,
          preview: 'Adicione um vídeo ou imagem para ilustrar o conceito principal do material.',
          reasoning: 'Recursos visuais aumentam o engajamento e compreensão.'
        });
        
        suggestions.push({
          title: 'Avaliação Formativa',
          type: 'block',
          blockType: 'quiz',
          confidence: 0.78,
          preview: 'Um quiz curto para verificar a compreensão dos conceitos apresentados.',
          reasoning: 'Avaliações formativas ajudam a consolidar o aprendizado.'
        });
      }
      
      // Limitar ao máximo de sugestões configurado
      const finalSuggestions = suggestions.slice(0, this.options.maxSuggestions);
      
      return {
        suggestions: finalSuggestions,
        metadata: {
          model: 'default-suggestion-model-v1',
          processingTime: 0.8,
          confidence: 0.89
        }
      };
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      return {
        suggestions: [],
        metadata: {
          model: 'default-suggestion-model-v1',
          processingTime: 0,
          confidence: 0
        }
      };
    }
  }
} 