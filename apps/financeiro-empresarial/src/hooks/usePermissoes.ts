import { useAuth } from './useAuth';
import React, { ReactNode } from 'react';

export type PerfilUsuario = 'admin' | 'financeiro' | 'gestor' | 'atendente' | 'professor' | 'aluno';

export interface Permissao {
  recurso: string;
  acoes: Array<'visualizar' | 'criar' | 'editar' | 'excluir' | 'aprovar'>;
}

// Mapeamento de perfis para permissões
const MAPA_PERMISSOES: Record<PerfilUsuario, Permissao[]> = {
  admin: [
    { recurso: 'dashboard', acoes: ['visualizar'] },
    { recurso: 'cobrancas', acoes: ['visualizar', 'criar', 'editar', 'excluir', 'aprovar'] },
    { recurso: 'recebimentos', acoes: ['visualizar', 'criar', 'editar', 'excluir'] },
    { recurso: 'despesas', acoes: ['visualizar', 'criar', 'editar', 'excluir', 'aprovar'] },
    { recurso: 'taxas', acoes: ['visualizar', 'criar', 'editar', 'excluir'] },
    { recurso: 'relatorios', acoes: ['visualizar'] },
    { recurso: 'configuracoes', acoes: ['visualizar', 'editar'] },
    { recurso: 'gateways', acoes: ['visualizar', 'criar', 'editar', 'excluir'] },
    { recurso: 'usuarios', acoes: ['visualizar', 'criar', 'editar', 'excluir'] }
  ],
  financeiro: [
    { recurso: 'dashboard', acoes: ['visualizar'] },
    { recurso: 'cobrancas', acoes: ['visualizar', 'criar', 'editar', 'aprovar'] },
    { recurso: 'recebimentos', acoes: ['visualizar', 'criar', 'editar'] },
    { recurso: 'despesas', acoes: ['visualizar', 'criar', 'editar', 'aprovar'] },
    { recurso: 'taxas', acoes: ['visualizar', 'criar', 'editar'] },
    { recurso: 'relatorios', acoes: ['visualizar'] },
    { recurso: 'configuracoes', acoes: ['visualizar', 'editar'] },
    { recurso: 'gateways', acoes: ['visualizar', 'editar'] }
  ],
  gestor: [
    { recurso: 'dashboard', acoes: ['visualizar'] },
    { recurso: 'cobrancas', acoes: ['visualizar', 'aprovar'] },
    { recurso: 'recebimentos', acoes: ['visualizar'] },
    { recurso: 'despesas', acoes: ['visualizar', 'aprovar'] },
    { recurso: 'taxas', acoes: ['visualizar'] },
    { recurso: 'relatorios', acoes: ['visualizar'] }
  ],
  atendente: [
    { recurso: 'dashboard', acoes: ['visualizar'] },
    { recurso: 'cobrancas', acoes: ['visualizar', 'criar'] },
    { recurso: 'recebimentos', acoes: ['visualizar'] }
  ],
  professor: [
    { recurso: 'dashboard', acoes: ['visualizar'] }
  ],
  aluno: [
    { recurso: 'dashboard', acoes: ['visualizar'] }
  ]
};

// Tipo para as ações permitidas
export type AcaoPermitida = 'visualizar' | 'criar' | 'editar' | 'excluir' | 'aprovar';

export function usePermissoes() {
  const { user } = useAuth();
  const perfilUsuario = user?.perfil || 'aluno';

  const verificarPermissao = (recurso: string, acao: AcaoPermitida): boolean => {
    // Administradores têm acesso total
    if (perfilUsuario === 'admin') return true;

    // Busca as permissões do perfil do usuário
    const permissoesDoPerfil = MAPA_PERMISSOES[perfilUsuario as PerfilUsuario] || [];
    
    // Verifica se o recurso existe nas permissões
    const permissaoRecurso = permissoesDoPerfil.find(p => p.recurso === recurso);
    
    // Se não encontrar o recurso, não tem permissão
    if (!permissaoRecurso) return false;

    // Verifica se a ação solicitada está nas ações permitidas
    return permissaoRecurso.acoes.includes(acao);
  };

  // Componente para renderização condicional baseada em permissão
  function PermissaoGuard({ 
    recurso, 
    acao, 
    fallback = null, 
    children 
  }: { 
    recurso: string; 
    acao: AcaoPermitida; 
    fallback?: ReactNode; 
    children: ReactNode 
  }) {
    return verificarPermissao(recurso, acao) ? <>{children}</> : <>{fallback}</>;
  }

  return { 
    verificarPermissao,
    PermissaoGuard,
    perfilUsuario
  };
} 