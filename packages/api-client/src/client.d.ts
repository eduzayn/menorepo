import { SupabaseClient } from '@supabase/supabase-js';
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
export declare class ApiClient {
    private client;
    private options;
    constructor(options: ApiClientOptions);
    /**
     * Acesso ao cliente Supabase original para operações personalizadas
     */
    get supabase(): SupabaseClient<Database>;
    /**
     * Gerencia o tratamento de erros de forma consistente
     */
    handleError(error: unknown, operation: string): ApiError;
    /**
     * Executa uma operação com tratamento de erros consistente
     */
    executeOperation<T>(operation: string, fn: () => Promise<T>): Promise<T>;
    /**
     * Wrapper para operações de autenticação
     */
    get auth(): import("@supabase/supabase-js/dist/module/lib/SupabaseAuthClient").SupabaseAuthClient;
    /**
     * Acesso direto ao método from() para tabelas
     *
     * Substituto do db, evitando problemas de tipagem
     */
    from<T extends keyof Database['public']['Tables']>(table: T): import("@supabase/postgrest-js").PostgrestQueryBuilder<any, any, T, unknown>;
    /**
     * DEPRECATED: use client.from() no lugar
     * @deprecated
     */
    get db(): {
        <TableName extends string, Table extends any>(relation: TableName): import("@supabase/postgrest-js").PostgrestQueryBuilder<any, Table, TableName, Table extends {
            Relationships: infer R;
        } ? R : unknown>;
        <ViewName extends string, View extends any>(relation: ViewName): import("@supabase/postgrest-js").PostgrestQueryBuilder<any, View, ViewName, View extends {
            Relationships: infer R;
        } ? R : unknown>;
    };
    /**
     * Wrapper para operações de storage
     */
    get storage(): import("@supabase/storage-js").StorageClient;
    /**
     * Wrapper para operações de funções
     */
    get functions(): import("@supabase/functions-js").FunctionsClient;
}
/**
 * Cria uma instância do cliente de API
 */
export declare function createApiClient(options: ApiClientOptions): ApiClient;
//# sourceMappingURL=client.d.ts.map