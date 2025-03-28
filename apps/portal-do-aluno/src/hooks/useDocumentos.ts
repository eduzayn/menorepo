import { useState, useEffect } from 'react';
import { useAlunoContext } from '../contexts/AlunoContext';

// Interface para um documento
export interface Documento {
  id: string;
  titulo: string;
  tipo: 'certificado' | 'declaracao' | 'historico' | 'outros';
  dataEmissao: string;
  url: string;
  baixado: boolean;
}

/**
 * Hook para listar e gerenciar documentos do aluno
 * @returns Dados dos documentos e funções para manipulação
 */
export function useDocumentos() {
  const { perfil, isAuthenticated } = useAlunoContext();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar documentos
  const fetchDocumentos = async () => {
    // Verifica se o usuário está autenticado
    if (!isAuthenticated || !perfil) {
      setError('Usuário não autenticado');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Em produção: Chamada à API
      // Simulação de dados para desenvolvimento
      const mockDocumentos: Documento[] = [
        {
          id: '1',
          titulo: 'Declaração de Matrícula',
          tipo: 'declaracao',
          dataEmissao: new Date().toISOString(),
          url: '/documentos/declaracao-matricula.pdf',
          baixado: false
        },
        {
          id: '2',
          titulo: 'Histórico Escolar',
          tipo: 'historico',
          dataEmissao: new Date().toISOString(),
          url: '/documentos/historico-escolar.pdf',
          baixado: false
        }
      ];
      
      // Simula um tempo de carregamento
      setTimeout(() => {
        setDocumentos(mockDocumentos);
        setIsLoading(false);
      }, 800);
      
    } catch (err) {
      setError('Erro ao carregar documentos');
      setIsLoading(false);
      console.error('Erro ao buscar documentos:', err);
    }
  };

  // Função para marcar documento como baixado
  const marcarComoBaixado = (id: string) => {
    setDocumentos(docs => 
      docs.map(doc => 
        doc.id === id ? { ...doc, baixado: true } : doc
      )
    );
  };

  // Carrega os documentos quando o perfil muda
  useEffect(() => {
    if (perfil) {
      fetchDocumentos();
    }
  }, [perfil]);

  return {
    documentos,
    isLoading,
    error,
    fetchDocumentos,
    marcarComoBaixado
  };
} 