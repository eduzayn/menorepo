# Guia de Implantação do Monorepo Edunéxia no Vercel

Este documento apresenta as instruções detalhadas para implantar o monorepo Edunéxia na plataforma Vercel, garantindo a correta configuração para todos os módulos.

## Visão Geral

O projeto Edunéxia é estruturado como um monorepo gerenciado com PNPM Workspaces e Turborepo, contendo múltiplos aplicativos em `apps/` e pacotes compartilhados em `packages/`. A implantação no Vercel requer uma abordagem específica para monorepos.

## Pré-requisitos

- Conta na Vercel
- Repositório git conectado à Vercel
- PNPM instalado localmente
- Turborepo configurado no projeto (já implementado)
- Acesso administrativo ao painel da Vercel

## Passo 1: Preparação do Repositório

1. Certifique-se de que o arquivo `pnpm-lock.yaml` está atualizado e commitado:
   ```bash
   pnpm install
   git add pnpm-lock.yaml
   git commit -m "chore: atualiza pnpm-lock.yaml para deploy"
   git push
   ```

2. Verifique se todos os scripts de build estão funcionando localmente:
   ```bash
   pnpm build
   ```

## Passo 2: Configuração do Vercel CLI

1. Instale o Vercel CLI globalmente:
   ```bash
   npm install -g vercel
   ```

2. Faça login no Vercel:
   ```bash
   vercel login
   ```

3. Configure o token do Turborepo para cache remoto:
   ```bash
   npx turbo login
   ```

4. Anote o token gerado para usar nas configurações de variáveis de ambiente.

## Passo 3: Configuração do Arquivo `vercel.json`

Para cada aplicativo em `apps/`, crie um arquivo `vercel.json` com a seguinte configuração:

```bash
cd apps/site-edunexia
touch vercel.json
```

Adicione o seguinte conteúdo (substituindo `site-edunexia` pelo nome do aplicativo específico):

```json
{
  "buildCommand": "cd ../.. && pnpm build --filter=@edunexia/site-edunexia",
  "outputDirectory": "dist",
  "installCommand": "cd ../.. && pnpm install",
  "framework": "vite"
}
```

Repita este processo para cada aplicativo que deseja implantar.

## Passo 4: Implementação dos Projetos na Vercel

### 4.1. Módulo `site-edunexia`

1. Acesse o dashboard do Vercel e clique em "Add New" → "Project"
2. Selecione o repositório do monorepo Edunéxia
3. Configure o projeto:
   - Nome do projeto: `edunexia-site`
   - Framework: `Vite`
   - Root Directory: `apps/site-edunexia`
   - Build Command: `cd ../.. && pnpm build --filter=@edunexia/site-edunexia`
   - Output Directory: `dist`
4. Em "Environment Variables", adicione:
   - `TURBO_TOKEN`: [token gerado pelo turbo login]
   - `TURBO_TEAM`: `edunexia`
   - `VITE_SUPABASE_URL`: [URL do Supabase]
   - `VITE_SUPABASE_ANON_KEY`: [Chave anônima do Supabase]
5. Configure o domínio personalizado:
   - Em "Settings" → "Domains", adicione `site.edunexia.com`
6. Clique em "Deploy"

### 4.2. Módulo `portal-do-aluno`

1. Acesse o dashboard do Vercel e clique em "Add New" → "Project"
2. Selecione o repositório do monorepo Edunéxia
3. Configure o projeto:
   - Nome do projeto: `edunexia-portal-aluno`
   - Framework: `Vite`
   - Root Directory: `apps/portal-do-aluno`
   - Build Command: `cd ../.. && pnpm build --filter=@edunexia/portal-do-aluno`
   - Output Directory: `dist`
4. Em "Environment Variables", adicione:
   - `TURBO_TOKEN`: [token gerado pelo turbo login]
   - `TURBO_TEAM`: `edunexia`
   - `VITE_SUPABASE_URL`: [URL do Supabase]
   - `VITE_SUPABASE_ANON_KEY`: [Chave anônima do Supabase]
5. Configure o domínio personalizado:
   - Em "Settings" → "Domains", adicione `aluno.edunexia.com`
6. Clique em "Deploy"

### 4.3. Repita o processo para os outros módulos

Repita o processo acima para cada um dos módulos prioritários:
- `matriculas` (domínio: `matriculas.edunexia.com`)
- `comunicacao` (domínio: `comunicacao.edunexia.com`)
- `material-didatico` (domínio: `material.edunexia.com`)
- E assim por diante para os demais módulos

## Passo 5: Configuração de Integrações Contínuas

1. Para cada projeto configurado na Vercel, acesse "Settings" → "Git"
2. Configure:
   - Production Branch: `main`
   - Preview Branches: Enable for all branches
   - Configurações de deploy automático:
     - Deploy when commits are pushed to main

## Passo 6: Verificação e Testes

Após cada implantação:

1. Verifique os logs de build para identificar erros
2. Teste a aplicação implantada para garantir que tudo está funcionando
3. Verifique se os pacotes compartilhados foram corretamente importados

## Passo 7: Configuração de Monitoramento (Opcional)

1. Ative o Vercel Analytics:
   - Em cada projeto, acesse "Settings" → "Analytics"
   - Clique em "Enable Analytics"

2. Configure alertas:
   - Em "Settings" → "Monitoring", configure alertas para falhas de implantação ou erros em produção

## Passo 8: Otimizações Adicionais

### 8.1. Cache de Builds

Certifique-se de que o cache entre builds está funcionando corretamente:

1. Verifique nos logs de build se o cache do Turborepo está sendo utilizado
2. Adicione ao `.gitignore`:
   ```
   .vercel
   ```

### 8.2. Performance

Para otimizar a performance das aplicações implantadas:

1. Ative a compressão avançada em "Settings" → "Advanced"
2. Configure a Edge Network para melhor desempenho global

## Resolução de Problemas Comuns

### Erro no Build do Monorepo

**Problema**: Falha ao resolver dependências internas (workspaces)

**Solução**:
1. Verifique se o `installCommand` no `vercel.json` está correto
2. Certifique-se de que o `pnpm-lock.yaml` está atualizado
3. Valide se as dependências no `package.json` usam o prefixo `workspace:*` corretamente

### Variáveis de Ambiente Não Acessíveis

**Problema**: Aplicação não consegue acessar as variáveis de ambiente

**Solução**:
1. Para variáveis do Vite, certifique-se de que começam com `VITE_`
2. Verifique se as variáveis estão definidas no Dashboard da Vercel
3. Para variáveis apenas de build, use `Build Environment Variables` nas configurações do projeto

## Notas Finais

- Mantenha um registro de todas as implantações e seus domínios
- Documente quaisquer modificações específicas por módulo
- Estabeleça um processo para testar implantações antes de disponibilizá-las aos usuários

---

## Referências

- [Documentação oficial da Vercel sobre Monorepos](https://vercel.com/docs/concepts/monorepos)
- [Documentação do Turborepo](https://turbo.build/repo/docs)
- [Guia da Vercel para PNPM](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js#pnpm)
- [Configuração de domínios na Vercel](https://vercel.com/docs/concepts/projects/domains) 