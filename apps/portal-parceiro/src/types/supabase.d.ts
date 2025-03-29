export declare namespace Database {
    namespace parcerias {
        interface Tables {
            instituicoes_parceiras: {
                Row: {
                    id: string;
                    nome: string;
                    razao_social: string;
                    cnpj: string;
                    endereco?: Record<string, any>;
                    telefone?: string;
                    email?: string;
                    site?: string;
                    logo_url?: string;
                    data_inicio: string;
                    data_fim?: string;
                    status: 'ativa' | 'pendente' | 'suspensa' | 'encerrada';
                    responsavel_id?: string;
                    notas?: string;
                    contrato_ativo_id?: string;
                    created_at: string;
                    updated_at: string;
                };
            };
            contratos: {
                Row: {
                    id: string;
                    instituicao_id: string;
                    titulo: string;
                    descricao?: string;
                    arquivo_url?: string;
                    data_inicio: string;
                    data_fim?: string;
                    valor_certificacao?: number;
                    status: 'ativa' | 'pendente' | 'suspensa' | 'encerrada';
                    termos?: Record<string, any>;
                    created_at: string;
                    updated_at: string;
                };
            };
            cursos_parceria: {
                Row: {
                    id: string;
                    instituicao_id: string;
                    contrato_id: string;
                    titulo: string;
                    carga_horaria: number;
                    nivel: string;
                    descricao?: string;
                    data_aprovacao?: string;
                    aprovado_por?: string;
                    status: 'ativa' | 'pendente' | 'suspensa' | 'encerrada';
                    projeto_pedagogico_url?: string;
                    created_at: string;
                    updated_at: string;
                };
            };
            solicitacoes_certificacao: {
                Row: {
                    id: string;
                    instituicao_id: string;
                    curso_id: string;
                    aluno_id?: string;
                    nome_aluno: string;
                    cpf_aluno: string;
                    email_aluno?: string;
                    data_nascimento?: string;
                    data_conclusao: string;
                    nota_final?: number;
                    status: 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada' | 'emitida';
                    observacoes?: string;
                    certificado_url?: string;
                    historico_url?: string;
                    codigo_validacao?: string;
                    solicitado_por?: string;
                    avaliado_por?: string;
                    created_at: string;
                    updated_at: string;
                };
            };
            documentos: {
                Row: {
                    id: string;
                    tipo: 'contrato' | 'aditivo' | 'projeto_pedagogico' | 'certificado' | 'historico' | 'rg_aluno' | 'cpf_aluno' | 'diploma_anterior';
                    titulo: string;
                    descricao?: string;
                    arquivo_url: string;
                    instituicao_id?: string;
                    curso_id?: string;
                    solicitacao_id?: string;
                    usuario_id?: string;
                    validado?: boolean;
                    validado_por?: string;
                    data_validacao?: string;
                    observacoes?: string;
                    created_at: string;
                    updated_at: string;
                };
            };
            financeiro_parceiros: {
                Row: {
                    id: string;
                    instituicao_id: string;
                    curso_id?: string;
                    solicitacao_id?: string;
                    descricao: string;
                    valor: number;
                    data_emissao: string;
                    data_vencimento: string;
                    data_pagamento?: string;
                    status: string;
                    comprovante_url?: string;
                    boleto_url?: string;
                    gerado_por?: string;
                    created_at: string;
                    updated_at: string;
                };
            };
            logs_atividades: {
                Row: {
                    id: string;
                    tipo: string;
                    descricao: string;
                    dados?: Record<string, any>;
                    instituicao_id?: string;
                    usuario_id?: string;
                    created_at: string;
                };
            };
        }
    }
}
export interface Database {
    parcerias: {
        Tables: Database.parcerias.Tables;
        Views: {
            visao_relatorios: {
                instituicao: string;
                status_instituicao: 'ativa' | 'pendente' | 'suspensa' | 'encerrada';
                curso: string;
                total_solicitacoes: number;
                certificados_emitidos: number;
                solicitacoes_pendentes: number;
                solicitacoes_rejeitadas: number;
                receita_total: number;
            };
        };
    };
}
//# sourceMappingURL=supabase.d.ts.map