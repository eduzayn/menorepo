<!-- cSpell:disable -->
# Padronização de Importações no Monorepo Edunéxia

Este documento define as diretrizes oficiais para padronização de importações em todos os módulos do monorepo da Edunéxia, visando garantir consistência, evitar duplicações e facilitar a manutenção.

## Princípios Gerais

1. **Centralização**: Todas as funções utilitárias comuns devem ser importadas de pacotes compartilhados
2. **Consistência**: Seguir sempre o mesmo padrão de importação em todos os módulos
3. **Clareza**: Importações explícitas e organizadas para facilitar a leitura e manutenção
4. **Otimização**: Evitar importações desnecessárias que aumentam o tamanho do bundle

## Guia de Importação por Tipo de Recurso

### Funções Utilitárias

**SEMPRE** importe funções utilitárias do pacote `@edunexia/utils`:

```typescript
// ✅ CORRETO
import { formatCurrency, formatDate, isValidCPF } from '@edunexia/utils';

// ❌ INCORRETO - Não crie ou importe funções utilitárias de outros lugares
import { formatCurrency } from '../utils/formatters';
import { isValidCPF } from '../helpers/validators';
```

Veja a lista completa de funções disponíveis em [`docs/centralizacao-utils.md`](./centralizacao-utils.md).

### Componentes de UI

**SEMPRE** importe componentes de UI do pacote `@edunexia/ui-components`:

```typescript
// ✅ CORRETO
import { Button, Card, TextField } from '@edunexia/ui-components';

// ❌ INCORRETO - Não crie componentes duplicados ou importe de outros lugares
import Button from '../components/Button';
```

### Tipos e Interfaces

**SEMPRE** importe tipos e interfaces globais do pacote `@edunexia/database-schema`:

```typescript
// ✅ CORRETO
import { User, Course, Enrollment } from '@edunexia/database-schema';

// ❌ INCORRETO - Não duplique definições de tipos já existentes
import { User } from '../types/user';
```

### Autenticação e Autorização

**SEMPRE** importe funções de autenticação do pacote `@edunexia/auth`:

```typescript
// ✅ CORRETO
import { useAuth, requireAuth, isAuthenticated } from '@edunexia/auth';

// ❌ INCORRETO - Não implemente lógica de autenticação localmente
import { useAuth } from '../contexts/AuthContext';
```

### Chamadas de API

**SEMPRE** utilize o cliente API centralizado do pacote `@edunexia/api-client`:

```typescript
// ✅ CORRETO
import { api, useFetch, useMutation } from '@edunexia/api-client';

// ❌ INCORRETO - Não crie clientes HTTP independentes
import axios from 'axios';
const api = axios.create({ ... });
```

### Assets e Recursos Estáticos

Para imagens, ícones e outros recursos comuns, use o pacote `@edunexia/assets`:

```typescript
// ✅ CORRETO
import { LogoEdunexia, IconUser } from '@edunexia/assets';

// ❌ INCORRETO - Não duplique recursos estáticos
import Logo from '../assets/logo.svg';
```

## Organização de Importações

As importações devem seguir a seguinte ordem:

1. Pacotes externos (React, bibliotecas de terceiros)
2. Pacotes compartilhados do monorepo (@edunexia/*)
3. Importações internas relativas (começando com `./` ou `../`)

Exemplo:

```typescript
// 1. Pacotes externos
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Pacotes compartilhados do monorepo
import { Button, Card } from '@edunexia/ui-components';
import { formatCurrency, isValidCPF } from '@edunexia/utils';
import { User, Course } from '@edunexia/database-schema';
import { useAuth } from '@edunexia/auth';
import { api } from '@edunexia/api-client';

// 3. Importações internas relativas
import { useCourseData } from './hooks/useCourseData';
import CourseHeader from './components/CourseHeader';
import './styles.css';
```

## Imports Descritivos com Alias

Para importações que podem causar conflitos de nomes, use alias descritivos:

```typescript
// ✅ CORRETO - Uso claro de alias para evitar ambiguidade
import { Button as UIButton } from '@edunexia/ui-components';
import { Button as CustomButton } from './components/Button';
```

## Named Exports vs. Default Exports

Prefira **named exports** em vez de default exports, pois:
- Facilitam o autocompletar do editor
- Tornam as importações mais consistentes
- Evitam problemas de nomeação inconsistente

```typescript
// ✅ CORRETO - Named exports
export function MyComponent() { ... }
export const myFunction = () => { ... }

// ❌ INCORRETO - Default exports
export default function MyComponent() { ... }
```

## Imports Inteligentes para Otimização de Bundle

Para pacotes grandes, importe apenas o que for utilizar:

```typescript
// ✅ CORRETO - Importação seletiva
import { startOfWeek, endOfWeek } from 'date-fns';

// ❌ INCORRETO - Importação de pacote inteiro
import * as dateFns from 'date-fns';
```

## Desenvolvimento Orientado por Contrato

Ao criar um novo módulo ou componente, defina suas interfaces públicas com clareza:

```typescript
// index.ts no módulo
export type { UserProps } from './types';
export { default as UserProfile } from './UserProfile';
export { useUserData } from './hooks/useUserData';

// Não exponha implementações internas e detalhes de implementação
```

## Ferramenta de Verificação de Importações

Para verificar se todas as importações estão seguindo o padrão recomendado, execute:

```bash
pnpm lint:imports
```

Este script verificará:
- Uso de pacotes compartilhados
- Potenciais duplicações
- Sintaxe de importação consistente

## Migração de Importações Existentes

Para atualizar importações existentes que não seguem esse padrão:

1. Verifique se a funcionalidade já existe em um pacote compartilhado
2. Migre a importação conforme as diretrizes deste documento
3. Execute os testes para garantir que não houve quebras
4. Documente quaisquer problemas encontrados

Para utilitários específicos, utilize o script de migração:

```bash
node scripts/update-utils-imports.js
```

## Convenções Específicas por Módulo

Cada módulo pode ter necessidades específicas, mas deve seguir as diretrizes gerais acima. Consulte o README do módulo para diretrizes específicas adicionais.

---

## Dúvidas Frequentes

**P: E se eu precisar de uma função utilitária que não existe no pacote compartilhado?**  
R: Adicione a função ao pacote `@edunexia/utils` seguindo as instruções em [`docs/centralizacao-utils.md`](./centralizacao-utils.md#contribuição). Não crie implementações locais.

**P: Posso criar um alias para o caminho das importações?**  
R: Sim, os alias `@/*` já estão configurados em todos os projetos e apontam para a pasta `src/` do módulo atual.

**P: Como lidar com componentes específicos do módulo?**  
R: Componentes específicos devem ficar em `./components/` e podem ser importados relativamente, mas certifique-se de que não duplicam funcionalidades dos pacotes compartilhados.

**P: E se eu precisar modificar um componente do pacote compartilhado?**  
R: Proponha a modificação no próprio pacote compartilhado. Se for uma personalização muito específica, utilize composição em vez de duplicação. 