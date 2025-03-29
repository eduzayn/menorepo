import { DefaultSuggestionModel } from './models/default-suggestion-model';
import { SuggestionRequest, AISuggestion } from './models/types';
import { BlockType } from '@/types/editor';

/**
 * Interface para configuração do motor de sugestões
 */
export interface SuggestionEngineConfig {
  apiUrl?: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxSuggestions?: number;
  useOfflineMode?: boolean;
}

/**
 * Interface para o contexto de geração de sugestões
 */
export interface SuggestionContext {
  contentTitle: string;
  contentDescription?: string;
  currentBlocks: Array<{
    type: BlockType;
    content: string;
    title?: string;
  }>;
  currentBlock?: {
    type: BlockType;
    content: string;
    title?: string;
  };
  topic?: string;
  educationLevel?: string;
  learningObjectives?: string[];
}

// Reexportamos a interface AISuggestion para manter compatibilidade com código existente
export { AISuggestion };

/**
 * Motor de sugestões de IA para conteúdo educacional
 */
export class SuggestionEngine {
  private static instance: SuggestionEngine;
  private config: SuggestionEngineConfig;
  private suggestionModel: DefaultSuggestionModel;

  private constructor() {
    this.config = {
      apiUrl: process.env.NEXT_PUBLIC_AI_API_URL,
      apiKey: process.env.NEXT_PUBLIC_AI_API_KEY,
      model: 'edunexia-suggestions-v1',
      temperature: 0.7,
      maxSuggestions: 3,
      useOfflineMode: false
    };
    
    this.suggestionModel = new DefaultSuggestionModel({
      temperature: this.config.temperature,
      maxSuggestions: this.config.maxSuggestions
    });
  }

  /**
   * Obtém a instância do motor de sugestões (singleton)
   */
  public static getInstance(): SuggestionEngine {
    if (!SuggestionEngine.instance) {
      SuggestionEngine.instance = new SuggestionEngine();
    }
    return SuggestionEngine.instance;
  }

  /**
   * Atualiza a configuração do motor de sugestões
   */
  public updateConfig(config: Partial<SuggestionEngineConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Atualiza o modelo com as novas configurações
    this.suggestionModel = new DefaultSuggestionModel({
      temperature: this.config.temperature,
      maxSuggestions: this.config.maxSuggestions
    });
  }

  /**
   * Gera sugestões com base no contexto fornecido
   * @param context Contexto para geração de sugestões
   * @returns Lista de sugestões de IA
   */
  public async generateSuggestions(context: SuggestionContext): Promise<AISuggestion[]> {
    try {
      const requestBody: SuggestionRequest = {
        contentTitle: context.contentTitle,
        contentDescription: context.contentDescription,
        existingBlocks: context.currentBlocks.map(block => ({
          type: block.type,
          content: block.content,
          title: block.title
        })),
        targetBlockType: context.currentBlock?.type,
        topic: context.topic,
        educationLevel: context.educationLevel,
        learningObjectives: context.learningObjectives
      };
      
      // Em um cenário real, chamaria o modelo
      // Como estamos simulando, retornar dados mockados com tipo correto
      
      // Simulando atraso para parecer real
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock de retorno do modelo
      const suggestions: AISuggestion[] = [
        {
          title: 'Introdução ao Tema',
          type: 'text',
          blockType: 'text',
          confidence: 0.92,
          preview: `Uma introdução sobre ${context.topic || 'o tema'} seria útil para contextualizar os alunos.`,
          reasoning: `Os materiais didáticos eficazes geralmente começam com uma introdução clara. Seu material ${context.currentBlocks.length === 0 ? 'ainda não tem uma introdução' : 'poderia se beneficiar de uma introdução mais detalhada'}.`
        },
        {
          title: 'Vídeo Complementar',
          type: 'block',
          blockType: 'video',
          confidence: 0.85,
          preview: 'Um vídeo explicativo ajudaria a ilustrar os conceitos de forma mais dinâmica.',
          reasoning: 'Recursos audiovisuais aumentam a retenção de informações em cerca de 65% segundo estudos de pedagogia.'
        },
        {
          title: 'Quiz de Verificação',
          type: 'block',
          blockType: 'quiz',
          confidence: 0.78,
          preview: 'Adicione um quiz com 3-5 questões para verificar o aprendizado dos conceitos principais.',
          reasoning: 'Avaliações formativas ao longo do material ajudam a consolidar o conhecimento e identificar pontos de dificuldade.'
        }
      ];
      
      return suggestions;
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      return [];
    }
  }

  /**
   * Sugere conteúdo para um tipo específico de bloco
   * @param blockType Tipo de bloco
   * @param context Contexto atual
   * @returns Lista de sugestões para o tipo especificado
   */
  public async suggestForBlockType(
    blockType: BlockType,
    context: SuggestionContext
  ): Promise<AISuggestion[]> {
    try {
      const requestBody: SuggestionRequest = {
        contentTitle: context.contentTitle,
        contentDescription: context.contentDescription,
        existingBlocks: context.currentBlocks.map(block => ({
          type: block.type,
          content: block.content,
          title: block.title
        })),
        targetBlockType: blockType,
        topic: context.topic,
        educationLevel: context.educationLevel,
        learningObjectives: context.learningObjectives
      };
      
      // Mock de retorno do modelo específico por tipo
      const suggestions: AISuggestion[] = [
        {
          title: `Sugestão para ${blockType}`,
          type: 'block',
          blockType: blockType,
          confidence: 0.9,
          preview: `Esta é uma sugestão específica para o tipo de bloco ${blockType}.`,
          reasoning: `Sugestões específicas para ${blockType} ajudam a criar conteúdo mais relevante.`
        }
      ];
      
      return suggestions;
    } catch (error) {
      console.error(`Erro ao gerar sugestões para bloco do tipo ${blockType}:`, error);
      return [];
    }
  }
} 