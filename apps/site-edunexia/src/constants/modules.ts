import { ModulePermissions } from '@edunexia/auth';

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  requiredPermission: keyof ModulePermissions;
}

export const MODULES: ModuleConfig[] = [
  {
    id: 'matriculas',
    name: 'Sistema de Matrículas',
    description: 'Gerenciamento de matrículas e processos seletivos',
    route: '/matriculas',
    icon: '/icons/matriculas-icon.svg',
    requiredPermission: 'matriculas'
  },
  {
    id: 'portal-aluno',
    name: 'Portal do Aluno',
    description: 'Acesso a aulas, notas e documentos',
    route: '/portal-aluno',
    icon: '/icons/student-icon.svg',
    requiredPermission: 'portal_aluno'
  },
  {
    id: 'material-didatico',
    name: 'Material Didático',
    description: 'Criação e acesso a conteúdos didáticos',
    route: '/material-didatico',
    icon: '/icons/teacher-icon.svg',
    requiredPermission: 'material_didatico'
  },
  {
    id: 'comunicacao',
    name: 'Comunicação',
    description: 'Envio de comunicados e notificações',
    route: '/comunicacao',
    icon: '/icons/communication-icon.svg',
    requiredPermission: 'comunicacao'
  },
  {
    id: 'financeiro',
    name: 'Gestão Financeira',
    description: 'Controle de mensalidades e financeiro',
    route: '/financeiro',
    icon: '/icons/financial-icon.svg',
    requiredPermission: 'financeiro'
  },
  {
    id: 'relatorios',
    name: 'Relatórios',
    description: 'Geração e visualização de relatórios',
    route: '/relatorios',
    icon: '/icons/reports-icon.svg',
    requiredPermission: 'relatorios'
  },
  {
    id: 'configuracoes',
    name: 'Configurações',
    description: 'Configurações do sistema',
    route: '/configuracoes',
    icon: '/icons/settings-icon.svg',
    requiredPermission: 'configuracoes'
  }
]; 