<!-- cSpell:disable -->
# @edunexia/tailwind-config

Configuração compartilhada do Tailwind CSS para o monorepo da Edunéxia.

## Descrição

Este pacote contém a configuração padronizada do Tailwind CSS para todos os módulos e aplicativos da Edunéxia. O objetivo é garantir consistência visual em toda a plataforma, implementando o Design System da Edunéxia através de uma configuração centralizada do Tailwind.

## Instalação

```bash
pnpm add -D @edunexia/tailwind-config
```

## Dependências

Este pacote requer o Tailwind CSS e suas dependências:

```bash
pnpm add -D tailwindcss postcss autoprefixer
```

## Conteúdo

O pacote inclui:

- Configuração de cores personalizadas
- Tipografia padronizada
- Espaçamentos e breakpoints
- Plugins e extensões
- Predefinições para componentes comuns

## Uso

### Em arquivos de configuração do Tailwind

Em seu arquivo `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Estender a configuração base
  presets: [require('@edunexia/tailwind-config')],
  
  // Configurações específicas do projeto (opcional)
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Adicione caminhos específicos do seu projeto
  ],
};
```

### Em arquivos PostCSS

Em seu arquivo `postcss.config.js`:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## Design System

A configuração implementa o Design System da Edunéxia com as seguintes características:

### Paleta de Cores

```js
colors: {
  primary: { /* tons de azul */ },
  secondary: { /* tons de verde */ },
  accent: { /* tons de amarelo */ },
  neutral: { /* tons de cinza */ },
  success: { /* tons de verde */ },
  warning: { /* tons de laranja */ },
  danger: { /* tons de vermelho */ },
  info: { /* tons de azul claro */ },
}
```

### Tipografia

Fontes, tamanhos, pesos e espaçamentos padronizados para garantir consistência tipográfica em toda a plataforma.

### Componentes

Estilos base para componentes comuns como botões, cartões, formulários, etc.

## Desenvolvimento

### Modificando a Configuração

Se precisar modificar a configuração:

1. Faça as alterações no arquivo `index.js`
2. Execute `pnpm test` para garantir que a configuração é válida
3. Atualize a versão do pacote
4. Publique as alterações (o monorepo fará isso automaticamente)

### Scripts

- `pnpm test`: Executa testes na configuração
- `pnpm lint`: Executa ESLint

## Integração com o Monorepo

Este pacote faz parte do monorepo da Edunéxia e segue os padrões estabelecidos. Para mais informações sobre como contribuir para o monorepo, consulte o [README principal](../../README.md). 
