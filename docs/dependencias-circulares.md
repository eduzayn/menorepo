# Gerenciamento de Dependências Circulares no Monorepo

Este documento explica como detectar, prevenir e resolver dependências circulares no monorepo da Edunéxia.

## O que são Dependências Circulares?

Dependências circulares ocorrem quando dois ou mais módulos dependem um do outro, formando um ciclo. Por exemplo:

```
Módulo A importa Módulo B
Módulo B importa Módulo A
```

Ou em ciclos mais complexos:

```
Módulo A importa Módulo B
Módulo B importa Módulo C
Módulo C importa Módulo A
```

## Por que Dependências Circulares são Problemáticas?

1. **Problemas de compilação** - TypeScript e outros compiladores podem ter dificuldades com dependências circulares
2. **Falhas em tempo de execução** - Podem causar valores `undefined` quando um módulo tenta acessar outro que ainda não foi completamente inicializado
3. **Manutenção e legibilidade** - Tornam o código mais difícil de entender e manter
4. **Dificuldades de teste** - Complicam a criação de testes unitários isolados

## Detecção de Dependências Circulares

O monorepo da Edunéxia utiliza a ferramenta [madge](https://github.com/pahen/madge) para detectar dependências circulares no código.

### Scripts Disponíveis

```bash
# Verificar dependências circulares em pacotes
pnpm circular:check

# Verificar dependências circulares em apps
pnpm circular:check:apps

# Verificar dependências circulares em todo o projeto
pnpm circular:check:all

# Gerar imagem do grafo de dependências (requer Graphviz)
pnpm circular:image
```

### Script de Verificação Completa

Para uma verificação completa, use um dos scripts:

```bash
# PowerShell
scripts/check-circular-deps.ps1

# Batch (Windows)
scripts/check-circular-deps.bat
```

Estes scripts:
1. Verificam dependências circulares em pacotes
2. Verificam dependências circulares em apps
3. Tentam gerar uma imagem do grafo de dependências (se Graphviz estiver instalado)

## Como Resolver Dependências Circulares

Quando encontrar dependências circulares, considere estas abordagens:

### 1. Extrair para um Terceiro Módulo

Extraia a funcionalidade comum para um terceiro módulo que ambos os módulos originais podem importar.

**Antes:**
```typescript
// moduleA.ts
import { someFunc } from './moduleB';

// moduleB.ts
import { otherFunc } from './moduleA';
```

**Depois:**
```typescript
// shared.ts
export function commonFunc() { ... }

// moduleA.ts
import { commonFunc } from './shared';

// moduleB.ts
import { commonFunc } from './shared';
```

### 2. Injeção de Dependência

Em vez de importar diretamente, use injeção de dependência.

```typescript
// service.ts
export class Service {
  constructor(private dependency: Dependency) {}
}

// main.ts
import { Service } from './service';
import { Dependency } from './dependency';

const dependency = new Dependency();
const service = new Service(dependency);
```

### 3. Reestruturar a Arquitetura

Revise a arquitetura para garantir uma hierarquia clara de dependências.

### 4. Interfaces e Tipos Compartilhados

Mova interfaces e tipos compartilhados para um módulo separado.

```typescript
// types.ts
export interface User { ... }

// userService.ts
import { User } from './types';

// userRepository.ts
import { User } from './types';
```

## Exemplo Prático: Resolução de Dependência Circular

### Exemplo 1: auth e api-client

**Problema:**
```
@edunexia/auth importa de @edunexia/api-client
@edunexia/api-client importa de @edunexia/auth
```

**Solução:**
1. Extrair tipos compartilhados para um módulo `@edunexia/shared-types`
2. Usar injeção de dependência para o cliente Supabase

### Exemplo 2: Ciclo em hooks e contextos

**Problema:**
```
hook.ts importa context.ts
context.ts importa hook.ts
```

**Solução:**
1. Consolide a lógica em um único arquivo
2. Separe a definição do contexto de seu uso

## Boas Práticas

1. **Execute a verificação regularmente**: Use `pnpm circular:check:all` antes de submeter mudanças significativas
2. **Organize por camadas**: Estruture seu código em camadas com dependências unidirecionais
3. **Minimize importações**: Importe apenas o necessário, não módulos inteiros
4. **Considere o princípio de responsabilidade única**: Cada módulo deve ter uma responsabilidade clara

## Configuração de CI/CD

A verificação de dependências circulares está integrada ao pipeline de CI/CD, garantindo que todas as pull requests sejam verificadas.

---

Para mais informações, consulte a [documentação do madge](https://github.com/pahen/madge) ou entre em contato com a equipe de arquitetura. 