/**
 * Formata data para exibição em formato brasileiro
 * @param date Data a ser formatada
 * @returns String formatada (DD/MM/YYYY)
 */
export function formatDate(date) {
    if (!date)
        return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
}
/**
 * Formata data e hora para exibição em formato brasileiro
 * @param date Data a ser formatada
 * @returns String formatada (DD/MM/YYYY HH:MM)
 */
export function formatDateTime(date) {
    if (!date)
        return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('pt-BR');
}
/**
 * Formata valor para exibição em formato monetário
 * @param value Valor a ser formatado
 * @returns String formatada (R$ XX,XX)
 */
export function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}
/**
 * Formata CPF para exibição
 * @param cpf CPF a ser formatado (apenas números)
 * @returns String formatada (XXX.XXX.XXX-XX)
 */
export function formatCPF(cpf) {
    if (!cpf)
        return '';
    // Remove qualquer caractere que não seja número
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11)
        return cpf;
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
/**
 * Formata CNPJ para exibição
 * @param cnpj CNPJ a ser formatado (apenas números)
 * @returns String formatada (XX.XXX.XXX/XXXX-XX)
 */
export function formatCNPJ(cnpj) {
    if (!cnpj)
        return '';
    // Remove qualquer caractere que não seja número
    const cleanCnpj = cnpj.replace(/\D/g, '');
    if (cleanCnpj.length !== 14)
        return cnpj;
    return cleanCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
/**
 * Trunca um texto em um determinado número de caracteres
 * @param text Texto a ser truncado
 * @param maxLength Número máximo de caracteres
 * @returns Texto truncado com "..." no final, se necessário
 */
export function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength)
        return text;
    return text.substring(0, maxLength) + '...';
}
