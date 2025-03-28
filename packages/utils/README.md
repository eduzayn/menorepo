# @edunexia/utils

Biblioteca de utilitários compartilhados para todos os módulos da plataforma Edunéxia.

## Descrição

Este pacote contém funções utilitárias reutilizáveis que são compartilhadas por diversos módulos da plataforma Edunéxia. O objetivo é centralizar implementações comuns para evitar duplicação de código e garantir consistência em toda a plataforma.

## Instalação

```bash
pnpm add @edunexia/utils
```

## Conteúdo

A biblioteca inclui utilitários para:

- Manipulação de datas
- Formatação e validação de valores
- Funções de manipulação de strings e arrays
- Manipulação de objetos e coleções
- Helpers para localStorage e sessionStorage
- Funções para debounce e throttle

## Uso

```typescript
import { formatarCPF, calcularIdade, formatarMoeda } from '@edunexia/utils';

// Exemplo de formatação de CPF
const cpfFormatado = formatarCPF('12345678909'); // 123.456.789-09

// Exemplo de cálculo de idade
const idade = calcularIdade('1990-01-01'); // Retorna a idade atual

// Exemplo de formatação de moeda
const valorFormatado = formatarMoeda(1234.56); // R$ 1.234,56
```

## Desenvolvimento

### Estrutura de Arquivos

```
src/
├── date/              # Utilitários de data
├── format/            # Funções de formatação
├── validation/        # Funções de validação
├── storage/           # Helpers para storage
├── array/             # Manipulação de arrays
├── __tests__/         # Testes unitários
└── index.ts           # Exportações públicas
```

### Contribuindo

1. Adicione suas funções utilitárias nos diretórios adequados, seguindo o padrão existente
2. Escreva testes unitários para suas funções
3. Documente cada função com JSDoc
4. Certifique-se de exportar as funções no arquivo index.ts
5. Atualize este README se necessário

### Scripts

- `pnpm build`: Compila a biblioteca
- `pnpm dev`: Compila em modo watch
- `pnpm test`: Executa os testes
- `pnpm lint`: Executa o ESLint

## Integração com o Monorepo

Este pacote faz parte do monorepo da Edunéxia e segue os padrões estabelecidos. Para mais informações sobre como contribuir para o monorepo, consulte o [README principal](../../README.md). 