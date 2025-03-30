# Estratégia de Testes - Edunéxia

Este documento descreve a estratégia de testes adotada no projeto Edunéxia, abordando os diferentes tipos de testes implementados, suas finalidades e as melhores práticas para desenvolvimento e manutenção dos testes.

## Visão Geral

A estratégia de testes do Edunéxia visa garantir a qualidade do software em múltiplos níveis, desde a validação de componentes isolados até a verificação de fluxos completos de uso. Nossa abordagem segue a pirâmide de testes, com ênfase em:

1. **Testes Unitários**: Base da pirâmide, com maior quantidade e velocidade
2. **Testes de Componentes**: Camada intermediária, testando a integração entre componentes
3. **Testes End-to-End (E2E)**: Topo da pirâmide, simulando interações reais do usuário

## Ferramentas e Configuração

Utilizamos um pacote centralizado de configuração de testes (`@edunexia/test-config`) para padronizar e facilitar a escrita dos testes em todo o monorepo:

- **Vitest**: Framework principal para testes unitários e de componentes
- **Testing Library**: Biblioteca para testar componentes React
- **Cypress**: Ferramenta para testes E2E
- **Mock Service Worker (MSW)**: Para simular chamadas de API

### Configuração Central

O pacote `@edunexia/test-config` fornece:

- Configuração padrão para Vitest e Jest
- Utilitários de teste (renders, mocks, fixtures)
- Helpers para geração de dados de teste
- Scripts para execução de testes em todo o monorepo

## Tipos de Testes

### Testes Unitários

Testam unidades isoladas de código (funções, hooks, utils).

**Características:**
- Rápidos de executar
- Não dependem de serviços externos
- Focados em uma única funcionalidade
- Uso extensivo de mocks para isolamento

**Exemplo:**
```tsx
// Teste de um hook de autenticação
it('deve autenticar o usuário com sucesso', async () => {
  mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
    data: { session: mockSession, user: mockUser },
    error: null
  });
  
  const { result } = renderHook(() => useAuth(), { wrapper });
  
  await act(async () => {
    await result.current.signIn({
      email: 'usuario@edunexia.com',
      password: 'senha123'
    });
  });
  
  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user).toEqual(mockUser);
});
```

### Testes de Componentes

Verificam se os componentes React estão funcionando corretamente.

**Características:**
- Testam renderização e comportamento
- Verificam interações do usuário
- Testam a integração entre componentes relacionados
- Podem usar mocks para APIs e serviços

**Exemplo:**
```tsx
// Teste de um componente de geração de boleto
it('deve gerar boleto ao clicar no botão', async () => {
  render(<GerarBoleto />);
  
  const user = userEvent.setup({ delay: null });
  const botoesGerarBoleto = screen.getAllByRole('button', { name: /Gerar Boleto/i });
  await user.click(botoesGerarBoleto[0]);
  
  await waitFor(() => {
    expect(screen.getByText(/Boleto gerado com sucesso/)).toBeInTheDocument();
  });
  
  expect(screen.getByText('Visualizar Boleto')).toBeInTheDocument();
  expect(screen.getByText('Copiar Código PIX')).toBeInTheDocument();
});
```

### Testes End-to-End (E2E)

Simulam o comportamento real do usuário em fluxos completos.

**Características:**
- Testam fluxos de ponta a ponta
- Verificam a integração de múltiplos componentes
- Simulam a navegação entre páginas
- Usam interceptação de API para simular respostas

**Exemplo:**
```tsx
// Teste E2E do fluxo de matrícula
it('deve completar todo o fluxo de matrícula com sucesso', () => {
  // Interceptação de APIs
  cy.intercept('GET', '/api/alunos/buscar*', { fixture: 'alunos.json' });
  cy.intercept('POST', '/api/matriculas', { success: true, matriculaId: 'matricula-123' });
  
  // Login e navegação
  cy.login('coordenador@edunexia.com', 'senha123');
  cy.visit('/matriculas/nova');
  
  // Passos do fluxo
  cy.get('[data-testid="busca-aluno-input"]').type('Silva');
  cy.get('[data-testid="aluno-resultado-item"]').first().click();
  cy.get('[data-testid="confirmar-aluno-btn"]').click();
  
  // Verificações
  cy.url().should('include', '/matriculas/confirmacao');
  cy.get('[data-testid="mensagem-sucesso"]').should('be.visible');
});
```

## Prioridades de Teste

Focamos nossos esforços de teste nos fluxos mais críticos da plataforma:

1. **Matrícula e Cadastro**
   - Fluxo completo de matrícula
   - Cadastro de alunos
   - Upload de documentos

2. **Autenticação e Segurança**
   - Login e logout
   - Recuperação de senha
   - Permissões e autorizações

3. **Pagamentos**
   - Geração de boletos
   - Integração com gateway de pagamento
   - Histórico financeiro

## Boas Práticas

### Organização dos Testes

- Testes unitários: `__tests__/*.test.tsx` (mesmo diretório do código)
- Testes de componentes: mesmo formato dos unitários
- Testes E2E: `cypress/e2e/*.cy.ts`

### Nomenclatura

- Descritiva e clara sobre o que está sendo testado
- Formato: `deve [ação/comportamento esperado] quando [condição]`

### Mocks e Fixtures

- Dados de teste padronizados em `fixtures/`
- Mocks de serviços em `__mocks__/`

## Execução de Testes

### Testes Unitários e de Componentes

```bash
# Executa os testes para um módulo específico
cd apps/matriculas
yarn test

# Executa em modo de observação
yarn test:watch

# Verifica cobertura
yarn test:coverage
```

### Testes E2E

```bash
# Inicia o ambiente de desenvolvimento
yarn dev

# Em outro terminal, executa os testes E2E
cd apps/matriculas
yarn test:e2e
```

### Todos os Testes

Para executar todos os testes do monorepo:

```bash
cd packages/test-config
yarn run-all-tests
```

## Cobertura de Testes

Buscamos uma cobertura mínima de:

- **80%** para testes unitários
- **70%** para testes de componentes
- Testes E2E devem cobrir todos os fluxos críticos

Os relatórios de cobertura são gerados em `coverage/` e podem ser visualizados abrindo `coverage/index.html`.

## Integração com CI/CD

Os testes são executados automaticamente:

1. **Pull Requests**: Testes unitários e de componentes
2. **Merge na branch principal**: Testes E2E completos
3. **Deploy**: Verificação completa antes de cada deploy

## Conclusão

Esta estratégia de testes visa garantir a qualidade do software Edunéxia através de uma abordagem abrangente e estruturada. Ao seguir estas diretrizes, conseguimos detectar problemas precocemente, aumentar a confiabilidade do código e facilitar refatorações futuras com segurança.

---

**Última atualização:** Abril/2024 