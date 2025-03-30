# Documentação da Integração RH-Contabilidade

## Visão Geral

Este documento descreve a implementação da integração entre os módulos de Recursos Humanos (RH) e Contabilidade na plataforma Edunéxia. A integração permite a contabilização automatizada de eventos do RH, como folha de pagamento, provisões de férias e 13º salário, gerando lançamentos contábeis correspondentes.

## Arquitetura da Integração

A integração foi implementada com os seguintes componentes:

1. **Schemas SQL**:
   - `rh`: Contém tabelas e funções relacionadas ao módulo de RH
   - `contabilidade`: Contém tabelas e funções do módulo contábil

2. **Tabelas Principais**:
   - `rh.pendencias_contabilizacao`: Registra eventos de RH pendentes de contabilização
   - `contabilidade.contas`: Armazena o plano de contas da instituição
   - `contabilidade.lancamentos`: Registra os lançamentos contábeis
   - `contabilidade.integracoes`: Registra o histórico de integrações entre módulos

3. **Funções de Integração**:
   - `contabilidade.gerar_plano_contas_rh()`: Gera um plano de contas específico para RH
   - `contabilidade.contabilizar_folha_pagamento()`: Gera lançamentos contábeis da folha
   - `contabilidade.verificar_plano_contas_rh()`: Verifica se o plano de contas RH já existe

4. **Edge Function**:
   - `integrar-rh-contabilidade`: API RESTful para executar funções de integração

## Fluxo da Integração

### Contabilização da Folha de Pagamento

1. **Preparação**: O módulo de RH processa a folha de pagamento e aprova os valores.
2. **Pendência**: Ao aprovar a folha, uma entrada é gerada em `rh.pendencias_contabilizacao`.
3. **Contabilização**: O contador acessa a tela de integração e solicita a contabilização.
4. **Processamento**: O sistema executa a função `contabilidade.contabilizar_folha_pagamento()`.
5. **Resultado**: São criados lançamentos contábeis nas contas apropriadas:
   - Débito: Despesas com Pessoal (3.1.1.01)
   - Crédito: Salários a Pagar (2.1.3.01)
6. **Atualização**: A pendência é marcada como processada e um registro de integração é criado.

### Plano de Contas para RH

Para utilizar a integração, cada instituição precisa ter um plano de contas específico para RH. A estrutura básica inclui:

- **Despesas (3)**
  - **Despesas Operacionais (3.1)**
    - **Despesas com Pessoal (3.1.1)**
      - Salários e Ordenados (3.1.1.01)
      - Encargos Sociais (3.1.1.02)
      - INSS (3.1.1.03)
      - FGTS (3.1.1.04)
      - etc.
    - **Provisões Trabalhistas (3.1.2)**
      - Provisão para Férias (3.1.2.01)
      - Provisão para 13º (3.1.2.02)
      - etc.

- **Passivo (2)**
  - **Passivo Circulante (2.1)**
    - **Obrigações Trabalhistas (2.1.3)**
      - Salários a Pagar (2.1.3.01)
      - Encargos a Recolher (2.1.3.02)
      - etc.
    - **Provisões Trabalhistas (2.1.4)**
      - Provisão para Férias (2.1.4.01)
      - Provisão para 13º (2.1.4.02)
      - etc.

## Estrutura de SQL Migrations

Os scripts de migração estão organizados da seguinte forma:

1. `20240701_tipos_enumerados.sql`: Cria os tipos enumerados necessários
2. `20240702_tabelas_integracao.sql`: Cria as tabelas de integração
3. `20240703_funcao_contabilizar_folha.sql`: Implementa a função de contabilização
4. `20240704_correcao_check_contas.sql`: Corrige validações do plano de contas
5. `usuarios_instituicoes.sql`: Cria tabela de usuários e instituições
6. `correcao_policias_rls.sql`: Corrige políticas de segurança

Para executar todas as migrações em sequência, use o script `migrate_integration.sh`.

## Teste da Integração

Para testar a integração:

1. **Preparação**:
   - Certifique-se de que os schemas `rh` e `contabilidade` existem
   - Verifique se as tabelas de integração foram criadas
   - Gere o plano de contas RH para a instituição de teste

2. **Execução**:
   - Acesse a página de testes `/contabilidade/teste-integracoes`
   - Selecione a operação "Contabilizar Folha de Pagamento"
   - Informe o mês, ano e instituição
   - Execute e verifique o resultado

3. **Verificação**:
   - Consulte a tabela `contabilidade.lancamentos` para ver os lançamentos gerados
   - Consulte a tabela `contabilidade.integracoes` para ver o histórico de integrações
   - Verifique se as pendências foram marcadas como processadas

## Políticas de Segurança (RLS)

As seguintes políticas de segurança foram implementadas:

- Usuários só podem ver dados de suas instituições
- Apenas usuários com perfil `contador` podem executar contabilizações
- Apenas usuários com perfil `admin` podem ver todos os logs de integração

## Manutenção e Solução de Problemas

### Logs e Monitoramento

Todas as operações de integração são registradas na tabela `public.integration_logs`. Para investigar problemas:

```sql
SELECT * FROM public.integration_logs 
WHERE modulo = 'RH' 
ORDER BY timestamp DESC;
```

### Erros Comuns

1. **Plano de contas não encontrado**:
   ```sql
   SELECT contabilidade.gerar_plano_contas_rh('UUID_DA_INSTITUICAO');
   ```

2. **Contabilização duplicada**:
   - Verifique se já existem lançamentos para o período
   ```sql
   SELECT * FROM contabilidade.lancamentos 
   WHERE EXTRACT(MONTH FROM data_competencia) = mes_desejado
   AND EXTRACT(YEAR FROM data_competencia) = ano_desejado;
   ```

3. **Erro na tabela `usuarios_instituicoes`**:
   - Execute o script `usuarios_instituicoes.sql` para criar ou corrigir a tabela

## Melhorias Futuras

- Implementação de contabilização de férias
- Contabilização automática de rescisões
- Dashboard para monitoramento das integrações
- Relatórios de custos de pessoal por departamento

## Referências

- Documentação Supabase: https://supabase.com/docs
- Scripts SQL: `packages/database-schema/supabase/migrations/`
- Instruções de implementação: `packages/database-schema/supabase/INSTRUCOES_IMPLEMENTACAO.md`
- Documentação de migrações: `packages/database-schema/supabase/MIGRATIONS.md` 