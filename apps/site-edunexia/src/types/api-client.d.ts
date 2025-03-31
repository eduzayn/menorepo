/**
 * Declaração de tipos temporária para @edunexia/api-client
 * Isso permite que o TypeScript reconheça o módulo enquanto resolvemos os problemas de build
 */

/**
 * Tipos para o api-client
 */

export interface ApiClient {
  client: any;
  options: any;
  supabase: any;
  executeOperation: (operation: () => Promise<any>) => Promise<any>;
  from: (table: string) => {
    insert: (data: any) => {
      select: () => {
        single: () => Promise<{ data: any; error: any; }>;
      };
    };
    update: (data: any) => {
      eq: (field: string, value: any) => {
        select: () => {
          single: () => Promise<{ data: any; error: any; }>;
        };
      };
    };
    delete: () => {
      eq: (field: string, value: any) => Promise<{ data: any; error: any; }>;
    };
    select: (fields?: string) => {
      eq: (field: string, value: any) => {
        single: () => Promise<{ data: any; error: any; }>;
      };
      order: (field: string, options?: { ascending?: boolean }) => Promise<{ data: any[]; error: any; }>;
    };
    upsert: (data: any) => Promise<{ data: any; error: any; }>;
  };
  get: (url: string, options?: any) => Promise<any>;
  post: (url: string, data?: any, options?: any) => Promise<any>;
  handleError: (error: any, context: string) => {
    message: string;
    code: string;
    details: any;
  };
}

export function createApiClient(options?: any): ApiClient;
export function useApiClient(): ApiClient; 