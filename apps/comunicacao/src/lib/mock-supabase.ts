// Simulação do cliente Supabase para desenvolvimento
export const mockSupabase = {
  from: (table: string) => ({
    select: (columns = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: getMockData(table, column, value), error: null }),
        order: () => ({
          limit: (limit: number) => Promise.resolve({ data: getMockData(table), error: null })
        })
      }),
      in: (column: string, values: any[]) => ({
        order: () => ({
          limit: (limit: number) => Promise.resolve({ data: getMockData(table), error: null })
        })
      }),
      order: (column: string, { ascending = true } = {}) => ({
        limit: (limit: number) => Promise.resolve({ data: getMockData(table), error: null })
      }),
      limit: (limit: number) => Promise.resolve({ data: getMockData(table), error: null })
    }),
    insert: (data: any) => Promise.resolve({ data, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data, error: null })
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
    })
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: { id: 'mock-user-id', email: 'user@example.com' } }, error: null })
  }
};

// Função para retornar dados fictícios com base na tabela
function getMockData(table: string, column?: string, value?: any): any[] {
  switch (table) {
    case 'interacoes':
      return [
        {
          id: '1',
          lead_id: '101',
          tipo: 'LIGACAO',
          conteudo: 'Ligação para verificar interesse no curso de inglês',
          criado_por: 'Consultor 1',
          criado_em: new Date(Date.now() - 3600000).toISOString() // 1 hora atrás
        },
        {
          id: '2',
          lead_id: '101',
          tipo: 'EMAIL',
          conteudo: 'Email com detalhes do curso de inglês e valores',
          criado_por: 'Sistema',
          criado_em: new Date(Date.now() - 7200000).toISOString() // 2 horas atrás
        },
        {
          id: '3',
          lead_id: '101',
          tipo: 'NOTA',
          conteudo: 'Cliente demonstrou interesse em pacotes semestrais',
          criado_por: 'Consultor 1',
          criado_em: new Date(Date.now() - 10800000).toISOString() // 3 horas atrás
        }
      ];
      
    case 'leads':
      return [
        {
          id: '101',
          nome: 'Maria Silva',
          email: 'maria.silva@example.com',
          telefone: '(11) 98765-4321',
          status: 'QUALIFICADO',
          criado_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
          atualizado_at: new Date().toISOString(),
          engajamento: 75,
          canal_origem: 'facebook',
          ultima_interacao: new Date(Date.now() - 3600000).toISOString() // 1 hora atrás
        },
        {
          id: '102',
          nome: 'João Carlos',
          email: 'joao.carlos@example.com',
          telefone: '(11) 91234-5678',
          status: 'EM_CONTATO',
          criado_at: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
          atualizado_at: new Date().toISOString(),
          engajamento: 45,
          canal_origem: 'website',
          ultima_interacao: new Date(Date.now() - 43200000).toISOString() // 12 horas atrás
        },
        {
          id: '103',
          nome: 'Ana Beatriz',
          email: 'ana.beatriz@example.com',
          telefone: '(11) 99876-5432',
          status: 'NOVO',
          criado_at: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
          atualizado_at: new Date().toISOString(),
          engajamento: 20,
          canal_origem: 'instagram',
          ultima_interacao: new Date(Date.now() - 86400000).toISOString() // 1 dia atrás
        }
      ];
      
    case 'conversas':
      return [
        {
          id: '201',
          lead_id: '101',
          titulo: 'Dúvidas sobre curso de inglês',
          status: 'ABERTA',
          criado_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
          atualizado_at: new Date().toISOString()
        },
        {
          id: '202',
          lead_id: '102',
          titulo: 'Informações sobre matrícula',
          status: 'ABERTA',
          criado_at: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
          atualizado_at: new Date().toISOString()
        }
      ];
      
    default:
      return [];
  }
} 