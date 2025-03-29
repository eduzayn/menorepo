import { BlockType } from '@/types/editor';

/**
 * Interface para sugestões de IA
 */
export interface AISuggestion {
  /** Título da sugestão */
  title: string;
  /** Tipo da sugestão (texto, bloco, etc) */
  type: 'text' | 'summary' | 'objectives' | 'activity' | 'correction' | 'block';
  /** Tipo de bloco para o qual a sugestão é aplicável */
  blockType?: BlockType;
  /** Nível de confiança da sugestão (0-1) */
  confidence: number;
  /** Preview do conteúdo para mostrar ao usuário */
  preview: string;
  /** Justificativa para a sugestão */
  reasoning: string;
  /** Conteúdo da sugestão */
  content?: string;
}

/**
 * Interface para uma requisição de sugestão
 */
export interface SuggestionRequest {
  /** Título do conteúdo */
  contentTitle: string;
  
  /** Descrição do conteúdo */
  contentDescription?: string;
  
  /** Blocos existentes */
  existingBlocks: Array<{
    type: BlockType;
    content: string;
    title?: string;
  }>;
  
  /** Tipo de bloco para o qual se deseja a sugestão */
  targetBlockType?: BlockType;
  
  /** Tópico do curso */
  topic?: string;
  
  /** Nível de educação */
  educationLevel?: string;
  
  /** Objetivos de aprendizagem */
  learningObjectives?: string[];
}

/**
 * Interface para uma resposta do modelo de sugestão
 */
export interface SuggestionResponse {
  /** Sugestões geradas */
  suggestions: AISuggestion[];
  metadata?: {
    model: string;
    processingTime: number;
    confidence: number;
  };
}

/**
 * Interface base para modelos de sugestão
 */
export interface SuggestionModel {
  generateSuggestions(request: SuggestionRequest): Promise<SuggestionResponse>;
}

/**
 * Classe base para modelos de sugestão
 */
export abstract class BaseSuggestionModel {
  /** ID do modelo */
  protected modelId: string;
  
  /** Versão do modelo */
  protected modelVersion: string;
  
  /** Configurações específicas do modelo */
  protected config: Record<string, any>;
  
  constructor(modelId: string, modelVersion: string, config: Record<string, any> = {}) {
    this.modelId = modelId;
    this.modelVersion = modelVersion;
    this.config = config;
  }
  
  /**
   * Gera sugestões baseadas na requisição
   * @param request Requisição de sugestão
   */
  public abstract generateSuggestions(request: SuggestionRequest): Promise<SuggestionResponse>;
  
  /**
   * Retorna detalhes do modelo
   */
  public getModelInfo(): { id: string; version: string; config: Record<string, any> } {
    return {
      id: this.modelId,
      version: this.modelVersion,
      config: { ...this.config }
    };
  }
} 