# Módulo de Comunicação

Este é o módulo de comunicação integrado, que permite gerenciar conversas, mensagens e interações com usuários através de diferentes canais.

## Funcionalidades

- Lista de conversas com busca e filtros
- Chat em tempo real com suporte a diferentes tipos de mensagens
- Respostas rápidas pré-definidas
- Suporte a múltiplos canais (chat, email, SMS, WhatsApp)
- Notificações e indicadores de status
- Integração com Supabase para persistência e tempo real

## Pré-requisitos

- Node.js 18+
- pnpm 8+
- Conta no Supabase

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   pnpm install
   ```
3. Copie o arquivo `.env.example` para `.env` e configure as variáveis:
   ```bash
   cp .env.example .env
   ```
4. Configure as variáveis do Supabase no arquivo `.env`:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
pnpm dev
```

## Build

Para gerar o build de produção:

```bash
pnpm build
```

## Testes

Para executar os testes:

```bash
pnpm test
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes React
  ├── contexts/      # Contextos React
  ├── hooks/         # Hooks personalizados
  ├── lib/           # Configurações e utilitários
  ├── pages/         # Páginas da aplicação
  ├── services/      # Serviços e integrações
  ├── types/         # Tipos TypeScript
  └── utils/         # Funções utilitárias
```

## Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- Supabase
- Vite
- Vitest

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'feat: adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Documentação Técnica

Para informações técnicas detalhadas sobre a implementação, arquitetura e integrações, consulte o [README Técnico](TECHNICAL.md). 