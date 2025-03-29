<!-- cSpell:disable -->
# Resolução de Problemas de TypeScript no Monorepo

Este documento fornece instruções para diagnosticar e resolver problemas comuns de TypeScript no monorepo Edunéxia.

## Problemas Comuns e Soluções

### 1. Problemas com Project References

**Sintomas:**
- Erros como `Referenced project must have setting "composite": true`
- Erros como `Referenced project may not disable emit`

**Solução:**
1. Execute o script de atualização das configurações:
   ```bash
   pnpm update-tsconfig
   ```
   Ou diretamente:
   ```bash
   node scripts/update-tsconfig.js
   ```

2. Verifique se cada arquivo `tsconfig.json` nos projetos tem:
   - `"composite": true` nas compilerOptions
   - Não tem `"noEmit": true` (ou tem `"noEmit": false`)

### 2. Módulos Não Encontrados

**Sintomas:**
- Erros como `Cannot find module '@edunexia/...' or its corresponding type declarations`

**Solução:**
1. Verifique se as dependências estão instaladas:
   ```bash
   pnpm install
   ```

2. Verifique os paths no arquivo `tsconfig.json` raiz:
   ```json
   "paths": {
     "@edunexia/*": ["./packages/*/src"],
     "@apps/*": ["./apps/*/src"]
   }
   ```

3. Para cada projeto, verifique se a dependência está corretamente declarada no `package.json`:
   ```json
   "dependencies": {
     "@edunexia/ui-components": "workspace:*"
   }
   ```

### 3. Problemas com JSX

**Sintomas:**
- Erros como `Cannot use JSX unless the '--jsx' flag is provided`
- Erros como `Module was resolved to '...', but '--jsx' is not set`

**Solução:**
1. Verifique se a configuração JSX está correta em `packages/typescript-config/vite.json`:
   ```json
   "jsx": "react-jsx"
   ```

2. Para projetos React, certifique-se de que estão estendendo a configuração correta:
   ```json
   "extends": "@edunexia/typescript-config/vite.json"
   ```

3. Limpe os caches do TypeScript e reinstale as dependências:
   ```bash
   find . -name "*.tsbuildinfo" -delete
   pnpm install
   ```

### 4. Dependências Circulares

**Sintomas:**
- Erro ao executar build: `cyclic dependency detected`
- Falha ao compilar com mensagens sobre ciclos

**Solução:**
1. Identifique as dependências circulares:
   ```bash
   pnpm circular:check:all
   ```

2. Reestruture o código para quebrar ciclos:
   - Mova interfaces/tipos compartilhados para um módulo separado
   - Use injeção de dependência em vez de importação direta
   - Divida arquivos grandes em componentes menores com responsabilidades claras

3. Para visualizar o grafo de dependências:
   ```bash
   pnpm circular:image
   ```

### 5. Incompatibilidades de Versão

**Sintomas:**
- Erros sobre versões do TypeScript incompatíveis
- Erros de incompatibilidade de tipos entre pacotes

**Solução:**
1. Verifique a consistência de versões no monorepo:
   ```bash
   pnpm version:check
   ```

2. Corrija inconsistências automaticamente:
   ```bash
   pnpm version:fix
   ```

## Caso de Uso: Resolvendo Configuração para Project References

O monorepo Edunéxia implementa Project References do TypeScript, que permitem build incremental e verificação de tipos mais eficiente. Esta abordagem requer algumas configurações específicas:

1. **Configuração Base** (`tsconfig.base.json`):
   ```json
   {
     "compilerOptions": {
       "composite": true,
       "declaration": true,
       "declarationMap": true,
       "noEmit": false
     }
   }
   ```

2. **Configuração de Cada Projeto**:
   ```json
   {
     "extends": "@edunexia/typescript-config/vite.json",
     "compilerOptions": {
       "composite": true,
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     },
     "include": ["src"]
   }
   ```

3. **Configuração Raiz** (`tsconfig.json`):
   ```json
   {
     "extends": "./tsconfig.base.json",
     "references": [
       { "path": "./apps/module-1" },
       { "path": "./packages/package-1" }
     ]
   }
   ```

## Script de Atualização Automática

O monorepo inclui um script que atualiza automaticamente todas as configurações de TypeScript:

```bash
pnpm update-tsconfig
```

Este script:
1. Identifica todos os projetos em `apps/` e `packages/`
2. Atualiza os arquivos `tsconfig.json` para incluir as configurações necessárias
3. Regenera o arquivo `tsconfig.json` raiz com referências para todos os projetos

## Boas Práticas

1. **Não duplique tipos** entre projetos - use pacotes compartilhados como `@edunexia/shared-types`
2. **Evite importações circulares** entre pacotes
3. **Não desabilite verificações de tipo** (`// @ts-ignore`, `any`) sem boa razão
4. **Periodicamente execute testes de tipo** em todo o monorepo
5. **Mantenha todas as configurações TypeScript sincronizadas** usando o script de atualização 
