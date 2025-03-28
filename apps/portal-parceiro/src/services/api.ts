import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Declaração de variáveis de ambiente para TypeScript
declare global {
  interface ImportMeta {
    env: {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
    };
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente Supabase não configuradas!');
}

// Cria o cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Tipos para facilitar o uso da API
export type InstituicaoParceira = Database['parcerias']['Tables']['instituicoes_parceiras']['Row'];
export type Contrato = Database['parcerias']['Tables']['contratos']['Row'];
export type CursoParceria = Database['parcerias']['Tables']['cursos_parceria']['Row'];
export type SolicitacaoCertificacao = Database['parcerias']['Tables']['solicitacoes_certificacao']['Row'];
export type Documento = Database['parcerias']['Tables']['documentos']['Row'];
export type FinanceiroParceiro = Database['parcerias']['Tables']['financeiro_parceiros']['Row'];

// API para Instituições Parceiras
export const instituicoesApi = {
  listar: async () => {
    const { data, error } = await supabase
      .from('instituicoes_parceiras')
      .select('*')
      .order('nome');
    
    if (error) throw error;
    return data;
  },

  obterPorId: async (id: string) => {
    const { data, error } = await supabase
      .from('instituicoes_parceiras')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  criar: async (instituicao: Omit<InstituicaoParceira, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('instituicoes_parceiras')
      .insert(instituicao)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  atualizar: async (id: string, instituicao: Partial<InstituicaoParceira>) => {
    const { data, error } = await supabase
      .from('instituicoes_parceiras')
      .update(instituicao)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  excluir: async (id: string) => {
    const { error } = await supabase
      .from('instituicoes_parceiras')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// API para Contratos
export const contratosApi = {
  listar: async (instituicaoId?: string) => {
    let query = supabase
      .from('contratos')
      .select('*')
      .order('data_inicio', { ascending: false });
    
    if (instituicaoId) {
      query = query.eq('instituicao_id', instituicaoId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  obterPorId: async (id: string) => {
    const { data, error } = await supabase
      .from('contratos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  criar: async (contrato: Omit<Contrato, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('contratos')
      .insert(contrato)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  atualizar: async (id: string, contrato: Partial<Contrato>) => {
    const { data, error } = await supabase
      .from('contratos')
      .update(contrato)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  excluir: async (id: string) => {
    const { error } = await supabase
      .from('contratos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// API para Cursos de Parceria
export const cursosApi = {
  listar: async (instituicaoId?: string) => {
    let query = supabase
      .from('cursos_parceria')
      .select('*')
      .order('titulo');
    
    if (instituicaoId) {
      query = query.eq('instituicao_id', instituicaoId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  obterPorId: async (id: string) => {
    const { data, error } = await supabase
      .from('cursos_parceria')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  criar: async (curso: Omit<CursoParceria, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('cursos_parceria')
      .insert(curso)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  atualizar: async (id: string, curso: Partial<CursoParceria>) => {
    const { data, error } = await supabase
      .from('cursos_parceria')
      .update(curso)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  excluir: async (id: string) => {
    const { error } = await supabase
      .from('cursos_parceria')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// API para Solicitações de Certificação
export const certificacoesApi = {
  listar: async (
    instituicaoId?: string, 
    cursoId?: string, 
    status?: string
  ) => {
    let query = supabase
      .from('solicitacoes_certificacao')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (instituicaoId) {
      query = query.eq('instituicao_id', instituicaoId);
    }
    
    if (cursoId) {
      query = query.eq('curso_id', cursoId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  obterPorId: async (id: string) => {
    const { data, error } = await supabase
      .from('solicitacoes_certificacao')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  criar: async (solicitacao: Omit<SolicitacaoCertificacao, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('solicitacoes_certificacao')
      .insert(solicitacao)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  atualizar: async (id: string, solicitacao: Partial<SolicitacaoCertificacao>) => {
    const { data, error } = await supabase
      .from('solicitacoes_certificacao')
      .update(solicitacao)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  excluir: async (id: string) => {
    const { error } = await supabase
      .from('solicitacoes_certificacao')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// API para Documentos
export const documentosApi = {
  listarPorEntidade: async (
    tipo: 'instituicao' | 'curso' | 'solicitacao',
    id: string
  ) => {
    const field = `${tipo}_id`;
    
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq(field, id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  obterPorId: async (id: string) => {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  criar: async (documento: Omit<Documento, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('documentos')
      .insert(documento)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  atualizar: async (id: string, documento: Partial<Documento>) => {
    const { data, error } = await supabase
      .from('documentos')
      .update(documento)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  excluir: async (id: string) => {
    const { error } = await supabase
      .from('documentos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// API para Upload e Download de arquivos
export const storageApi = {
  // Upload de arquivo
  upload: async (
    bucket: string,
    caminho: string,
    arquivo: File
  ) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(caminho, arquivo, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    return data;
  },

  // Gerar URL pública do arquivo
  getPublicUrl: (bucket: string, caminho: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(caminho);
    
    return data.publicUrl;
  },

  // Excluir arquivo
  excluir: async (bucket: string, caminhos: string[]) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove(caminhos);
    
    if (error) throw error;
    return data;
  }
};

// API para Relatórios
export const relatoriosApi = {
  obterDashboard: async (instituicaoId?: string) => {
    let query = supabase
      .from('visao_relatorios')
      .select('*');
    
    if (instituicaoId) {
      query = query.eq('instituicao_id', instituicaoId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
};

// Exporta o objeto API completo
const api = {
  supabase,
  instituicoes: instituicoesApi,
  contratos: contratosApi,
  cursos: cursosApi,
  certificacoes: certificacoesApi,
  documentos: documentosApi,
  storage: storageApi,
  relatorios: relatoriosApi
};

export default api; 