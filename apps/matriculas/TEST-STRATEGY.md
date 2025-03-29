<!-- cSpell:disable -->
# Estratégia de Testes - Módulo Matrículas

Este documento descreve a abordagem de testes adotada no módulo de Matrículas da Edunéxia.

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
<Button data-cy="botao-proximo">Próximo</Button>
```

### Mock de APIs e Serviços

Para testes que dependem de serviços externos, utilizamos:

1. **Vitest**: `vi.mock()` para mockar módulos e funções
2. **Cypress**: `cy.intercept()` para interceptar chamadas de rede

```typescript
// Exemplo com Vitest
vi.mock('../services/matriculaService', () => ({
  criarMatricula: vi.fn()
}));

// Exemplo com Cypress
cy.intercept('GET', '**/api/cursos*', { fixture: 'cursos.json' }).as('getCursos');
```

## Cobertura de Teste

Visamos atingir pelo menos 80% de cobertura de código, com foco nas seguintes funcionalidades:

1. **Formulário Multi-step de Matrícula**:
   - Validação de campos
   - Navegação entre etapas
   - Submissão de dados

2. **Upload e Validação de Documentos**:
   - Upload de arquivos
   - Validação de tipos e tamanhos
   - Listagem de documentos

3. **Visualização e Assinatura de Contratos**:
   - Exibição do contrato
   - Processo de assinatura digital
   - Validação de termos

4. **Pagamento**:
   - Seleção de formas de pagamento
   - Geração de boletos
   - Processamento de cartão

## Estrutura de Testes

```
apps/matriculas/
├── src/
│   ├── __tests__/
│   │   ├── MatriculaFormMultiStep.test.tsx
│   │   ├── DocumentoUpload.test.tsx
│   │   ├── ContratoViewer.test.tsx
│   │   └── GerarBoleto.test.tsx
│   ├── components/
│   └── ...
├── cypress/
│   ├── component/
│   │   ├── DocumentoUpload.cy.tsx
│   │   └── ...
│   ├── e2e/
│   │   ├── fluxo-matricula.cy.ts
│   │   ├── erro-matricula.cy.ts
│   │   └── ...
│   ├── fixtures/
│   │   ├── cursos.json
│   │   ├── planos.json
│   │   └── ...
│   └── support/
└── ...
```

## Casos de Teste Prioritários

1. **Fluxo de Matrícula Completo**:
   - Preenchimento e validação de todos os campos
   - Navegação entre todas as etapas do formulário
   - Submissão de todos os documentos necessários
   - Conclusão da matrícula

2. **Cenários de Erro**:
   - Validação de campos obrigatórios
   - Validação de datas inválidas
   - Erro no upload de documentos
   - Falha na criação da matrícula
   - Falha no processamento de pagamento

3. **Upload de Documentos**:
   - Upload de diferentes tipos de arquivo
   - Validação de tamanho máximo
   - Validação de formato de arquivo
   - Customização de nome de arquivo

4. **Visualização e Assinatura de Contrato**:
   - Exibição do contrato
   - Processo de assinatura
   - Validação de concordância com termos
   - Erro no processo de assinatura

5. **Geração e Visualização de Boletos**:
   - Geração de boleto para diferentes parcelas
   - Visualização do boleto
   - Cópia do código PIX
   - Mensagens de sucesso e erro

## Integração com CI/CD

Os testes são executados automaticamente:
1. Na criação de Pull Requests
2. Antes de deploy para ambientes de staging e produção

## Ferramentas

- **Vitest:** Testes unitários e de integração
- **Testing Library:** Utilitários para testar componentes React
- **Cypress:** Testes de componente e E2E
- **Cypress File Upload:** Plugin para simular upload de arquivos
- **Mock Service Worker (MSW):** Para simular chamadas de API em testes unitários

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
