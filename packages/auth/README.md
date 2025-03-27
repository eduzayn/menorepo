# @edunexia/auth

Pacote de autenticação unificado para todos os módulos da plataforma Edunéxia. Gerencia sessão de usuários, permissões e perfis.

## Instalação

```bash
# O pacote é instalado automaticamente através das dependências do monorepo
```

## Uso Básico

```tsx
// Em main.tsx do módulo
import { AuthProvider } from '@edunexia/auth';
import { ApiProvider } from '@edunexia/api-client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApiProvider
      supabaseUrl={import.meta.env.VITE_SUPABASE_URL}
      supabaseKey={import.meta.env.VITE_SUPABASE_ANON_KEY}
    >
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ApiProvider>
  </React.StrictMode>
);

// Em componentes e páginas
import { useAuth } from '@edunexia/auth';

function MeuComponente() {
  const { 
    user,
    loading,
    error,
    isAuthenticated,
    signIn,
    signOut,
    hasRole
  } = useAuth();
  
  // Verificar autenticação
  if (loading) return <div>Carregando...</div>;
  if (!isAuthenticated) return <div>Não autenticado</div>;
  
  // Verificar papel de usuário
  if (!hasRole('professor')) return <div>Acesso negado</div>;
  
  return (
    <div>
      <h1>Bem-vindo, {user?.nome}!</h1>
      <button onClick={() => signOut()}>Sair</button>
    </div>
  );
}
```

## Componentes e Hooks

### `AuthProvider`

Provider que disponibiliza o contexto de autenticação para toda a aplicação.

```tsx
<AuthProvider>
  {children}
</AuthProvider>
```

### `useAuth`

Hook principal para acessar o estado e funções de autenticação.

```tsx
const { 
  // Estado
  user,                 // Usuário autenticado ou null
  session,              // Sessão atual ou null
  loading,              // Estado de carregamento
  error,                // Erro, se houver
  isAuthenticated,      // Boolean indicando se há usuário autenticado
  
  // Ações
  signIn,               // Função para login
  signOut,              // Função para logout
  
  // Verificação de permissões
  hasPermission,        // Verifica permissão específica
  hasRole,              // Verifica papel do usuário
  
  // Perfil
  updateProfile         // Atualiza dados do usuário
} = useAuth();
```

## Migração de Módulos Existentes

Para migrar módulos que usam autenticação local:

1. Remova arquivos e contextos de autenticação locais
2. Adicione `AuthProvider` no arquivo `main.tsx` ou raiz da aplicação
3. Substitua hooks ou funções de autenticação locais pelo `useAuth`
4. Atualize componentes para usar as propriedades do novo hook

## Tipos Exportados

- `User`: Interface de usuário autenticado
- `UserSession`: Dados da sessão
- `AuthCredentials`: Credenciais para login
- `UserRole`: Tipos de papéis de usuário 