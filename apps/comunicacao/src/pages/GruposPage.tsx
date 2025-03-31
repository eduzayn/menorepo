import React, { useState } from 'react';
import { useGrupos } from '../hooks';

// Componentes substitutos para Tabs e TabPane
const Tabs = ({ activeKey, onChange, children }: { 
  activeKey: string, 
  onChange: (key: string) => void, 
  children: React.ReactNode 
}) => {
  // Filtrar apenas os componentes TabPane
  const panes = React.Children.toArray(children)
    .filter(child => React.isValidElement(child) && child.props.tab);

  return (
    <div>
      <div className="flex border-b">
        {panes.map(pane => {
          const props = (pane as React.ReactElement).props;
          return (
            <button
              key={props.key}
              onClick={() => onChange(props.key)}
              className={`px-4 py-2 ${activeKey === props.key 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              {props.tab}
            </button>
          );
        })}
      </div>
      <div className="p-4">
        {panes.find(pane => (pane as React.ReactElement).props.key === activeKey)}
      </div>
    </div>
  );
};

const TabPane = ({ children }: { 
  tab?: string, 
  key?: string, 
  children: React.ReactNode 
}) => {
  return <div>{children}</div>;
};

// Mock dos componentes de grupo
const GrupoList = () => (
  <div>
    <h3 className="text-lg font-medium mb-4">Lista de Grupos</h3>
    <p>Componente de listagem de grupos</p>
  </div>
);

const GrupoParticipantes = ({ grupoId }: { grupoId: string }) => (
  <div>
    <h3 className="text-lg font-medium mb-4">Participantes do Grupo</h3>
    <p>Mostrando participantes do grupo: {grupoId}</p>
  </div>
);

interface Grupo {
  id: string;
  nome: string;
}

interface GruposResponse {
  data?: Grupo[];
  loading?: boolean;
  error?: Error;
}

// Mock do hook useGrupos
const mockUseGrupos = (): { grupos: GruposResponse } => {
  return {
    grupos: {
      data: [
        { id: 'g1', nome: 'Suporte' },
        { id: 'g2', nome: 'Vendas' },
        { id: 'g3', nome: 'Administração' }
      ],
      loading: false
    }
  };
};

const GruposPage: React.FC = () => {
  // Usando o mock em vez do hook real para desenvolvimento
  const { grupos } = mockUseGrupos();
  const [selectedGrupoId, setSelectedGrupoId] = useState<string | null>(null);

  const handleTabChange = (key: string) => {
    setSelectedGrupoId(key === 'lista' ? null : key);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Grupos</h2>
      <Tabs
        activeKey={selectedGrupoId || 'lista'}
        onChange={handleTabChange}
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

export default GruposPage; 