/**
 * Integração com o Banco de Dados - Portal do Aluno
 * 
 * Este arquivo contém as funções de integração com o Supabase
 * para o módulo Portal do Aluno da Edunéxia.
 */

import { createClient } from '@supabase/supabase-js';
import { User } from '@edunexia/auth';

// Importar tipos da estrutura do banco
import { 
  PerfilAluno, 
  ProgressoConteudo,
  DocumentoAluno,
  Certificado,
  BloqueioAcesso,
  AtividadeAluno,
  Gamificacao,
  DocumentoStatus,
  CertificadoStatus,
  ProgressoStatus,
  TipoConteudo
} from '../types/database';

// Inicialização do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Funções para Perfil do Aluno
 */

/**
 * Obter perfil completo do aluno
 */
export const getPerfilAluno = async (userId: string): Promise<PerfilAluno | null> => {
  const { data, error } = await supabase
    .from('portal_aluno.perfil_aluno')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Erro ao obter perfil do aluno:', error);
    return null;
  }
  
  return data;
};

/**
 * Atualizar perfil do aluno
 */
export const updatePerfilAluno = async (
  userId: string, 
  perfil: Partial<PerfilAluno>
): Promise<PerfilAluno | null> => {
  const { data, error } = await supabase
    .from('portal_aluno.perfil_aluno')
    .update(perfil)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) {
    console.error('Erro ao atualizar perfil do aluno:', error);
    return null;
  }
  
  return data;
};

/**
 * Registrar último acesso do aluno
 */
export const registrarUltimoAcesso = async (userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('portal_aluno.perfil_aluno')
    .update({ ultimo_acesso: new Date() })
    .eq('id', userId);
    
  if (error) {
    console.error('Erro ao registrar último acesso:', error);
    return false;
  }
  
  return true;
};

/**
 * Funções para Progresso de Conteúdo
 */

/**
 * Obter progresso do aluno em um curso
 */
export const getProgressoCurso = async (
  alunoId: string,
  cursoId: string
): Promise<ProgressoConteudo[]> => {
  const { data, error } = await supabase
    .from('portal_aluno.progresso_conteudo')
    .select('*')
    .eq('aluno_id', alunoId)
    .eq('curso_id', cursoId);
    
  if (error) {
    console.error('Erro ao obter progresso do curso:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Atualizar progresso de um conteúdo
 */
export const atualizarProgressoConteudo = async (
  alunoId: string,
  aulaId: string,
  progresso: Partial<ProgressoConteudo>
): Promise<ProgressoConteudo | null> => {
  // Obter tipo e curso_id da aula
  const { data: aulaData, error: aulaError } = await supabase
    .from('conteudo.aulas')
    .select('id, disciplina_id, disciplina:disciplinas(curso_id)')
    .eq('id', aulaId)
    .single();

  if (aulaError || !aulaData) {
    console.error('Erro ao obter dados da aula:', aulaError);
    return null;
  }
  
  const cursoId = aulaData.disciplina?.curso_id;
  
  if (!cursoId) {
    console.error('Curso ID não encontrado para a aula');
    return null;
  }
  
  // Verificar se já existe progresso
  const { data: existingData, error: existingError } = await supabase
    .from('portal_aluno.progresso_conteudo')
    .select('*')
    .eq('aluno_id', alunoId)
    .eq('aula_id', aulaId)
    .maybeSingle();
    
  // Se não existe, criar novo registro
  if (!existingData) {
    const novoProgresso = {
      aluno_id: alunoId,
      aula_id: aulaId,
      curso_id: cursoId,
      disciplina_id: aulaData.disciplina_id,
      tipo: 'aula' as TipoConteudo,
      status: 'em_progresso' as ProgressoStatus,
      porcentagem_concluida: 0,
      ultima_interacao: new Date(),
      ...progresso
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('portal_aluno.progresso_conteudo')
      .insert(novoProgresso)
      .select()
      .single();
      
    if (insertError) {
      console.error('Erro ao inserir progresso:', insertError);
      return null;
    }
    
    return insertData;
  }
  
  // Se existe, atualizar
  const { data: updateData, error: updateError } = await supabase
    .from('portal_aluno.progresso_conteudo')
    .update({
      ...progresso,
      ultima_interacao: new Date()
    })
    .eq('aluno_id', alunoId)
    .eq('aula_id', aulaId)
    .select()
    .single();
    
  if (updateError) {
    console.error('Erro ao atualizar progresso:', updateError);
    return null;
  }
  
  return updateData;
};

/**
 * Funções para Documentos
 */

/**
 * Obter documentos do aluno
 */
export const getDocumentosAluno = async (
  alunoId: string,
  status?: DocumentoStatus
): Promise<DocumentoAluno[]> => {
  let query = supabase
    .from('portal_aluno.documentos_aluno')
    .select('*')
    .eq('aluno_id', alunoId);
    
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
    
  if (error) {
    console.error('Erro ao obter documentos do aluno:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Enviar novo documento
 */
export const enviarDocumento = async (
  alunoId: string,
  arquivo: File,
  tipo: string,
  descricao?: string
): Promise<DocumentoAluno | null> => {
  // Upload do arquivo para o storage
  const fileName = `${alunoId}/${Date.now()}_${arquivo.name}`;
  
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('documentos_aluno')
    .upload(fileName, arquivo);
    
  if (uploadError) {
    console.error('Erro ao fazer upload do documento:', uploadError);
    return null;
  }
  
  // Obter URL pública do arquivo
  const { data: { publicUrl } } = supabase
    .storage
    .from('documentos_aluno')
    .getPublicUrl(fileName);
  
  // Inserir registro do documento
  const novoDocumento = {
    aluno_id: alunoId,
    nome: arquivo.name,
    tipo,
    descricao,
    arquivo_url: publicUrl,
    status: 'pendente' as DocumentoStatus
  };
  
  const { data, error } = await supabase
    .from('portal_aluno.documentos_aluno')
    .insert(novoDocumento)
    .select()
    .single();
    
  if (error) {
    console.error('Erro ao registrar documento:', error);
    return null;
  }
  
  return data;
};

/**
 * Funções para Certificados
 */

/**
 * Obter certificados do aluno
 */
export const getCertificadosAluno = async (
  alunoId: string
): Promise<Certificado[]> => {
  const { data, error } = await supabase
    .from('portal_aluno.certificados')
    .select('*, curso:cursos(nome)')
    .eq('aluno_id', alunoId);
    
  if (error) {
    console.error('Erro ao obter certificados do aluno:', error);
    return [];
  }
  
  return data || [];
};

/**
 * Solicitar certificado para um curso
 */
export const solicitarCertificado = async (
  alunoId: string,
  cursoId: string
): Promise<{ sucesso: boolean; mensagem: string }> => {
  // Verificar elegibilidade para o certificado
  const { data: elegibilidade, error: elegibilidadeError } = await supabase
    .rpc('portal_aluno.verificar_elegibilidade_certificado', {
      p_aluno_id: alunoId,
      p_curso_id: cursoId
    });
    
  if (elegibilidadeError) {
    console.error('Erro ao verificar elegibilidade:', elegibilidadeError);
    return { 
      sucesso: false, 
      mensagem: 'Erro ao verificar elegibilidade para certificado.' 
    };
  }
  
  if (!elegibilidade) {
    return { 
      sucesso: false, 
      mensagem: 'Aluno não elegível para certificado. Verifique conclusão de conteúdos, média mínima, situação financeira e documentação.' 
    };
  }
  
  // Verificar se já existe certificado para este curso
  const { data: certificadoExistente, error: certificadoError } = await supabase
    .from('portal_aluno.certificados')
    .select('id, status')
    .eq('aluno_id', alunoId)
    .eq('curso_id', cursoId)
    .maybeSingle();
    
  if (certificadoError) {
    console.error('Erro ao verificar certificado existente:', certificadoError);
    return { 
      sucesso: false, 
      mensagem: 'Erro ao verificar certificado existente.' 
    };
  }
  
  // Se já existe certificado, verificar status
  if (certificadoExistente) {
    if (['emitido', 'enviado'].includes(certificadoExistente.status)) {
      return { 
        sucesso: false, 
        mensagem: 'Certificado já emitido para este curso.' 
      };
    }
    
    if (certificadoExistente.status === 'solicitado') {
      return { 
        sucesso: false, 
        mensagem: 'Certificado já solicitado e está em processamento.' 
      };
    }
    
    // Atualizar certificado existente
    const { error: updateError } = await supabase
      .from('portal_aluno.certificados')
      .update({
        status: 'solicitado' as CertificadoStatus,
        data_solicitacao: new Date()
      })
      .eq('id', certificadoExistente.id);
      
    if (updateError) {
      console.error('Erro ao atualizar solicitação de certificado:', updateError);
      return { 
        sucesso: false, 
        mensagem: 'Erro ao atualizar solicitação de certificado.' 
      };
    }
    
    return { 
      sucesso: true, 
      mensagem: 'Solicitação de certificado atualizada com sucesso.'
    };
  }
  
  // Se não existe, criar novo certificado
  const codigo = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  
  const { error: insertError } = await supabase
    .from('portal_aluno.certificados')
    .insert({
      aluno_id: alunoId,
      curso_id: cursoId,
      codigo_validacao: codigo,
      status: 'solicitado' as CertificadoStatus
    });
    
  if (insertError) {
    console.error('Erro ao solicitar certificado:', insertError);
    return { 
      sucesso: false, 
      mensagem: 'Erro ao solicitar certificado.' 
    };
  }
  
  return { 
    sucesso: true, 
    mensagem: 'Certificado solicitado com sucesso. Aguarde processamento.' 
  };
};

/**
 * Funções para Bloqueios de Acesso
 */

/**
 * Verificar se aluno está bloqueado
 */
export const verificarBloqueioAluno = async (
  alunoId: string
): Promise<{ bloqueado: boolean; motivos: string[]; detalhes: BloqueioAcesso[] }> => {
  const { data, error } = await supabase
    .from('portal_aluno.bloqueios_acesso')
    .select('*')
    .eq('aluno_id', alunoId)
    .eq('ativo', true);
    
  if (error) {
    console.error('Erro ao verificar bloqueios:', error);
    return { bloqueado: false, motivos: [], detalhes: [] };
  }
  
  const bloqueios = data || [];
  const motivos = bloqueios.map(b => b.motivo);
  
  return {
    bloqueado: bloqueios.length > 0,
    motivos,
    detalhes: bloqueios
  };
};

/**
 * Funções para Atividades
 */

/**
 * Registrar atividade do aluno
 */
export const registrarAtividade = async (
  alunoId: string,
  tipo: string,
  descricao: string,
  pagina?: string
): Promise<boolean> => {
  const { error } = await supabase.rpc('portal_aluno.register_activity', {
    p_aluno_id: alunoId,
    p_tipo: tipo,
    p_descricao: descricao,
    p_pagina: pagina,
    p_ip_address: null,  // O IP será capturado pelo servidor
    p_user_agent: navigator.userAgent
  });
  
  if (error) {
    console.error('Erro ao registrar atividade:', error);
    return false;
  }
  
  return true;
};

/**
 * Funções para Gamificação
 */

/**
 * Obter dados de gamificação do aluno
 */
export const getGamificacaoAluno = async (
  alunoId: string
): Promise<Gamificacao | null> => {
  const { data, error } = await supabase
    .from('portal_aluno.gamificacao')
    .select('*')
    .eq('aluno_id', alunoId)
    .maybeSingle();
    
  if (error) {
    console.error('Erro ao obter dados de gamificação:', error);
    return null;
  }
  
  return data;
};

/**
 * Funções de Situação do Aluno
 */

/**
 * Obter situação geral do aluno
 */
export const getSituacaoAluno = async (
  alunoId: string
): Promise<any | null> => {
  const { data, error } = await supabase
    .from('portal_aluno.situacao_aluno')
    .select('*')
    .eq('aluno_id', alunoId)
    .maybeSingle();
    
  if (error) {
    console.error('Erro ao obter situação do aluno:', error);
    return null;
  }
  
  return data;
}; 