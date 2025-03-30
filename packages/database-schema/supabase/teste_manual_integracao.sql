-- Comandos SQL para teste manual da integração RH-Contabilidade
-- Executado por: Administrador do Banco de Dados
-- Cada seção deve ser executada separadamente para melhor controle

----------------------
-- 1. Verificação das funções
----------------------

-- Verificar função de geração de plano de contas
SELECT routine_name, routine_type, data_type 
FROM information_schema.routines 
WHERE routine_schema = 'contabilidade' 
  AND routine_name IN ('gerar_plano_contas_rh', 'contabilizar_folha_pagamento', 'contabilizar_provisao_ferias', 'relatorio_custos_pessoal');

-- Verificar estrutura da tabela de integrações
SELECT column_name, data_type, character_maximum_length, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'contabilidade' 
  AND table_name = 'integracoes';

-- Verificar estrutura da tabela de pendências
SELECT column_name, data_type, character_maximum_length, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'rh' 
  AND table_name = 'pendencias_contabilizacao';

----------------------
-- 2. Gerar plano de contas para uma instituição
----------------------

-- Substitua o UUID pela sua instituição real
SELECT contabilidade.gerar_plano_contas_rh('00000000-0000-0000-0000-000000000000'::UUID);

-- Verificar as contas criadas
SELECT codigo, nome, tipo, natureza, permite_lancamentos 
FROM contabilidade.contas 
WHERE instituicao_id = '00000000-0000-0000-0000-000000000000'  -- Substitua pelo mesmo UUID
  AND (codigo LIKE '3.1.1%' OR codigo LIKE '3.1.2%' OR codigo LIKE '2.1.3%' OR codigo LIKE '2.1.4%')
ORDER BY codigo;

----------------------
-- 3. Contabilizar folha de pagamento (teste manual)
----------------------

-- ATENÇÃO: Substitua os parâmetros pela sua instituição, mês e ano reais
SELECT contabilidade.contabilizar_folha_pagamento(
  '00000000-0000-0000-0000-000000000000'::UUID,  -- instituição
  7,                                            -- mês (julho)
  2024                                          -- ano
);

-- Verificar lançamentos gerados para a folha
SELECT l.id, l.data_lancamento, l.data_competencia, l.valor, 
       cd.codigo as conta_debito, cd.nome as nome_debito,
       cc.codigo as conta_credito, cc.nome as nome_credito,
       l.historico
FROM contabilidade.lancamentos l
JOIN contabilidade.contas cd ON l.conta_debito_id = cd.id
JOIN contabilidade.contas cc ON l.conta_credito_id = cc.id
WHERE l.instituicao_id = '00000000-0000-0000-0000-000000000000'
  AND EXTRACT(MONTH FROM l.data_competencia) = 7
  AND EXTRACT(YEAR FROM l.data_competencia) = 2024
  AND l.historico LIKE 'Folha de Pagamento%';

----------------------
-- 4. Contabilizar provisão de férias (teste manual)
----------------------

-- ATENÇÃO: Substitua os parâmetros pela sua instituição, mês e ano reais
SELECT contabilidade.contabilizar_provisao_ferias(
  '00000000-0000-0000-0000-000000000000'::UUID,  -- instituição
  7,                                            -- mês (julho)
  2024                                          -- ano
);

-- Verificar lançamentos gerados para provisão de férias
SELECT l.id, l.data_lancamento, l.data_competencia, l.valor, 
       cd.codigo as conta_debito, cd.nome as nome_debito,
       cc.codigo as conta_credito, cc.nome as nome_credito,
       l.historico
FROM contabilidade.lancamentos l
JOIN contabilidade.contas cd ON l.conta_debito_id = cd.id
JOIN contabilidade.contas cc ON l.conta_credito_id = cc.id
WHERE l.instituicao_id = '00000000-0000-0000-0000-000000000000'
  AND EXTRACT(MONTH FROM l.data_competencia) = 7
  AND EXTRACT(YEAR FROM l.data_competencia) = 2024
  AND l.historico LIKE 'Provisão de Férias%';

----------------------
-- 5. Gerar relatório de custos de pessoal
----------------------

-- ATENÇÃO: Substitua os parâmetros pela sua instituição, mês e ano reais
SELECT contabilidade.relatorio_custos_pessoal(
  '00000000-0000-0000-0000-000000000000'::UUID,  -- instituição
  7,                                            -- mês (julho)
  2024                                          -- ano
);

-- Verificar relatório gerado
SELECT id, tipo, periodo_inicio, periodo_fim, 
       conteudo->'totais'->'salarios' as total_salarios,
       conteudo->'totais'->'encargos' as total_encargos,
       conteudo->'totais'->'beneficios' as total_beneficios,
       gerado_em
FROM contabilidade.relatorios
WHERE instituicao_id = '00000000-0000-0000-0000-000000000000'
  AND tipo = 'CUSTOS_PESSOAL'
  AND periodo_inicio = DATE '2024-07-01'
ORDER BY gerado_em DESC
LIMIT 1;

----------------------
-- 6. Verificar registros de integração
----------------------

-- Verificar integrações realizadas
SELECT modulo_origem, modulo_destino, referencia_origem, referencia_destino, data_integracao, detalhes
FROM contabilidade.integracoes
WHERE instituicao_id = '00000000-0000-0000-0000-000000000000'
ORDER BY data_integracao DESC
LIMIT 10;

-- OBSERVAÇÕES:
-- 1. Substitua os UUIDs de instituição pelos valores reais do seu ambiente
-- 2. Ajuste os meses e anos conforme sua necessidade
-- 3. Execute cada seção separadamente para melhor controle
-- 4. Os testes devem ser realizados primeiro em ambiente de homologação
-- 5. Recomenda-se criar entradas de teste nas tabelas rh.folha_pagamento e rh.colaboradores antes de executar os testes 