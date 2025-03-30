// Função Edge para integração RH-Contabilidade
// Esta função permite executar operações de integração entre os módulos RH e Contabilidade
// https://supabase.com/docs/guides/functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Criar cliente Supabase usando autenticação do usuário
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verificar token de autorização
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Não autorizado' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    // Processar requisição e executar operação de integração
    const { operacao, instituicaoId, mes, ano, detalhes } = await req.json();

    // Verificar parâmetros obrigatórios
    if (!operacao || !instituicaoId) {
      return new Response(
        JSON.stringify({
          error: 'Parâmetros obrigatórios: operacao, instituicaoId',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    let resultado;

    // Executar a operação de integração solicitada
    switch (operacao) {
      case 'contabilizar_folha':
        if (!mes || !ano) {
          return new Response(
            JSON.stringify({
              error: 'Parâmetros obrigatórios para folha: mes, ano',
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }

        // Chamar função do banco de dados para contabilizar folha
        const { data: dataFolha, error: errorFolha } = await supabaseClient.rpc(
          'contabilizar_folha_pagamento',
          {
            p_instituicao_id: instituicaoId,
            p_mes: mes,
            p_ano: ano,
          }
        );

        resultado = dataFolha || { error: errorFolha?.message };
        break;

      case 'contabilizar_ferias':
        if (!mes || !ano) {
          return new Response(
            JSON.stringify({
              error: 'Parâmetros obrigatórios para férias: mes, ano',
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }

        // Chamar função do banco de dados para contabilizar provisão de férias
        const { data: dataFerias, error: errorFerias } = await supabaseClient.rpc(
          'contabilizar_provisao_ferias',
          {
            p_instituicao_id: instituicaoId,
            p_mes: mes,
            p_ano: ano,
          }
        );

        resultado = dataFerias || { error: errorFerias?.message };
        break;

      case 'relatorio_custos':
        if (!mes || !ano) {
          return new Response(
            JSON.stringify({
              error: 'Parâmetros obrigatórios para relatório: mes, ano',
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }

        // Chamar função do banco de dados para gerar relatório de custos
        const { data: dataRelatorio, error: errorRelatorio } = await supabaseClient.rpc(
          'relatorio_custos_pessoal',
          {
            p_instituicao_id: instituicaoId,
            p_mes: mes,
            p_ano: ano,
          }
        );

        resultado = dataRelatorio || { error: errorRelatorio?.message };
        break;

      case 'processar_pendencias':
        // Chamar função do banco de dados para processar pendências em lote
        const { data: dataPendencias, error: errorPendencias } = await supabaseClient.rpc(
          'processar_pendencias_contabilizacao',
          {
            p_instituicao_id: instituicaoId,
          }
        );

        resultado = dataPendencias || { error: errorPendencias?.message };
        break;

      default:
        return new Response(
          JSON.stringify({
            error: 'Operação inválida',
            operacoesDisponiveis: [
              'contabilizar_folha',
              'contabilizar_ferias',
              'relatorio_custos',
              'processar_pendencias',
            ],
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
    }

    // Registrar log da operação
    await supabaseClient
      .from('integration_logs')
      .insert({
        usuario_id: user.id,
        instituicao_id: instituicaoId,
        modulo: 'RH-CONTABILIDADE',
        operacao: operacao,
        parametros: JSON.stringify({ mes, ano, detalhes }),
        resultado: JSON.stringify(resultado),
      })
      .select();

    // Retornar resultado da operação
    return new Response(
      JSON.stringify(resultado),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Erro na função Edge de integração RH-Contabilidade:', error);

    return new Response(
      JSON.stringify({ 
        error: 'Erro interno no servidor',
        detalhes: error instanceof Error ? error.message : String(error) 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}); 