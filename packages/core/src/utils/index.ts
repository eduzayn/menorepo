// Aqui serão exportados os utilitários do core

// Funções de formatação
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

// Funções de validação
export const validateCPF = (cpf: string): boolean => {
  // Implementação simplificada
  return cpf.length === 11;
};

export const validateCNPJ = (cnpj: string): boolean => {
  // Implementação simplificada
  return cnpj.length === 14;
}; 