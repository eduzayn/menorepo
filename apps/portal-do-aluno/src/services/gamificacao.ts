import { createClient } from '@supabase/supabase-js'
import type { ProgressoAluno, Conquista, AtividadeGamificada } from '@/types/gamificacao'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function obterProgressoAluno(alunoId: string): Promise<ProgressoAluno> {
  try {
    const { data, error } = await supabase
      .from('progresso_aluno')
      .select('*')
      .eq('alunoId', alunoId)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Erro ao obter progresso do aluno:', error)
    throw new Error('Falha ao obter progresso do aluno')
  }
}

export async function registrarAtividade(
  alunoId: string,
  atividade: AtividadeGamificada
): Promise<void> {
  try {
    // Registrar atividade completada
    const { error: atividadeError } = await supabase
      .from('atividades_completadas')
      .insert({
        alunoId,
        atividadeId: atividade.id,
        dataCompletada: new Date()
      })

    if (atividadeError) throw atividadeError

    // Atualizar progresso do aluno
    const { data: progresso } = await supabase
      .from('progresso_aluno')
      .select('*')
      .eq('alunoId', alunoId)
      .single()

    if (progresso) {
      const { error: progressoError } = await supabase
        .from('progresso_aluno')
        .update({
          pontos: progresso.pontos + atividade.pontos,
          atividadesCompletas: progresso.atividadesCompletas + 1
        })
        .eq('alunoId', alunoId)

      if (progressoError) throw progressoError
    }
  } catch (error) {
    console.error('Erro ao registrar atividade:', error)
    throw new Error('Falha ao registrar atividade')
  }
}

export async function verificarConquistas(alunoId: string): Promise<Conquista[]> {
  try {
    const { data: progresso } = await supabase
      .from('progresso_aluno')
      .select('*')
      .eq('alunoId', alunoId)
      .single()

    if (!progresso) throw new Error('Progresso não encontrado')

    // Buscar conquistas disponíveis
    const { data: conquistas, error } = await supabase
      .from('conquistas')
      .select('*')
      .not('id', 'in', progresso.conquistas)

    if (error) throw error

    // Verificar quais conquistas foram desbloqueadas
    const conquistasDesbloqueadas = conquistas.filter(conquista => {
      // Implementar lógica de verificação de requisitos
      return true // Por enquanto, retorna todas
    })

    // Atualizar conquistas do aluno
    if (conquistasDesbloqueadas.length > 0) {
      const { error: updateError } = await supabase
        .from('progresso_aluno')
        .update({
          conquistas: [...progresso.conquistas, ...conquistasDesbloqueadas.map(c => c.id)]
        })
        .eq('alunoId', alunoId)

      if (updateError) throw updateError
    }

    return conquistasDesbloqueadas
  } catch (error) {
    console.error('Erro ao verificar conquistas:', error)
    throw new Error('Falha ao verificar conquistas')
  }
}

export async function atualizarTempoEstudo(
  alunoId: string,
  minutos: number
): Promise<void> {
  try {
    const { error } = await supabase
      .from('progresso_aluno')
      .update({
        tempoEstudo: supabase.raw(`tempo_estudo + ${minutos}`)
      })
      .eq('alunoId', alunoId)

    if (error) throw error
  } catch (error) {
    console.error('Erro ao atualizar tempo de estudo:', error)
    throw new Error('Falha ao atualizar tempo de estudo')
  }
} 