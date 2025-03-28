# Controle de Versões no Monorepo Edunéxia

Este documento descreve as práticas de controle de versões de dependências no monorepo da Edunéxia, visando garantir consistência e prevenir problemas de compatibilidade.

## Problema

Em um monorepo com múltiplos pacotes e aplicações, é comum enfrentar:

1. **Inconsistência de versões**: Diferentes pacotes usando versões distintas da mesma dependência
2. **Conflitos de compatibilidade**: Versões incompatíveis causando problemas em tempo de execução
3. **Dificuldade de manutenção**: Atualizar dependências manualmente em vários pacotes é propenso a erros

## Solução: Syncpack

O monorepo da Edunéxia utiliza o [syncpack](https://jamiemason.github.io/syncpack/) para verificar e manter a consistência nas versões das dependências em todos os pacotes.

### Como funciona

1. O Syncpack analisa todos os arquivos `package.json` do monorepo
2. Compara as versões de cada dependência em todos os pacotes
3. Alerta sobre inconsistências ou versões conflitantes
4. Pode corrigir automaticamente problemas de versão

### Regras estabelecidas

As seguintes regras foram configuradas no arquivo `.syncpackrc`:

- **React e ReactDOM**: Todas as versões devem ser idênticas no monorepo
- **Radix UI**: Todas as bibliotecas Radix UI devem usar a mesma versão
- **TanStack**: Todos os pacotes TanStack devem usar a mesma versão
- **Pacotes locais**: Permitimos uso de `workspace:*` em `devDependencies`
- **PeerDependencies**: Permitimos ranges de compatibilidade para maior flexibilidade

## Como usar

### Verificar consistência de versões

```bash
pnpm version:check
# ou
pnpm syncpack:lint
```

### Listar todas as versões

```bash
pnpm syncpack:list
```

### Corrigir inconsistências automaticamente

```bash
pnpm version:fix
# ou
pnpm syncpack:fix-mismatches
```

### Atualizar dependências

```bash
# Atualizar todas as dependências de desenvolvimento
pnpm syncpack:update --types dev

# Atualizar dependências específicas
pnpm syncpack:update --filter react
```

## Integração Contínua

Um workflow do GitHub Actions (`version-check.yml`) verifica automaticamente a consistência das versões em cada pull request, garantindo que novas alterações não introduzam inconsistências.

## Resolução de problemas comuns

### Versões conflitantes de React

Quando encontrar conflitos envolvendo versões do React, utilize o script de correção:

```bash
pnpm syncpack:fix-mismatches
```

Se precisar forçar uma versão específica para todos os pacotes:

```bash
pnpm syncpack:fix-mismatches --bump highest
```

### Exceções às regras

Algumas exceções às regras de versão podem ser configuradas no arquivo `.syncpackrc`. Por exemplo, para um pacote específico que precisa usar uma versão diferente de uma dependência:

```json
{
  "versionGroups": [
    {
      "label": "Exceção para pacote específico",
      "packages": ["apps/legacy-app"],
      "dependencies": ["react"],
      "policy": "ignore"
    }
  ]
}
```

## Recomendações

1. Sempre execute `pnpm version:check` antes de criar um pull request
2. Prefira utilizar o mesmo range semântico (`^`) para dependências
3. Para bibliotecas críticas como React, use exatamente a mesma versão em todos os pacotes
4. Atualize dependências regularmente, preferivelmente em conjunto 