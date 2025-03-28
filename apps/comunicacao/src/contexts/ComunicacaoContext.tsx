import { createContext, useContext, useEffect, useState } from 'react'
import type { Tables, Enums } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { criarConversa } from '@/services/comunicacao'
import { useAuth } from './AuthContext'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

type Conversa = Tables<'conversas'>
type Mensagem = Tables<'mensagens'>
type StatusConversa = Enums<'comunicacao_status'>
type CanalComunicacao = Enums<'comunicacao_canal'>
type TipoMensagem = Enums<'comunicacao_tipo_mensagem'>

interface IniciarConversaParams {
  participante_id: string
  participante_tipo: 'LEAD' | 'ALUNO'
  titulo: string
  canal: 'CHAT' | 'EMAIL' | 'WHATSAPP'
}

interface ComunicacaoContextType {
  conversas: Conversa[]
  conversaAtual: Conversa | null
  mensagens: Mensagem[]
  loading: boolean
  error: Error | null
  selecionarConversa: (conversa: Conversa) => Promise<void>
  enviarMensagem: (conteudo: string, tipo: TipoMensagem) => Promise<void>
  marcarComoLida: (conversaId: string) => Promise<void>
  iniciarConversa: (params: IniciarConversaParams) => Promise<void>
  iniciarCampanha: (destinatarioIds: string[], conteudo: string, titulo: string) => Promise<void>
}

const ComunicacaoContext = createContext<ComunicacaoContextType | null>(null)

export function ComunicacaoProvider({ children }: { children: React.ReactNode }) {
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [conversaAtual, setConversaAtual] = useState<Conversa | null>(null)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

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

  const iniciarConversa = async (params: IniciarConversaParams) => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const novaConversa = await criarConversa({
        titulo: params.titulo,
        status: 'ATIVO',
        canal: params.canal,
        participante_id: params.participante_id,
        participante_tipo: params.participante_tipo,
        usuario_id: user.id,
        participantes: [
          {
            id: user.id,
            tipo: 'USUARIO',
            nome: user.user_metadata?.nome || user.email,
            email: user.email || '',
            online: true,
            ultimo_acesso: new Date().toISOString()
          },
          {
            id: params.participante_id,
            tipo: params.participante_tipo,
            nome: params.titulo.replace('Conversa com ', ''),
            email: '',
            online: false
          }
        ]
      })

      setConversas((prev) => [novaConversa, ...prev])
      await selecionarConversa(novaConversa)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao iniciar conversa'))
    } finally {
      setLoading(false)
    }
  }

  const iniciarCampanha = async (destinatarioIds: string[], conteudo: string, titulo: string) => {
    if (!user) {
      toast.error('Você precisa estar autenticado para criar uma campanha')
      return
    }

    try {
      setLoading(true)

      // Criar campanha
      const { data: novaCampanha, error: errorCampanha } = await supabase
        .from('campanhas')
        .insert({
          titulo,
          descricao: conteudo.substring(0, 100) + (conteudo.length > 100 ? '...' : ''),
          tipo: 'marketing',
          status: 'ATIVO',
          data_inicio: new Date().toISOString(),
          criado_por: user.id
        })
        .select()
        .single()

      if (errorCampanha) throw errorCampanha

      // Adicionar destinatários
      const destinatarios = destinatarioIds.map((id) => ({
        campanha_id: novaCampanha.id,
        destinatario_id: id,
        status: 'ATIVO'
      }))

      const { error: errorDestinatarios } = await supabase
        .from('campanha_destinatarios')
        .insert(destinatarios)

      if (errorDestinatarios) throw errorDestinatarios

      toast.success('Campanha criada com sucesso!')
      navigate(`/campanhas/${novaCampanha.id}`)
    } catch (error) {
      console.error('Erro ao criar campanha:', error)
      toast.error('Não foi possível criar a campanha')
    } finally {
      setLoading(false)
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
        iniciarConversa,
        iniciarCampanha
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