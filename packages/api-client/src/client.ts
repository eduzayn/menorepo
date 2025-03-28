import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@edunexia/database-schema';
import { ApiError } from './types';

export interface ApiClientOptions {
  /**
   * URL do Supabase
   */
  supabaseUrl: string;
  
  /**
   * Chave anônima do Supabase
   */
  supabaseAnonKey: string;
  
  /**
   * Função para tratamento de logs de erros (opcional)
   */
  onError?: (error: ApiError) => void;
  
  /**
   * Ativar logs para depuração
   */
  enableLogging?: boolean;
}

/**
 * Cliente principal da API que encapsula o Supabase
 */
export class ApiClient {
  private client: SupabaseClient<Database>;
  private options: ApiClientOptions;

  constructor(options: ApiClientOptions) {
    this.options = options;
    this.client = createClient<Database>(
      options.supabaseUrl,
      options.supabaseAnonKey
    );
  }

  /**
   * Acesso ao cliente Supabase original para operações personalizadas
   */
  get supabase(): SupabaseClient<Database> {
    return this.client;
  }

  /**
   * Gerencia o tratamento de erros de forma consistente
   */
  handleError(error: unknown, operation: string): ApiError {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      operation,
      timestamp: new Date(),
      originalError: error
    };

    if (this.options.onError) {
      this.options.onError(apiError);
    }

    if (this.options.enableLogging) {
      console.error(`[API Error] ${operation}:`, apiError);
    }

    return apiError;
  }

  /**
   * Executa uma operação com tratamento de erros consistente
   */
  async executeOperation<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    try {
      if (this.options.enableLogging) {
        console.info(`[API] Executando operação: ${operation}`);
      }
      
      const result = await fn();
      
      if (this.options.enableLogging) {
        console.info(`[API] Operação concluída: ${operation}`);
      }
      
      return result;
    } catch (error) {
      const apiError = this.handleError(error, operation);
      throw apiError;
    }
  }

  /**
   * Wrapper para operações de autenticação
   */
  get auth() {
    return this.client.auth;
  }

  /**
   * Acesso direto ao método from() para tabelas
   * 
   * Substituto do db, evitando problemas de tipagem
   */
  from<T extends keyof Database['public']['Tables']>(
    table: T
  ) {
    return this.client.from(table);
  }

  /**
   * DEPRECATED: use client.from() no lugar
   * @deprecated
   */
  get db() {
    // @ts-ignore - manter para compatibilidade
    return this.client.from;
  }

  /**
   * Wrapper para operações de storage
   */
  get storage() {
    return this.client.storage;
  }

  /**
   * Wrapper para operações de funções
   */
  get functions() {
    return this.client.functions;
  }
}

/**
 * Cria uma instância do cliente de API
 */
export function createApiClient(options: ApiClientOptions): ApiClient {
  return new ApiClient(options);
} 