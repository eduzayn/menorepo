import { useDatabase } from './supabase';
import supabaseService from './supabase';
import { Database } from '@/types/supabase';
import { useEffect, useState } from 'react';

export type Versao = Database['public']['Tables']['versoes']['Row'];
export type VersaoInsert = Database['public']['Tables']['versoes']['Insert'];

/**
 * Hook para obter o histórico de versões de uma aula
 * @param aulaId ID da aula
 * @returns Lista de versões e status de carregamento
 */
export const useVersionHistory = (aulaId: string) => {
  const supabase = useDatabase();
  const [versions, setVersions] = useState<Versao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!aulaId) return;

    const fetchVersions = async () => {
      try {
        setLoading(true);
        
        // Usa a função RPC para obter versões com detalhes dos autores
        const { data, error } = await supabase
          .rpc('get_versoes_aula', { p_aula_id: aulaId });
        
        if (error) throw error;
        
        // Busca detalhes completos para cada versão
        const { data: detailedData, error: detailedError } = await supabase
          .from('versoes')
          .select('*')
          .eq('aula_id', aulaId)
          .order('numero', { ascending: false });
          
        if (detailedError) throw detailedError;
        
        setVersions(detailedData || []);
      } catch (err) {
        console.error('Erro ao buscar histórico de versões:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido ao buscar versões'));
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [supabase, aulaId]);

  return { versions, loading, error };
};

/**
 * Serviço para gerenciar versões de aulas
 */
class VersionService {
  /**
   * Cria uma nova versão de uma aula
   * @param aulaId ID da aula
   * @param conteudo Conteúdo da aula
   * @param comentario Comentário sobre as alterações
   * @returns Nova versão criada
   */
  public async createVersion(
    aulaId: string,
    conteudo: any,
    comentario?: string
  ): Promise<Versao | null> {
    try {
      const client = supabaseService.getClient();
      const currentUser = await supabaseService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      // Busca o número da última versão
      const { data: maxVersion, error: maxError } = await client
        .from('versoes')
        .select('numero')
        .eq('aula_id', aulaId)
        .order('numero', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      // Calcula o próximo número de versão
      const numero = maxVersion ? maxVersion.numero + 1 : 1;
      
      // Cria a nova versão
      const { data, error } = await client
        .from('versoes')
        .insert({
          aula_id: aulaId,
          numero,
          conteudo,
          autor_id: currentUser.id,
          criado_em: new Date().toISOString(),
          comentario: comentario || `Versão ${numero}`
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erro ao criar versão:', error);
      return null;
    }
  }

  /**
   * Obtém uma versão específica pelo ID
   * @param id ID da versão
   * @returns Dados da versão
   */
  public async getVersionById(id: string): Promise<Versao | null> {
    try {
      const client = supabaseService.getClient();
      
      const { data, error } = await client
        .from('versoes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Erro ao buscar versão ${id}:`, error);
      return null;
    }
  }

  /**
   * Obtém a versão mais recente de uma aula
   * @param aulaId ID da aula
   * @returns Versão mais recente
   */
  public async getLatestVersion(aulaId: string): Promise<Versao | null> {
    try {
      const client = supabaseService.getClient();
      
      const { data, error } = await client
        .from('versoes')
        .select('*')
        .eq('aula_id', aulaId)
        .order('numero', { ascending: false })
        .limit(1)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Erro ao buscar versão mais recente da aula ${aulaId}:`, error);
      return null;
    }
  }

  /**
   * Reverte uma aula para uma versão anterior
   * @param versaoId ID da versão a ser restaurada
   * @param comentario Comentário sobre a restauração
   * @returns Nova versão criada com o conteúdo restaurado
   */
  public async revertToVersion(versaoId: string, comentario?: string): Promise<Versao | null> {
    try {
      const client = supabaseService.getClient();
      
      // Busca a versão a ser restaurada
      const { data: versao, error: versaoError } = await client
        .from('versoes')
        .select('*')
        .eq('id', versaoId)
        .single();
        
      if (versaoError) throw versaoError;
      
      if (!versao) {
        throw new Error('Versão não encontrada');
      }
      
      // Cria uma nova versão com o conteúdo da versão antiga
      return this.createVersion(
        versao.aula_id,
        versao.conteudo,
        comentario || `Restauração da versão ${versao.numero}`
      );
    } catch (error) {
      console.error(`Erro ao reverter para versão ${versaoId}:`, error);
      return null;
    }
  }

  /**
   * Compara duas versões e retorna as diferenças
   * @param versaoAntigaId ID da primeira versão
   * @param versaoNovaId ID da segunda versão (mais recente)
   * @returns Objeto com as diferenças
   */
  public async compareVersions(versaoAntigaId: string, versaoNovaId: string): Promise<any> {
    try {
      const client = supabaseService.getClient();
      
      // Busca as duas versões
      const [versaoAntiga, versaoNova] = await Promise.all([
        this.getVersionById(versaoAntigaId),
        this.getVersionById(versaoNovaId)
      ]);
      
      if (!versaoAntiga || !versaoNova) {
        throw new Error('Uma ou ambas as versões não foram encontradas');
      }
      
      // Implementar lógica de diff aqui
      // Esta é uma implementação básica, uma real usaria uma biblioteca como diff/json-diff
      
      // Comparação simples de campos principais
      const antigoBlocos = Array.isArray(versaoAntiga.conteudo) ? versaoAntiga.conteudo : [];
      const novoBlocos = Array.isArray(versaoNova.conteudo) ? versaoNova.conteudo : [];
      
      const blocosAdicionados = novoBlocos.filter(
        (bloco: any) => !antigoBlocos.some((b: any) => b.id === bloco.id)
      );
      
      const blocosRemovidos = antigoBlocos.filter(
        (bloco: any) => !novoBlocos.some((b: any) => b.id === bloco.id)
      );
      
      const blocosModificados = novoBlocos.filter((bloco: any) => {
        const blocoAntigo = antigoBlocos.find((b: any) => b.id === bloco.id);
        if (!blocoAntigo) return false;
        
        // Comparação simples baseada em stringify
        return JSON.stringify(blocoAntigo) !== JSON.stringify(bloco);
      });
      
      return {
        versaoAntiga: {
          numero: versaoAntiga.numero,
          data: versaoAntiga.criado_em
        },
        versaoNova: {
          numero: versaoNova.numero,
          data: versaoNova.criado_em
        },
        diferencas: {
          blocosAdicionados: blocosAdicionados.length,
          blocosRemovidos: blocosRemovidos.length,
          blocosModificados: blocosModificados.length,
          detalhes: {
            adicionados: blocosAdicionados,
            removidos: blocosRemovidos,
            modificados: blocosModificados
          }
        }
      };
    } catch (error) {
      console.error(`Erro ao comparar versões ${versaoAntigaId} e ${versaoNovaId}:`, error);
      return null;
    }
  }
}

export default new VersionService(); 