# @edunexia/database-schema

Este pacote contém os tipos TypeScript e enums para o banco de dados da plataforma Edunéxia.

## 📦 Instalação

```bash
yarn add @edunexia/database-schema
```

## 🔧 Uso

```typescript
import { UserRole, AuthProvider, Profile, Institution } from '@edunexia/database-schema';

// Exemplo de uso dos tipos
const profile: Profile = {
    id: '123',
    email: 'user@example.com',
    full_name: 'John Doe',
    avatar_url: null,
    role: UserRole.ALUNO,
    institution_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

// Exemplo de uso dos enums
if (profile.role === UserRole.SUPER_ADMIN) {
    // Lógica para super admin
}
```

## 📚 Tipos Disponíveis

### Interfaces

- `Profile`: Perfil do usuário
- `Institution`: Instituição de ensino
- `UserSession`: Sessão do usuário
- `PasswordReset`: Reset de senha
- `EmailVerification`: Verificação de email
- `Database`: Tipo completo do banco de dados

### Enums

- `UserRole`: Papéis de usuário
  - SUPER_ADMIN
  - ADMIN_INSTITUICAO
  - CONSULTOR_COMERCIAL
  - TUTOR
  - ALUNO

- `AuthProvider`: Provedores de autenticação
  - EMAIL
  - GOOGLE
  - FACEBOOK
  - MICROSOFT
  - APPLE

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
yarn install

# Build
yarn build

# Desenvolvimento com watch mode
yarn dev

# Lint
yarn lint
```

## 📄 Licença

MIT 