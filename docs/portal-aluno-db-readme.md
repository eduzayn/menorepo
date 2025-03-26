# Documentação Técnica: Banco de Dados do Portal do Aluno

Este documento explica a estrutura do banco de dados implementada para o módulo Portal do Aluno da plataforma Edunéxia.

## Visão Geral

O schema `portal_aluno` foi criado para armazenar todas as tabelas relacionadas ao portal do aluno, permitindo:

- Gerenciamento de perfis complementares dos alunos
- Acompanhamento de progresso nos conteúdos educacionais
- Upload e gestão de documentos
- Solicitação e controle de certificados
- Controle de acesso e bloqueios
- Registro de atividades dos alunos
- Sistema de gamificação

## Estrutura do Banco

### Schema e Tipos Enumerados

- Schema exclusivo: `portal_aluno`
- Tipos enumerados:
  - `documento_status`: pendente, aprovado, rejeitado, em_analise
  - `certificado_status`: disponivel, indisponivel, solicitado, emitido, enviado, cancelado
  - `motivo_bloqueio`: inadimplencia, documentacao_pendente, administrativo, suspensao_temporaria, inatividade
  - `tipo_conteudo`: aula, video, documento, quiz, tarefa, forum, material_complementar
  - `progresso_status`: nao_iniciado, em_progresso, concluido, atrasado, cancelado

### Tabelas Principais

1. **perfil_aluno**
   - Complemento ao perfil básico do usuário
   - Informações pessoais, preferências e dados de contato
   - Vinculado à matrícula do aluno

2. **progresso_conteudo**
   - Registra o avanço do aluno em cada conteúdo
   - Armazena notas, tempo gasto e status de conclusão
   - Permite análise detalhada do desempenho do aluno

3. **documentos_aluno**
   - Gerencia documentos enviados pelo aluno
   - Controla status de aprovação e revisão
   - Permite feedback para correções

4. **certificados**
   - Controla solicitações e emissões de certificados
   - Implementa código de validação para autenticidade
   - Gerencia motivos de indisponibilidade

5. **bloqueios_acesso**
   - Controla bloqueios temporários ou permanentes
   - Registra motivos e descrições dos bloqueios
   - Permite desbloqueio automático por data

6. **atividades_aluno**
   - Registra histórico de uso da plataforma
   - Captura IP e agente de usuário para segurança
   - Permite análise de padrões de uso

7. **gamificacao**
   - Sistema de pontos, medalhas e conquistas
   - Incentiva participação e engajamento
   - Histórico de pontuação para acompanhamento

### Views

1. **situacao_aluno**
   - Visão consolidada do status atual do aluno
   - Mostra bloqueios, documentos pendentes, parcelas atrasadas
   - Útil para dashboard e relatórios

2. **estatisticas_uso**
   - Métricas de utilização da plataforma
   - Alunos ativos por dia e atividades realizadas
   - Acompanhamento de conclusão de conteúdos

### Storage Buckets

Três buckets foram criados para armazenamento:

1. **documentos_aluno**: Documentos enviados pelos alunos (privado)
2. **certificados**: Certificados emitidos pela plataforma (privado)
3. **fotos_aluno**: Fotos de perfil dos alunos (público)

## Segurança e Permissões

O script implementa Row Level Security (RLS) em todas as tabelas, seguindo as políticas:

- Alunos visualizam apenas seus próprios dados
- Administradores e tutores têm acesso conforme permissões específicas
- Políticas específicas para cada operação (SELECT, INSERT, UPDATE)
- Controle por role do usuário (super_admin, admin_instituicao, tutor, aluno)

## Automatizações

Funções e triggers implementados:

- Atualização automática de timestamps (updated_at)
- Criação automática de perfil complementar para alunos
- Registro de atividades simplificado via função
- Verificação de elegibilidade para certificados

## Integrações com Outros Módulos

A estrutura foi projetada para integrar com:

- **Matrículas**: Vinculado pelo `matricula_id`
- **Material Didático**: Referencia conteúdos via `conteudo.disciplinas` e `conteudo.aulas`
- **Autenticação**: Usa `auth.users` para identificação
- **Financeiro**: Conecta-se à tabela `pagamentos` para verificar inadimplência

## Como Usar

### Para Desenvolvedores Frontend

```typescript
import { supabase } from '@edunexia/api-client';

// Exemplo de consulta ao perfil do aluno
const getPerfilAluno = async (userId) => {
  const { data, error } = await supabase
    .from('portal_aluno.perfil_aluno')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
};

// Exemplo de registro de progresso
const atualizarProgresso = async (alunoId, aulaId, porcentagem) => {
  const { data, error } = await supabase
    .from('portal_aluno.progresso_conteudo')
    .upsert({
      aluno_id: alunoId,
      aula_id: aulaId,
      porcentagem_concluida: porcentagem,
      ultima_interacao: new Date(),
      status: porcentagem === 100 ? 'concluido' : 'em_progresso'
    }, { onConflict: ['aluno_id', 'aula_id'] });
    
  if (error) throw error;
  return data;
};
```

### Para Administradores de Banco

- Execute o script `20240330000000_portal_aluno_schema.sql` para criar toda a estrutura
- As políticas RLS já estão configuradas para segurança
- Buckets de storage são criados automaticamente

### Comandos Úteis Para Teste

```sql
-- Verificar alunos e seu progresso
SELECT a.full_name, a.email, 
  COUNT(p.id) as total_conteudos,
  COUNT(CASE WHEN p.status = 'concluido' THEN 1 END) as concluidos,
  ROUND(AVG(p.porcentagem_concluida)) as media_progresso
FROM public.profiles a
LEFT JOIN portal_aluno.progresso_conteudo p ON a.id = p.aluno_id
WHERE a.role = 'aluno'
GROUP BY a.id, a.full_name, a.email;

-- Verificar documentos pendentes
SELECT a.full_name, d.nome, d.tipo, d.status
FROM portal_aluno.documentos_aluno d
JOIN public.profiles a ON d.aluno_id = a.id
WHERE d.status = 'pendente';

-- Verificar elegibilidade para certificados
SELECT a.full_name, c.nome as curso,
  portal_aluno.verificar_elegibilidade_certificado(a.id, m.curso_id) as elegivel
FROM public.profiles a
JOIN public.matriculas m ON a.id = m.aluno_id
JOIN public.cursos c ON m.curso_id = c.id
WHERE a.role = 'aluno';
```

## Próximos Passos

- Integração com o módulo de avaliação de desempenho
- Implementação de notificações automáticas baseadas em eventos
- Expansão do sistema de gamificação
- API para aplicativo móvel do aluno

## Suporte e Manutenção

Ao modificar este schema, sempre considere:

1. Compatibilidade com os módulos existentes
2. Segurança dos dados (RLS)
3. Impacto na performance para grandes volumes
4. Possibilidade de ativação incremental das funcionalidades 