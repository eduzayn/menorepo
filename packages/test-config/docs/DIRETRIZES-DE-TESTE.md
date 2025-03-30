# Diretrizes de Teste - Projeto Edunéxia

Este documento estabelece as diretrizes, padrões e melhores práticas para a escrita e manutenção de testes em todos os módulos da plataforma Edunéxia.

## Índice

1. [Introdução](#introdução)
2. [Ferramentas e Configuração](#ferramentas-e-configuração)
3. [Estrutura de Testes](#estrutura-de-testes)
4. [Tipos de Testes](#tipos-de-testes)
5. [Melhores Práticas](#melhores-práticas)
6. [Mocks e Fixtures](#mocks-e-fixtures)
7. [Cobertura de Código](#cobertura-de-código)
8. [Integração Contínua](#integração-contínua)
9. [Solução de Problemas Comuns](#solução-de-problemas-comuns)

## Introdução

O projeto Edunéxia adota uma abordagem de testes abrangente, visando garantir a qualidade e estabilidade de todos os módulos. Seguimos a filosofia de "testar comportamentos, não implementações", focando em como os componentes e funções se comportam do ponto de vista do usuário ou consumidor.

## Ferramentas e Configuração

### Vitest

O Vitest é a ferramenta principal de teste para todos os módulos React do projeto. Ele oferece velocidade, compatibilidade com TypeScript e integração com o ecossistema Vite.

Para configurar o Vitest em um módulo:

```ts
// vitest.config.ts
import { createVitestConfig } from '@edunexia/test-config';

export default createVitestConfig();
```

### Jest (Alternativa)

Para módulos específicos que necessitam do Jest:

```js
// jest.config.js
const { createJestConfig } = require('@edunexia/test-config');

module.exports = createJestConfig();
```

### Bibliotecas de Teste

- **Testing Library**: Para testes de componentes React
- **MSW (Mock Service Worker)**: Para mocks de API
- **Cypress**: Para testes end-to-end

## Estrutura de Testes

Os testes devem seguir uma estrutura consistente:

```
/src
  /components
    /Button
      Button.tsx
      Button.test.tsx  // Testes unitários junto do componente
  /hooks
    /useAuth
      useAuth.ts
      useAuth.test.ts  // Testes unitários junto do hook
  /pages
    Home.tsx
    Home.test.tsx      // Testes do componente da página
  /services
    api.ts
    api.test.ts        // Testes de serviços
  /__tests__           // Testes de integração ou testes complexos
    integration.test.tsx
```

## Tipos de Testes

### Testes Unitários

Testam unidades isoladas de código (componentes, hooks, funções):

```tsx
import { render, screen } from '@edunexia/test-config';
import { Button } from './Button';

describe('Button', () => {
  it('deve renderizar com o texto correto', () => {
    render(<Button>Clique</Button>);
    expect(screen.getByText('Clique')).toBeInTheDocument();
  });

  it('deve chamar onClick quando clicado', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clique</Button>);
    screen.getByText('Clique').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testes de Integração

Verificam a interação entre múltiplos componentes:

```tsx
import { render, screen, userEvent } from '@edunexia/test-config';
import { AuthProvider } from '../contexts/AuthContext';
import { LoginForm } from './LoginForm';

describe('Integração: Login', () => {
  it('deve autenticar o usuário e redirecionar', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    
    await userEvent.type(screen.getByLabelText('Email'), 'usuario@exemplo.com');
    await userEvent.type(screen.getByLabelText('Senha'), 'senha123');
    await userEvent.click(screen.getByText('Entrar'));
    
    // Verificar redirecionamento ou estado de autenticação
    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
  });
});
```

### Testes de Hooks

Para hooks personalizados:

```tsx
import { renderHook, act } from '@edunexia/test-config';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('deve incrementar o contador', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### Testes de API

```tsx
import { vi } from 'vitest';
import { setupApiMock } from '@edunexia/test-config';
import { fetchUserData } from './api';

describe('API', () => {
  const apiMock = setupApiMock();
  
  it('deve buscar os dados do usuário corretamente', async () => {
    apiMock.onGet('/users/1').reply(200, { id: 1, name: 'João' });
    
    const userData = await fetchUserData(1);
    
    expect(userData).toEqual({ id: 1, name: 'João' });
  });
});
```

## Melhores Práticas

### Nomeação de Testes

Siga o padrão "deve fazer algo quando algo acontece":

```tsx
// Bom
it('deve mostrar mensagem de erro quando a senha é inválida', () => {});

// Evitar
it('senha inválida', () => {});
```

### Organização com `describe` e `it`

```tsx
describe('LoginForm', () => {
  describe('validação', () => {
    it('deve validar o email', () => {});
    it('deve validar a senha', () => {});
  });
  
  describe('submissão', () => {
    it('deve enviar os dados para a API', () => {});
    it('deve mostrar erro quando a API falha', () => {});
  });
});
```

### Evite Testes Acoplados

Cada teste deve ser independente, podendo ser executado isoladamente sem depender do estado de outros testes.

### Priorize Seletores Acessíveis

Siga esta ordem de preferência:
1. `getByRole` (acessibilidade)
2. `getByLabelText` (formulários)
3. `getByText` (conteúdo visível)
4. `getByTestId` (último recurso)

```tsx
// Melhor (acessível)
screen.getByRole('button', { name: 'Enviar' });

// Evitar (frágil)
screen.getByTestId('submit-button');
```

### Teste de Assincronicidade

```tsx
it('deve carregar dados assíncronos', async () => {
  render(<MeuComponente />);
  
  // Antes de carregar
  expect(screen.getByText('Carregando...')).toBeInTheDocument();
  
  // Após carregar
  expect(await screen.findByText('Dados carregados')).toBeInTheDocument();
});
```

## Mocks e Fixtures

### Mocks do Supabase

```tsx
import { mockSupabaseClient } from '@edunexia/test-config';

// Mock simples
mockSupabaseClient({
  authSession: { user: { id: '123' } },
  userData: { nome: 'Usuário Teste' }
});

// Mock com comportamento personalizado
mockSupabaseClient({
  customMocks: {
    from: (table) => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({
            data: { id: '123', nome: 'Usuário Teste' },
            error: null
          })
        })
      })
    })
  }
});
```

### Dados de Teste

Utilize os dados de teste padronizados do pacote `@edunexia/test-config`:

```tsx
import { testUser, testCurso, testMatricula } from '@edunexia/test-config';

// Usar em testes
render(<UserProfile user={testUser} />);
```

## Cobertura de Código

### Metas de Cobertura

- **Mínimo**: 80% de cobertura de linhas e branches
- **Ideal**: 90%+ de cobertura para código crítico

### Medição de Cobertura

```bash
# Executar testes com cobertura
pnpm test:coverage

# Verificar limites
pnpm test:coverage:check
```

### Exclusão de Cobertura

Para arquivos que não precisam ser testados:

```ts
// vitest.config.ts
export default createVitestConfig({
  coverage: {
    exclude: ['**/*.d.ts', '**/types/**', '**/*.stories.tsx']
  }
});
```

## Integração Contínua

Os testes são executados automaticamente em cada Pull Request e push para a branch principal via GitHub Actions:

- **PR**: Executa apenas os testes dos módulos afetados
- **Main**: Executa todos os testes e verifica a cobertura

## Solução de Problemas Comuns

### Problemas com Mocks

Se os mocks não estiverem funcionando corretamente:

```tsx
// Certifique-se de que o mock está antes do render
vi.mock('@supabase/supabase-js');
mockSupabaseClient(/* ... */);

// Depois render o componente
render(<MeuComponente />);
```

### Testes Instáveis

Para testes que falham de forma intermitente:

1. Verifique operações assíncronas usando `findBy*` em vez de `getBy*`
2. Use `waitFor` para esperar por condições
3. Evite dependências entre testes

```tsx
// Mais estável
await waitFor(() => {
  expect(screen.getByText('Sucesso')).toBeInTheDocument();
});
```

### Erros com Testing Library

Se estiver com problemas com "Warning: An update to Component inside a test was not wrapped in act...":

```tsx
// Use sempre act() para simular interações do usuário
await act(async () => {
  await userEvent.click(button);
});
```

## Conclusão

Seguindo estas diretrizes, manteremos um padrão alto de qualidade em todos os módulos da plataforma Edunéxia, garantindo estabilidade e confiabilidade do código com uma base de testes abrangente e eficaz.

## Recursos Adicionais

- [Documentação do Vitest](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Guia de Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) 