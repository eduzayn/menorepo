# Usando o Pacote @edunexia/test-config

Este documento explica como utilizar o pacote centralizado de testes da plataforma Edunéxia.

## Instalação

O pacote já está disponível através do monorepo, basta adicioná-lo como dependência de desenvolvimento no arquivo `package.json` do seu módulo:

```json
{
  "devDependencies": {
    "@edunexia/test-config": "workspace:*"
  }
}
```

## Configuração do Vitest

Para usar a configuração padronizada do Vitest, crie um arquivo `vitest.config.ts` na raiz do seu módulo:

```typescript
import { createVitestConfig } from '@edunexia/test-config';

export default createVitestConfig('./', {
  // Configurações específicas do seu módulo, se necessário
  coverage: {
    thresholds: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    include: [
      'src/components/**',
      'src/hooks/**',
      'src/utils/**',
    ],
  },
});
```

## Configuração do Jest

Para módulos que usam Jest, crie um arquivo `jest.config.js` na raiz do seu módulo:

```javascript
const { createJestConfig } = require('@edunexia/test-config');

module.exports = createJestConfig({
  // Configurações específicas do seu módulo, se necessário
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
});
```

## Escrevendo Testes

### Importando Utilitários de Teste

```typescript
import { 
  render, 
  screen, 
  userEvent, 
  vi,
  mockSupabaseClient,
  testUser,
  testSession 
} from '@edunexia/test-config';
```

### Exemplo de Teste Básico

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@edunexia/test-config';
import { MeuComponente } from './MeuComponente';

describe('MeuComponente', () => {
  it('deve renderizar corretamente', () => {
    render(<MeuComponente />);
    expect(screen.getByText('Teste')).toBeInTheDocument();
  });
});
```

### Exemplo com Mock do Supabase

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, mockSupabaseClient, testUser, testSession } from '@edunexia/test-config';
import { PerfilUsuario } from './PerfilUsuario';

// Mock do módulo de API
vi.mock('@edunexia/api-client', () => ({
  useSupabaseClient: () => mockSupabaseClient({
    authSession: testSession,
    userData: testUser,
  }),
}));

describe('PerfilUsuario', () => {
  it('deve exibir os dados do usuário', () => {
    render(<PerfilUsuario usuarioId={testUser.id} />);
    expect(screen.getByText(testUser.nome)).toBeInTheDocument();
  });
});
```

### Exemplo com Dados de Teste

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, gerarParcelas } from '@edunexia/test-config';
import { ListaParcelas } from './ListaParcelas';

describe('ListaParcelas', () => {
  it('deve exibir a lista de parcelas', () => {
    const parcelas = gerarParcelas(3, 'pendente');
    render(<ListaParcelas parcelas={parcelas} />);
    
    expect(screen.getAllByTestId('parcela-item')).toHaveLength(3);
  });
});
```

## Scripts no package.json

Adicione os seguintes scripts no `package.json` do seu módulo:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Recursos Disponíveis

O pacote `@edunexia/test-config` oferece:

### Utilitários para Renderização e Interação
- `render`, `screen`, `fireEvent`, `waitFor`, etc. do Testing Library
- `userEvent` para simular interações do usuário
- `vi` para criar mocks no Vitest

### Mocks Prontos
- `mockSupabaseClient`: Mock para o cliente Supabase
- `setupLocalStorageMock`: Mock para o localStorage
- `mockFetch`: Mock para o fetch
- `mockReactQuery`: Mock para o React Query

### Dados de Teste
- `testUser`: Dados básicos de um usuário
- `testSession`: Dados básicos de uma sessão
- `testMatricula`: Dados básicos de uma matrícula
- `testCurso`: Dados básicos de um curso
- `gerarParcelas`: Função para gerar parcelas para testes
- `gerarDocumentos`: Função para gerar documentos para testes

## Dúvidas Frequentes

### Como mockar um contexto personalizado?

Você pode usar a função `createWrapper` para criar um wrapper de contexto:

```typescript
import { render, createWrapper } from '@edunexia/test-config';
import { MeuContexto } from '../contexts/MeuContexto';

const wrapper = createWrapper(MeuContexto.Provider);
render(<MeuComponente />, { wrapper });
```

### Como combinar múltiplos contextos?

Use a função `combineProviders` para combinar vários provedores:

```typescript
import { render, combineProviders } from '@edunexia/test-config';
import { MeuContexto } from '../contexts/MeuContexto';
import { OutroContexto } from '../contexts/OutroContexto';

const Wrapper = combineProviders(
  MeuContexto.Provider,
  OutroContexto.Provider
);

render(<MeuComponente />, { wrapper: Wrapper });
``` 