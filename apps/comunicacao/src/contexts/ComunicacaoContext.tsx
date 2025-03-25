import { createContext, useContext, useEffect, useState } from 'react'
import type { Tables, Enums } from '@/types/database'
import { supabase } from '@/lib/supabase'

type Conversa = Tables<'conversas'>
type Mensagem = Tables<'mensagens'>
type StatusConversa = Enums<'comunicacao_status'>
type CanalComunicacao = Enums<'comunicacao_canal'>
type TipoMensagem = Enums<'comunicacao_tipo_mensagem'>

interface ComunicacaoContextType {
  conversas: Conversa[]
  conversaAtual: Conversa | null
  mensagens: Mensagem[]
  loading: boolean
  error: Error | null
  selecionarConversa: (conversa: Conversa) => Promise<void>
  enviarMensagem: (conteudo: string, tipo: TipoMensagem) => Promise<void>
  marcarComoLida: (conversaId: string) => Promise<void>
}

const ComunicacaoContext = createContext<ComunicacaoContextType | null>(null)

export function ComunicacaoProvider({ children }: { children: React.ReactNode }) {
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [conversaAtual, setConversaAtual] = useState<Conversa | null>(null)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const carregarConversas = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('conversas')
          .select('*')
          .order('atualizado_at', { ascending: false })

        if (error) throw error
        setConversas(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar conversas'))
      } finally {
        setLoading(false)
      }
    }

    carregarConversas()

    // Inscrever-se em novas conversas
    const subscription = supabase
      .channel('conversas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversas' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setConversas((prev) => [payload.new as Conversa, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setConversas((prev) =>
            prev.map((conv) => (conv.id === payload.new.id ? (payload.new as Conversa) : conv))
          )
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const selecionarConversa = async (conversa: Conversa) => {
    try {
      setLoading(true)
      setConversaAtual(conversa)

      const { data, error } = await supabase
        .from('mensagens')
        .select('*')
        .eq('conversa_id', conversa.id)
        .order('criado_at', { ascending: true })

      if (error) throw error
      setMensagens(data)

      // Marcar mensagens como lidas
      await supabase.rpc('marcar_mensagens_como_lidas', {
        conversa_id_param: conversa.id,
        usuario_id_param: conversa.usuario_id,
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar mensagens'))
    } finally {
      setLoading(false)
    }
  }

  const enviarMensagem = async (conteudo: string, tipo: TipoMensagem) => {
    if (!conversaAtual) return

    try {
      const novaMensagem: Partial<Mensagem> = {
        conversa_id: conversaAtual.id,
        remetente_id: conversaAtual.usuario_id,
        conteudo,
        tipo,
        lida: false,
      }

      const { data, error } = await supabase.from('mensagens').insert(novaMensagem).select().single()

      if (error) throw error
      setMensagens((prev) => [...prev, data])

      // Atualizar última mensagem da conversa
      await supabase.rpc('atualizar_ultima_mensagem', {
        conversa_id_param: conversaAtual.id,
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao enviar mensagem'))
    }
  }

  const marcarComoLida = async (conversaId: string) => {
    try {
      const { error } = await supabase.rpc('marcar_mensagens_como_lidas', {
        conversa_id_param: conversaId,
        usuario_id_param: conversaAtual?.usuario_id || '',
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao marcar mensagens como lidas'))
    }
  }

  return (
    <ComunicacaoContext.Provider
      value={{
        conversas,
        conversaAtual,
        mensagens,
        loading,
        error,
        selecionarConversa,
        enviarMensagem,
        marcarComoLida,
      }}
    >
      {children}
    </ComunicacaoContext.Provider>
  )
}

export function useComunicacao() {
  const context = useContext(ComunicacaoContext)
  if (!context) {
    throw new Error('useComunicacao deve ser usado dentro de um ComunicacaoProvider')
  }
  return context
} 