/**
 * Tipos compartilhados para testes no projeto Edunéxia
 */

/**
 * Tipo para os thresholds de cobertura
 */
export interface CoverageThreshold {
  branches: number;
  functions: number;
  lines: number;
  statements: number;
}

/**
 * Representa um objeto aluno para testes
 */
export interface TestStudent {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  dataNascimento: Date;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

/**
 * Representa um objeto curso para testes
 */
export interface TestCourse {
  id: string;
  nome: string;
  descricao: string;
  cargaHoraria: number;
  valor: number;
  duracao: number;
}

/**
 * Representa um objeto matrícula para testes
 */
export interface TestEnrollment {
  id: string;
  aluno: TestStudent;
  curso: TestCourse;
  dataMatricula: Date;
  valorTotal: number;
  status: 'ativa' | 'cancelada' | 'concluida' | 'pendente';
  formaPagamento: 'boleto' | 'cartao' | 'pix';
  parcelas: number;
}

/**
 * Opções para o report de cobertura
 */
export interface CoverageReportOptions {
  outputDir?: string;
  openInBrowser?: boolean;
  includeAllFiles?: boolean;
  excludeNodeModules?: boolean;
  reporter?: ('text' | 'json' | 'html' | 'lcov')[];
}

/**
 * Configurações para thresholds de cobertura por caminho
 */
export interface CoverageThresholds {
  global: CoverageThreshold;
  [path: string]: CoverageThreshold;
}

/**
 * Tipo que representa uma função de mock com expectativas
 */
export interface TestMock<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>;
  mock: {
    calls: Parameters<T>[];
    results: { type: 'return' | 'throw'; value: any }[];
    instances: any[];
    lastCall: Parameters<T>;
  };
  mockClear(): void;
  mockReset(): void;
  mockRestore(): void;
  mockImplementation(fn: (...args: Parameters<T>) => ReturnType<T>): TestMock<T>;
  mockImplementationOnce(fn: (...args: Parameters<T>) => ReturnType<T>): TestMock<T>;
  mockReturnValue(value: ReturnType<T>): TestMock<T>;
  mockReturnValueOnce(value: ReturnType<T>): TestMock<T>;
  mockResolvedValue<U extends Promise<any>>(value: Awaited<ReturnType<T> & U>): TestMock<T>;
  mockResolvedValueOnce<U extends Promise<any>>(value: Awaited<ReturnType<T> & U>): TestMock<T>;
  mockRejectedValue(value: any): TestMock<T>;
  mockRejectedValueOnce(value: any): TestMock<T>;
} 