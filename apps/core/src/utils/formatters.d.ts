/**
 * Formata data para exibição em formato brasileiro
 * @param date Data a ser formatada
 * @returns String formatada (DD/MM/YYYY)
 */
export declare function formatDate(date: Date | string): string;
/**
 * Formata data e hora para exibição em formato brasileiro
 * @param date Data a ser formatada
 * @returns String formatada (DD/MM/YYYY HH:MM)
 */
export declare function formatDateTime(date: Date | string): string;
/**
 * Formata valor para exibição em formato monetário
 * @param value Valor a ser formatado
 * @returns String formatada (R$ XX,XX)
 */
export declare function formatCurrency(value: number): string;
/**
 * Formata CPF para exibição
 * @param cpf CPF a ser formatado (apenas números)
 * @returns String formatada (XXX.XXX.XXX-XX)
 */
export declare function formatCPF(cpf: string): string;
/**
 * Formata CNPJ para exibição
 * @param cnpj CNPJ a ser formatado (apenas números)
 * @returns String formatada (XX.XXX.XXX/XXXX-XX)
 */
export declare function formatCNPJ(cnpj: string): string;
/**
 * Trunca um texto em um determinado número de caracteres
 * @param text Texto a ser truncado
 * @param maxLength Número máximo de caracteres
 * @returns Texto truncado com "..." no final, se necessário
 */
export declare function truncateText(text: string, maxLength: number): string;
//# sourceMappingURL=formatters.d.ts.map