/**
 * Hook estendido para autenticação específica de polo
 * Baseia-se no useAuth compartilhado, adicionando funcionalidades específicas
 */

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@edunexia/auth';

// Tipos específicos para polos
interface PoloInfo {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  responsavel: string;
}

export function useAuthPolo() {
  // Usa o hook de autenticação compartilhado
  const auth = useAuth();
  
  // Estado específico para polos
  const [poloId, setPoloId] = useState<string | null>(null);
  const [poloInfo, setPoloInfo] = useState<PoloInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Determinar se o usuário é de um polo
  const isPolo = auth.user?.perfil === 'parceiro';
  const isAdmin = auth.user?.perfil === 'admin';
  
  // Permissão para acessar recursos de polo
  const hasAccess = isPolo || isAdmin;

  // Carregar dados do polo quando o usuário estiver autenticado
  useEffect(() => {
    const carregarDadosPolo = async () => {
      if (!auth.user || !hasAccess) {
        setPoloId(null);
        setPoloInfo(null);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        // Se for um usuário de polo, buscar ID do polo associado
        if (isPolo) {
          // Em um cenário real, buscaria do banco de dados
          // Simulação para desenvolvimento
          const idPolo = auth.user.perfil_detalhes?.polo_id || 'polo-default';
          setPoloId(idPolo);
          
          // Buscar informações detalhadas do polo
          // Simulação para desenvolvimento
          setPoloInfo({
            id: idPolo,
            nome: 'Polo ' + auth.user.nome,
            cidade: 'Cidade Exemplo',
            estado: 'UF',
            responsavel: auth.user.nome
          });
        } else if (isAdmin) {
          // Admins podem acessar qualquer polo, definir um valor padrão ou null
          // dependendo da lógica da aplicação
          setPoloId(null);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do polo:', error);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDadosPolo();
  }, [auth.user, isPolo, isAdmin, hasAccess]);
  
  // Função para selecionar um polo específico (útil para admins)
  const selecionarPolo = useCallback((id: string) => {
    if (isAdmin) {
      setPoloId(id);
      // Aqui buscaria informações do polo selecionado
    }
  }, [isAdmin]);
  
  return {
    // Dados básicos de autenticação
    ...auth,
    
    // Dados específicos de polo
    poloId,
    poloInfo,
    isPolo,
    isAdmin,
    hasAccess,
    
    // Funcionalidades específicas
    selecionarPolo,
    
    // Estado adicional
    loadingPolo: loading
  };
} 