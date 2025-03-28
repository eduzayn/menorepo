import React from 'react';
import { useGrupos } from '../../hooks';
import { Button, Card, List, Typography, Space, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import type { Grupo, InsertGrupo, UpdateGrupo } from '../../types/comunicacao';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const GrupoList: React.FC = () => {
  const { grupos, criarGrupo, atualizarGrupo, excluirGrupo } = useGrupos();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingGrupo, setEditingGrupo] = React.useState<Grupo | null>(null);

  const handleCreate = async (values: InsertGrupo) => {
    try {
      await criarGrupo.mutateAsync(values);
      message.success('Grupo criado com sucesso!');
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Erro ao criar grupo');
    }
  };

  const handleUpdate = async (values: UpdateGrupo) => {
    if (!editingGrupo) return;
    try {
      await atualizarGrupo.mutateAsync({ id: editingGrupo.id, grupo: values });
      message.success('Grupo atualizado com sucesso!');
      setModalVisible(false);
      setEditingGrupo(null);
      form.resetFields();
    } catch (error) {
      message.error('Erro ao atualizar grupo');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await excluirGrupo.mutateAsync(id);
      message.success('Grupo excluído com sucesso!');
    } catch (error) {
      message.error('Erro ao excluir grupo');
    }
  };

  const showModal = (grupo?: Grupo) => {
    if (grupo) {
      setEditingGrupo(grupo);
      form.setFieldsValue(grupo);
    } else {
      setEditingGrupo(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const gruposData = grupos.data || [];

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Title level={2}>Grupos</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Novo Grupo
          </Button>
        </Space>

        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={gruposData}
          loading={grupos.isLoading}
          renderItem={(grupo: Grupo) => (
            <List.Item>
              <Card
                title={grupo.nome}
                extra={
                  <Space>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => showModal(grupo)}
                    />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(grupo.id)}
                    />
                  </Space>
                }
              >
                <Text>{grupo.descricao}</Text>
                <div style={{ marginTop: 8 }}>
                  <Space>
                    <UserOutlined />
                    <Text type="secondary">
                      {(grupo as any).participantes?.length || 0} participantes
                    </Text>
                  </Space>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Space>

      <Modal
        title={editingGrupo ? 'Editar Grupo' : 'Novo Grupo'}
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setModalVisible(false);
          setEditingGrupo(null);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingGrupo ? handleUpdate : handleCreate}
        >
          <Form.Item
            name="nome"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira o nome do grupo' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="descricao" label="Descrição">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}; 