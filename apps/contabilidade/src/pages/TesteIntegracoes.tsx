import React, { useState } from 'react';
import { Button, Card, Alert, Space, Spin, DatePicker, Form, Select, Typography, message } from '@edunexia/ui-components';
import { contabilidadeService } from '@edunexia/api-client';
import { useAuth } from '@edunexia/auth';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const TesteIntegracoes: React.FC = () => {
  const { instituicaoAtiva } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [form] = Form.useForm();

  const formatarParametros = (valores: any) => {
    const data = dayjs(valores.mesAno);
    return {
      instituicaoId: instituicaoAtiva?.id,
      mes: data.month() + 1, // dayjs retorna mês de 0-11
      ano: data.year(),
      dataInicio: valores.dataInicio ? valores.dataInicio.format('YYYY-MM-DD') : undefined,
      dataFim: valores.dataFim ? valores.dataFim.format('YYYY-MM-DD') : undefined
    };
  };

  const testarIntegracao = async (funcao: string) => {
    try {
      await form.validateFields();
      const valores = form.getFieldsValue();
      const params = formatarParametros(valores);

      setLoading(true);
      setResultado(null);
      setErro(null);

      let result;

      switch (funcao) {
        case 'gerar_balancete':
          result = await contabilidadeService.gerarBalancete(params);
          break;
        case 'sincronizar_contabilidade_financeiro':
          result = await contabilidadeService.sincronizarContabilidadeFinanceiro(params);
          break;
        case 'integrar_rh_folha_pagamento':
          result = await contabilidadeService.integrarRhFolhaPagamento(params);
          break;
        case 'contabilizar_folha_pagamento':
          result = await contabilidadeService.contabilizarFolhaPagamento(params);
          break;
        case 'integrar_rh_ferias':
          result = await contabilidadeService.integrarRhFerias(params);
          break;
        case 'contabilizar_provisao_ferias':
          result = await contabilidadeService.contabilizarProvisaoFerias(params);
          break;
        case 'integrar_rh_beneficios':
          result = await contabilidadeService.integrarRhBeneficios(params);
          break;
        case 'contabilizar_beneficios':
          result = await contabilidadeService.contabilizarBeneficios(params);
          break;
        case 'relatorio_custos_pessoal':
          result = await contabilidadeService.relatorioCustosPessoal(params);
          break;
        default:
          throw new Error('Função não reconhecida');
      }

      if (result.success) {
        setResultado(result.data);
        message.success('Operação executada com sucesso!');
      } else {
        setErro(result.error?.message || 'Erro desconhecido');
        message.error('Falha na operação. Verifique os detalhes do erro.');
      }
    } catch (error: any) {
      setErro(error.message || 'Erro ao executar operação');
      message.error('Falha na validação de dados ou operação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Title level={2}>Teste de Integrações Contabilidade / RH</Title>
      <Text type="secondary" className="mb-6 block">
        Esta página permite testar as funções de integração entre os módulos de Contabilidade, Financeiro e RH.
      </Text>
      
      <Card className="mb-6">
        <Form form={form} layout="vertical" initialValues={{ mesAno: dayjs() }}>
          <Form.Item 
            name="mesAno" 
            label="Mês/Ano de Referência" 
            rules={[{ required: true, message: 'Por favor, selecione o mês/ano de referência' }]}
          >
            <DatePicker picker="month" format="MM/YYYY" className="w-full" />
          </Form.Item>
          
          <Form.Item name="dataInicio" label="Data Início (Para sincronização Financeiro)">
            <DatePicker className="w-full" />
          </Form.Item>
          
          <Form.Item name="dataFim" label="Data Fim (Para sincronização Financeiro)">
            <DatePicker className="w-full" />
          </Form.Item>
          
          <Title level={4} className="mb-4">Operações Disponíveis:</Title>
          
          <Space direction="vertical" className="w-full">
            <Card title="Operações Contábeis Gerais" className="mb-4">
              <Space>
                <Button 
                  type="primary" 
                  onClick={() => testarIntegracao('gerar_balancete')}
                  loading={loading}
                >
                  Gerar Balancete
                </Button>
                
                <Button 
                  onClick={() => testarIntegracao('sincronizar_contabilidade_financeiro')}
                  loading={loading}
                >
                  Sincronizar Financeiro
                </Button>
              </Space>
            </Card>
            
            <Card title="Integração RH - Folha de Pagamento" className="mb-4">
              <Space>
                <Button 
                  onClick={() => testarIntegracao('integrar_rh_folha_pagamento')}
                  loading={loading}
                >
                  Integrar Folha
                </Button>
                
                <Button 
                  onClick={() => testarIntegracao('contabilizar_folha_pagamento')}
                  loading={loading}
                >
                  Contabilizar Folha
                </Button>
              </Space>
            </Card>
            
            <Card title="Integração RH - Férias e Benefícios" className="mb-4">
              <Space>
                <Button 
                  onClick={() => testarIntegracao('integrar_rh_ferias')}
                  loading={loading}
                >
                  Integrar Férias
                </Button>
                
                <Button 
                  onClick={() => testarIntegracao('contabilizar_provisao_ferias')}
                  loading={loading}
                >
                  Contabilizar Provisão Férias
                </Button>
                
                <Button 
                  onClick={() => testarIntegracao('integrar_rh_beneficios')}
                  loading={loading}
                >
                  Integrar Benefícios
                </Button>
                
                <Button 
                  onClick={() => testarIntegracao('contabilizar_beneficios')}
                  loading={loading}
                >
                  Contabilizar Benefícios
                </Button>
              </Space>
            </Card>
            
            <Card title="Relatórios Gerenciais">
              <Button 
                onClick={() => testarIntegracao('relatorio_custos_pessoal')}
                loading={loading}
              >
                Relatório Custos Pessoal
              </Button>
            </Card>
          </Space>
        </Form>
      </Card>
      
      {loading && (
        <div className="text-center py-8">
          <Spin size="large" />
          <p className="mt-2">Processando operação...</p>
        </div>
      )}
      
      {erro && (
        <Alert
          message="Erro na Operação"
          description={erro}
          type="error"
          showIcon
          className="mb-6"
        />
      )}
      
      {resultado && (
        <Card title="Resultado da Operação">
          <div className="mb-4">
            <Text strong>Tipo de Resposta:</Text> {Array.isArray(resultado) ? 'Array de Dados' : 'Objeto JSON'}
          </div>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(resultado, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default TesteIntegracoes; 