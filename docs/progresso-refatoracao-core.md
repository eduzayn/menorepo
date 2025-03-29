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
| apps/portal-do-aluno | ⏳ Pendente | Verificar todas as importações de @edunexia/core |
| apps/material-didatico | ⏳ Pendente | Verificar todas as importações de @edunexia/core |
| apps/comunicacao | ⏳ Pendente | Verificar todas as importações de @edunexia/core |
| apps/matriculas | ⏳ Pendente | Verificar todas as importações de @edunexia/core |
| apps/site-vendas | ⏳ Pendente | Verificar todas as importações de @edunexia/core |

## Novos Pacotes Criados

| Pacote | Descrição | Observações |
|--------|-----------|-------------|
| packages/navigation | Gerenciamento de navegação | Contém useNavigation e estruturas de rotas |
| packages/notifications | Sistema de notificações | Contém useNotifications e componentes relacionados |

## Próximos Passos

1. ✅ ~~Migrar os contextos AlertContext e ThemeContext para ui-components~~
2. ✅ ~~Criar pacotes específicos para navigation e notifications~~
3. ⏳ Atualizar todas as importações nos módulos da aplicação
4. ⏳ Executar testes para garantir que nada foi quebrado
5. ⏳ Remover o módulo apps/core

## Observações Gerais

- A migração está seguindo a abordagem de dividir as responsabilidades em pacotes específicos
- Os componentes estão sendo modernizados com Tailwind CSS durante a migração
- Os contextos foram melhorados, como o ThemeContext que agora possui integração com o Tailwind
- Os novos pacotes (navigation e notifications) foram criados do zero com base no código do apps/core
- Próximo passo crítico é atualizar as importações em todos os módulos que dependem do apps/core 