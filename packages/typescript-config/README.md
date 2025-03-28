# TypeScript Config

Este pacote contém configurações TypeScript reutilizáveis e padronizadas para todos os projetos e módulos do monorepo Edunexia.

## Visão Geral

O pacote `@edunexia/typescript-config` oferece configurações de TypeScript compartilhadas para garantir consistência em todo o monorepo. Ao estender estas configurações, todos os projetos podem manter o mesmo comportamento de compilação e verificação de tipos, evitando discrepâncias entre os módulos.

## Configurações Disponíveis

O pacote inclui as seguintes configurações:

- **base.json** - Configuração base que outros arquivos estendem
- **vite.json** - Otimizada para projetos React usando Vite
- **react-library.json** - Para bibliotecas React
- **react-app.json** - Para aplicações React
- **nextjs.json** - Para aplicações Next.js
- **vite-node.json** - Para projetos Vite com Node.js

## Como Usar

Em seu arquivo `tsconfig.json`, estenda uma das configurações de acordo com o tipo de seu projeto:

### Para Aplicações Vite (a maioria dos apps):

```json
{
  "extends": "@edunexia/typescript-config/vite.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@pages/*": ["./src/pages/*"],
      // ... outras configurações de paths específicas do seu projeto
    }
  },
  "include": ["src", "vite.config.ts"]
}
```

### Para Bibliotecas React (packages):

```json
{
  "extends": "@edunexia/typescript-config/react-library.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

### Para Aplicativos Next.js:

```json
{
  "extends": "@edunexia/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## Benefícios da Padronização

- **Consistência**: Todos os módulos têm as mesmas regras de TypeScript
- **Manutenção simplificada**: As atualizações são feitas em um único lugar
- **Configurações testadas**: Todas as configurações são otimizadas para seus casos de uso
- **Redução de erros**: Menos chances de inconsistências entre módulos
- **Onboarding mais fácil**: Desenvolvedores não precisam reaprender configurações para cada módulo

## Regras Importantes

1. **SEMPRE** estenda uma das configurações deste pacote em seu `tsconfig.json`
2. **NÃO** substitua configurações críticas sem uma razão bem documentada
3. **MANTENHA** seus `paths` organizados seguindo o padrão do monorepo
4. **ATUALIZE** este pacote sempre que forem necessárias mudanças globais

## Problemas Comuns

Se encontrar problemas de compilação após atualizar este pacote, verifique:

1. Se sua versão de TypeScript é compatível
2. Se há conflitos em seu arquivo `tsconfig.json` local
3. Se seu projeto precisa de configurações especiais não cobertas pelos arquivos fornecidos

## Contribuindo

Para contribuir com mudanças nas configurações TypeScript:

1. Discuta as mudanças na issue correspondente
2. Implemente as alterações no arquivo apropriado
3. Teste a configuração em diferentes tipos de projetos
4. Atualize esta documentação descrevendo o impacto das mudanças 