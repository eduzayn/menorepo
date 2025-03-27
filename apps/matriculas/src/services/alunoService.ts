import { useSupabaseClient, TypedSupabaseClient } from '@edunexia/api-client'
import { Aluno } from '@/types/aluno'

// Função para criar o serviço com o cliente
export const createAlunoService = (client: TypedSupabaseClient) => ({
  async listarAlunos(): Promise<Aluno[]> {
    const { data, error } = await client
      .from('alunos')
      .select('*')
    
    if (error) throw error
    return data || []
  },

  async buscarAluno(id: string): Promise<Aluno> {
    const { data, error } = await client
      .from('alunos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) throw new Error('Aluno não encontrado')
    return data
  },

  async criarAluno(aluno: Omit<Aluno, 'id' | 'created_at' | 'updated_at'>): Promise<Aluno> {
    const { data, error } = await client
      .from('alunos')
      .insert([aluno])
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Erro ao criar aluno')
    return data
  },

  async atualizarAluno(
    id: string,
    aluno: Partial<Omit<Aluno, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Aluno> {
    const { data, error } = await client
      .from('alunos')
      .update(aluno)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) throw new Error('Erro ao atualizar aluno')
    return data
  },

  async excluirAluno(id: string): Promise<void> {
    const { error } = await client
      .from('alunos')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
})

// Hook para usar o serviço em componentes
export function useAlunoService() {
  const supabase = useSupabaseClient()
  return createAlunoService(supabase)
} 