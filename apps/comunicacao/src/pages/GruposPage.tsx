import React from 'react';
import { Tabs } from 'antd';
import { GrupoList, GrupoParticipantes } from '../components';
import { useGrupos } from '../hooks';

const { TabPane } = Tabs;

export const GruposPage: React.FC = () => {
  const { grupos } = useGrupos();
  const [selectedGrupoId, setSelectedGrupoId] = React.useState<string | null>(null);

  return (
    <div>
      <Tabs
        activeKey={selectedGrupoId || 'lista'}
        onChange={(key) => setSelectedGrupoId(key === 'lista' ? null : key)}
      >
        <TabPane tab="Lista de Grupos" key="lista">
          <GrupoList />
        </TabPane>
        {grupos.data?.map((grupo) => (
          <TabPane tab={grupo.nome} key={grupo.id}>
            <GrupoParticipantes grupoId={grupo.id} />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}; 