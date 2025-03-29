/**
 * @edunexia/database-schema
 *
 * Este arquivo contém os tipos TypeScript para o esquema do banco de dados do Supabase.
 * Gerado a partir dos enums e tabelas identificados via consulta SQL.
 */
export type Database = {
    public: {
        Tables: {
            matriculas: {
                Row: DbMatricula;
                Insert: Omit<DbMatricula, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<DbMatricula, 'id' | 'created_at'>>;
            };
        };
        Enums: {
            matricula_status: MatriculaStatus;
            payment_method: PaymentMethod;
            payment_status: PaymentStatus;
            user_role: UserRole;
            auth_provider: AuthProvider;
            comunicacao_status: ComunicacaoStatus;
            comunicacao_tipo_mensagem: ComunicacaoTipoMensagem;
        };
    };
    financeiro: {
        Tables: {
            cobrancas: {
                Row: DbCobranca;
                Insert: Omit<DbCobranca, 'id' | 'created_at'>;
                Update: Partial<Omit<DbCobranca, 'id' | 'created_at'>>;
            };
        };
        Enums: {
            status_cobranca: StatusCobranca;
            metodo_pagamento: MetodoPagamento;
            gateway_pagamento: GatewayPagamento;
            categoria_financeira: CategoriaFinanceira;
            tipo_lancamento: TipoLancamento;
            status_pagamento: StatusPagamento;
            tipo_cobranca: TipoCobranca;
            tipo_aplicacao_taxa: TipoAplicacaoTaxa;
        };
    };
};
export type MatriculaStatus = 'pendente' | 'ativa' | 'cancelada' | 'trancada' | 'concluida' | 'em_processo' | 'inadimplente' | 'reativada';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'boleto' | 'cash';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
export type UserRole = 'admin' | 'professor' | 'aluno';
export type AuthProvider = 'email' | 'google' | 'facebook' | 'github';
export type ComunicacaoStatus = 'aberto' | 'em_andamento' | 'fechado' | 'arquivado';
export type ComunicacaoTipoMensagem = 'texto' | 'imagem' | 'arquivo' | 'video' | 'audio' | 'localizacao';
export type StatusCobranca = 'pendente' | 'pago' | 'vencido' | 'cancelado';
export type MetodoPagamento = 'pix' | 'boleto' | 'cartao' | 'transferencia' | 'dinheiro';
export type GatewayPagamento = 'littex' | 'infinitepay' | 'manual';
export type CategoriaFinanceira = 'mensalidade' | 'matricula' | 'taxa' | 'multa' | 'desconto' | 'comissao' | 'salario' | 'aluguel' | 'servico' | 'marketing' | 'outros';
export type TipoLancamento = 'entrada' | 'saida';
export type StatusPagamento = 'confirmado' | 'pendente' | 'cancelado' | 'estornado';
export type TipoCobranca = 'mensalidade' | 'taxa' | 'material' | 'uniforme' | 'outro';
export type TipoAplicacaoTaxa = 'matricula' | 'mensalidade' | 'material' | 'certificado' | 'todas';
export interface DbMatricula {
    id: string;
    aluno_id: string;
    curso_id: string;
    instituicao_id: string;
    plano_pagamento_id: string;
    status: MatriculaStatus;
    data_inicio: string;
    data_conclusao_prevista?: string | null;
    data_conclusao_efetiva?: string | null;
    observacoes?: string | null;
    created_at: string;
    updated_at: string;
}
export interface DbCobranca {
    id: string;
    aluno_id?: string | null;
    matricula_id?: string | null;
    instituicao_id: string;
    tipo: TipoCobranca;
    valor_total: number;
    valor_pago?: number | null;
    status: StatusCobranca;
    data_emissao: string;
    data_vencimento: string;
    data_pagamento?: string | null;
    metodo_pagamento?: MetodoPagamento | null;
    gateway?: GatewayPagamento | null;
    link_pagamento?: string | null;
    observacao?: string | null;
    created_at: string;
    created_by: string;
}
//# sourceMappingURL=index.d.ts.map