import React from 'react';
import { useGrupos } from '../../hooks';
import { Table, Button, Space, Modal, Form, Select, message, Tag } from 'antd';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import type { GrupoParticipante, GrupoRole } from '../../types/comunicacao';

const { Option } = Select;

interface GrupoParticipantesProps {
  grupoId: string;
}

export const GrupoParticipantes: React.FC<GrupoParticipantesProps> = ({ grupoId }) => {
  const { participantes, adicionarParticipante, atualizarParticipante, removerParticipante } = useGrupos();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleAddParticipante = async (values: any) => {
    try {
      await adicionarParticipante.mutateAsync({
        ...values,
        grupo_id: grupoId,
      });
      message.success('Participante adicionado com sucesso!');
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Erro ao adicionar participante');
    }
  };

  const handleUpdateRole = async (participante: GrupoParticipante, newRole: GrupoRole) => {
    try {
      await atualizarParticipante.mutateAsync({
        grupoId,
        usuarioId: participante.usuario_id,
        participante: { role: newRole },
      });
      message.success('Função atualizada com sucesso!');
    } catch (error) {
      message.error('Erro ao atualizar função');
    }
  };

  const handleRemoveParticipante = async (usuarioId: string) => {
    try {
      await removerParticipante.mutateAsync({ grupoId, usuarioId });
      message.success('Participante removido com sucesso!');
    } catch (error) {
      message.error('Erro ao remover participante');
    }
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: ['usuario', 'nome'],
      key: 'nome',
    },
    {
      title: 'Email',
      dataIndex: ['usuario', 'email'],
      key: 'email',
    },
    {
      title: 'Função',
      dataIndex: 'role',
      key: 'role',
      render: (role: GrupoRole, record: GrupoParticipante) => (
        <Select
          value={role}
          onChange={(value) => handleUpdateRole(record, value)}
          style={{ width: 120 }}
        >
          <Option value="admin">Admin</Option>
          <Option value="moderador">Moderador</Option>
          <Option value="membro">Membro</Option>
        </Select>
      ),
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_: any, record: GrupoParticipante) => (
        <Space>
          <Button
            type="text"
            danger
            icon={<UserDeleteOutlined />}
            onClick={() => handleRemoveParticipante(record.usuario_id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <h3>Participantes</h3>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Adicionar Participante
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={participantes(grupoId).data}
          loading={participantes(grupoId).isLoading}
          rowKey="usuario_id"
        />
      </Space>

      <Modal
        title="Adicionar Participante"
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddParticipante}
        >
          <Form.Item
            name="usuario_id"
            label="Usuário"
            rules={[{ required: true, message: 'Por favor, selecione um usuário' }]}
          >
            <Select
              showSearch
              placeholder="Selecione um usuário"
              optionFilterProp="children"
            >
              {/* Aqui você precisará implementar a busca de usuários */}
              <Option value="1">Usuário 1</Option>
              <Option value="2">Usuário 2</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="role"
            label="Função"
            rules={[{ required: true, message: 'Por favor, selecione uma função' }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="moderador">Moderador</Option>
              <Option value="membro">Membro</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}; 