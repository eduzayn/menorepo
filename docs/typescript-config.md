<!-- cSpell:disable -->
# Configuração do TypeScript no Monorepo Edunéxia

## Visão Geral

Este documento descreve como o TypeScript está configurado no monorepo da Edunéxia, incluindo a estratégia de referências entre projetos, compilação e estrutura dos arquivos de configuração.

## Estrutura de Configuração

O monorepo utiliza a funcionalidade de "Project References" do TypeScript, que permite:
- Build incremental de projetos
- Dependências explícitas entre projetos
- Verificação de tipo mais eficiente
- Melhor gerenciamento de dependências

### Arquivos de Configuração

- **`tsconfig.base.json`**: Configuração base para todo o monorepo
- **`tsconfig.json`**: Configuração raiz que referencia todos os projetos
- **`packages/typescript-config/*.json`**: Templates de configuração para diferentes tipos de projetos

## Configuração Padrão para Projetos

### Apps (Aplicações com Vite)

Cada aplicação no diretório `apps/` deve ter um arquivo `tsconfig.json` com a seguinte estrutura:

```json
{
  "extends": "@edunexia/typescript-config/vite.json",
  "compilerOptions": {
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      // Outros aliases específicos do projeto
    }
  },
  "include": ["src"]
}
```

### Packages (Bibliotecas)

Cada pacote no diretório `packages/` deve ter um arquivo `tsconfig.json` com a seguinte estrutura:

```json
{
  "extends": "../../tsconfig.base.json", 
  // Ou algum template específico do pacote
  "compilerOptions": {
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## Como Atualizar as Configurações

Para atualizar as configurações de TypeScript em todos os projetos do monorepo, execute:

```bash
pnpm update-tsconfig
```

Este comando executará o script `scripts/update-tsconfig.js`, que:
1. Identifica todos os projetos em `apps/` e `packages/`
2. Atualiza os arquivos `tsconfig.json` em cada projeto
3. Regenera o arquivo `tsconfig.json` raiz com referências para todos os projetos

## Resolução de Problemas Comuns

### Projeto Referenciado Deve Ter `composite: true`

**Erro:** `Referenced project must have setting "composite": true.`

**Solução:** Adicione `"composite": true` nas compilerOptions do projeto referenciado.

### Projeto Referenciado Não Pode Desativar Emissão

**Erro:** `Referenced project may not disable emit.`

**Solução:** Certifique-se de que o projeto referenciado não tenha `"noEmit": true`. Para projetos Vite, você pode manter um arquivo separado para desenvolvimento (com noEmit) e outro para build.

### Referências Circulares

**Erro:** Erros de build relacionados a dependências circulares.

**Solução:** Utilize o comando `pnpm circular:check` para identificar e resolver dependências circulares no código.

## Integração com as Ferramentas de Build

O TypeScript no monorepo se integra com:
- **pnpm**: Gerenciador de pacotes que entende as referências entre projetos
- **Turbo**: Para builds eficientes e cache inteligente
- **Vite**: Para desenvolvimento rápido com hot reload

## Template para Novos Projetos

Para criar um novo módulo, utilize o template existente em `apps/module-template/`, que já contém as configurações corretas de TypeScript.

## Boas Práticas

- Sempre respeite as dependências declaradas entre projetos
- Evite configurações personalizadas que contradigam a configuração base
- Mantenha o `composite: true` em todos os projetos referenciados
- Utilize os aliases de path consistentemente (`@/*`, etc.)
- Prefira reexportar tipos de pacotes comuns ao invés de redeclará-los 
