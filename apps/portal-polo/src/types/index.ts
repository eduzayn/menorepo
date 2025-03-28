export interface Polo {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  email: string;
  responsavel: string;
  status: 'ativo' | 'inativo' | 'pendente';
  created_at: string;
  updated_at: string;
}

export interface Aluno {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  polo_id: string;
  curso_id: string;
  status: 'ativo' | 'inativo' | 'trancado' | 'formado';
  data_matricula: string;
  created_at: string;
  updated_at: string;
}

export interface Comissao {
  id: string;
  polo_id: string;
  aluno_id: string;
  curso_id: string;
  valor: number;
  percentual: number;
  status: 'pendente' | 'pago' | 'cancelado';
  data_geracao: string;
  created_at: string;
  updated_at: string;
}

export interface Repasse {
  id: string;
  polo_id: string;
  valor_total: number;
  data_pagamento: string;
  descricao: string;
  comprovante_url?: string;
  status: 'pendente' | 'pago' | 'cancelado';
  created_at: string;
  updated_at: string;
} 