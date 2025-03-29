<!-- cSpell:disable -->
# Solução para os Problemas de TypeScript no Monorepo

## Problemas Identificados

Ao configurar o TypeScript no monorepo, foram encontrados os seguintes erros:

```Referenced project 'c:/menorepo/apps/comunicacao' must have setting "composite": true.
Referenced project 'c:/menorepo/apps/core' must have setting "composite": true.
Referenced project 'c:/menorepo/apps/material-didatico' must have setting "composite": true.
Referenced project 'c:/menorepo/apps/matriculas' must have setting "composite": true.
Referenced project 'c:/menorepo/apps/matriculas' may not disable emit.
Referenced project 'c:/menorepo/apps/portal-do-aluno' must have setting "composite": true.
Referenced project 'c:/menorepo/apps/portal-do-aluno' may not disable emit.
Referenced project 'c:/menorepo/apps/portal-parceiro' must have setting "composite": true.
Referenced project 'c:/menorepo/apps/portal-polo' must have setting "composite": true.
Referenced project 'c:/menorepo/packages/api-client' must have setting "composite": true.
```

## Solução Implementada

Para resolver completamente estes problemas, foi criado um script que atualiza automaticamente os arquivos `tsconfig.json` em todos os projetos do monorepo:

1. Foi criado o script `scripts/update-tsconfig.js` que:
   - Identifica todos os projetos em `apps/` e `packages/`
   - Atualiza os arquivos `tsconfig.json` de cada projeto para incluir `"composite": true`
   - Preserva as configurações específicas de cada projeto (como paths)
   - Regenera o arquivo `tsconfig.json` raiz com referências para todos os projetos

2. Foi adicionado ao `package.json` um novo script chamado `update-tsconfig`.

3. Foi criada documentação em `docs/typescript-config.md` que explica a configuração do TypeScript no monorepo.

4. O template de módulo em `apps/module-template` foi atualizado para incluir a configuração correta.

## Como Aplicar a Solução

Para aplicar a solução, execute o seguinte comando:

```bash
pnpm update-tsconfig
```

## Verificação da Solução

Após executar o comando acima, verifique se o build do projeto funciona corretamente:

```bash
pnpm build
```

## Referências

- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Configuração de Monorepos com TypeScript](https://www.typescriptlang.org/docs/handbook/project-references.html#overall-structure)
- Documentação interna: `docs/typescript-config.md`
