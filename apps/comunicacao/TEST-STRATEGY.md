# Estratégia de Testes - Módulo Comunicação

Este documento descreve a abordagem de testes adotada no módulo de Comunicação da Edunéxia.

## Tipos de Testes

### 1. Testes Unitários

Utilizamos o **Vitest** para testes unitários de componentes e funções isoladas. Esses testes verificam se cada unidade de código funciona corretamente de forma isolada.

**Localização:** `src/__tests__/`

**Convenção de nomenclatura:** `[NomeDoComponente].test.tsx`

**Como executar:**
```bash
pnpm test
```

### 2. Testes de Componente

Utilizamos o **Cypress Component Testing** para testar componentes React em um ambiente isolado, verificando sua renderização e comportamento.

**Localização:** `cypress/component/`

**Convenção de nomenclatura:** `[NomeDoComponente].cy.tsx`

**Como executar:**
```bash
pnpm test:component
```

### 3. Testes E2E (End-to-End)

Utilizamos o **Cypress** para testes E2E que simulam o comportamento do usuário no navegador, testando fluxos completos da aplicação.

**Localização:** `cypress/e2e/`

**Convenção de nomenclatura:** `[descricao-do-fluxo].cy.ts`

**Como executar:**
```bash
pnpm test:e2e
```

## Padrões e Práticas

### Atributos data-cy

Utilizamos atributos `data-cy` para selecionar elementos no DOM, garantindo que os testes sejam resilientes a mudanças na UI:

```jsx
<Button data-cy="send-button">Enviar</Button>
```

### Mock de APIs e Serviços

Para testes que dependem de serviços externos, utilizamos:

1. **Vitest**: `vi.mock()` para mockar módulos e funções
2. **Cypress**: `cy.intercept()` para interceptar chamadas de rede

```typescript
// Exemplo com Vitest
vi.mock('../services/chat', () => ({
  enviarMensagem: vi.fn()
}));

// Exemplo com Cypress
cy.intercept('GET', '**/api/conversas/listar', { fixture: 'conversas.json' }).as('listarConversas');
```

## Cobertura de Teste

Visamos atingir pelo menos 80% de cobertura de código, com foco nas seguintes funcionalidades:

1. **Chat**:
   - Listagem de conversas
   - Visualização de mensagens
   - Envio de mensagens
   - Indicador de digitação
   - Respostas rápidas

2. **Notificações**:
   - Exibição de notificações
   - Marcação como lida
   - Filtros de notificações

3. **Campanhas**:
   - Criação de campanhas
   - Listagem de campanhas
   - Métricas e análises

4. **CRM**:
   - Visualização de perfil de aluno
   - Histórico de interações
   - Segmentação e tags

## Estrutura de Testes

```
apps/comunicacao/
├── src/
│   ├── __tests__/              # Testes unitários
│   │   ├── ChatWindow.test.tsx
│   │   ├── SearchInput.test.tsx
│   │   └── RespostasRapidas.test.tsx
│   ├── components/             # Componentes React
│   └── ...
├── cypress/
│   ├── component/              # Testes de componentes
│   │   ├── ChatWindow.cy.tsx
│   │   └── ...
│   ├── e2e/                    # Testes end-to-end
│   │   ├── chat.cy.ts
│   │   └── ...
│   ├── fixtures/               # Dados mockados para testes
│   │   ├── conversas.json
│   │   └── ...
│   └── support/                # Configurações e comandos do Cypress
└── ...
```

## Casos de Teste Prioritários

1. **Interface de Chat**:
   - Renderização do ChatWindow
   - Exibição correta de mensagens do usuário e contatos
   - Funcionalidade de envio de mensagens
   - Indicação de digitação
   - Exibição de status de leitura

2. **Listagem de Conversas**:
   - Carregamento da lista de conversas
   - Exibição de mensagens não lidas
   - Ordenação por data de atualização
   - Busca e filtragem de conversas

3. **Respostas Rápidas**:
   - Carregamento de respostas pré-definidas
   - Seleção e inserção de respostas no chat
   - Criação e edição de novas respostas

4. **Campanhas e Automações**:
   - Criação de campanhas de comunicação
   - Configuração de regras e triggers
   - Monitoramento de resultados e métricas

## Integração com CI/CD

Os testes são executados automaticamente:
1. Na criação de Pull Requests
2. Antes de deploy para ambientes de staging e produção

## Ferramentas

- **Vitest:** Testes unitários 
- **Testing Library:** Utilitários para testar componentes React
- **Cypress:** Testes de componente e E2E
- **Mock Service Worker (MSW):** Para simular chamadas de API em testes unitários e de integração

## Tratamento de Erros Comuns

### Problemas com Tipos no Cypress:

Se ocorrerem erros de tipo como `Cannot find name 'cy'` ou `Cannot find type definition file for 'cypress'`, adicione as seguintes instalações:

```bash
pnpm add -D @types/cypress
```

E certifique-se de incluir a linha de referência no topo dos arquivos de teste:

```typescript
/// <reference types="cypress" />
```

### Problemas com Testing Library:

Se ocorrerem erros como `Property 'toBeInTheDocument' does not exist on type 'Assertion<any>'`, instale:

```bash
pnpm add -D @testing-library/jest-dom
```

E adicione a configuração adequada nos arquivos de configuração do Vitest. 