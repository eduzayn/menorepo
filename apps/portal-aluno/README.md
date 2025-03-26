# README TÉCNICO - Módulo Portal do Aluno da Plataforma Edunéxia

##  Visão Geral

> * Objetivo:*
> O Módulo Portal do Aluno é o ambiente digital onde o aluno tem acesso a todas as informações e serviços da instituição. Ele é responsável pela visualização de conteúdos, progresso nos cursos, documentos, dados financeiros, certificados e comunicação com tutores.

> * Integração Total com o Ecossistema:*
> Integra-se aos módulos de Matrículas, Material Didático, Financeiro, Comunicação, Contratos e Inadimplência. Todas as informações do aluno fluem de forma automatizada, garantindo consistência.

##  Tecnologias Utilizadas
- *React + TypeScript* (Frontend)
- *Supabase* (Banco e Auth)
- *TailwindCSS* (Design system)
- *Yarn Workspaces* (Monorepo)

##  Principais Funcionalidades

###  Perfil e Credenciais
- Visualização dos dados pessoais e acadêmicos
- Edição de informações permitidas (ex: foto, telefone)
- Acesso à carteirinha digital
- Visualização de histórico escolar e cursos concluídos
- Foto, mini bio e dados complementares configuráveis
- Fomenta uma comunidade mais conectada
- Visualização do curso atual, próximas aulas e tarefas
- Status da matrícula e documentos
- Avisos importantes e notificações

###  Área de Estudos (Integração com Módulo Material Didático)
- Feedback automatizado por *IA* em todas as atividades realizadas pelo aluno
- Acesso por disciplina e módulo
- Vídeos-aula com acompanhamento de progresso
- Testes e Avaliações com notas automáticas
- Entrega de atividades (upload ou preenchimento)
- Simulados, fóruns e e-books

###  Documentos
- Upload de documentos obrigatórios
- Status de deferimento (pendente, aprovado, reprovado)
- Correção automatizada por *IA* com base em regras pré-definidas (formato, validade, tipo)
- Visualização de contratos assinados

###  Financeiro
- Visualização de parcelas e boletos
- Emissão de 2ª via
- Solicitação de negociação (gera aditivos)
- Status financeiro e bloqueios

###  Certificações
- Solicitação de certificado (após cumprir critérios)
- Validação dos seguintes requisitos:
  - Conclusão de todas as atividades
  - Média mínima 70%
  - Quitado integralmente
  - Documentação deferida
  - Tempo mínimo de curso atingido

###  Controle de Acesso
- Bloqueio automático após 10 dias de atraso no primeiro pagamento
- Bloqueio após 30 dias de inadimplência
- Cancelamento automático após 90 dias
- Mensagens claras com orientação para regularização

###  Suporte e Comunicação
- Chat com a *Professora Ana (IA)* para dúvidas sobre conteúdo e gerais
- Contato com tutoria
- Chat com IA
- Notificações recebidas
- Histórico de atendimento

##  Layout (Visual)
```text
┌────────────────────────────┐
│        Menu Lateral        │
├────────────────────────────┤
│   Dashboard Inicial        │
├────────────────────────────┤
│   Perfil do Aluno          │ ← Credenciais e dados acadêmicos
├────────────────────────────┤
│   Área de Estudos          │ ← Rota de aprendizagem
├────────────────────────────┤
│   Financeiro               │ ← Parcelas, boletos, negociação
├────────────────────────────┤
│   Documentos               │ ← Uploads, status, correções IA
├────────────────────────────┤
│   Certificados             │ ← Solicitação e regras
├────────────────────────────┤
│   Calendário               │ ← Eventos e prazos
├────────────────────────────┤
│   Recursos e Biblioteca    │ ← Materiais extras
├────────────────────────────┤
│   Gamificação              │ ← Pontos e conquistas
├────────────────────────────┤
│   Feedbacks e Avaliações   │ ← Avaliação da plataforma
├────────────────────────────┤
│   Suporte                  │ ← Atendimento, IA, mensagens
│     └── Professora Ana     │ ← Chat IA
└────────────────────────────┘
```

##  Integrações
- *Matrículas*: status de matrícula, documentos, acesso
- *Financeiro*: cobranças, pagamentos, bloqueios
- *Material Didático*: conteúdo e acompanhamento
- *Comunicação*: atendimento automatizado, mensagens
- *Contabilidade*: status financeiro

##  Rotas e Páginas
```bash
/dashboard                         # Visão inicial
/perfil                            # Visualização e edição de perfil
/perfil/credenciais                # Carteirinha digital e histórico
/estudos                           # Lista de cursos e progresso
/estudos/:cursoId                  # Detalhes e aulas
/financeiro                        # Visão geral do financeiro
/financeiro/negociar/:parcelaId    # Solicitação de acordo
/documentos                        # Upload e status
/certificados                      # Certificados emitidos
/certificados/solicitar            # Solicitação de certificado
/calendario                        # Calendário acadêmico
/recursos                          # Biblioteca de materiais extras
/gamificacao                       # Painel de pontos e conquistas
/avaliacoes                        # Feedback do aluno
/suporte                           # Canal de atendimento
/suporte/ana                       # Chat com a Professora Ana (IA)
```

##  Modo Noturno
- Alternância entre tema claro e escuro, com salvamento de preferência

##  Estrutura de Código
```bash
apps/portal-do-aluno/
├── src/
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
├── public/
├── package.json
└── tsconfig.json
```

##  Supabase (Schema portal_aluno)
| Tabela                  | Finalidade                             |
|-------------------------|----------------------------------------|
| usuarios_aluno         | Dados pessoais e vinculação à matrícula |
| progresso_conteudo     | Registro de andamento e notas           |
| documentos_uploads     | Upload e status de aprovação            |
| certificados           | Certificados gerados e datas            |
| bloqueios              | Regras de bloqueio e motivo             |

##  Documentação Complementar
> Este módulo integra-se ao monorepo da Edunéxia. Consulte o [README Principal](../../README.md) e os módulos de Matrículas e Material Didático para detalhes integrados.

---

Com esse portal, o aluno da Edunéxia tem uma experiência moderna, segura e fluida, integrando aprendizado, gestão financeira e suporte com autonomia total. 