/**
 * Funções de validação centralizadas
 * 
 * Este arquivo contém todas as funções de validação usadas na plataforma Edunéxia
 */

/**
 * Verifica se uma string é um email válido
 * @param email Email a ser validado
 * @returns true se o email for válido, false caso contrário
 */
export function isValidEmail(email: string): boolean {
  // Expressão regular para validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Verifica se uma string é um CPF válido
 * @param cpf CPF a ser validado
 * @returns true se o CPF for válido, false caso contrário
 */
export function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');
  
  // Verifica se o CPF tem 11 dígitos
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais (caso inválido)
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Cálculo do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(cpf.charAt(9)) !== digit1) return false;
  
  // Cálculo do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(cpf.charAt(10)) !== digit2) return false;
  
  return true;
}

/**
 * Verifica se uma string é um CNPJ válido
 * @param cnpj CNPJ a ser validado
 * @returns true se o CNPJ for válido, false caso contrário
 */
export function isValidCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, '');
  
  // Verifica se o CNPJ tem 14 dígitos
  if (cnpj.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais (caso inválido)
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  // Validação do primeiro dígito verificador
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
  if (result !== parseInt(digits.charAt(0))) return false;
  
  // Validação do segundo dígito verificador
  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
}

/**
 * Verifica se uma string é uma URL válida
 * @param url URL a ser validada
 * @returns true se a URL for válida, false caso contrário
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Verifica se uma string é um CEP válido
 * @param cep CEP a ser validado
 * @returns true se o CEP for válido, false caso contrário
 */
export function isValidCEP(cep: string): boolean {
  // Remove caracteres não numéricos
  cep = cep.replace(/\D/g, '');
  
  // Verifica se o CEP tem 8 dígitos
  return cep.length === 8;
}

/**
 * Verifica se uma string é um telefone válido
 * @param phone Telefone a ser validado
 * @returns true se o telefone for válido, false caso contrário
 */
export function isValidPhone(phone: string): boolean {
  // Remove caracteres não numéricos
  phone = phone.replace(/\D/g, '');
  
  // Verifica se o telefone tem 10 ou 11 dígitos (fixo ou celular)
  return phone.length === 10 || phone.length === 11;
}

/**
 * Verifica se uma senha atende aos requisitos de segurança
 * @param password Senha a ser validada
 * @param minLength Comprimento mínimo (padrão: 8)
 * @param requireUppercase Requer pelo menos uma letra maiúscula (padrão: true)
 * @param requireLowercase Requer pelo menos uma letra minúscula (padrão: true)
 * @param requireNumber Requer pelo menos um número (padrão: true)
 * @param requireSpecial Requer pelo menos um caractere especial (padrão: false)
 * @returns true se a senha atender aos requisitos, false caso contrário
 */
export function isValidPassword(
  password: string,
  minLength: number = 8,
  requireUppercase: boolean = true,
  requireLowercase: boolean = true,
  requireNumber: boolean = true,
  requireSpecial: boolean = false
): boolean {
  if (password.length < minLength) return false;
  
  if (requireUppercase && !/[A-Z]/.test(password)) return false;
  
  if (requireLowercase && !/[a-z]/.test(password)) return false;
  
  if (requireNumber && !/\d/.test(password)) return false;
  
  if (requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  
  return true;
}

/**
 * Verifica se uma data é válida
 * @param date Data a ser validada (string ou objeto Date)
 * @returns true se a data for válida, false caso contrário
 */
export function isValidDate(date: Date | string): boolean {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return !isNaN(date.getTime());
}

/**
 * Verifica se uma data está no futuro
 * @param date Data a ser validada
 * @returns true se a data estiver no futuro, false caso contrário
 */
export function isFutureDate(date: Date | string): boolean {
  if (!isValidDate(date)) return false;
  
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  return d.getTime() > now.getTime();
}

/**
 * Verifica se uma data está no passado
 * @param date Data a ser validada
 * @returns true se a data estiver no passado, false caso contrário
 */
export function isPastDate(date: Date | string): boolean {
  if (!isValidDate(date)) return false;
  
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  return d.getTime() < now.getTime();
}

/**
 * Verifica se uma string contém apenas letras
 * @param text Texto a ser validado
 * @returns true se o texto contém apenas letras, false caso contrário
 */
export function isAlphaOnly(text: string): boolean {
  return /^[a-zA-Z]+$/.test(text);
}

/**
 * Verifica se uma string contém apenas letras e números
 * @param text Texto a ser validado
 * @returns true se o texto contém apenas letras e números, false caso contrário
 */
export function isAlphanumeric(text: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(text);
} 