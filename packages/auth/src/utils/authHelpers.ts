import { supabase } from '../lib/supabaseClient';
import type { User, ModulePermission } from '../types';

/**
 * Busca os dados completos do usuário incluindo suas permissões
 * @param userId ID do usuário
 * @returns Dados completos do usuário
 */
export async function fetchUserWithPermissions(userId: string): Promise<User> {
  // Buscar dados básicos do usuário
  const { data: userData, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  
  // Buscar metadados do usuário no auth
  const { data: authData } = await supabase.auth.admin.getUserById(userId);
  
  if (!authData?.user) {
    throw new Error('Usuário não encontrado');
  }
  
  // Determinar o papel (role) do usuário
  const role = authData.user.user_metadata?.role || 'student';
  
  // Obter permissões baseadas no papel do usuário
  let permissions = getDefaultPermissionsForRole(role);
  
  // Buscar permissões personalizadas do usuário
  const { data: customPermissions } = await supabase
    .from('user_permissions')
    .select('permissions')
    .eq('user_id', userId)
    .single();
  
  if (customPermissions) {
    // Sobrescrever com permissões personalizadas
    permissions = {
      ...permissions,
      ...customPermissions.permissions
    };
  }
  
  return {
    id: userId,
    email: userData.email,
    name: userData.name,
    role,
    permissions: Object.entries(permissions)
      .filter(([_, value]) => value === true)
      .map(([key]) => key as ModulePermission),
    app_metadata: authData.user.app_metadata || {},
    user_metadata: authData.user.user_metadata || {},
    aud: authData.user.aud || 'authenticated',
    created_at: authData.user.created_at
  };
}

/**
 * Retorna as permissões padrão para cada papel (role)
 * @param role Papel do usuário
 * @returns Objeto com as permissões padrão
 */
function getDefaultPermissionsForRole(role: string): Record<ModulePermission, boolean> {
  const defaultPermissions: Record<ModulePermission, boolean> = {
    // Matrículas
    'matriculas.view': false,
    'matriculas.manage': false,
    'matriculas.delete': false,
    
    // Portal do Aluno
    'portal-aluno.view': false,
    'portal-aluno.manage': false,
    
    // Material Didático
    'material-didatico.view': false,
    'material-didatico.create': false,
    'material-didatico.edit': false,
    'material-didatico.delete': false,
    
    // Comunicação
    'comunicacao.view': false,
    'comunicacao.manage': false,
    'comunicacao.delete': false,
    
    // Financeiro
    'financeiro.view': false,
    'financeiro.manage': false,
    'financeiro.delete': false,
    
    // Relatórios
    'relatorios.view': false,
    'relatorios.generate': false,
    
    // Configurações
    'configuracoes.view': false,
    'configuracoes.manage': false
  };

  switch (role) {
    case 'super_admin':
      // Todas as permissões
      Object.keys(defaultPermissions).forEach(key => {
        defaultPermissions[key as ModulePermission] = true;
      });
      break;

    case 'institution_admin':
      // Acesso administrativo à instituição
      defaultPermissions['matriculas.view'] = true;
      defaultPermissions['matriculas.manage'] = true;
      defaultPermissions['portal-aluno.view'] = true;
      defaultPermissions['portal-aluno.manage'] = true;
      defaultPermissions['material-didatico.view'] = true;
      defaultPermissions['material-didatico.create'] = true;
      defaultPermissions['material-didatico.edit'] = true;
      defaultPermissions['comunicacao.view'] = true;
      defaultPermissions['comunicacao.manage'] = true;
      defaultPermissions['financeiro.view'] = true;
      defaultPermissions['financeiro.manage'] = true;
      defaultPermissions['relatorios.view'] = true;
      defaultPermissions['relatorios.generate'] = true;
      defaultPermissions['configuracoes.view'] = true;
      defaultPermissions['configuracoes.manage'] = true;
      break;

    case 'coordinator':
      // Acesso de coordenador
      defaultPermissions['matriculas.view'] = true;
      defaultPermissions['matriculas.manage'] = true;
      defaultPermissions['portal-aluno.view'] = true;
      defaultPermissions['material-didatico.view'] = true;
      defaultPermissions['material-didatico.create'] = true;
      defaultPermissions['material-didatico.edit'] = true;
      defaultPermissions['comunicacao.view'] = true;
      defaultPermissions['comunicacao.manage'] = true;
      defaultPermissions['relatorios.view'] = true;
      break;

    case 'teacher':
      // Acesso de professor
      defaultPermissions['material-didatico.view'] = true;
      defaultPermissions['material-didatico.create'] = true;
      defaultPermissions['material-didatico.edit'] = true;
      defaultPermissions['portal-aluno.view'] = true;
      defaultPermissions['comunicacao.view'] = true;
      defaultPermissions['comunicacao.manage'] = true;
      break;

    case 'secretary':
      // Acesso de secretaria
      defaultPermissions['matriculas.view'] = true;
      defaultPermissions['matriculas.manage'] = true;
      defaultPermissions['comunicacao.view'] = true;
      defaultPermissions['comunicacao.manage'] = true;
      defaultPermissions['relatorios.view'] = true;
      break;

    case 'financial':
      // Acesso financeiro
      defaultPermissions['financeiro.view'] = true;
      defaultPermissions['financeiro.manage'] = true;
      defaultPermissions['relatorios.view'] = true;
      break;

    case 'student':
      // Acesso de aluno
      defaultPermissions['portal-aluno.view'] = true;
      defaultPermissions['material-didatico.view'] = true;
      break;

    case 'parent':
      // Acesso de responsável
      defaultPermissions['portal-aluno.view'] = true;
      break;
  }

  return defaultPermissions;
} 