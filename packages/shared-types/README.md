<!-- cSpell:disable -->
# @edunexia/shared-types

Biblioteca de tipos TypeScript compartilhados para o ecossistema Edunéxia.

## Descrição

Este pacote centraliza definições de tipos comuns utilizados em toda a plataforma Edunéxia, garantindo consistência e reutilização de definições entre os diversos módulos.

## Estrutura

```
src/
 ├── common.ts       # Tipos comuns para entidades básicas
 ├── user.ts         # Tipos relacionados a usuários
 ├── pagination.ts   # Tipos para paginação e filtros
 ├── enums.ts        # Enumerações comuns
 └── index.ts        # Exportações públicas
```

## Uso

Instale o pacote como dependência:

```bash
yarn add @edunexia/shared-types
```

Importe os tipos necessários:

```typescript
import { UserProfile, PaginatedResponse, MatriculaStatus } from '@edunexia/shared-types';

// Exemplo de uso
const fetchUsers = async (): Promise<PaginatedResponse<UserProfile>> => {
  // Implementação...
};

// Usando enums
const matricula = {
  status: MatriculaStatus.APROVADA
};
```

## Desenvolvimento

Para contribuir com novos tipos:

1. Adicione os novos tipos nos arquivos apropriados ou crie um novo arquivo
2. Exporte-os no arquivo `index.ts`
3. Documente os tipos com JSDoc
4. Execute `yarn build` para gerar as declarações

## Scripts

- `yarn build`: Compilar a biblioteca
- `yarn dev`: Compilar em modo watch
- `yarn lint`: Executar eslint
- `yarn test`: Executar testes
- `yarn clean`: Limpar diretório dist 
