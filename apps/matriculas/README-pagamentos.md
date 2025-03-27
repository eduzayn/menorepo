# Módulo de Pagamentos - Edunéxia Matrículas

Este módulo integra a plataforma Edunéxia com gateways de pagamento para processar matrículas e mensalidades.

## Gateways Suportados

Atualmente, o módulo suporta os seguintes gateways:

- **Lytex** - Processamento de boletos, PIX e cartão de crédito
- **InfinitePay** *(em desenvolvimento)* - Processamento de cartão de crédito

## Estrutura do Módulo

```
apps/matriculas/
├── services/                      # Serviços de integração
│   ├── lytexService.ts            # Serviço de comunicação com Lytex
│   └── ...
├── scripts/
│   ├── edge-functions/            # Funções Edge (Supabase)
│   │   └── lytex-webhook/         # Webhook para Lytex
│   ├── lytex-charge-creator.js    # Utilitário para criar cobranças
│   ├── deploy-lytex-webhook.js    # Script de implantação
│   └── create-lytex-webhook.sql   # Esquema do banco de dados
├── docs/
│   └── integracao-lytex.md        # Documentação da integração Lytex
└── .env                           # Variáveis de ambiente (não versionar)
```

## Configuração

1. Copie o arquivo `.env.example` para `.env` e preencha os dados
2. Instale as dependências com `pnpm install`
3. Execute o SQL em `scripts/create-lytex-webhook.sql` no Supabase
4. Implante a Edge Function com `node scripts/deploy-lytex-webhook.js`

## Webhooks

Cada gateway possui um endpoint específico para receber notificações de pagamento. Os endpoints são:

- **Lytex**: `https://[project-ref].supabase.co/functions/v1/lytex-webhook`
- **InfinitePay**: *(em desenvolvimento)*

## Fluxo de Pagamento

1. Usuário seleciona forma de pagamento
2. Sistema cria cobrança usando o serviço correspondente
3. Usuário é redirecionado para página de checkout do gateway
4. Após pagamento, o gateway envia notificação para o webhook
5. Webhook atualiza o status do pagamento no banco de dados
6. Sistema notifica o usuário sobre o status do pagamento

## Testes

Para testar a integração Lytex:

```bash
# Criar uma cobrança PIX de R$ 10
node scripts/lytex-charge-creator.js pix 10

# Criar um boleto de R$ 50
node scripts/lytex-charge-creator.js boleto 50

# Criar uma cobrança de cartão de crédito de R$ 100
node scripts/lytex-charge-creator.js credit_card 100
```

## Segurança

- Credenciais sensíveis são armazenadas como variáveis de ambiente
- Os webhooks são protegidos por chaves de autenticação
- Transações e logs são armazenados no banco de dados
- Implementada validação de dados em todas as etapas do processo

## Implantação

Para implantar atualizações:

1. Atualize o código da Edge Function
2. Execute `node scripts/deploy-lytex-webhook.js`
3. Verifique no painel do Supabase se a função foi atualizada

## Referências

- [Documentação Lytex](https://docs.lytex.com.br)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Documentação detalhada](./docs/integracao-lytex.md) 