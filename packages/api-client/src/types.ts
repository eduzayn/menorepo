import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@edunexia/database-schema';

/**
 * Erro padrão da API para tratamento consistente
 */
export interface ApiError {
  /**
   * Mensagem de erro legível
   */
  message: string;

  /**
   * Nome da operação que falhou
   */
  operation: string;

  /**
   * Timestamp do erro
   */
  timestamp: Date;

  /**
   * Erro original para depuração
   */
  originalError?: unknown;

  /**
   * Código de erro (opcional)
   */
  code?: string;

  /**
   * Dados adicionais sobre o erro (opcional)
   */
  details?: Record<string, unknown>;
}

/**
 * Status de uma requisição para controle de estado
 */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Contexto global da API
 */
export interface ApiContext {
  /**
   * Cliente da API
   */
  client: ApiClient;
}

/**
 * Interface para retorno de resultados das operações de API com meta-informações
 */
export interface ApiResponse<T> {
  /**
   * Dados da resposta
   */
  data: T;

  /**
   * Erro da operação (se houver)
   */
  error: ApiError | null;

  /**
   * Status da requisição
   */
  status: RequestStatus;

  /**
   * Timestamp da resposta
   */
  timestamp: Date;
}

/**
 * Tipo para o cliente de API
 */
export type ApiClient = {
  /**
   * Cliente Supabase original
   */
  supabase: SupabaseClient<Database>;

  /**
   * Função para tratar erros de forma consistente
   */
  handleError: (error: unknown, operation: string) => ApiError;

  /**
   * Executa operações com tratamento de erros padronizado
   */
  executeOperation: <T>(operation: string, fn: () => Promise<T>) => Promise<T>;

  /**
   * Acesso ao módulo de autenticação
   */
  auth: SupabaseClient<Database>['auth'];

  /**
   * Acesso ao módulo de banco de dados
   */
  db: SupabaseClient<Database>['from'];

  /**
   * Acesso ao módulo de storage
   */
  storage: SupabaseClient<Database>['storage'];

  /**
   * Acesso ao módulo de funções
   */
  functions: SupabaseClient<Database>['functions'];
}; 