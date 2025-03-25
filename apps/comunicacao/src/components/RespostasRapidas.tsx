import { useState } from 'react'
import { Select } from '@repo/ui-components'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'

type RespostaRapida = Tables<'respostas_rapidas'>

export function RespostasRapidas({
  onSelecionar,
}: {
  onSelecionar: (conteudo: string) => void
}) {
  const [respostas, setRespostas] = useState<RespostaRapida[]>([])
  const [loading, setLoading] = useState(true)

  useState(() => {
    const carregarRespostas = async () => {
      try {
        const { data, error } = await supabase
          .from('respostas_rapidas')
          .select('*')
          .order('titulo')

        if (error) throw error
        setRespostas(data)
      } catch (err) {
        console.error('Erro ao carregar respostas rápidas:', err)
      } finally {
        setLoading(false)
      }
    }

    carregarRespostas()
  }, [])

  const handleChange = (value: string) => {
    const resposta = respostas.find((r) => r.id === value)
    if (resposta) {
      onSelecionar(resposta.conteudo)
    }
  }

  return (
    <Select
      placeholder={loading ? 'Carregando...' : 'Selecione uma resposta rápida'}
      disabled={loading}
      onChange={handleChange}
      options={respostas.map((resposta) => ({
        value: resposta.id,
        label: resposta.titulo,
      }))}
    />
  )
} 