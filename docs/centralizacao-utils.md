<!-- cSpell:disable -->
# Centralização de Funções Utilitárias na Edunéxia

Este documento descreve o processo de centralização de funções utilitárias no monorepo da Edunéxia, visando eliminar duplicações, padronizar implementações e facilitar a manutenção.

## Motivação

Durante a análise do código, foram identificadas diversas duplicações de funções utilitárias em diferentes módulos, como:

- Funções de formatação (`formatCurrency`, `formatDate`, etc.)
- Funções de validação (`isValidCPF`, `isValidEmail`, etc.)
- Utilitários diversos (`truncateText`, `generateId`, etc.)

Esta duplicação causava diversos problemas:
1. Inconsistência nas implementações
2. Dificuldade de manutenção (correções precisavam ser aplicadas em vários lugares)
3. Aumento desnecessário do tamanho do bundle
4. Potenciais bugs devido a comportamentos diferentes entre módulos

## Solução Implementada

Todas as funções utilitárias foram centralizadas no pacote `@edunexia/utils`, organizadas em três categorias principais:

1. **formatters.ts**: Funções de formatação de valores
2. **validators.ts**: Funções de validação de dados
3. **utils/index.ts**: Utilitários gerais

## Como Usar

Para utilizar as funções utilitárias, importe-as diretamente do pacote `@edunexia/utils`:

```typescript
import { formatCurrency, formatDate, isValidCPF } from '@edunexia/utils';

// Exemplo de uso
const valor = formatCurrency(1234.56); // R$ 1.234,56
const data = formatDate(new Date()); // 31/12/2023
const cpfValido = isValidCPF('123.456.789-00'); // false
```

## Funções Disponíveis

### Formatação (formatters.ts)

| Função | Descrição |
|--------|-----------|
| `formatCurrency` | Formata um valor como moeda brasileira (R$) |
| `formatDate` | Formata uma data no padrão brasileiro (DD/MM/YYYY) |
| `formatDateTime` | Formata data e hora no padrão brasileiro |
| `formatNumber` | Formata um número no padrão brasileiro |
| `formatCPF` | Formata um CPF (XXX.XXX.XXX-XX) |
| `formatCNPJ` | Formata um CNPJ (XX.XXX.XXX/XXXX-XX) |
| `formatPhone` | Formata um telefone ((XX) XXXXX-XXXX) |
| `formatCEP` | Formata um CEP (XXXXX-XXX) |
| `formatPercentage` | Formata um valor como porcentagem |
| `truncateText` | Trunca um texto longo com reticências |
| `formatName` | Formata um nome completo para exibição |
| `formatFileSize` | Formata o tamanho de um arquivo (KB, MB, etc.) |
| `formatDuration` | Formata uma duração em minutos para "Xh Ymin" |
| `formatRelativeTime` | Formata uma data como tempo relativo |

### Validação (validators.ts)

| Função | Descrição |
|--------|-----------|
| `isValidEmail` | Verifica se um email é válido |
| `isValidCPF` | Verifica se um CPF é válido |
| `isValidCNPJ` | Verifica se um CNPJ é válido |
| `isValidUrl` | Verifica se uma URL é válida |
| `isValidCEP` | Verifica se um CEP é válido |
| `isValidPhone` | Verifica se um telefone é válido |
| `isValidPassword` | Verifica se uma senha atende aos requisitos |
| `isValidDate` | Verifica se uma data é válida |
| `isFutureDate` | Verifica se uma data está no futuro |
| `isPastDate` | Verifica se uma data está no passado |
| `isAlphaOnly` | Verifica se um texto contém apenas letras |
| `isAlphanumeric` | Verifica se um texto contém apenas letras e números |

### Utilitários Gerais (utils/index.ts)

| Função | Descrição |
|--------|-----------|
| `cn` | Combina classes CSS (utility do Tailwind) |
| `generateId` | Gera um ID único |
| `delay` | Atrasa a execução por um determinado tempo |
| `slugify` | Cria um slug a partir de um texto |
| `removeNullValues` | Remove valores nulos de um objeto |
| `groupBy` | Agrupa um array de objetos por uma propriedade |
| `sortBy` | Ordena um array de objetos por uma propriedade |
| `deepMerge` | Faz o merge profundo de dois objetos |
| `debounce` | Limita a execução de uma função (espera um tempo) |
| `throttle` | Limita a taxa de execução de uma função |
| `shuffle` | Embaralha elementos de um array |
| `uniqueArray` | Retorna apenas valores únicos de um array |
| `removeAccents` | Remove acentos de um texto |

## Script de Migração

Foi criado um script para automatizar o processo de migração das funções utilitárias duplicadas:

```bash
# Execute o script para encontrar duplicações e atualizar importações
node scripts/update-utils-imports.js
```

O script realiza as seguintes operações:
1. Identifica implementações duplicadas de funções utilitárias
2. Atualiza as importações nos arquivos que usam essas funções
3. Cria arquivos de compatibilidade para manter a retrocompatibilidade
4. Adiciona `@edunexia/utils` como dependência nos projetos que usam as funções

## Arquivos de Compatibilidade

Para manter a retrocompatibilidade com o código existente, foram criados arquivos de compatibilidade que re-exportam as funções do pacote centralizado. Isso permite uma migração gradual, sem quebrar o código existente.

Esses arquivos contêm avisos de depreciação e devem ser removidos quando todos os módulos estiverem usando diretamente o pacote `@edunexia/utils`.

## Boas Práticas

1. **Sempre importe de `@edunexia/utils`**: Não crie novas implementações de funções que já existem
2. **Adicione novas funções ao pacote centralizado**: Se precisar de uma nova função utilitária, adicione-a ao pacote centralizado
3. **Documente novas funções**: Use JSDoc para documentar o propósito e parâmetros das funções
4. **Escreva testes**: Todas as funções utilitárias devem ter testes

## Contribuição

Para adicionar novas funções utilitárias:

1. Identifique a categoria apropriada (formatters, validators ou utils)
2. Adicione a função ao arquivo correspondente
3. Documente a função com JSDoc
4. Escreva testes para a função
5. Atualize esta documentação com a nova função
6. Execute `pnpm build` e `pnpm test` para garantir que tudo está funcionando

## Preocupações de Compatibilidade

Se você encontrar problemas de compatibilidade após a migração, verifique:

1. Se a função importada tem a mesma assinatura da função original
2. Se a implementação centralizada tem o mesmo comportamento da original
3. Se existem diferenças sutis que precisam ser ajustadas (ex: formato de data ligeiramente diferente)

Em caso de problemas, reporte-os à equipe de desenvolvimento para que possam ser resolvidos.

## Relação com a Arquitetura do Projeto

Esta centralização de funções utilitárias está alinhada com as diretrizes de arquitetura do projeto. Para entender melhor onde cada tipo de código deve residir (em `packages/` ou `apps/`), consulte a [documentação sobre divisão de responsabilidades](./arquitetura/divisao-responsabilidades.md).

A centralização das funções utilitárias não apenas elimina duplicações, mas também reforça os princípios arquiteturais do projeto, garantindo que código reutilizável esteja disponível para todos os módulos de forma padronizada. 