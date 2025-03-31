<!-- cSpell:disable -->
# Pacote de Autenticação Edunéxia

Este pacote fornece uma solução completa de autenticação para o ecossistema Edunéxia, integrando-se com o Supabase para gerenciamento de usuários e permissões.

## Características

- Autenticação unificada para todos os módulos
- Sistema de permissões baseado em papéis (RBAC)
- Suporte a papéis funcionais dinâmicos
- Gerenciamento de preferências do usuário
- Cache de permissões
- Sistema de auditoria
- Integração com Supabase

## Instalação

```bash
yarn add @edunexia/auth
```

## Configuração

1. Configure as variáveis de ambiente do Supabase:

```env
SUPABASE_URL=sua-url-do-supabase
SUPABASE_ANON_KEY=sua-chave-anonima
```

2. Adicione o AuthProvider ao seu aplicativo:

```tsx
import { AuthProvider } from '@edunexia/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

function App() {
  return (
    <AuthProvider supabaseClient={supabase}>
      {/* Seus componentes aqui */}
    </AuthProvider>
  );
}
```

## Uso

### Hook de Autenticação

```tsx
import { useAuth } from '@edunexia/auth';

function LoginComponent() {
  const { signIn, signUp, signOut, user, loading, error } = useAuth();

  const handleLogin = async () => {
    try {
      const { user, session, error } = await signIn({
        email: 'usuario@exemplo.com',
        password: 'senha123'
      });

      if (error) {
        console.error('Erro no login:', error);
        return;
      }

      console.log('Usuário logado:', user);
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  return (
    // Seu componente de login
  );
}
```

### Verificação de Permissões

```tsx
import { usePermission } from '@edunexia/auth';

function ProtectedComponent() {
  const canReadMatriculas = usePermission('matriculas', 'read');
  const canWriteMatriculas = usePermission('matriculas', 'write');

  if (!canReadMatriculas) {
    return <div>Acesso negado</div>;
  }

  return (
    <div>
      {canWriteMatriculas && <button>Nova Matrícula</button>}
      {/* Conteúdo protegido */}
    </div>
  );
}
```

### Atualização de Perfil

```tsx
function ProfileComponent() {
  const { updateProfile, updatePreferences } = useAuth();

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = await updateProfile({
        name: 'Novo Nome'
      });
      console.log('Perfil atualizado:', updatedUser);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      const updatedUser = await updatePreferences({
        theme: 'dark',
        language: 'pt-BR',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      });
      console.log('Preferências atualizadas:', updatedUser);
    } catch (err) {
      console.error('Erro ao atualizar preferências:', err);
    }
  };

  return (
    // Seu componente de perfil
  );
}
```

## Estrutura de Permissões

### Papéis Disponíveis

```typescript
type RoleLevel = 
  | 'super_admin'        // Acesso completo
  | 'institution_admin'  // Admin de instituição
  | 'coordinator'        // Coordenador
  | 'teacher'           // Professor
  | 'secretary'         // Secretaria
  | 'financial'         // Financeiro
  | 'student'           // Aluno
  | 'parent';           // Responsável
```

### Módulos e Permissões

```typescript
interface ModulePermissions {
  matriculas: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  comunicacao: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  // ... outros módulos
}
```

## Cache de Permissões

O sistema implementa um cache de permissões para melhorar a performance:

1. As permissões são armazenadas em memória após o login
2. O cache é atualizado quando:
   - O usuário faz login
   - As permissões são modificadas
   - O usuário faz logout
3. O cache é limpo automaticamente após 1 hora

## Sistema de Auditoria

O sistema registra eventos importantes:

1. **Eventos de Autenticação**
   - Login bem-sucedido
   - Login falhou
   - Logout
   - Cadastro de usuário

2. **Eventos de Permissões**
   - Alteração de papéis
   - Modificação de permissões
   - Acesso negado

3. **Eventos de Perfil**
   - Atualização de dados
   - Modificação de preferências

## Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Testes

```bash
# Executar testes unitários
yarn test

# Executar testes de integração
yarn test:integration

# Executar todos os testes
yarn test:all
```

## Licença

MIT
