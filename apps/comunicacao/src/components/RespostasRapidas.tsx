import { useState, useEffect, ChangeEvent } from 'react'
import { Select } from '../components/ui/select'
import { mockSupabase as supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'

type RespostaRapida = Tables<'respostas_rapidas'>

export function RespostasRapidas({
  onSelecionar,
}: {
  onSelecionar: (conteudo: string) => void
}) {
  const [respostas, setRespostas] = useState<RespostaRapida[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarRespostas = async () => {
      try {
        // Usando dados mock para desenvolvimento
        setRespostas([
          {
            id: '1',
            titulo: 'Saudação padrão',
            conteudo: 'Olá! Como posso ajudar você hoje?',
            criado_por: 'sistema',
            criado_em: '2023-01-01'
          },
          {
            id: '2',
            titulo: 'Agradecimento',
            conteudo: 'Agradecemos o seu contato. Estamos à disposição!',
            criado_por: 'sistema',
            criado_em: '2023-01-01'
          }
        ]);
      } catch (err) {
        console.error('Erro ao carregar respostas rápidas:', err)
      } finally {
        setLoading(false)
      }
    }

    carregarRespostas()
  }, [])

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
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