# Documento Técnico: Implementação de Entrada Unificada no Ecossistema Edunexia

## 1. Visão Geral

Este documento descreve o processo de implementação de um sistema de entrada unificada para todos os módulos do ecossistema Edunexia, permitindo que usuários acessem diferentes funcionalidades através de uma autenticação centralizada, com visualização e acesso baseados em suas permissões.

## 2. Arquitetura da Solução

### 2.1 Componentes Principais

- **Portal Unificado**: Página centralizada de seleção de módulos após login
- **AuthProvider**: Sistema de autenticação centralizado (`@edunexia/auth`)
- **PermissionSystem**: Lógica de verificação de permissões para acesso aos módulos
- **Supabase Auth**: Backend de autenticação compartilhado

### 2.2 Hierarquia de Funções (Roles)

O sistema de autenticação da Edunexia utiliza a seguinte hierarquia clara de funções:

```typescript
export type UserRole = 
  | 'super_admin'        // Acesso completo a todas instituições
  | 'institution_admin'  // Administrador de uma instituição específica
  | 'coordinator'        // Coordenador de cursos/áreas
  | 'teacher'            // Professor
  | 'secretary'          // Secretaria acadêmica
  | 'financial'          // Financeiro
  | 'student'            // Aluno
  | 'parent';            // Responsável (para alunos menores)
```

### 2.3 Mapeamento Detalhado de Módulos e Permissões

| Módulo | ID | Rota | Página Principal | Permissão Necessária |
|--------|---------|----------|----------------|-----------------|
| Sistema de Matrículas | matriculas | `/matriculas` | `MatriculasPage.tsx` | `viewEnrollments` |
| Portal do Aluno | aluno | `/portal-do-aluno` | `StudentSpace.tsx` | `viewStudentPortal` |
| Material Didático | material | `/material-didatico` | `ContentEditor.tsx` | `viewMaterials` |
| Comunicação | comunicacao | `/comunicacao` | `CommunicationPage.tsx` | `viewCommunications` |
| Gestão Financeira | financeiro | `/financeiro` | `FinancialPage.tsx` | `viewFinancialData` |
| Relatórios | relatorios | `/relatorios` | `ReportsPage.tsx` | `viewReports` |
| Configurações | configuracoes | `/configuracoes` | `SettingsPage.tsx` | `manageSettings` |

**Estrutura de Permissões:**
```typescript
export interface ModulePermissions {
  // Matrículas
  viewEnrollments?: boolean;
  manageEnrollments?: boolean;
  
  // Comunicação
  viewCommunications?: boolean;
  manageCommunications?: boolean;
  sendBulkMessages?: boolean;
  
  // Material Didático
  viewMaterials?: boolean;
  createMaterials?: boolean;
  editMaterials?: boolean;
  
  // Portal do Aluno
  viewStudentPortal?: boolean;
  
  // Financeiro
  viewFinancialData?: boolean;
  manageFinancialData?: boolean;
  
  // Relatórios
  viewReports?: boolean;
  generateReports?: boolean;
  
  // Configurações
  manageSettings?: boolean;
  manageUsers?: boolean;
  manageRoles?: boolean;
  manageInstitution?: boolean;
}
```

### 2.4 Usuário de Teste

Para facilitar o desenvolvimento e testes, o sistema inclui um usuário de teste com permissões completas:

```typescript
const TEST_USER = {
  email: 'ana.diretoria@edunexia.com',
  password: 'teste123',
  name: 'Ana Diretoria',
  role: 'super_admin' as UserRole,
  permissions: {
    viewEnrollments: true,
    manageEnrollments: true,
    viewCommunications: true,
    manageCommunications: true,
    sendBulkMessages: true,
    viewMaterials: true,
    createMaterials: true,
    editMaterials: true,
    viewStudentPortal: true,
    viewFinancialData: true,
    manageFinancialData: true,
    viewReports: true,
    generateReports: true,
    manageSettings: true,
    manageUsers: true,
    manageRoles: true,
    manageInstitution: true
  },
  preferences: {
    theme: 'light',
    language: 'pt-BR'
  },
  app_metadata: {
    provider: 'email'
  },
  user_metadata: {
    role: 'super_admin'
  },
  aud: 'authenticated',
  created_at: new Date().toISOString()
};
```

**Notas para Desenvolvedores:**
1. O bypass de teste só funciona com as credenciais exatas do usuário de teste
2. O bypass é controlado pela variável de ambiente `ENABLE_TEST_BYPASS`
3. Em produção, o bypass deve ser desabilitado
4. O usuário de teste tem todas as permissões para facilitar o desenvolvimento

## 3. Fluxo Detalhado de Implementação

### 3.1 AuthContext Centralizado

1. **Implementação do Provider de Autenticação**
   ```tsx
   // Em contexts/AuthContext.tsx
   import React, { createContext, useContext, useState, useEffect } from 'react';
   import { supabase } from '../lib/supabaseClient';
   
   // Interface para dados do usuário com permissões
   interface UserData {
     id: string;
     name: string;
     email: string;
     role: UserRole;
     institution_id: string;
     permissions: ModulePermissions;
   }
   
   // Interface para o contexto de autenticação
   interface AuthContextType {
     user: UserData | null;
     isAuthenticated: boolean;
     isLoading: boolean;
     login: (email: string, password: string) => Promise<UserData>;
     logout: () => Promise<void>;
   }
   
   const AuthContext = createContext<AuthContextType | null>(null);
   
   export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
     const [user, setUser] = useState<UserData | null>(null);
     const [isLoading, setIsLoading] = useState(true);
     
     // Verificar sessão ao carregar
     useEffect(() => {
       const checkSession = async () => {
         setIsLoading(true);
         
         const { data: { session } } = await supabase.auth.getSession();
         
         if (session) {
           // Buscar dados completos do usuário incluindo permissões
           const userData = await fetchUserWithPermissions(session.user.id);
           setUser(userData);
         }
         
         setIsLoading(false);
       };
       
       checkSession();
       
       // Configurar listener para mudanças de auth
       const { data: { subscription } } = supabase.auth.onAuthStateChange(
         async (event, session) => {
           if (event === 'SIGNED_IN' && session) {
             const userData = await fetchUserWithPermissions(session.user.id);
             setUser(userData);
           } else if (event === 'SIGNED_OUT') {
             setUser(null);
           }
         }
       );
       
       return () => {
         subscription.unsubscribe();
       };
     }, []);
     
     // Função para fazer login
     const login = async (email: string, password: string): Promise<UserData> => {
       setIsLoading(true);
       
       try {
         const { data, error } = await supabase.auth.signInWithPassword({
           email, password
         });
         
         if (error) throw error;
         
         const userData = await fetchUserWithPermissions(data.user.id);
         setUser(userData);
         
         return userData;
       } finally {
         setIsLoading(false);
       }
     };
     
     // Função para fazer logout
     const logout = async (): Promise<void> => {
       await supabase.auth.signOut();
       setUser(null);
     };
     
     return (
       <AuthContext.Provider value={{ 
         user, 
         isAuthenticated: !!user, 
         isLoading, 
         login, 
         logout 
       }}>
         {children}
       </AuthContext.Provider>
     );
   };
   
   // Hook para usar o contexto
   export const useAuth = () => {
     const context = useContext(AuthContext);
     if (!context) {
       throw new Error('useAuth deve ser usado dentro de um AuthProvider');
     }
     return context;
   };
   ```

2. **Implementação do Sistema de Permissões**
   ```tsx
   // Em hooks/usePermission.tsx
   import { useAuth } from '../contexts/AuthContext';
   
   // Hook para verificar uma permissão específica
   export function usePermission(permission: keyof ModulePermissions): boolean {
     const { user } = useAuth();
     
     if (!user) return false;
     
     // Super admins e admin de instituição têm todas as permissões
     if (user.role === 'super_admin' || user.role === 'institution_admin') {
       return true;
     }
     
     // Verificar permissão específica
     return !!user.permissions[permission];
   }
   
   // Hook para verificar acesso a um módulo
   export function useModuleAccess(moduleId: string): boolean {
     // Mapeamento de módulos para permissões necessárias
     const modulePermissionMap: Record<string, keyof ModulePermissions> = {
       'matriculas': 'viewEnrollments',
       'aluno': 'viewStudentPortal',
       'material': 'viewMaterials',
       'comunicacao': 'viewCommunications',
       'financeiro': 'viewFinancialData'
     };
     
     const requiredPermission = modulePermissionMap[moduleId];
     
     if (!requiredPermission) return false;
     
     return usePermission(requiredPermission);
   }
   ```

3. **Função para buscar usuário com permissões**
   ```typescript
   // Em utils/authHelpers.ts
   async function fetchUserWithPermissions(userId: string): Promise<UserData> {
     // Buscar dados básicos do usuário
     const { data: userData, error } = await supabase
       .from('profiles')
       .select('*')
       .eq('id', userId)
       .single();
     
     if (error) throw error;
     
     // Buscar metadados do usuário no auth
     const { data: authData } = await supabase.auth.admin.getUserById(userId);
     
     // Determinar o papel (role) do usuário
     const role = authData?.user?.user_metadata?.role || 'student';
     
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
       name: userData.name,
       email: userData.email,
       role,
       institution_id: userData.institution_id,
       permissions
     };
   }
   
   // Permissões padrão por papel
   function getDefaultPermissionsForRole(role: UserRole): ModulePermissions {
     switch (role) {
       case 'super_admin':
       case 'institution_admin':
         // Todas as permissões
         return {
           viewEnrollments: true,
           manageEnrollments: true,
           viewCommunications: true,
           manageCommunications: true,
           sendBulkMessages: true,
           viewMaterials: true,
           createMaterials: true,
           editMaterials: true,
           viewStudentPortal: true,
           viewFinancialData: true,
           manageFinancialData: true,
           viewReports: true,
           generateReports: true,
           manageSettings: true,
           manageUsers: true,
           manageRoles: true,
           manageInstitution: true
         };
       case 'coordinator':
         return {
           viewEnrollments: true,
           manageEnrollments: true,
           viewCommunications: true,
           viewMaterials: true,
           createMaterials: true,
           editMaterials: true,
           viewStudentPortal: true
         };
       case 'teacher':
         return {
           viewMaterials: true,
           createMaterials: true,
           editMaterials: true,
           viewStudentPortal: true
         };
       case 'secretary':
         return {
           viewEnrollments: true,
           manageEnrollments: true,
           viewCommunications: true,
           manageCommunications: true,
           sendBulkMessages: true
         };
       case 'financial':
         return {
           viewFinancialData: true,
           manageFinancialData: true
         };
       case 'student':
         return {
           viewStudentPortal: true
         };
       case 'parent':
         return {
           viewStudentPortal: true
         };
       default:
         return {};
     }
   }
   ```

### 3.2 Componentes de Proteção de Rotas

1. **Componente ProtectedRoute para verificação de permissões**
   ```tsx
   // Em components/ProtectedRoute.tsx
   import { useEffect } from 'react';
   import { useNavigate } from 'react-router-dom';
   import { useAuth } from '../contexts/AuthContext';
   import { usePermission } from '../hooks/usePermission';
   
   interface ProtectedRouteProps {
     requiredPermission: keyof ModulePermissions;
     children: React.ReactNode;
   }
   
   const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
     requiredPermission, 
     children 
   }) => {
     const { isAuthenticated, isLoading } = useAuth();
     const hasPermission = usePermission(requiredPermission);
     const navigate = useNavigate();
     
     useEffect(() => {
       if (!isLoading) {
         if (!isAuthenticated) {
           navigate('/login', { replace: true });
         } else if (!hasPermission) {
           navigate('/unauthorized', { replace: true });
         }
       }
     }, [isAuthenticated, hasPermission, isLoading, navigate]);
     
     if (isLoading) {
       return <div className="loading-indicator">Carregando...</div>;
     }
     
     return isAuthenticated && hasPermission ? <>{children}</> : null;
   };
   
   export default ProtectedRoute;
   ```

2. **Componente ModuleRoute para proteção baseada em módulo**
   ```tsx
   // Em components/ModuleRoute.tsx
   import { useModuleAccess } from '../hooks/usePermission';
   import ProtectedRoute from './ProtectedRoute';
   
   interface ModuleRouteProps {
     moduleId: string;
     children: React.ReactNode;
   }
   
   // Mapeamento de módulos para permissões necessárias
   const MODULE_PERMISSION_MAP: Record<string, keyof ModulePermissions> = {
     'matriculas': 'viewEnrollments',
     'aluno': 'viewStudentPortal',
     'material': 'viewMaterials',
     'comunicacao': 'viewCommunications',
     'financeiro': 'viewFinancialData'
   };
   
   const ModuleRoute: React.FC<ModuleRouteProps> = ({ moduleId, children }) => {
     const requiredPermission = MODULE_PERMISSION_MAP[moduleId];
     
     if (!requiredPermission) {
       return <div>Módulo não encontrado</div>;
     }
     
     return (
       <ProtectedRoute requiredPermission={requiredPermission}>
         {children}
       </ProtectedRoute>
     );
   };
   
   export default ModuleRoute;
   ```

### 3.3 Implementação da Página de Seleção de Portais

1. **PortalSelector com Verificação de Permissões**
   ```tsx
   // Em pages/portal-selector/index.tsx
   import { useEffect } from 'react';
   import { Link, useNavigate } from 'react-router-dom';
   import { useAuth } from '../../contexts/AuthContext';
   import { usePermission } from '../../hooks/usePermission';
   
   // Definição dos módulos disponíveis
   const MODULES = [
     {
       id: 'matriculas',
       name: 'Sistema de Matrículas',
       description: 'Gerenciamento de matrículas e processos seletivos',
       route: '/matriculas',
       icon: '/icons/matriculas-icon.svg',
       requiredPermission: 'viewEnrollments'
     },
     {
       id: 'aluno',
       name: 'Portal do Aluno',
       description: 'Acesso a aulas, notas e documentos',
       route: '/portal-do-aluno',
       icon: '/icons/student-icon.svg',
       requiredPermission: 'viewStudentPortal'
     },
     {
       id: 'material',
       name: 'Material Didático',
       description: 'Criação e acesso a conteúdos didáticos',
       route: '/material-didatico',
       icon: '/icons/teacher-icon.svg',
       requiredPermission: 'viewMaterials'
     },
     {
       id: 'comunicacao',
       name: 'Comunicação',
       description: 'Envio de comunicados e notificações',
       route: '/comunicacao',
       icon: '/icons/communication-icon.svg',
       requiredPermission: 'viewCommunications'
     },
     {
       id: 'financeiro',
       name: 'Gestão Financeira',
       description: 'Controle de mensalidades e financeiro',
       route: '/financeiro',
       icon: '/icons/financial-icon.svg',
       requiredPermission: 'viewFinancialData'
     }
   ];
   
   const PortalSelector = () => {
     const { user, isAuthenticated, isLoading } = useAuth();
     const navigate = useNavigate();
     
     // Redirecionar para login se não estiver autenticado
     useEffect(() => {
       if (!isLoading && !isAuthenticated) {
         navigate('/login');
       }
     }, [isAuthenticated, isLoading, navigate]);
     
     // Para cada módulo, usar o hook usePermission para verificar acesso
     const availableModules = MODULES.filter(module => {
       // Hook customizado que verifica permissão
       const hasPermission = usePermission(module.requiredPermission);
       return hasPermission;
     });
     
     if (isLoading) {
       return <div className="loading">Carregando...</div>;
     }
     
     return (
       <div className="portal-selector-page">
         <div className="header">
           <h1>Selecione seu Portal</h1>
           <p className="welcome-message">
             Bem-vindo(a), {user?.name || 'Usuário'}
           </p>
         </div>
         
         <div className="modules-grid">
           {availableModules.map(module => (
             <Link
               key={module.id}
               to={module.route}
               className="module-card"
             >
               <div className="module-icon">
                 <img src={module.icon} alt={module.name} />
               </div>
               <div className="module-info">
                 <h2>{module.name}</h2>
                 <p>{module.description}</p>
               </div>
             </Link>
           ))}
         </div>
         
         {availableModules.length === 0 && (
           <div className="no-modules-message">
             <p>Você não tem acesso a nenhum módulo.</p>
             <p>Entre em contato com o administrador do sistema.</p>
           </div>
         )}
       </div>
     );
   };
   
   export default PortalSelector;
   ```

### 3.4 Configuração de Rotas

```tsx
// Em App.tsx ou router.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/login';
import PortalSelector from './pages/portal-selector';
import Unauthorized from './pages/unauthorized';
import ModuleRoute from './components/ModuleRoute';

// Importações de páginas dos módulos
import MatriculasPage from './pages/matriculas';
import StudentPortal from './pages/aluno';
import MaterialDidatico from './pages/material';
import Comunicacao from './pages/comunicacao';
import Financeiro from './pages/financeiro';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Rota do seletor de portais - requer autenticação */}
          <Route 
            path="/portal-selector" 
            element={
              <ProtectedRoute requiredPermission={null}>
                <PortalSelector />
              </ProtectedRoute>
            } 
          />
          
          {/* Rotas protegidas para cada módulo */}
          <Route 
            path="/matriculas/*" 
            element={
              <ModuleRoute moduleId="matriculas">
                <MatriculasPage />
              </ModuleRoute>
            } 
          />
          
          <Route 
            path="/portal-do-aluno/*" 
            element={
              <ModuleRoute moduleId="aluno">
                <StudentPortal />
              </ModuleRoute>
            } 
          />
          
          <Route 
            path="/material-didatico/*" 
            element={
              <ModuleRoute moduleId="material">
                <MaterialDidatico />
              </ModuleRoute>
            } 
          />
          
          <Route 
            path="/comunicacao/*" 
            element={
              <ModuleRoute moduleId="comunicacao">
                <Comunicacao />
              </ModuleRoute>
            } 
          />
          
          <Route 
            path="/financeiro/*" 
            element={
              <ModuleRoute moduleId="financeiro">
                <Financeiro />
              </ModuleRoute>
            } 
          />
          
          {/* Redirecionamento da raiz para o login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rota para URLs não encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
```

## 4. Benefícios da Nova Abordagem

A abordagem atualizada traz diversos benefícios:

1. **Sistema de Permissões Centralizado**
   - Roles hierárquicos com permissões específicas
   - Verificação em um único lugar através de hooks especializados
   - Possibilidade de personalização por usuário além dos padrões por função

2. **Simplificação Arquitetural**
   - Sistema único em vez de múltiplos portais
   - Sem necessidade de compartilhar cookies entre subdomínios
   - Modelo claro de proteção de rotas

3. **Experiência de Usuário Melhorada**
   - Interface unificada e intuitiva
   - Visualização personalizada baseada em permissões reais
   - Feedback claro quando acesso é negado

4. **Segurança Aprimorada**
   - Separação clara entre autenticação e autorização
   - Permissões granulares por funcionalidade
   - Auditoria centralizada de acessos

5. **Facilidade de Manutenção**
   - Estrutura modular e extensível
   - Fácil adição de novos módulos ou permissões
   - Centralização da lógica de permissões

## 5. Implementação Técnica Detalhada

### 5.1 Componentes e Arquivos Principais

| Arquivo | Responsabilidade |
|---------|------------------|
| `contexts/AuthContext.tsx` | Gerenciamento centralizado de autenticação |
| `hooks/usePermission.tsx` | Hooks para verificação de permissões |
| `utils/authHelpers.ts` | Funções auxiliares para autenticação e permissões |
| `components/ProtectedRoute.tsx` | Proteção de rotas baseada em permissões |
| `components/ModuleRoute.tsx` | Proteção específica para módulos |
| `pages/portal-selector/index.tsx` | Interface de seleção de módulos |
| `pages/unauthorized/index.tsx` | Página de acesso não autorizado |

### 5.2 Modelo de Dados

**Tabelas do Banco de Dados:**

1. **profiles** - Informações de perfil do usuário
   - id (PK, referência para auth.users)
   - name
   - email
   - institution_id (FK para institutions)
   - created_at
   - updated_at

2. **user_permissions** - Permissões personalizadas por usuário
   - id (PK)
   - user_id (FK para auth.users)
   - permissions (JSONB - contém objeto ModulePermissions)
   - created_at
   - updated_at

3. **institutions** - Instituições no sistema
   - id (PK)
   - name
   - domain
   - settings
   - active
   - created_at
   - updated_at

### 5.3 Fluxo de Usuário

1. **Login**:
   - Usuário acessa `/login`
   - Insere credenciais válidas
   - Sistema busca dados do usuário e suas permissões
   - Usuário é redirecionado para `/portal-selector`

2. **Seleção de Módulo**:
   - Sistema verifica permissões do usuário
   - Usuário visualiza apenas os módulos para os quais tem permissão
   - Seleciona um módulo clicando no respectivo card
   - É redirecionado para a rota do módulo selecionado

3. **Navegação Entre Módulos**:
   - A qualquer momento, pode retornar ao `/portal-selector`
   - Pode navegar diretamente entre módulos para os quais tem permissão
   - Tentativas de acesso a módulos sem permissão são bloqueadas

4. **Acesso Não Autorizado**:
   - Se tentar acessar um módulo sem permissão, é redirecionado para `/unauthorized`
   - Visualiza mensagem clara sobre o motivo da restrição
   - Pode visualizar lista de módulos para os quais tem permissão
   - Pode retornar ao portal selector

## 6. Considerações de Implantação

1. **Migração**
   - Planejar migração do sistema atual para o novo modelo de permissões
   - Criar scripts para transferir roles existentes para o novo formato
   - Estabelecer período de transição com ambos sistemas funcionando

2. **Implantação**
   - Implementar em ambiente de desenvolvimento para testes iniciais
   - Migrar gradualmente para staging e validar com usuários reais
   - Preparar documentação e treinamento para administradores

3. **Monitoramento**
   - Implementar logging de verificações de permissão
   - Monitorar tentativas de acesso não autorizado
   - Coletar feedback dos usuários sobre a nova interface

Esta nova abordagem simplifica significativamente a infraestrutura e a experiência do usuário, enquanto oferece um modelo de permissões mais robusto, granular e fácil de manter para o ecossistema Edunexia.

## 7. Casos de Uso e Papéis Funcionais Específicos

### 7.1 Papéis Funcionais Adicionais

Além dos papéis hierárquicos principais, o sistema pode incorporar papéis funcionais específicos:

```typescript
export type FunctionalRole = 
  | 'web_designer'        // Designer com permissões limitadas para o site
  | 'marketing_manager'   // Especialista em marketing e promoções
  | 'community_manager'   // Moderador de espaços comunitários
  | 'instructor_assistant' // Auxiliar com acesso limitado a cursos
  | 'support_agent';      // Agente de suporte ao cliente
```

### 7.2 Permissões Expandidas

O sistema de permissões pode ser expandido para cobrir mais áreas funcionais:

```typescript
export interface ExtendedModulePermissions extends ModulePermissions {
  // Site e Design
  viewSite?: boolean;
  editSiteDesign?: boolean;
  editSiteContent?: boolean;
  
  // Marketing e Promoções
  viewMarketing?: boolean;
  managePromotions?: boolean;
  manageLeadCapture?: boolean;
  viewAnalytics?: boolean;
  
  // Comunidade
  viewCommunity?: boolean;
  manageCommunitySpaces?: boolean;
  moderatePosts?: boolean;
  
  // Integrações
  configureIntegrations?: boolean;
  manageAPIs?: boolean;
}
```

### 7.3 Auto-seleção de Permissões Relacionadas

Para permissões que são dependentes, o sistema pode implementar uma lógica de auto-seleção:

```typescript
// Em utils/permissionHelpers.ts
export function getRelatedPermissions(permission: keyof ExtendedModulePermissions): Array<keyof ExtendedModulePermissions> {
  const permissionMap: Record<keyof ExtendedModulePermissions, Array<keyof ExtendedModulePermissions>> = {
    'manageEnrollments': ['viewEnrollments'],
    'manageCommunications': ['viewCommunications'],
    'createMaterials': ['viewMaterials'],
    'editMaterials': ['viewMaterials'],
    'manageFinancialData': ['viewFinancialData'],
    'manageCommunitySpaces': ['viewCommunity'],
    'moderatePosts': ['viewCommunity'],
    'managePromotions': ['viewMarketing'],
    'editSiteDesign': ['viewSite'],
    'editSiteContent': ['viewSite'],
    // outras relações...
  };
  
  return permissionMap[permission] || [];
}

// Função para aplicar permissões relacionadas automaticamente
export function applyRelatedPermissions(permissions: ExtendedModulePermissions): ExtendedModulePermissions {
  const updatedPermissions = { ...permissions };
  
  // Para cada permissão ativa, adicionar suas permissões relacionadas
  Object.keys(permissions).forEach(key => {
    const permissionKey = key as keyof ExtendedModulePermissions;
    if (permissions[permissionKey]) {
      const relatedPermissions = getRelatedPermissions(permissionKey);
      relatedPermissions.forEach(relatedKey => {
        updatedPermissions[relatedKey] = true;
      });
    }
  });
  
  return updatedPermissions;
}
```

### 7.4 Casos de Uso de Permissões

#### 7.4.1 Delegação de Design do Site
**Cenário**: Atribuir a função de "Designer de Website" a um freelancer para que ele possa atualizar o site sem acessar o conteúdo dos cursos ou configurações financeiras.

**Implementação**:
```typescript
const webDesignerPermissions: ExtendedModulePermissions = {
  viewSite: true,
  editSiteDesign: true,
  editSiteContent: true,
  // Sem acesso a outros módulos/funcionalidades
};
```

#### 7.4.2 Gestão Financeira
**Cenário**: Conceder a função de "Gerente Financeiro" ao contador para que ele possa gerenciar vendas e assinaturas de forma segura.

**Implementação**:
```typescript
const financialManagerPermissions: ExtendedModulePermissions = {
  viewFinancialData: true,
  manageFinancialData: true,
  // Acesso limitado aos dados financeiros
};
```

#### 7.4.3 Marketing Eficiente
**Cenário**: Habilitar a função de "Marketer" para um membro da equipe focado em estratégias promocionais e análises.

**Implementação**:
```typescript
const marketingManagerPermissions: ExtendedModulePermissions = {
  viewMarketing: true,
  managePromotions: true,
  manageLeadCapture: true,
  viewAnalytics: true,
  // Acesso focado em marketing
};
```

#### 7.4.4 Gerenciamento de Cursos
**Cenário**: Atribuir funções de "Instrutor" ou "Instrutor Assistente" para gerenciar a criação de cursos ou auxiliar na avaliação.

**Implementação**:
```typescript
const instructorPermissions: ExtendedModulePermissions = {
  viewMaterials: true,
  createMaterials: true,
  editMaterials: true,
  viewEnrollments: true,
  // Permissões completas de instrutor
};

const assistantInstructorPermissions: ExtendedModulePermissions = {
  viewMaterials: true,
  viewEnrollments: true,
  // Permissões limitadas para auxiliar
};
```

#### 7.4.5 Construção de Comunidade
**Cenário**: Empoderar um "Gerente de Comunidade" para organizar e moderar os espaços comunitários da plataforma.

**Implementação**:
```typescript
const communityManagerPermissions: ExtendedModulePermissions = {
  viewCommunity: true,
  manageCommunitySpaces: true,
  moderatePosts: true,
  // Foco na gestão comunitária
};
```

### 7.5 Tabelas de Banco de Dados Adicionais

Para suportar estes casos de uso, podemos adicionar estas tabelas ao modelo de dados:

1. **permission_templates** - Modelos predefinidos de conjuntos de permissões
   - id (PK)
   - name (nome descritivo do template, ex: "Web Designer", "Gerente Financeiro")
   - description (descrição das responsabilidades)
   - permissions (JSONB - objeto com as permissões)
   - created_by (FK para auth.users)
   - created_at
   - updated_at

2. **functional_roles** - Definição dos papéis funcionais
   - id (PK)
   - name (nome do papel funcional)
   - code (identificador interno, ex: "web_designer")
   - template_id (FK para permission_templates)
   - created_at
   - updated_at

3. **user_functional_roles** - Atribuição de papéis funcionais a usuários
   - id (PK)
   - user_id (FK para auth.users)
   - functional_role_id (FK para functional_roles)
   - created_at
   - updated_at

### 7.6 Interface de Gerenciamento de Permissões

Para facilitar a administração das permissões, uma interface administrativa pode ser implementada:

```tsx
// Em pages/admin/user-permissions/index.tsx
const PermissionManager: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<ExtendedModulePermissions>({});
  const [templates, setTemplates] = useState<PermissionTemplate[]>([]);
  
  // Carregar templates e permissões do usuário
  useEffect(() => {
    if (selectedUser) {
      fetchUserPermissions(selectedUser).then(setPermissions);
    }
    fetchPermissionTemplates().then(setTemplates);
  }, [selectedUser]);
  
  // Aplicar um template de permissões
  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template && selectedUser) {
      // Aplicar permissões do template, mantendo permissões customizadas
      const newPermissions = {
        ...permissions,
        ...template.permissions
      };
      
      // Aplicar permissões relacionadas automaticamente
      const fullPermissions = applyRelatedPermissions(newPermissions);
      
      setPermissions(fullPermissions);
      saveUserPermissions(selectedUser, fullPermissions);
    }
  };
  
  // Alterar uma permissão específica
  const togglePermission = (key: keyof ExtendedModulePermissions) => {
    if (!selectedUser) return;
    
    const newPermissions = { 
      ...permissions,
      [key]: !permissions[key]
    };
    
    // Aplicar permissões relacionadas automaticamente
    const fullPermissions = applyRelatedPermissions(newPermissions);
    
    setPermissions(fullPermissions);
    saveUserPermissions(selectedUser, fullPermissions);
  };
  
  return (
    <div className="permission-manager">
      <h1>Gerenciamento de Permissões</h1>
      
      <UserSelector
        onSelectUser={setSelectedUser}
        selectedUser={selectedUser}
      />
      
      {selectedUser && (
        <>
          <PermissionTemplateSelector
            templates={templates}
            onApplyTemplate={applyTemplate}
          />
          
          <PermissionGrid
            permissions={permissions}
            onTogglePermission={togglePermission}
          />
          
          <div className="actions">
            <button 
              className="reset-button"
              onClick={() => fetchUserPermissions(selectedUser).then(setPermissions)}
            >
              Resetar Alterações
            </button>
          </div>
        </>
      )}
    </div>
  );
};
```

## 8. Conclusão

O sistema de permissões refinado da Edunexia oferece uma solução abrangente e flexível para o controle de acesso em toda a plataforma educacional. Com a capacidade de atribuir permissões granulares, criar papéis funcionais específicos e automatizar relações entre permissões, a plataforma pode atender a diversos modelos de operação e necessidades organizacionais.

A interface de gerenciamento intuitiva permite que administradores criem configurações de acesso adaptadas às funções específicas dentro da instituição, facilitando a colaboração segura entre membros da equipe com diferentes responsabilidades.

Este modelo equilibra segurança, flexibilidade e facilidade de uso, permitindo que instituições educacionais administrem seu ecossistema digital de maneira eficaz e controlada. 