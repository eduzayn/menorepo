import React from 'react';
import { useNotificacoes } from '../../hooks';
import { Card, Form, Switch, TimePicker, Select, Space, Button, message } from 'antd';
import type { NotificacaoConfig, TipoNotificacao, ComunicacaoCanal } from '../../types/comunicacao';

const { Option } = Select;

interface NotificacoesConfigProps {
  usuarioId: string;
}

export const NotificacoesConfig: React.FC<NotificacoesConfigProps> = ({ usuarioId }) => {
  const { configuracoes, criarConfiguracao, atualizarConfiguracao } = useNotificacoes();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      const config = {
        ...values,
        usuario_id: usuarioId,
        horario_inicio: values.horario_inicio?.format('HH:mm'),
        horario_fim: values.horario_fim?.format('HH:mm'),
      };

      const existingConfig = configuracoes(usuarioId).data?.find(
        (c) => c.tipo_notificacao === values.tipo_notificacao && c.canal === values.canal
      );

      if (existingConfig) {
        await atualizarConfiguracao.mutateAsync({
          id: existingConfig.id,
          config,
        });
        message.success('Configuração atualizada com sucesso!');
      } else {
        await criarConfiguracao.mutateAsync(config);
        message.success('Configuração criada com sucesso!');
      }
    } catch (error) {
      message.error('Erro ao salvar configuração');
    }
  };

  const tiposNotificacao: { label: string; value: TipoNotificacao }[] = [
    { label: 'Mensagem', value: 'mensagem' },
    { label: 'Campanha', value: 'campanha' },
    { label: 'Lembrete', value: 'lembrete' },
  ];

  const canais: { label: string; value: ComunicacaoCanal }[] = [
    { label: 'WhatsApp', value: 'WHATSAPP' },
    { label: 'Email', value: 'EMAIL' },
    { label: 'SMS', value: 'SMS' },
  ];

  const diasSemana = [
    { label: 'Domingo', value: 0 },
    { label: 'Segunda', value: 1 },
    { label: 'Terça', value: 2 },
    { label: 'Quarta', value: 3 },
    { label: 'Quinta', value: 4 },
    { label: 'Sexta', value: 5 },
    { label: 'Sábado', value: 6 },
  ];

  return (
    <div>
      <h2>Configurações de Notificações</h2>
      <Space direction="vertical" style={{ width: '100%' }}>
        {tiposNotificacao.map((tipo) => (
          <Card key={tipo.value} title={tipo.label}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {canais.map((canal) => {
                const config = configuracoes(usuarioId).data?.find(
                  (c) => c.tipo_notificacao === tipo.value && c.canal === canal.value
                );

                return (
                  <Card
                    key={`${tipo.value}-${canal.value}`}
                    type="inner"
                    title={canal.label}
                  >
                    <Form
                      form={form}
                      layout="vertical"
                      initialValues={{
                        ...config,
                        tipo_notificacao: tipo.value,
                        canal: canal.value,
                      }}
                      onFinish={handleSubmit}
                    >
                      <Form.Item
                        name="ativo"
                        label="Ativo"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>

                      <Form.Item
                        name="horario_inicio"
                        label="Horário Início"
                        rules={[
                          {
                            required: form.getFieldValue('ativo'),
                            message: 'Por favor, selecione o horário de início',
                          },
                        ]}
                      >
                        <TimePicker format="HH:mm" />
                      </Form.Item>

                      <Form.Item
                        name="horario_fim"
                        label="Horário Fim"
                        rules={[
                          {
                            required: form.getFieldValue('ativo'),
                            message: 'Por favor, selecione o horário de fim',
                          },
                        ]}
                      >
                        <TimePicker format="HH:mm" />
                      </Form.Item>

                      <Form.Item
                        name="dias_semana"
                        label="Dias da Semana"
                        rules={[
                          {
                            required: form.getFieldValue('ativo'),
                            message: 'Por favor, selecione os dias da semana',
                          },
                        ]}
                      >
                        <Select mode="multiple">
                          {diasSemana.map((dia) => (
                            <Option key={dia.value} value={dia.value}>
                              {dia.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Salvar
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                );
              })}
            </Space>
          </Card>
        ))}
      </Space>
    </div>
  );
}; 