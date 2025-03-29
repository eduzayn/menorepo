import { createClient } from '@supabase/supabase-js';
/**
 * Cliente principal da API que encapsula o Supabase
 */
export class ApiClient {
    client;
    options;
    constructor(options) {
        this.options = options;
        this.client = createClient(options.supabaseUrl, options.supabaseAnonKey);
    }
    /**
     * Acesso ao cliente Supabase original para operações personalizadas
     */
    get supabase() {
        return this.client;
    }
    /**
     * Gerencia o tratamento de erros de forma consistente
     */
    handleError(error, operation) {
        const apiError = {
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
    async executeOperation(operation, fn) {
        try {
            if (this.options.enableLogging) {
                console.info(`[API] Executando operação: ${operation}`);
            }
            const result = await fn();
            if (this.options.enableLogging) {
                console.info(`[API] Operação concluída: ${operation}`);
            }
            return result;
        }
        catch (error) {
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
    from(table) {
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
export function createApiClient(options) {
    return new ApiClient(options);
}
