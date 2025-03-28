import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam variáveis de ambiente do Supabase')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Tipos de enums do banco de dados
export type StatusConversa = Database['public']['Enums']['comunicacao_status']
export type CanalComunicacao = Database['public']['Enums']['comunicacao_canal']
export type TipoMensagem = Database['public']['Enums']['comunicacao_tipo_mensagem']
export type TipoCampanha = Database['public']['Enums']['comunicacao_tipo_campanha']
export type GrupoRole = Database['public']['Enums']['grupo_role']
export type TipoNotificacao = Database['public']['Enums']['tipo_notificacao']

// Tipos de tabelas do banco de dados
export type Conversa = Database['public']['Tables']['conversas']['Row']
export type Mensagem = Database['public']['Tables']['mensagens']['Row']
export type Campanha = Database['public']['Tables']['campanhas']['Row']
export type RespostaRapida = Database['public']['Tables']['respostas_rapidas']['Row']
export type Grupo = Database['public']['Tables']['grupos']['Row']
export type GrupoParticipante = Database['public']['Tables']['grupo_participantes']['Row']
export type NotificacaoConfig = Database['public']['Tables']['notificacoes_config']['Row'] 