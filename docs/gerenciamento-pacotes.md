<!-- cSpell:disable -->
# Gerenciamento de Pacotes no Monorepo Edunéxia

Este documento estabelece as diretrizes oficiais para o gerenciamento de pacotes no monorepo da Edunéxia.

## O Gerenciador de Pacotes Oficial: pnpm

A Edunéxia padronizou o uso do **pnpm** como gerenciador de pacotes oficial para todo o monorepo. A decisão foi tomada com base nas seguintes vantagens:

1. **Eficiência de espaço em disco**: pnpm utiliza um armazenamento centralizado, economizando espaço
2. **Prevenção do "node_modules hell"**: estrutura de links mais previsível e segura
3. **Melhor performance**: instalação e atualização de dependências mais rápidas
4. **Melhor suporte a monorepos**: implementação robusta de workspaces
5. **Prevenção de dependências fantasmas**: evita que pacotes acessem dependências não declaradas

## Versão Padronizada

Para garantir consistência entre todos os desenvolvedores e ambientes CI/CD, a versão específica do pnpm está fixada em:

```
pnpm@8.9.0
```

Esta versão está definida em:
- `package.json` (campo "packageManager")
- Workflows do GitHub Actions

## Versão do Node.js

A versão padrão do Node.js para este projeto é:

```
node@18.16.0
```

Esta versão está definida em:
- `package.json` (campo "engines")
- `.npmrc` (campo "use-node-version")
- `.nvmrc` e `.node-version` para compatibilidade com ferramentas de controle de versão

### Importante: Formato da Versão do Node.js

Ao especificar a versão do Node.js em arquivos de configuração, sempre use o formato completo X.Y.Z:

✅ **Correto**: `18.16.0`  
❌ **Incorreto**: `18` ou `>=18`

O PNPM requer o formato completo X.Y.Z para baixar a versão correta do Node.js. Usar apenas o número principal da versão (como "18") causará erros.

## Instalação do pnpm

### Usando Corepack (Recomendado)

O [Corepack](https://nodejs.org/api/corepack.html) é uma ferramenta integrada ao Node.js que ajuda a gerenciar as versões dos gerenciadores de pacotes. É a maneira recomendada de instalar e usar o pnpm:

```bash
# Habilitar corepack (apenas uma vez)
corepack enable

# O pnpm já será instalado automaticamente na versão correta quando você entrar no diretório do projeto
# Não é necessário instalá-lo manualmente!
```

### Instalação Manual (Alternativa)

Se você não puder usar o Corepack, pode instalar o pnpm manualmente:

```bash
# Instalação global do npm
npm install -g pnpm@8.9.0

# Ou usando script de instalação oficial
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## Comandos Comuns

### Instalação de Dependências

```bash
# Instalar todas as dependências do monorepo
pnpm install

# Instalar em um pacote específico
pnpm --filter @edunexia/auth install
```

### Adicionar Novas Dependências

```bash
# Adicionar dependência específica a um pacote
pnpm add react --filter @edunexia/ui-components

# Adicionar dependência de desenvolvimento
pnpm add -D typescript --filter @edunexia/auth

# Adicionar dependência workspace (de outro pacote do monorepo)
pnpm add @edunexia/ui-components --filter @edunexia/portal-do-aluno

# Adicionar dependência a todo o monorepo
pnpm add -w eslint
```

### Executar Scripts

```bash
# Executar script em todos os pacotes que o implementam
pnpm build

# Executar script em um pacote específico
pnpm --filter @edunexia/auth build
```

## Lock File e Versionamento

O arquivo `pnpm-lock.yaml` **deve sempre ser commitado** no repositório. Nunca modifique manualmente ou ignore este arquivo. Ele garante que todos os desenvolvedores e ambientes de CI/CD instalem exatamente as mesmas versões de todas as dependências.

## Migrando de Yarn para pnpm

Se você estava usando Yarn anteriormente:

1. Remova `node_modules` e `yarn.lock`
2. Instale o pnpm conforme instruções acima
3. Execute `pnpm install` para criar o novo lock file

## Resolução de Problemas

### Conflitos no Lock File

Se ocorrerem conflitos de merge no arquivo pnpm-lock.yaml:

```bash
# Resolva os conflitos de merge no package.json primeiro
git checkout --ours pnpm-lock.yaml
pnpm install
git add pnpm-lock.yaml
```

### Dependências Quebradas

Se você encontrar problemas após a instalação:

```bash
# Limpa cache e reinstala
pnpm store prune
pnpm install --force
```

### Problemas com a Versão do Node.js

Se você encontrar o erro `ERR_PNPM_INVALID_NODE_VERSION`:

1. Verifique se o formato da versão no arquivo `.npmrc` está correto (deve ser X.Y.Z)
2. Use o NVM para mudar para a versão correta:
   ```bash
   nvm use
   ```
3. Ou instale a versão correta do Node.js manualmente

## Considerações para CI/CD

Para ambientes de CI/CD, certifique-se de:

1. Usar a mesma versão do pnpm (8.9.0)
2. Configurar o cache para melhorar o tempo de build
3. Usar `--frozen-lockfile` para garantir instalações determinísticas

Exemplo nos GitHub Actions:

```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 8.9.0
    
- name: Get pnpm store directory
  shell: bash
  run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV
    
- name: Setup pnpm cache
  uses: actions/cache@v3
  with:
    path: ${{ env.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
```

## Regras Importantes

1. **Nunca misture** gerenciadores de pacotes (npm, Yarn, pnpm) no projeto
2. **Não execute** comandos npm ou yarn no repositório
3. **Não edite** manualmente o arquivo pnpm-lock.yaml
4. **Sempre utilize** a versão exata do pnpm especificada (8.9.0)
5. **Commit** sempre o pnpm-lock.yaml após alterações nas dependências 
