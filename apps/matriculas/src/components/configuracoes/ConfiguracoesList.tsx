import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { configuracoesService, ConfiguracaoTaxa, ConfiguracaoServico, ConfiguracaoSplit, ConfiguracaoPagamento } from '../../services/configuracoesService';
import { formatCurrency } from '../../utils/formatters';

type ConfiguracaoTab = 'taxas' | 'servicos' | 'splits' | 'gateways';

export const ConfiguracoesList = () => {
  const [activeTab, setActiveTab] = useState<ConfiguracaoTab>('taxas');
  const [taxas, setTaxas] = useState<ConfiguracaoTaxa[]>([]);
  const [servicos, setServicos] = useState<ConfiguracaoServico[]>([]);
  const [splits, setSplits] = useState<ConfiguracaoSplit[]>([]);
  const [gateways, setGateways] = useState<ConfiguracaoPagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfiguracao = async () => {
      setLoading(true);
      setError(null);
      
      try {
        switch (activeTab) {
          case 'taxas':
            const taxasData = await configuracoesService.listarTaxas();
            setTaxas(taxasData);
            break;
          case 'servicos':
            const servicosData = await configuracoesService.listarServicos();
            setServicos(servicosData);
            break;
          case 'splits':
            const splitsData = await configuracoesService.listarSplits();
            setSplits(splitsData);
            break;
          case 'gateways':
            const gatewaysData = await configuracoesService.listarGateways();
            setGateways(gatewaysData);
            break;
        }
      } catch (err) {
        console.error(`Erro ao carregar ${activeTab}:`, err);
        setError(`Não foi possível carregar as configurações de ${activeTab}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchConfiguracao();
  }, [activeTab]);

  const handleExcluirTaxa = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta taxa?')) return;
    
    try {
      await configuracoesService.excluirTaxa(id);
      setTaxas(taxas.filter(taxa => taxa.id !== id));
    } catch (err) {
      console.error('Erro ao excluir taxa:', err);
      alert('Não foi possível excluir a taxa.');
    }
  };

  const handleExcluirServico = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este serviço?')) return;
    
    try {
      await configuracoesService.excluirServico(id);
      setServicos(servicos.filter(servico => servico.id !== id));
    } catch (err) {
      console.error('Erro ao excluir serviço:', err);
      alert('Não foi possível excluir o serviço.');
    }
  };

  const handleExcluirSplit = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este split?')) return;
    
    try {
      await configuracoesService.excluirSplit(id);
      setSplits(splits.filter(split => split.id !== id));
    } catch (err) {
      console.error('Erro ao excluir split:', err);
      alert('Não foi possível excluir o split.');
    }
  };

  const handleExcluirGateway = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este gateway de pagamento?')) return;
    
    try {
      await configuracoesService.excluirGateway(id);
      setGateways(gateways.filter(gateway => gateway.id !== id));
    } catch (err) {
      console.error('Erro ao excluir gateway:', err);
      alert('Não foi possível excluir o gateway de pagamento.');
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'taxas':
        return renderTaxasTab();
      case 'servicos':
        return renderServicosTab();
      case 'splits':
        return renderSplitsTab();
      case 'gateways':
        return renderGatewaysTab();
      default:
        return null;
    }
  };

  const renderTaxasTab = () => {
    if (taxas.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Nenhuma taxa cadastrada.</p>
          <Link 
            to="/configuracoes/taxas/nova" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Cadastrar Nova Taxa
          </Link>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-end mb-4">
          <Link 
            to="/configuracoes/taxas/nova" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Nova Taxa
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {taxas.map((taxa) => (
                <tr key={taxa.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{taxa.nome}</div>
                    {taxa.descricao && (
                      <div className="text-sm text-gray-500">{taxa.descricao}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {taxa.tipo === 'percentual' ? 'Percentual' : 'Valor Fixo'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {taxa.tipo === 'percentual' 
                      ? `${taxa.valor}%` 
                      : formatCurrency(taxa.valor)
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {taxa.ativo ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Ativo
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/configuracoes/taxas/${taxa.id}/editar`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleExcluirTaxa(taxa.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderServicosTab = () => {
    if (servicos.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Nenhum serviço cadastrado.</p>
          <Link 
            to="/configuracoes/servicos/novo" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Cadastrar Novo Serviço
          </Link>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-end mb-4">
          <Link 
            to="/configuracoes/servicos/novo" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Novo Serviço
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Obrigatório
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servicos.map((servico) => (
                <tr key={servico.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{servico.nome}</div>
                    {servico.descricao && (
                      <div className="text-sm text-gray-500">{servico.descricao}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(servico.valor)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {servico.obrigatorio ? 'Sim' : 'Não'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {servico.ativo ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Ativo
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/configuracoes/servicos/${servico.id}/editar`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleExcluirServico(servico.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSplitsTab = () => {
    if (splits.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Nenhuma regra de split cadastrada.</p>
          <Link 
            to="/configuracoes/splits/novo" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Cadastrar Novo Split
          </Link>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-end mb-4">
          <Link 
            to="/configuracoes/splits/novo" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Novo Split
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Entidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {splits.map((split) => (
                <tr key={split.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{split.nome}</div>
                    {split.descricao && (
                      <div className="text-sm text-gray-500">{split.descricao}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {split.tipo_entidade === 'polo' && 'Polo'}
                    {split.tipo_entidade === 'parceiro' && 'Parceiro'}
                    {split.tipo_entidade === 'professor' && 'Professor'}
                    {split.tipo_entidade === 'instituicao' && 'Instituição'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {split.percentual}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {split.ativo ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Ativo
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/configuracoes/splits/${split.id}/editar`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleExcluirSplit(split.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderGatewaysTab = () => {
    if (gateways.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Nenhum gateway de pagamento cadastrado.</p>
          <Link 
            to="/configuracoes/gateways/novo" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Cadastrar Novo Gateway
          </Link>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-end mb-4">
          <Link 
            to="/configuracoes/gateways/novo" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Novo Gateway
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gateway
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ambiente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gateways.map((gateway) => (
                <tr key={gateway.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{gateway.gateway}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gateway.ambiente === 'producao' ? 'Produção' : 'Teste'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {gateway.ativo ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Ativo
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/configuracoes/gateways/${gateway.id}/editar`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleExcluirGateway(gateway.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('taxas')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'taxas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Taxas
            </button>
            <button
              onClick={() => setActiveTab('servicos')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'servicos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Serviços
            </button>
            <button
              onClick={() => setActiveTab('splits')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'splits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Splits de Pagamento
            </button>
            <button
              onClick={() => setActiveTab('gateways')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'gateways'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gateways de Pagamento
            </button>
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}; 