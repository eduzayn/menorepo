/**
 * Verifica se o email é válido
 * @param email Email a ser validado
 * @returns Boolean indicando se é válido
 */
export function isValidEmail(email) {
    if (!email)
        return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
/**
 * Verifica se o CPF é válido
 * @param cpf CPF a ser validado (com ou sem formatação)
 * @returns Boolean indicando se é válido
 */
export function isValidCPF(cpf) {
    if (!cpf)
        return false;
    // Remove caracteres não numéricos
    const cleanCpf = cpf.replace(/\D/g, '');
    // Verifica se tem 11 dígitos
    if (cleanCpf.length !== 11)
        return false;
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleanCpf))
        return false;
    // Algoritmo de validação do CPF
    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    if (remainder !== parseInt(cleanCpf.substring(9, 10))) {
        return false;
    }
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    if (remainder !== parseInt(cleanCpf.substring(10, 11))) {
        return false;
    }
    return true;
}
/**
 * Verifica se uma string está vazia
 * @param value Valor a ser verificado
 * @returns Boolean indicando se está vazio
 */
export function isEmpty(value) {
    return value === null || value === undefined || value.trim() === '';
}
/**
 * Verifica se um valor é um número
 * @param value Valor a ser verificado
 * @returns Boolean indicando se é um número
 */
export function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
/**
 * Validação básica de senha forte
 * @param password Senha a ser validada
 * @returns Boolean indicando se atende aos requisitos mínimos
 */
export function isStrongPassword(password) {
    if (!password || password.length < 8)
        return false;
    // Deve conter pelo menos um número
    const hasNumber = /\d/.test(password);
    // Deve conter pelo menos uma letra maiúscula
    const hasUpperCase = /[A-Z]/.test(password);
    // Deve conter pelo menos uma letra minúscula
    const hasLowerCase = /[a-z]/.test(password);
    // Deve conter pelo menos um caractere especial
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    return hasNumber && hasUpperCase && hasLowerCase && hasSpecialChar;
}
