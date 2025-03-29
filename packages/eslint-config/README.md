<!-- cSpell:disable -->
# ESLint Config

Configurações padronizadas de ESLint para o monorepo Edunéxia.

## Instalação

```bash
# No diretório do seu aplicativo ou pacote
pnpm add -D eslint @edunexia/eslint-config
```

## Uso

### Configuração Base

```js
// .eslintrc.js
module.exports = {
  extends: ["@edunexia/eslint-config"],
};
```

### Configuração React

```js
// .eslintrc.js
module.exports = {
  extends: ["@edunexia/eslint-config/react"],
};
```

### Configuração Next.js

```js
// .eslintrc.js
module.exports = {
  extends: ["@edunexia/eslint-config/next"],
};
```

### Configuração Vite

```js
// .eslintrc.js
module.exports = {
  extends: ["@edunexia/eslint-config/vite"],
};
```

## Adicionando regras específicas

Você pode estender a configuração padrão adicionando regras específicas:

```js
module.exports = {
  extends: ["@edunexia/eslint-config/react"],
  rules: {
    // Suas regras específicas aqui
    "no-console": "error",
  }
}
```

## Características

- **Base**: Configurações comuns para TypeScript e linting de imports.
- **React**: Extensão da configuração base com regras específicas para React e hooks.
- **Next.js**: Extensão da configuração do React com regras específicas para Next.js.
- **Vite**: Extensão da configuração do React com regras otimizadas para projetos Vite.

## Estrutura

- `index.js`: Configuração base TypeScript
- `react.js`: Configuração React
- `next.js`: Configuração Next.js
- `vite.js`: Configuração Vite 
