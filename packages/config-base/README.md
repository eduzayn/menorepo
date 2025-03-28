# Configurações Compartilhadas do Monorepo Edunéxia

Este pacote contém configurações padronizadas para ESLint, Prettier e Tailwind CSS que podem ser utilizadas por todos os módulos do monorepo Edunéxia.

## Configurações Base

Este pacote contém configurações base para vários aspectos do projeto:

- **`eslint/`**: Configuração base do ESLint
- **`prettier/`**: Configuração base do Prettier

> Nota: A configuração do Tailwind CSS foi movida para o pacote `packages/tailwind-config`

## Estrutura

```
config-base/
├── eslint/      # Configuração do ESLint
└── prettier/    # Configuração do Prettier
```

## Como usar as configurações em um módulo

### ESLint

Crie um arquivo `.eslintrc.js` no seu módulo com o seguinte conteúdo:

```js
module.exports = {
  extends: ['@edunexia/eslint-config'],
  // Configurações específicas do módulo, se necessário
};
```

### Prettier

Crie um arquivo `.prettierrc.js` no seu módulo com o seguinte conteúdo:

```js
module.exports = require('@edunexia/prettier-config');
```

### Tailwind CSS

Crie um arquivo `tailwind.config.js` no seu módulo com o seguinte conteúdo:

```js
const baseConfig = require('@edunexia/tailwind-config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Estender a configuração base
  presets: [baseConfig],
  // Configurações específicas do módulo, se necessário
  theme: {
    extend: {
      // Extensões específicas do módulo
    },
  },
};
```

Para o PostCSS, crie um arquivo `postcss.config.js` no seu módulo:

```js
module.exports = require('@edunexia/tailwind-config/postcss.config.js');
```

## Benefícios

- **Consistência**: Todos os módulos seguem os mesmos padrões de código
- **Manutenção**: Alterações nas configurações são feitas em um único lugar
- **Facilidade**: Configuração simplificada para novos módulos

## Atualização das configurações

Para atualizar qualquer configuração, modifique os arquivos nos diretórios correspondentes e todos os módulos que as utilizam serão automaticamente atualizados. 