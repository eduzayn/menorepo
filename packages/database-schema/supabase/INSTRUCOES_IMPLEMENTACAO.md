# Instruções para Implementação da Integração RH-Contabilidade

## Pré-requisitos

- Acesso ao Supabase com permissões de administrador
- Supabase CLI instalado localmente (para execução dos scripts)
- Acesso às credenciais do projeto
- Conhecimento básico de SQL e Supabase Edge Functions

## Passo 1: Preparação do Ambiente

1. Clone o repositório para sua máquina local:
   ```bash
   git clone https://github.com/eduzayn/menorepo.git
   cd menorepo
   ```

2. Instale as dependências:
   ```bash
   yarn install
   ```

3. Configure suas variáveis locais do Supabase:
   ```bash
   supabase login
   supabase link --project-ref seu-projeto-ref
   ```

## Passo 2: Verificação da Estrutura Atual

Antes de iniciar a implementação, verifique se o esquema `contabilidade` já existe e se possui as tabelas necessárias:

1. Acesse o SQL Editor no Supabase Studio
2. Execute o comando:
   ```sql
   SELECT schema_name
   FROM information_schema.schemata
   WHERE schema_name IN ('contabilidade', 'rh');
   ```

3. Se o esquema `contabilidade` não existir, crie-o:
   ```sql
   CREATE SCHEMA contabilidade;
   ```

## Passo 3: Execução das Migrações SQL

As migrações devem ser executadas na seguinte ordem:

1. **Schema RH** - Cria a estrutura básica para RH:
   - Acesse o diretório: `packages/database-schema/supabase/migrations/`
   - Execute o arquivo `20240702_schema_rh.sql`

2. **Funções de Integração** - Cria as funções para integração entre RH e contabilidade:
   - Execute o arquivo `20240703_integracao_rh_contabilidade.sql`

3. **Plano de Contas RH** - Cria a função para gerar o plano de contas específico para RH:
   - Execute o arquivo `20240704_plano_contas_rh.sql`

### Usando o Supabase CLI:

```bash
cd packages/database-schema/supabase
supabase db push migrations/20240702_schema_rh.sql
supabase db push migrations/20240703_integracao_rh_contabilidade.sql
supabase db push migrations/20240704_plano_contas_rh.sql
```

### Usando o SQL Editor do Supabase:

Copie e cole o conteúdo de cada arquivo SQL na ordem mencionada acima.

## Passo 4: Implantação da Função Edge

1. Navegue até o diretório da função Edge:
   ```bash
   cd packages/database-schema/supabase/functions/integrar-rh-contabilidade
   ```

2. Verifique se o código da função está atualizado conforme as correções realizadas

3. Implante a função:
   ```bash
   supabase functions deploy integrar-rh-contabilidade
   ```

4. Verifique se a função foi implantada corretamente:
   ```bash
   supabase functions list
   ```

## Passo 5: Verificação da Implementação

Execute os seguintes comandos SQL para verificar se as funções foram criadas corretamente:

```sql
-- Verificar funções
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'contabilidade'
  AND routine_name IN ('gerar_plano_contas_rh', 'contabilizar_folha_pagamento', 'contabilizar_provisao_ferias', 'relatorio_custos_pessoal');

-- Verificar tabelas
SELECT table_name
FROM information_schema.tables
WHERE table_schema IN ('contabilidade', 'rh')
  AND table_name IN ('integracoes', 'pendencias_contabilizacao');
```

## Passo 6: Configuração do Plano de Contas

Para cada instituição que utilizará a integração RH-Contabilidade, é necessário gerar o plano de contas específico:

```sql
-- Substitua pelo UUID da instituição
SELECT contabilidade.gerar_plano_contas_rh('00000000-0000-0000-0000-000000000000');
```

## Passo 7: Teste da Integração

Você pode usar o arquivo `teste_manual_integracao.sql` para testar manualmente cada função implementada. Alternativamente, acesse a página de testes de integração no frontend:

1. Acesse o módulo de contabilidade
2. Navegue até a página de teste de integrações (`/contabilidade/teste-integracoes`)
3. Selecione a operação desejada (ex: gerar balancete, contabilizar folha)
4. Informe os parâmetros necessários (mês, ano)
5. Execute a operação e verifique o resultado

## Passo 8: Configuração de Usuários e Permissões

Configure as permissões adequadas para acesso às funções de integração:

1. Acesse o Supabase Auth
2. Certifique-se de que os usuários com perfil `contador` e `financeiro` tenham as permissões corretas
3. Teste o acesso com diferentes perfis para verificar as políticas RLS

## Solução de Problemas Comuns

### Erro ao executar função Edge:

Se você encontrar erro de sintaxe como `ERROR: 42601: syntax error at or near "{"` ao chamar a função Edge, verifique:

1. A sintaxe do código JavaScript/TypeScript na função Edge
2. Se as aspas estão corretas (use aspas duplas em vez de simples)
3. Se todos os pontos e vírgulas estão no lugar correto

### Erro ao executar função SQL:

Se você encontrar erro na função SQL como `ERROR: 42601: syntax error at or near "AND"` ao verificar contas, verifique:

1. A ordem correta das cláusulas SQL (FROM, WHERE, GROUP BY, etc.)
2. Se a sintaxe das condições está correta
3. Se há palavras-chave SQL na posição errada

### Erro com declaração ALIAS FOR:

Se você encontrar erro de sintaxe com a declaração `ALIAS FOR` nas funções PL/pgSQL como:
```
ERROR: 42601: syntax error at or near "["
LINE 124: v_codigo ALIAS FOR v_contas_rh[i][1];
```

Esta sintaxe não é suportada em todas as versões do PostgreSQL. Use a alternativa abaixo:

```sql
-- Ao invés de:
DECLARE
  v_codigo ALIAS FOR v_contas_rh[i][1];
  
-- Use:
DECLARE
  v_codigo TEXT;
BEGIN
  v_codigo := v_contas_rh[i][1];
```

Declare explicitamente o tipo de cada variável e atribua os valores usando o operador `:=`.

### Erro ao gerar plano de contas:

Se a função `gerar_plano_contas_rh` retornar erro, verifique:

1. Se a instituição especificada existe
2. Se as tabelas de contas contábeis estão criadas corretamente
3. Se os tipos enumerados para `tipo_conta` e `natureza_conta` estão definidos

## Próximos Passos

Após a implementação bem-sucedida:

1. Documente quaisquer problemas encontrados
2. Instrua os usuários sobre como utilizar as novas funcionalidades
3. Configure rotinas automatizadas para processamento periódico (por exemplo, geração mensal de provisões)
4. Realize uma auditoria dos lançamentos gerados para garantir a consistência contábil

## Recursos Adicionais

Para mais informações, consulte:

- `packages/database-schema/supabase/INTEGRACAO_RH_CONTABILIDADE.md`
- `packages/database-schema/supabase/MIGRATIONS.md`
- Documentação do Supabase: https://supabase.com/docs
- Documentação da API da Edunéxia: `packages/api-client/README.md` 