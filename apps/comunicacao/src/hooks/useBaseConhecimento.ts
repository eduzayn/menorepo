import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ArtigoConhecimento {
  id: string;
  titulo: string;
  conteudo: string;
  resumo: string;
  categoria_id: string;
  subcategoria_id?: string;
  criado_em: string;
  data_atualizacao: string;
  criado_por: string;
  tags: string[];
  favorito: boolean;
  visualizacoes: number;
  destacado: boolean;
  autor?: string;
  data_criacao: string;
  data_atualizacao?: string;
  artigos_relacionados?: { id: string; titulo: string }[];
}

export interface CategoriaConhecimento {
  id: string;
  nome: string;
  descricao?: string;
  icone?: string;
  ordem: number;
  quantidade_artigos: number;
  subcategorias?: SubcategoriaConhecimento[];
}

export interface SubcategoriaConhecimento {
  id: string;
  nome: string;
  categoria_id: string;
  ordem: number;
}

interface UseBaseConhecimentoOptions {
  categoria?: string;
  subcategoria?: string;
  mostrarArquivados?: boolean;
  ordenacao?: 'recentes' | 'populares' | 'relevantes';
  limitePorPagina?: number;
}

export function useBaseConhecimento(options: UseBaseConhecimentoOptions = {}) {
  const [artigos, setArtigos] = useState<ArtigoConhecimento[]>([]);
  const [categorias, setCategorias] = useState<CategoriaConhecimento[]>([]);
  const [artigoSelecionado, setArtigoSelecionado] = useState<ArtigoConhecimento | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalArtigos, setTotalArtigos] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const { user } = useAuth();

  const {
    categoria,
    subcategoria,
    mostrarArquivados = false,
    ordenacao = 'relevantes',
    limitePorPagina = 10
  } = options;

  // Buscar artigos com filtros
  const buscarArtigos = useCallback(async (termoBusca?: string, pagina = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      setPaginaAtual(pagina);

      // Configurar a consulta base
      let query = supabase
        .from('base_conhecimento')
        .select('*', { count: 'exact' });

      // Aplicar filtros
      if (!mostrarArquivados) {
        query = query.neq('status', 'ARQUIVADO');
      }

      if (categoria) {
        query = query.eq('categoria', categoria);
      }

      if (subcategoria) {
        query = query.eq('subcategoria', subcategoria);
      }

      if (termoBusca) {
        query = query.or(`titulo.ilike.%${termoBusca}%,conteudo.ilike.%${termoBusca}%,tags.cs.{${termoBusca}}`);
      }

      // Aplicar ordenação
      if (ordenacao === 'recentes') {
        query = query.order('criado_em', { ascending: false });
      } else if (ordenacao === 'populares') {
        query = query.order('visualizacoes', { ascending: false });
      } else {
        // Relevantes: combina avaliações positivas e visualizações
        query = query.order('avaliacoes_positivas', { ascending: false })
                     .order('visualizacoes', { ascending: false });
      }

      // Aplicar paginação
      const offset = (pagina - 1) * limitePorPagina;
      query = query.range(offset, offset + limitePorPagina - 1);

      // Executar a consulta
      const { data, error, count } = await query;

      if (error) throw error;

      if (count !== null) {
        setTotalArtigos(count);
      }

      // Se o usuário estiver logado, verificar artigos favoritos
      if (user) {
        const { data: favoritos } = await supabase
          .from('base_conhecimento_favoritos')
          .select('artigo_id')
          .eq('usuario_id', user.id);

        const favoritosIds = favoritos?.map(f => f.artigo_id) || [];
        
        // Marcar os artigos favoritos
        const artigosComFavoritos = data?.map(artigo => ({
          ...artigo,
          favorito: favoritosIds.includes(artigo.id)
        })) || [];
        
        setArtigos(artigosComFavoritos as ArtigoConhecimento[]);
      } else {
        setArtigos(data as ArtigoConhecimento[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar artigos'));
      console.error('Erro ao buscar artigos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [categoria, subcategoria, mostrarArquivados, ordenacao, limitePorPagina, user]);

  // Buscar categorias da base de conhecimento
  const buscarCategorias = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Buscar categorias
      const { data: categoriasData, error: categoriasError } = await supabase
        .from('base_conhecimento_categorias')
        .select('*');
        
      if (categoriasError) throw categoriasError;
      
      // Buscar subcategorias
      const { data: subcategoriasData, error: subcategoriasError } = await supabase
        .from('base_conhecimento_subcategorias')
        .select('*');
        
      if (subcategoriasError) throw subcategoriasError;
      
      // Buscar contagem de artigos por categoria
      const { data: contagemData, error: contagemError } = await supabase
        .from('base_conhecimento')
        .select('categoria, id')
        .neq('status', 'ARQUIVADO');
        
      if (contagemError) throw contagemError;
      
      // Agrupar subcategorias por categoria
      const subcategoriasPorCategoria: Record<string, { id: string; nome: string }[]> = {};
      subcategoriasData?.forEach(subcategoria => {
        if (!subcategoriasPorCategoria[subcategoria.categoria_id]) {
          subcategoriasPorCategoria[subcategoria.categoria_id] = [];
        }
        subcategoriasPorCategoria[subcategoria.categoria_id].push({
          id: subcategoria.id,
          nome: subcategoria.nome
        });
      });
      
      // Contar artigos por categoria
      const contagemPorCategoria: Record<string, number> = {};
      contagemData?.forEach(artigo => {
        contagemPorCategoria[artigo.categoria] = (contagemPorCategoria[artigo.categoria] || 0) + 1;
      });
      
      // Combinar dados
      const categoriasCompletas = categoriasData?.map(categoria => ({
        ...categoria,
        subcategorias: subcategoriasPorCategoria[categoria.id] || [],
        quantidade_artigos: contagemPorCategoria[categoria.id] || 0
      })) || [];
      
      setCategorias(categoriasCompletas as CategoriaConhecimento[]);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      setError(err instanceof Error ? err : new Error('Erro ao buscar categorias'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar detalhes de um artigo específico
  const buscarArtigoPorId = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      
      // Incrementar visualizações
      await supabase.rpc('incrementar_visualizacao_artigo', { artigo_id: id });
      
      // Buscar artigo
      const { data, error } = await supabase
        .from('base_conhecimento')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Verificar se é favorito para o usuário atual
      if (user) {
        const { data: favorito, error: favoritoError } = await supabase
          .from('base_conhecimento_favoritos')
          .select('*')
          .eq('artigo_id', id)
          .eq('usuario_id', user.id)
          .single();
          
        if (!favoritoError && favorito) {
          data.favorito = true;
        }
      }
      
      setArtigoSelecionado(data as ArtigoConhecimento);
      return data as ArtigoConhecimento;
    } catch (err) {
      console.error('Erro ao buscar artigo:', err);
      setError(err instanceof Error ? err : new Error('Erro ao buscar artigo'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Adicionar novo artigo
  const adicionarArtigo = useCallback(async (artigo: Omit<ArtigoConhecimento, 'id' | 'criado_em' | 'atualizado_em' | 'visualizacoes' | 'avaliacoes_positivas' | 'avaliacoes_negativas'>) => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar artigos');
      return null;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('base_conhecimento')
        .insert({
          ...artigo,
          criado_por: user.id,
          visualizacoes: 0,
          avaliacoes_positivas: 0,
          avaliacoes_negativas: 0
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Artigo adicionado com sucesso');
      return data as ArtigoConhecimento;
    } catch (err) {
      console.error('Erro ao adicionar artigo:', err);
      toast.error('Erro ao adicionar artigo');
      setError(err instanceof Error ? err : new Error('Erro ao adicionar artigo'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Editar artigo existente
  const editarArtigo = useCallback(async (id: string, atualizacoes: Partial<ArtigoConhecimento>) => {
    if (!user) {
      toast.error('Você precisa estar logado para editar artigos');
      return null;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('base_conhecimento')
        .update({
          ...atualizacoes,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Atualizar o artigo selecionado se for o mesmo
      if (artigoSelecionado && artigoSelecionado.id === id) {
        setArtigoSelecionado({
          ...artigoSelecionado,
          ...data
        } as ArtigoConhecimento);
      }
      
      // Atualizar a lista de artigos se o artigo estiver nela
      setArtigos(artigos.map(artigo => 
        artigo.id === id ? { ...artigo, ...data } : artigo
      ) as ArtigoConhecimento[]);
      
      toast.success('Artigo atualizado com sucesso');
      return data as ArtigoConhecimento;
    } catch (err) {
      console.error('Erro ao editar artigo:', err);
      toast.error('Erro ao editar artigo');
      setError(err instanceof Error ? err : new Error('Erro ao editar artigo'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, artigos, artigoSelecionado]);

  // Arquivar/desarquivar artigo
  const alterarStatusArtigo = useCallback(async (id: string, status: 'PUBLICADO' | 'RASCUNHO' | 'ARQUIVADO') => {
    if (!user) {
      toast.error('Você precisa estar logado para alterar o status de artigos');
      return false;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('base_conhecimento')
        .update({ status, atualizado_em: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      
      // Atualizar o artigo selecionado se for o mesmo
      if (artigoSelecionado && artigoSelecionado.id === id) {
        setArtigoSelecionado({
          ...artigoSelecionado,
          status
        });
      }
      
      // Atualizar a lista de artigos ou remover se não deve mais ser exibido
      if (status === 'ARQUIVADO' && !mostrarArquivados) {
        setArtigos(artigos.filter(artigo => artigo.id !== id));
      } else {
        setArtigos(artigos.map(artigo => 
          artigo.id === id ? { ...artigo, status } : artigo
        ));
      }
      
      const mensagem = status === 'ARQUIVADO' 
        ? 'Artigo arquivado com sucesso' 
        : status === 'PUBLICADO'
          ? 'Artigo publicado com sucesso'
          : 'Artigo salvo como rascunho';
          
      toast.success(mensagem);
      return true;
    } catch (err) {
      console.error('Erro ao alterar status do artigo:', err);
      toast.error('Erro ao alterar status do artigo');
      setError(err instanceof Error ? err : new Error('Erro ao alterar status do artigo'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, artigos, artigoSelecionado, mostrarArquivados]);

  // Favoritar/desfavoritar artigo
  const alternarFavorito = useCallback(async (id: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para favoritar artigos');
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // Verificar se já é favorito
      const { data: favorito, error: favoritoError } = await supabase
        .from('base_conhecimento_favoritos')
        .select('*')
        .eq('artigo_id', id)
        .eq('usuario_id', user.id)
        .single();
        
      if (favoritoError && favoritoError.code !== 'PGRST116') {
        // Erro diferente de "não encontrado"
        throw favoritoError;
      }
      
      let isFavorito = false;
      
      if (favorito) {
        // Remover dos favoritos
        const { error } = await supabase
          .from('base_conhecimento_favoritos')
          .delete()
          .eq('artigo_id', id)
          .eq('usuario_id', user.id);
          
        if (error) throw error;
        
        toast.success('Artigo removido dos favoritos');
      } else {
        // Adicionar aos favoritos
        const { error } = await supabase
          .from('base_conhecimento_favoritos')
          .insert({
            artigo_id: id,
            usuario_id: user.id
          });
          
        if (error) throw error;
        
        isFavorito = true;
        toast.success('Artigo adicionado aos favoritos');
      }
      
      // Atualizar o artigo selecionado se for o mesmo
      if (artigoSelecionado && artigoSelecionado.id === id) {
        setArtigoSelecionado({
          ...artigoSelecionado,
          favorito: isFavorito
        });
      }
      
      // Atualizar a lista de artigos
      setArtigos(artigos.map(artigo => 
        artigo.id === id ? { ...artigo, favorito: isFavorito } : artigo
      ));
      
      return true;
    } catch (err) {
      console.error('Erro ao alternar favorito:', err);
      toast.error('Erro ao alternar favorito');
      setError(err instanceof Error ? err : new Error('Erro ao alternar favorito'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, artigos, artigoSelecionado]);

  // Avaliar artigo (positivo/negativo)
  const avaliarArtigo = useCallback(async (id: string, avaliacao: 'positiva' | 'negativa') => {
    if (!user) {
      toast.error('Você precisa estar logado para avaliar artigos');
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // Verificar se já avaliou este artigo
      const { data: avaliacaoExistente, error: avaliacaoError } = await supabase
        .from('base_conhecimento_avaliacoes')
        .select('*')
        .eq('artigo_id', id)
        .eq('usuario_id', user.id)
        .single();
        
      if (avaliacaoError && avaliacaoError.code !== 'PGRST116') {
        // Erro diferente de "não encontrado"
        throw avaliacaoError;
      }
      
      let campoAtualizar = '';
      let valor = 0;
      
      if (avaliacaoExistente) {
        // Já avaliou antes - verificar se é a mesma avaliação
        if (avaliacaoExistente.tipo === avaliacao) {
          // Mesma avaliação, não faz nada
          toast.info('Você já avaliou este artigo');
          return false;
        }
        
        // Avaliação diferente - atualizar
        const { error } = await supabase
          .from('base_conhecimento_avaliacoes')
          .update({ tipo: avaliacao })
          .eq('artigo_id', id)
          .eq('usuario_id', user.id);
          
        if (error) throw error;
        
        // Decrementar avaliação anterior e incrementar nova
        if (avaliacao === 'positiva') {
          await supabase.rpc('decrementar_avaliacao_negativa', { artigo_id: id });
          await supabase.rpc('incrementar_avaliacao_positiva', { artigo_id: id });
          campoAtualizar = 'avaliacoes_positivas';
          valor = 1;
        } else {
          await supabase.rpc('decrementar_avaliacao_positiva', { artigo_id: id });
          await supabase.rpc('incrementar_avaliacao_negativa', { artigo_id: id });
          campoAtualizar = 'avaliacoes_negativas';
          valor = 1;
        }
      } else {
        // Primeira avaliação
        const { error } = await supabase
          .from('base_conhecimento_avaliacoes')
          .insert({
            artigo_id: id,
            usuario_id: user.id,
            tipo: avaliacao
          });
          
        if (error) throw error;
        
        // Incrementar contagem
        if (avaliacao === 'positiva') {
          await supabase.rpc('incrementar_avaliacao_positiva', { artigo_id: id });
          campoAtualizar = 'avaliacoes_positivas';
          valor = 1;
        } else {
          await supabase.rpc('incrementar_avaliacao_negativa', { artigo_id: id });
          campoAtualizar = 'avaliacoes_negativas';
          valor = 1;
        }
      }
      
      // Buscar artigo atualizado
      const { data: artigoAtualizado, error: artigoError } = await supabase
        .from('base_conhecimento')
        .select('*')
        .eq('id', id)
        .single();
        
      if (artigoError) throw artigoError;
      
      // Atualizar o artigo selecionado se for o mesmo
      if (artigoSelecionado && artigoSelecionado.id === id) {
        setArtigoSelecionado(artigoAtualizado as ArtigoConhecimento);
      }
      
      // Atualizar a lista de artigos
      setArtigos(artigos.map(artigo => 
        artigo.id === id ? artigoAtualizado as ArtigoConhecimento : artigo
      ));
      
      toast.success(`Avaliação ${avaliacao === 'positiva' ? 'positiva' : 'negativa'} registrada`);
      return true;
    } catch (err) {
      console.error('Erro ao avaliar artigo:', err);
      toast.error('Erro ao avaliar artigo');
      setError(err instanceof Error ? err : new Error('Erro ao avaliar artigo'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, artigos, artigoSelecionado]);

  // Buscar artigos relacionados
  const buscarArtigosRelacionados = useCallback(async (artigoId: string, limite = 5) => {
    try {
      setIsLoading(true);
      
      // Buscar artigo atual para obter categoria e tags
      const { data: artigoAtual, error: artigoError } = await supabase
        .from('base_conhecimento')
        .select('categoria, tags')
        .eq('id', artigoId)
        .single();
        
      if (artigoError) throw artigoError;
      
      // Buscar artigos da mesma categoria e com tags similares
      const { data: relacionados, error: relacionadosError } = await supabase
        .from('base_conhecimento')
        .select('*')
        .eq('categoria', artigoAtual.categoria)
        .neq('id', artigoId)
        .neq('status', 'ARQUIVADO')
        .order('avaliacoes_positivas', { ascending: false })
        .limit(limite);
        
      if (relacionadosError) throw relacionadosError;
      
      return relacionados as ArtigoConhecimento[];
    } catch (err) {
      console.error('Erro ao buscar artigos relacionados:', err);
      setError(err instanceof Error ? err : new Error('Erro ao buscar artigos relacionados'));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar artigos favoritos do usuário
  const buscarArtigosFavoritos = useCallback(async () => {
    if (!user) {
      toast.error('Você precisa estar logado para ver favoritos');
      return [];
    }
    
    try {
      setIsLoading(true);
      
      const { data: favoritos, error: favoritosError } = await supabase
        .from('base_conhecimento_favoritos')
        .select('artigo_id')
        .eq('usuario_id', user.id);
        
      if (favoritosError) throw favoritosError;
      
      if (!favoritos || favoritos.length === 0) {
        return [];
      }
      
      const artigosIds = favoritos.map(f => f.artigo_id);
      
      const { data, error } = await supabase
        .from('base_conhecimento')
        .select('*')
        .in('id', artigosIds)
        .neq('status', 'ARQUIVADO');
        
      if (error) throw error;
      
      return (data || []).map(artigo => ({
        ...artigo,
        favorito: true
      })) as ArtigoConhecimento[];
    } catch (err) {
      console.error('Erro ao buscar favoritos:', err);
      setError(err instanceof Error ? err : new Error('Erro ao buscar favoritos'));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Buscar artigos por categoria
  useEffect(() => {
    if (categoria) {
      buscarArtigos();
    }
  }, [categoria, subcategoria, buscarArtigos]);

  return {
    artigos,
    artigoSelecionado,
    categorias,
    isLoading,
    error,
    totalArtigos,
    paginaAtual,
    limitePorPagina,
    buscarArtigos,
    buscarCategorias,
    buscarArtigoPorId,
    adicionarArtigo,
    editarArtigo,
    alterarStatusArtigo,
    alternarFavorito,
    avaliarArtigo,
    buscarArtigosRelacionados,
    buscarArtigosFavoritos,
    setPaginaAtual
  };
} 