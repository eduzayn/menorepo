# @edunexia/typescript-config

Configurações compartilhadas de TypeScript para o monorepo da Edunéxia.

## Descrição

Este pacote contém configurações padronizadas de TypeScript para todos os módulos e pacotes do monorepo da Edunéxia. O objetivo é garantir consistência na configuração do TypeScript em todo o projeto, facilitando a manutenção e evitando problemas de compatibilidade.

## Instalação

```bash
pnpm add -D @edunexia/typescript-config
```

## Configurações Disponíveis

O pacote inclui as seguintes configurações:

- **base.json**: Configurações base para qualquer projeto TypeScript
- **react-app.json**: Configurações para aplicações React
- **react-library.json**: Configurações para bibliotecas React
- **nextjs.json**: Configurações para aplicações Next.js
- **vite.json**: Configurações para projetos usando Vite
- **vite-node.json**: Configurações para projetos Vite Node.js

## Uso

No arquivo `tsconfig.json` do seu projeto, estenda uma das configurações disponíveis:

### Para uma aplicação React

```json
{
  "extends": "@edunexia/typescript-config/react-app.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Para uma biblioteca React

```json
{
  "extends": "@edunexia/typescript-config/react-library.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Para uma aplicação Next.js

```json
{
  "extends": "@edunexia/typescript-config/nextjs.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## Detalhes de Configuração

### Configuração Base (base.json)

A configuração base define:

- `strict: true` - Habilita verificações estritas de tipos
- Suporte a ESNext e módulos ES
- Resolução de módulos TypeScript
- Configurações para JSX (React)
- Outras configurações recomendadas para garantir qualidade do código

## Desenvolvimento

### Modificando as Configurações

Se precisar modificar as configurações:

1. Faça as alterações no arquivo de configuração apropriado
2. Execute `pnpm test` para garantir que as configurações são válidas
3. Atualize a versão do pacote
4. Publique as alterações (o monorepo fará isso automaticamente)

### Scripts

- `pnpm test`: Executa testes nas configurações
- `pnpm lint`: Executa ESLint

## Integração com o Monorepo

Este pacote faz parte do monorepo da Edunéxia e segue os padrões estabelecidos. Para mais informações sobre como contribuir para o monorepo, consulte o [README principal](../../README.md). 