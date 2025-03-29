# Módulo de Recursos Humanos (RH) - Edunéxia

Este módulo faz parte da plataforma Edunéxia e gerencia todos os processos relacionados à área de Recursos Humanos.

## Visão Geral

O módulo de RH permite gerenciar o ciclo completo de recursos humanos de uma instituição educacional, incluindo:

- Recrutamento e seleção
- Gestão de colaboradores
- Avaliação de desempenho
- Dashboard de indicadores
- Perfil profissional
- Integração com redes sociais para contratação

## Estrutura do Módulo

```
apps/rh/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── candidatos/     # Gestão de candidatos
│   │   ├── colaboradores/  # Gestão de colaboradores
│   │   ├── recrutamento/   # Processo seletivo
│   │   ├── dashboard/      # Indicadores e métricas
│   │   ├── perfil/         # Perfil do colaborador
│   │   └── avaliacao/      # Avaliação de desempenho
│   ├── contexts/           # Contextos para estados compartilhados
│   ├── hooks/              # Hooks personalizados
│   ├── pages/              # Páginas principais
│   ├── services/           # Serviços e integrações
│   ├── utils/              # Funções utilitárias
│   └── types/              # Tipagens específicas do módulo
├── package.json            # Dependências do módulo
├── tsconfig.json           # Configuração TypeScript
└── README.md               # Esta documentação
```

## Responsabilidades

- **Gestão de recrutamento**: Publicação de vagas, triagem de currículos, agendamento de entrevistas
- **Gestão de colaboradores**: Cadastro, histórico, documentação e informações contratuais
- **Avaliação de desempenho**: Ciclos de avaliação, metas, feedback e planos de desenvolvimento
- **Dashboard de RH**: Indicadores de turnover, headcount, tempo médio de contratação
- **Integração com redes sociais**: LinkedIn, Facebook, Twitter e GitHub para recrutamento

## Fluxos Principais

1. **Recrutamento**:
   - Criação da vaga
   - Publicação em redes sociais e portais
   - Recebimento e triagem de candidaturas
   - Processo seletivo (entrevistas, testes)
   - Contratação e onboarding

2. **Gestão de Colaboradores**:
   - Cadastro completo
   - Gestão de documentos
   - Histórico profissional
   - Férias e licenças
   - Desligamento

3. **Avaliação de Desempenho**:
   - Definição de metas
   - Avaliação 360°
   - Feedback contínuo
   - Plano de desenvolvimento

## Integração com outros Módulos

- **Portal do Aluno**: Para professores que também são colaboradores
- **Financeiro**: Para folha de pagamento e benefícios
- **Comunicação**: Para comunicados internos aos colaboradores
- **Core**: Para autenticação e permissões

## Funcionalidades de Redes Sociais

- Publicação automática de vagas no LinkedIn, Facebook e Twitter
- Login social para candidatos
- Importação de dados profissionais do LinkedIn
- Integração com GitHub para vagas técnicas
- Compartilhamento de conquistas dos colaboradores

## Como Usar

1. Instale as dependências:
```bash
pnpm install
```

2. Execute o ambiente de desenvolvimento:
```bash
pnpm dev
```

3. Para construir o módulo:
```bash
pnpm build
```

## Desenvolvimento

Para contribuir com este módulo, siga as diretrizes gerais de contribuição do projeto Edunéxia e as especificações técnicas deste README. 