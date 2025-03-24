import type { Database } from '@edunexia/database-schema';

export type ComunicacaoStatus = 'ativo' | 'inativo' | 'pendente' | 'arquivado';
export type ComunicacaoCanal = 'whatsapp' | 'email' | 'chat' | 'sms';
export type ComunicacaoTipoMensagem = 'texto' | 'imagem' | 'arquivo' | 'video' | 'audio' | 'localizacao';
export type ComunicacaoTipoCampanha = 'marketing' | 'notificacao' | 'lembrete' | 'pesquisa';

export type Conversa = Database['public']['Tables']['conversas']['Row'];
export type Mensagem = Database['public']['Tables']['mensagens']['Row'];
export type Campanha = Database['public']['Tables']['campanhas']['Row'];
export type CampanhaDestinatario = Database['public']['Tables']['campanha_destinatarios']['Row'];
export type RespostaRapida = Database['public']['Tables']['respostas_rapidas']['Row'];

export type InsertConversa = Database['public']['Tables']['conversas']['Insert'];
export type InsertMensagem = Database['public']['Tables']['mensagens']['Insert'];
export type InsertCampanha = Database['public']['Tables']['campanhas']['Insert'];
export type InsertCampanhaDestinatario = Database['public']['Tables']['campanha_destinatarios']['Insert'];
export type InsertRespostaRapida = Database['public']['Tables']['respostas_rapidas']['Insert'];

export type UpdateConversa = Database['public']['Tables']['conversas']['Update'];
export type UpdateMensagem = Database['public']['Tables']['mensagens']['Update'];
export type UpdateCampanha = Database['public']['Tables']['campanhas']['Update'];
export type UpdateCampanhaDestinatario = Database['public']['Tables']['campanha_destinatarios']['Update'];
export type UpdateRespostaRapida = Database['public']['Tables']['respostas_rapidas']['Update']; 