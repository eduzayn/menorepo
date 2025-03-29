import { Database } from '../types/supabase';
declare global {
    interface ImportMeta {
        env: {
            VITE_SUPABASE_URL: string;
            VITE_SUPABASE_ANON_KEY: string;
        };
    }
}
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "parcerias", any>;
export type InstituicaoParceira = Database['parcerias']['Tables']['instituicoes_parceiras']['Row'];
export type Contrato = Database['parcerias']['Tables']['contratos']['Row'];
export type CursoParceria = Database['parcerias']['Tables']['cursos_parceria']['Row'];
export type SolicitacaoCertificacao = Database['parcerias']['Tables']['solicitacoes_certificacao']['Row'];
export type Documento = Database['parcerias']['Tables']['documentos']['Row'];
export type FinanceiroParceiro = Database['parcerias']['Tables']['financeiro_parceiros']['Row'];
export declare const instituicoesApi: {
    listar: () => Promise<any[]>;
    obterPorId: (id: string) => Promise<any>;
    criar: (instituicao: Omit<InstituicaoParceira, "id" | "created_at" | "updated_at">) => Promise<any>;
    atualizar: (id: string, instituicao: Partial<InstituicaoParceira>) => Promise<any>;
    excluir: (id: string) => Promise<boolean>;
};
export declare const contratosApi: {
    listar: (instituicaoId?: string) => Promise<any[]>;
    obterPorId: (id: string) => Promise<any>;
    criar: (contrato: Omit<Contrato, "id" | "created_at" | "updated_at">) => Promise<any>;
    atualizar: (id: string, contrato: Partial<Contrato>) => Promise<any>;
    excluir: (id: string) => Promise<boolean>;
};
export declare const cursosApi: {
    listar: (instituicaoId?: string) => Promise<any[]>;
    obterPorId: (id: string) => Promise<any>;
    criar: (curso: Omit<CursoParceria, "id" | "created_at" | "updated_at">) => Promise<any>;
    atualizar: (id: string, curso: Partial<CursoParceria>) => Promise<any>;
    excluir: (id: string) => Promise<boolean>;
};
export declare const certificacoesApi: {
    listar: (instituicaoId?: string, cursoId?: string, status?: string) => Promise<any[]>;
    obterPorId: (id: string) => Promise<any>;
    criar: (solicitacao: Omit<SolicitacaoCertificacao, "id" | "created_at" | "updated_at">) => Promise<any>;
    atualizar: (id: string, solicitacao: Partial<SolicitacaoCertificacao>) => Promise<any>;
    excluir: (id: string) => Promise<boolean>;
};
export declare const documentosApi: {
    listarPorEntidade: (tipo: "instituicao" | "curso" | "solicitacao", id: string) => Promise<any[]>;
    obterPorId: (id: string) => Promise<any>;
    criar: (documento: Omit<Documento, "id" | "created_at" | "updated_at">) => Promise<any>;
    atualizar: (id: string, documento: Partial<Documento>) => Promise<any>;
    excluir: (id: string) => Promise<boolean>;
};
export declare const storageApi: {
    upload: (bucket: string, caminho: string, arquivo: File) => Promise<{
        id: string;
        path: string;
        fullPath: string;
    }>;
    getPublicUrl: (bucket: string, caminho: string) => string;
    excluir: (bucket: string, caminhos: string[]) => Promise<import("@supabase/storage-js").FileObject[]>;
};
export declare const relatoriosApi: {
    obterDashboard: (instituicaoId?: string) => Promise<any[]>;
};
declare const api: {
    supabase: import("@supabase/supabase-js").SupabaseClient<Database, "parcerias", any>;
    instituicoes: {
        listar: () => Promise<any[]>;
        obterPorId: (id: string) => Promise<any>;
        criar: (instituicao: Omit<InstituicaoParceira, "id" | "created_at" | "updated_at">) => Promise<any>;
        atualizar: (id: string, instituicao: Partial<InstituicaoParceira>) => Promise<any>;
        excluir: (id: string) => Promise<boolean>;
    };
    contratos: {
        listar: (instituicaoId?: string) => Promise<any[]>;
        obterPorId: (id: string) => Promise<any>;
        criar: (contrato: Omit<Contrato, "id" | "created_at" | "updated_at">) => Promise<any>;
        atualizar: (id: string, contrato: Partial<Contrato>) => Promise<any>;
        excluir: (id: string) => Promise<boolean>;
    };
    cursos: {
        listar: (instituicaoId?: string) => Promise<any[]>;
        obterPorId: (id: string) => Promise<any>;
        criar: (curso: Omit<CursoParceria, "id" | "created_at" | "updated_at">) => Promise<any>;
        atualizar: (id: string, curso: Partial<CursoParceria>) => Promise<any>;
        excluir: (id: string) => Promise<boolean>;
    };
    certificacoes: {
        listar: (instituicaoId?: string, cursoId?: string, status?: string) => Promise<any[]>;
        obterPorId: (id: string) => Promise<any>;
        criar: (solicitacao: Omit<SolicitacaoCertificacao, "id" | "created_at" | "updated_at">) => Promise<any>;
        atualizar: (id: string, solicitacao: Partial<SolicitacaoCertificacao>) => Promise<any>;
        excluir: (id: string) => Promise<boolean>;
    };
    documentos: {
        listarPorEntidade: (tipo: "instituicao" | "curso" | "solicitacao", id: string) => Promise<any[]>;
        obterPorId: (id: string) => Promise<any>;
        criar: (documento: Omit<Documento, "id" | "created_at" | "updated_at">) => Promise<any>;
        atualizar: (id: string, documento: Partial<Documento>) => Promise<any>;
        excluir: (id: string) => Promise<boolean>;
    };
    storage: {
        upload: (bucket: string, caminho: string, arquivo: File) => Promise<{
            id: string;
            path: string;
            fullPath: string;
        }>;
        getPublicUrl: (bucket: string, caminho: string) => string;
        excluir: (bucket: string, caminhos: string[]) => Promise<import("@supabase/storage-js").FileObject[]>;
    };
    relatorios: {
        obterDashboard: (instituicaoId?: string) => Promise<any[]>;
    };
};
export default api;
//# sourceMappingURL=api.d.ts.map