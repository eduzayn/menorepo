import React, { useState } from 'react';
import { useVagas } from '../../hooks';
import { StatusVaga } from '../../types';

interface FiltrosProps {
  onFiltroChange: (filtros: {
    status?: StatusVaga,
    departamento?: string,
    data_inicio?: string,
    data_fim?: string
  }) => void;
}

const FiltrosVagas: React.FC<FiltrosProps> = ({ onFiltroChange }) => {
  const [status, setStatus] = useState<StatusVaga | ''>('');
  const [departamento, setDepartamento] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const aplicarFiltros = () => {
    const filtros: {
      status?: StatusVaga,
      departamento?: string,
      data_inicio?: string,
      data_fim?: string
    } = {};

    if (status) filtros.status = status as StatusVaga;
    if (departamento) filtros.departamento = departamento;
    if (dataInicio) filtros.data_inicio = dataInicio;
    if (dataFim) filtros.data_fim = dataFim;

    onFiltroChange(filtros);
  };

  const limparFiltros = () => {
    setStatus('');
    setDepartamento('');
    setDataInicio('');
    setDataFim('');
    onFiltroChange({});
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-semibold mb-3">Filtros</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full p-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusVaga | '')}
          >
            <option value="">Todos</option>
            <option value={StatusVaga.ABERTA}>Aberta</option>
            <option value={StatusVaga.EM_ANDAMENTO}>Em Andamento</option>
            <option value={StatusVaga.ENCERRADA}>Encerrada</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Departamento</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            placeholder="Ex: TI, Marketing"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data Início</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data Fim</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={limparFiltros}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Limpar
        </button>
        <button
          onClick={aplicarFiltros}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

interface VagaCardProps {
  titulo: string;
  departamento: string;
  status: StatusVaga;
  data_criacao: string;
  num_candidatos: number;
  onView: () => void;
  onEdit: () => void;
}

const VagaCard: React.FC<VagaCardProps> = ({
  titulo,
  departamento,
  status,
  data_criacao,
  num_candidatos,
  onView,
  onEdit,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case StatusVaga.ABERTA:
        return 'bg-green-100 text-green-800';
      case StatusVaga.EM_ANDAMENTO:
        return 'bg-blue-100 text-blue-800';
      case StatusVaga.ENCERRADA:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{titulo}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
          {status}
        </span>
      </div>
      <p className="text-gray-600 mb-2">Departamento: {departamento}</p>
      <div className="flex justify-between text-sm text-gray-500 mb-3">
        <span>Criada em: {formatDate(data_criacao)}</span>
        <span>{num_candidatos} candidato(s)</span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onView}
          className="flex-1 px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200 text-sm"
        >
          Ver Detalhes
        </button>
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-1.5 bg-blue-50 rounded hover:bg-blue-100 text-blue-700 text-sm"
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export const ListaVagas: React.FC = () => {
  const {
    vagas,
    vagasLoading,
    vagasError,
    updateFilters,
    criarVaga,
  } = useVagas();

  const handleFiltroChange = (filtros: any) => {
    updateFilters(filtros);
  };

  const handleNovaVaga = () => {
    // Em um cenário real, redirecionar para página de criação
    console.log('Criar nova vaga');
  };

  if (vagasLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (vagasError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Erro!</strong>
        <span className="block sm:inline"> Não foi possível carregar as vagas.</span>
      </div>
    );
  }

  // Dados fictícios para visualização (em um cenário real, viriam da API)
  const vagasMock = [
    {
      id: '1',
      titulo: 'Desenvolvedor Frontend React',
      departamento: 'Tecnologia',
      status: StatusVaga.ABERTA,
      data_criacao: '2023-08-15',
      num_candidatos: 12,
    },
    {
      id: '2',
      titulo: 'Analista de Marketing Digital',
      departamento: 'Marketing',
      status: StatusVaga.EM_ANDAMENTO,
      data_criacao: '2023-07-20',
      num_candidatos: 8,
    },
    {
      id: '3',
      titulo: 'Gerente de Projetos',
      departamento: 'Tecnologia',
      status: StatusVaga.ENCERRADA,
      data_criacao: '2023-06-10',
      num_candidatos: 5,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestão de Vagas</h2>
        <button
          onClick={handleNovaVaga}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nova Vaga
        </button>
      </div>

      <FiltrosVagas onFiltroChange={handleFiltroChange} />

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-gray-500 mb-1">Vagas Abertas</h4>
          <p className="text-2xl font-semibold">
            {vagasMock.filter(v => v.status === StatusVaga.ABERTA).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-gray-500 mb-1">Em Andamento</h4>
          <p className="text-2xl font-semibold">
            {vagasMock.filter(v => v.status === StatusVaga.EM_ANDAMENTO).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-gray-500 mb-1">Total de Candidatos</h4>
          <p className="text-2xl font-semibold">
            {vagasMock.reduce((acc, v) => acc + v.num_candidatos, 0)}
          </p>
        </div>
      </div>

      {/* Lista de vagas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vagasMock.map((vaga) => (
          <VagaCard
            key={vaga.id}
            titulo={vaga.titulo}
            departamento={vaga.departamento}
            status={vaga.status}
            data_criacao={vaga.data_criacao}
            num_candidatos={vaga.num_candidatos}
            onView={() => console.log(`Ver vaga ${vaga.id}`)}
            onEdit={() => console.log(`Editar vaga ${vaga.id}`)}
          />
        ))}
      </div>

      {vagasMock.length === 0 && (
        <div className="bg-gray-50 p-8 text-center rounded">
          <p className="text-gray-500">Nenhuma vaga encontrada.</p>
        </div>
      )}
    </div>
  );
}; 