import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useChat } from './useChat';
import { useAuth } from './useAuth';

interface RegraAtribuicao {
  id: string;
  departamento_id: string;
  departamento_nome: string;
  palavras_chave: string[];
  prioridade: number;
  ativo: boolean;
}

interface DepartamentoDestino {
  id: string;
  nome: string;
  descricao?: string;
  usuarios: { id: string; nome: string }[];
}

export function useAtribuicaoAutomatica() {
  const { usuario } = useAuth();
  const [regras, setRegras] = useState<RegraAtribuicao[]>([]);
  const [departamentos, setDepartamentos] = useState<DepartamentoDestino[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Carregar regras de atribuição
  const carregarRegras = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('regras_atribuicao')
        .select(`
          id,
          departamento_id,
          departamentos(nome),
          palavras_chave,
          prioridade,
          ativo
        `)
        .eq('ativo', true)
        .order('prioridade', { ascending: false });
        
      if (error) throw new Error(error.message);
      
      const regrasProcessadas = data.map(regra => ({
        id: regra.id,
        departamento_id: regra.departamento_id,
        departamento_nome: regra.departamentos.nome,
        palavras_chave: regra.palavras_chave,
        prioridade: regra.prioridade,
        ativo: regra.ativo
      }));
      
      setRegras(regrasProcessadas);
    } catch (erro) {
      console.error('Erro ao carregar regras de atribuição:', erro);
      setError(erro as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar departamentos e usuários associados
  const carregarDepartamentos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .select(`
          id,
          nome,
          descricao,
          usuarios_departamentos(
            usuarios(id, nome, email)
          )
        `)
        .eq('ativo', true);
        
      if (error) throw new Error(error.message);
      
      const departamentosProcessados = data.map(dep => ({
        id: dep.id,
        nome: dep.nome,
        descricao: dep.descricao,
        usuarios: dep.usuarios_departamentos.map((ud: any) => ({
          id: ud.usuarios.id,
          nome: ud.usuarios.nome
        }))
      }));
      
      setDepartamentos(departamentosProcessados);
    } catch (erro) {
      console.error('Erro ao carregar departamentos:', erro);
      setError(erro as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analisar o texto e identificar o departamento adequado
  const identificarDepartamento = useCallback((texto: string): string | null => {
    // Converter para minúsculas para comparação
    const textoLowerCase = texto.toLowerCase();
    
    // Verificar cada regra, começando pelas de maior prioridade
    for (const regra of regras) {
      // Verificar se alguma palavra-chave da regra está no texto
      const encontrada = regra.palavras_chave.some(palavraChave => 
        textoLowerCase.includes(palavraChave.toLowerCase())
      );
      
      if (encontrada) {
        return regra.departamento_id;
      }
    }
    
    // Nenhuma correspondência encontrada
    return null;
  }, [regras]);

  // Atribuir conversa a um departamento
  const atribuirConversa = useCallback(async (
    conversaId: string, 
    departamentoId: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar se há usuários disponíveis no departamento
      const departamento = departamentos.find(d => d.id === departamentoId);
      
      if (!departamento || departamento.usuarios.length === 0) {
        throw new Error(`Nenhum usuário disponível no departamento ${departamento?.nome || departamentoId}`);
      }
      
      // Distribuição round-robin simples 
      // (em produção, poderia considerar carga de trabalho, status online, etc.)
      const usuariosAtivos = departamento.usuarios;
      const indiceAleatorio = Math.floor(Math.random() * usuariosAtivos.length);
      const usuarioDestino = usuariosAtivos[indiceAleatorio];
      
      // Atualizar a conversa com o novo atendente
      const { error } = await supabase
        .from('conversas')
        .update({ 
          atendente_id: usuarioDestino.id,
          departamento_id: departamentoId,
          atribuido_em: new Date().toISOString(),
          atribuido_automaticamente: true
        })
        .eq('id', conversaId);
        
      if (error) throw new Error(error.message);
      
      // Criar uma mensagem de sistema notificando a transferência
      await supabase
        .from('mensagens')
        .insert({
          conversa_id: conversaId,
          remetente_id: 'system',
          conteudo: `Esta conversa foi transferida automaticamente para o departamento ${departamento.nome}.`,
          tipo: 'SISTEMA',
          data_envio: new Date().toISOString()
        });
        
      return {
        sucesso: true,
        departamento: departamento.nome,
        atendente: usuarioDestino.nome
      };
    } catch (erro) {
      console.error('Erro ao atribuir conversa:', erro);
      setError(erro as Error);
      return {
        sucesso: false,
        erro: (erro as Error).message
      };
    } finally {
      setIsLoading(false);
    }
  }, [departamentos]);

  // Processar mensagem e atribuir automaticamente se necessário
  const processarMensagem = useCallback(async (
    conversaId: string, 
    mensagem: string
  ) => {
    try {
      // Verificar se a conversa já está atribuída a algum departamento
      const { data: conversa, error: conversaError } = await supabase
        .from('conversas')
        .select('departamento_id, atendente_id')
        .eq('id', conversaId)
        .single();
        
      if (conversaError) throw new Error(conversaError.message);
      
      // Se já está atribuída, não fazer nada
      if (conversa.departamento_id) {
        return {
          sucesso: true,
          atribuida: false,
          mensagem: 'Conversa já atribuída anteriormente'
        };
      }
      
      // Identificar departamento com base no conteúdo da mensagem
      const departamentoId = identificarDepartamento(mensagem);
      
      if (!departamentoId) {
        return {
          sucesso: true,
          atribuida: false,
          mensagem: 'Nenhum departamento identificado para a mensagem'
        };
      }
      
      // Atribuir a conversa ao departamento identificado
      const resultado = await atribuirConversa(conversaId, departamentoId);
      
      return {
        ...resultado,
        atribuida: resultado.sucesso
      };
    } catch (erro) {
      console.error('Erro ao processar mensagem para atribuição:', erro);
      return {
        sucesso: false,
        atribuida: false,
        erro: (erro as Error).message
      };
    }
  }, [identificarDepartamento, atribuirConversa]);

  // Adicionar uma nova regra de atribuição
  const adicionarRegra = useCallback(async (
    departamentoId: string,
    palavrasChave: string[],
    prioridade: number
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('regras_atribuicao')
        .insert({
          departamento_id: departamentoId,
          palavras_chave: palavrasChave,
          prioridade,
          ativo: true,
          criado_por: usuario?.id,
          criado_em: new Date().toISOString()
        })
        .select('id')
        .single();
        
      if (error) throw new Error(error.message);
      
      // Recarregar regras após adicionar
      await carregarRegras();
      
      return {
        sucesso: true,
        id: data.id
      };
    } catch (erro) {
      console.error('Erro ao adicionar regra:', erro);
      setError(erro as Error);
      return {
        sucesso: false,
        erro: (erro as Error).message
      };
    } finally {
      setIsLoading(false);
    }
  }, [usuario?.id, carregarRegras]);

  // Atualizar uma regra existente
  const atualizarRegra = useCallback(async (
    regraId: string,
    dados: Partial<Omit<RegraAtribuicao, 'id' | 'departamento_nome'>>
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('regras_atribuicao')
        .update({
          ...dados,
          atualizado_por: usuario?.id,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', regraId);
        
      if (error) throw new Error(error.message);
      
      // Recarregar regras após atualizar
      await carregarRegras();
      
      return { sucesso: true };
    } catch (erro) {
      console.error('Erro ao atualizar regra:', erro);
      setError(erro as Error);
      return {
        sucesso: false,
        erro: (erro as Error).message
      };
    } finally {
      setIsLoading(false);
    }
  }, [usuario?.id, carregarRegras]);

  // Remover uma regra
  const removerRegra = useCallback(async (regraId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Não excluir fisicamente, apenas marcar como inativo
      const { error } = await supabase
        .from('regras_atribuicao')
        .update({
          ativo: false,
          atualizado_por: usuario?.id,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', regraId);
        
      if (error) throw new Error(error.message);
      
      // Recarregar regras após remover
      await carregarRegras();
      
      return { sucesso: true };
    } catch (erro) {
      console.error('Erro ao remover regra:', erro);
      setError(erro as Error);
      return {
        sucesso: false,
        erro: (erro as Error).message
      };
    } finally {
      setIsLoading(false);
    }
  }, [usuario?.id, carregarRegras]);

  return {
    regras,
    departamentos,
    isLoading,
    error,
    carregarRegras,
    carregarDepartamentos,
    processarMensagem,
    adicionarRegra,
    atualizarRegra,
    removerRegra,
    identificarDepartamento
  };
} 