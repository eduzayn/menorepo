# Progresso da Refatoração do Módulo apps/core

Este documento registra o progresso da migração de componentes, hooks e contextos do `apps/core` para os pacotes específicos, conforme o plano de refatoração.

## Componentes UI

| Componente | Status | Destino | Observações |
|------------|--------|---------|-------------|
| DashboardLayout | ✅ Migrado | packages/ui-components | Migrado com melhorias de estilo e flexibilidade |
| PageHeader | ✅ Migrado | packages/ui-components | Já realizado anteriormente |
| Alert | ✅ Migrado | packages/ui-components | Melhorado com ícones e estilos modernos |
| Loader | ✅ Migrado | packages/ui-components | Adicionadas novas opções de cores |

## Hooks

| Hook | Status | Destino | Observações |
|------|--------|---------|-------------|
| useAuth | ✅ Migrado | packages/auth | Já existia uma implementação em packages/auth |
| useNavigation | ✅ Migrado | packages/navigation | Migrado para um novo pacote específico com melhorias |
| useNotifications | ✅ Migrado | packages/notifications | Migrado para um novo pacote específico com contexto |

## Contextos

| Contexto | Status | Destino | Observações |
|----------|--------|---------|-------------|
| UserContext | ✅ Migrado | packages/auth | Substituído pelo AuthProvider já existente |
| AlertContext | ✅ Migrado | packages/ui-components | Migrado usando o componente Alert atualizado |
| ThemeContext | ✅ Migrado | packages/ui-components | Migrado com suporte a Tailwind e melhorias |

## Atualizações de Importações

| Módulo | Status | Observações |
|--------|--------|-------------|
| apps/portal-do-aluno | ✅ Atualizado | Migrado ThemeProvider, AlertProvider e substituído UserProvider por AuthProvider |
| apps/material-didatico | ✅ Atualizado | Já estava usando os pacotes específicos |
| apps/comunicacao | ✅ Atualizado | Migrado ThemeProvider, AlertProvider e outras dependências |
| apps/portal-polo | ✅ Atualizado | Migrados componentes UI, formatters (utils) e ApiProvider |
| apps/matriculas | ✅ Atualizado | Migrada importação de ROUTE_PREFIXES no Login.tsx |
| apps/portal-parceiro | ✅ Atualizado | Removida importação de ROUTE_PREFIXES do core |
| apps/financeiro-empresarial | ✅ Atualizado | Removidas todas as dependências do core |
| apps/site-vendas | 🚫 Inexistente | Módulo não encontrado, módulo equivalente é site-edunexia |
| packages/auth | ✅ Atualizado | Reimplementados os tipos e constantes internamente |

## Novos Pacotes Criados

| Pacote | Descrição | Observações |
|--------|-----------|-------------|
| packages/navigation | Gerenciamento de navegação | Contém useNavigation e estruturas de rotas |
| packages/notifications | Sistema de notificações | Contém useNotifications e componentes relacionados |
| packages/utils | Funções utilitárias | Já existia no monorepo, contém formatCurrency, formatDate, etc. |

## Desafios Encontrados

1. **Substituição do UserProvider**: O UserProvider foi substituído pelo AuthProvider em diversos módulos. Verificamos que não houve impacto nas funcionalidades existentes.

2. **Dependências de tipos e constantes**: As dependências foram acomodadas de duas formas: algumas migraram para seus pacotes específicos, outras foram reimplementadas localmente para evitar dependências circulares.

3. **Dependências circulares**: Implementamos uma estratégia para evitar dependências circulares entre pacotes, utilizando definições de tipos locais quando necessário.

## Próximos Passos

1. ✅ ~~Migrar os contextos AlertContext e ThemeContext para ui-components~~
2. ✅ ~~Criar pacotes específicos para navigation e notifications~~
3. ✅ ~~Atualizar todas as importações nos módulos da aplicação~~
   - ✅ apps/comunicacao
   - ✅ apps/portal-polo
   - ✅ apps/portal-do-aluno
   - ✅ apps/material-didatico
   - ✅ apps/matriculas
   - ✅ apps/portal-parceiro
   - ✅ apps/financeiro-empresarial
   - 🚫 apps/site-vendas (inexistente)
4. ✅ ~~Corrigir as dependências de tipos e constantes em packages/auth~~
   - ✅ Migração do tipo ModuleName para packages/navigation
   - ✅ Migração das constantes ROUTE_PREFIXES para packages/navigation
   - ✅ Corrigidos erros de tipagem no AuthProvider
5. ✅ ~~Usar o pacote @edunexia/utils para funções utilitárias~~
   - ✅ Atualizado importações em apps/portal-polo para formatCurrency e formatDate
6. ✅ ~~Remover o módulo apps/core~~
   - ✅ Removido diretório apps/core
   - ✅ Atualizados package.json de todos os módulos para remover dependência
   - ✅ Atualizado tsconfig.json para remover referência ao módulo

## Observações Gerais

- A migração foi concluída com sucesso, resultando em uma arquitetura mais organizada e modular.
- Os componentes foram modernizados com Tailwind CSS durante a migração.
- Os contextos foram melhorados, como o ThemeContext que agora possui integração com o Tailwind.
- Os novos pacotes (navigation e notifications) foram criados do zero com base no código do apps/core.
- A arquitetura atual permite maior flexibilidade para atualizações futuras, já que cada funcionalidade agora está em seu pacote específico. 