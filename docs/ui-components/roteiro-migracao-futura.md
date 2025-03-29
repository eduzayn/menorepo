# Roteiro para Continuação da Migração de Componentes

Este documento estabelece um plano detalhado para a continuação da migração de componentes para a biblioteca centralizada `@edunexia/ui-components`.

## Fase 1: Conclusão do Módulo Matrículas (Sprint 1)

### Semana 1: Migração do DashboardLayout

1. **Análise e Comparação**
   - Comparar a implementação atual em `apps/matriculas/src/components/Layout/DashboardLayout.tsx` com a versão padronizada
   - Identificar diferenças de APIs e funcionalidades específicas

2. **Implementação**
   - Atualizar o `DashboardLayout` padronizado para suportar funcionalidades específicas, se necessário
   - Migrar as páginas do módulo para utilizarem o componente padronizado:
     - Dashboard.tsx
     - RelatorioFinanceiro.tsx
     - Outras páginas que utilizam o layout

3. **Testes**
   - Verificar se a navegação e a exibição de todas as páginas continuam funcionando corretamente
   - Testar em diferentes resoluções de tela

### Semana 2: Implementação e Migração do DashboardCard

1. **Desenvolvimento na Biblioteca**
   - Implementar o componente `DashboardCard` em `packages/ui-components/src/components/data-display/DashboardCard.tsx`
   - Adicionar testes ao componente
   - Documentar o componente em `docs/ui-components/componentes-padronizados.md`

2. **Migração**
   - Substituir o uso local em `apps/matriculas/src/components/dashboard/DashboardCard.tsx`
   - Atualizar as importações em todos os arquivos relevantes

3. **Remoção**
   - Remover a implementação local após a migração bem-sucedida

## Fase 2: Módulo Portal do Aluno (Sprint 2)

### Semana 3: Análise e Planejamento

1. **Inventário de Componentes**
   - Mapear todos os componentes duplicados ou potencialmente padronizáveis no módulo
   - Priorizar com base na frequência de uso e complexidade

2. **Planejamento de Migração**
   - Determinar a ordem de migração para minimizar conflitos
   - Identificar componentes que precisam ser adicionados à biblioteca

### Semana 4: Migração de Componentes Básicos

1. **Implementação de Card Padronizado**
   - Desenvolver o componente `Card` em `packages/ui-components/src/components/data-display/Card.tsx`
   - Adicionar testes e documentação

2. **Migração de PageHeader**
   - Implementar o componente `PageHeader` em `packages/ui-components/src/components/layout/PageHeader.tsx`
   - Migrar as páginas para usar o novo componente

## Fase 3: Módulo Comunicação (Sprint 3)

### Semana 5: Componentes Específicos de Comunicação

1. **Análise de Message e NotificationCard**
   - Determinar se são específicos demais para o módulo ou genéricos o suficiente para a biblioteca
   - Se genéricos, desenvolver versões padronizadas

2. **Migração de NotificationCard**
   - Se padronizado, migrar todas as instâncias para a versão centralizada

### Semana 6: Layout e Formulários

1. **Migração de DashboardLayout**
   - Atualizar todas as páginas do módulo comunicação para usar o layout padronizado

2. **Migração de Componentes de Formulário**
   - Identificar formulários existentes
   - Migrar para usar `FormField`, `Input` e `Select` padronizados

## Fase 4: Expansão e Consolidação (Sprint 4)

### Semana 7: Novos Componentes Padronizados

1. **Implementação de Modal**
   - Desenvolver um componente de modal padronizado
   - Adicionar testes e documentação

2. **Implementação de Table**
   - Desenvolver um componente de tabela padronizado
   - Incluir funcionalidades de ordenação, filtragem e paginação

### Semana 8: Testes e Documentação

1. **Ampliação da Cobertura de Testes**
   - Aumentar a cobertura de testes para todos os componentes
   - Implementar testes de integração

2. **Documentação Avançada**
   - Melhorar a documentação existente
   - Criar uma biblioteca de exemplos
   - Atualizar o guia de migração com novos casos de uso

## Recomendações para Implementação

### Segmentação de Tarefas

Divida a migração em pequenas tarefas gerenciáveis:

1. **Análise** - Entender o componente atual e seu uso
2. **Implementação/Atualização** - Desenvolver ou atualizar a versão padronizada
3. **Migração** - Substituir o uso local pela versão padronizada
4. **Teste** - Verificar se tudo funciona conforme esperado
5. **Documentação** - Atualizar documentação refletindo as mudanças

### Estratégia de Lançamento

Para cada sprint:

1. **Versão Alpha** - Disponibilizar internamente para testes
2. **Versão Beta** - Implementar em um módulo inicial
3. **Versão Estável** - Liberar para uso em todos os módulos

### Métricas de Progresso

Acompanhe o progresso utilizando:

- Número de componentes migrados vs. total identificado
- Cobertura de testes dos componentes padronizados
- Redução no tamanho total do código nos módulos

## Cronograma Resumido

| Sprint | Duração | Módulos/Componentes | Meta de Progresso |
|--------|---------|---------------------|-------------------|
| 1      | 2 semanas | Matrículas (DashboardLayout, DashboardCard) | 60% do módulo |
| 2      | 2 semanas | Portal do Aluno (Card, PageHeader) | 50% do módulo |
| 3      | 2 semanas | Comunicação (Message, NotificationCard) | 50% do módulo |
| 4      | 2 semanas | Expansão (Modal, Table) e Consolidação | 30% adicional geral |

## Recursos Necessários

- **Tempo de Desenvolvimento**: 8 semanas (tempo parcial)
- **Revisões de Código**: 2-3 horas por semana
- **Testes**: Testes unitários para cada componente + testes de integração por módulo

## Considerações Finais

A migração completa é um processo gradual que deve ser feito com cuidado para evitar quebras de funcionalidade. O foco inicial deve ser nos componentes mais utilizados e mais simples, avançando progressivamente para componentes mais complexos.

É essencial manter a compatibilidade com implementações existentes enquanto a migração estiver em andamento, possivelmente criando adaptadores temporários quando necessário. 