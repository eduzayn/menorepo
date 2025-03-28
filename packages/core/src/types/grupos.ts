export interface Grupo {
  id: string;
  nome: string;
  descricao: string;
  criado_at: string;
  atualizado_at: string;
}

export interface Participante {
  id: string;
  grupo_id: string;
  usuario_id: string;
  role: 'ADMIN' | 'MEMBRO';
  criado_at: string;
  atualizado_at: string;
}

export type InsertGrupo = Omit<Grupo, 'id' | 'criado_at' | 'atualizado_at'>;
export type UpdateGrupo = Partial<InsertGrupo>;

export type InsertParticipante = Omit<Participante, 'id' | 'criado_at' | 'atualizado_at'>;
export type UpdateParticipante = Partial<InsertParticipante>; 