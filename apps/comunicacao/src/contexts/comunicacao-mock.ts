// Mock do contexto de comunicação para desenvolvimento

// Interface para parâmetros de iniciar conversa
export interface IniciarConversaParams {
  participante_id: string;
  participante_tipo: 'LEAD' | 'ALUNO';
  titulo: string;
  canal: string;
}

// Funções mockadas
export const iniciarConversaMock = async (params: IniciarConversaParams): Promise<string | null> => {
  console.log('Mock: Iniciando conversa', params);
  await new Promise(resolve => setTimeout(resolve, 300));
  return `mock-conversa-${Date.now()}`;
};

// Contexto mockado
export const comunicacaoMock = {
  loading: false,
  error: null,
  iniciarConversa: iniciarConversaMock
}; 