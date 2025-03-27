import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { configuracoesService, ConfiguracaoTaxa, ConfiguracaoServico, ConfiguracaoSplit, ConfiguracaoPagamento } from '../../services/configuracoesService';

type TipoConfiguracao = 'taxa' | 'servico' | 'split' | 'gateway';

export const ConfiguracoesForm = () => {
  const { tipo, id } = useParams<{ tipo: string; id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Taxa
  const [taxaForm, setTaxaForm] = useState<Partial<ConfiguracaoTaxa>>({
    nome: '',
    tipo: 'percentual',
    valor: 0,
    descricao: '',
    ativo: true
  });
  
  // Serviço
  const [servicoForm, setServicoForm] = useState<Partial<ConfiguracaoServico>>({
    nome: '',
    valor: 0,
    descricao: '',
    obrigatorio: false,
    ativo: true
  });
  
  // Split
  const [splitForm, setSplitForm] = useState<Partial<ConfiguracaoSplit>>({
    nome: '',
    tipo_entidade: 'polo',
    percentual: 0,
    descricao: '',
    ativo: true
  });
  
  // Gateway
  const [gatewayForm, setGatewayForm] = useState<Partial<ConfiguracaoPagamento>>({
    gateway: '',
    chave_api: '',
    chave_secreta: '',
    ambiente: 'teste',
    ativo: true
  });
  
  const tipoConfiguracao: TipoConfiguracao = 
    tipo === 'taxas' ? 'taxa' : 
    tipo === 'servicos' ? 'servico' : 
    tipo === 'splits' ? 'split' : 
    tipo === 'gateways' ? 'gateway' : 'taxa';
  
  const isEdicao = !!id;
  
  useEffect(() => {
    if (!id) return;
    
    const fetchConfiguracao = async () => {
      setLoading(true);
      setError(null);
      
      try {
        switch (tipoConfiguracao) {
          case 'taxa':
            const taxa = await configuracoesService.buscarTaxa(id);
            setTaxaForm(taxa);
            break;
          case 'servico':
            const servico = await configuracoesService.buscarServico(id);
            setServicoForm(servico);
            break;
          case 'split':
            const split = await configuracoesService.buscarSplit(id);
            setSplitForm(split);
            break;
          case 'gateway':
            const gateway = await configuracoesService.buscarGateway(id);
            setGatewayForm(gateway);
            break;
        }
      } catch (err) {
        console.error(`Erro ao carregar ${tipoConfiguracao}:`, err);
        setError(`Não foi possível carregar os dados para edição.`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfiguracao();
  }, [id, tipoConfiguracao]);
  
  const handleTaxaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setTaxaForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'valor' 
          ? parseFloat(value) || 0
          : value
    }));
  };
  
  const handleServicoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setServicoForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'valor' 
          ? parseFloat(value) || 0
          : value
    }));
  };
  
  const handleSplitChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setSplitForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'percentual' 
          ? parseFloat(value) || 0
          : value
    }));
  };
  
  const handleGatewayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setGatewayForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setError(null);
    
    try {
      switch (tipoConfiguracao) {
        case 'taxa':
          if (isEdicao) {
            await configuracoesService.atualizarTaxa(id!, taxaForm);
          } else {
            await configuracoesService.criarTaxa(taxaForm as Omit<ConfiguracaoTaxa, 'id' | 'created_at' | 'updated_at'>);
          }
          break;
        case 'servico':
          if (isEdicao) {
            await configuracoesService.atualizarServico(id!, servicoForm);
          } else {
            await configuracoesService.criarServico(servicoForm as Omit<ConfiguracaoServico, 'id' | 'created_at' | 'updated_at'>);
          }
          break;
        case 'split':
          if (isEdicao) {
            await configuracoesService.atualizarSplit(id!, splitForm);
          } else {
            await configuracoesService.criarSplit(splitForm as Omit<ConfiguracaoSplit, 'id' | 'created_at' | 'updated_at'>);
          }
          break;
        case 'gateway':
          if (isEdicao) {
            await configuracoesService.atualizarGateway(id!, gatewayForm);
          } else {
            await configuracoesService.criarGateway(gatewayForm as Omit<ConfiguracaoPagamento, 'id' | 'created_at' | 'updated_at'>);
          }
          break;
      }
      
      navigate('/configuracoes');
    } catch (err) {
      console.error(`Erro ao ${isEdicao ? 'atualizar' : 'criar'} ${tipoConfiguracao}:`, err);
      setError(`Não foi possível ${isEdicao ? 'atualizar' : 'criar'} o registro.`);
    } finally {
      setSalvando(false);
    }
  };
  
  const renderTaxaForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome da Taxa
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={taxaForm.nome}
              onChange={handleTaxaChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
              Tipo de Taxa
            </label>
            <select
              id="tipo"
              name="tipo"
              value={taxaForm.tipo}
              onChange={handleTaxaChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="percentual">Percentual</option>
              <option value="fixo">Valor Fixo</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="valor" className="block text-sm font-medium text-gray-700">
              {taxaForm.tipo === 'percentual' ? 'Percentual (%)' : 'Valor (R$)'}
            </label>
            <input
              type="number"
              step={taxaForm.tipo === 'percentual' ? '0.01' : '0.01'}
              min="0"
              id="valor"
              name="valor"
              value={taxaForm.valor}
              onChange={handleTaxaChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={taxaForm.descricao || ''}
              onChange={handleTaxaChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativo"
              name="ativo"
              checked={taxaForm.ativo}
              onChange={handleTaxaChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="ativo" className="ml-2 block text-sm text-gray-700">
              Ativo
            </label>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/configuracoes')}
            className="mr-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : isEdicao ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    );
  };
  
  const renderServicoForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome do Serviço
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={servicoForm.nome}
              onChange={handleServicoChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="valor" className="block text-sm font-medium text-gray-700">
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              id="valor"
              name="valor"
              value={servicoForm.valor}
              onChange={handleServicoChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={servicoForm.descricao || ''}
              onChange={handleServicoChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="obrigatorio"
              name="obrigatorio"
              checked={servicoForm.obrigatorio}
              onChange={handleServicoChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="obrigatorio" className="ml-2 block text-sm text-gray-700">
              Obrigatório
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativo"
              name="ativo"
              checked={servicoForm.ativo}
              onChange={handleServicoChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="ativo" className="ml-2 block text-sm text-gray-700">
              Ativo
            </label>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/configuracoes')}
            className="mr-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : isEdicao ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    );
  };
  
  const renderSplitForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome do Split
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={splitForm.nome}
              onChange={handleSplitChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="tipo_entidade" className="block text-sm font-medium text-gray-700">
              Tipo de Entidade
            </label>
            <select
              id="tipo_entidade"
              name="tipo_entidade"
              value={splitForm.tipo_entidade}
              onChange={handleSplitChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="polo">Polo</option>
              <option value="parceiro">Parceiro</option>
              <option value="professor">Professor</option>
              <option value="instituicao">Instituição</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="percentual" className="block text-sm font-medium text-gray-700">
              Percentual (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              id="percentual"
              name="percentual"
              value={splitForm.percentual}
              onChange={handleSplitChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={splitForm.descricao || ''}
              onChange={handleSplitChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativo"
              name="ativo"
              checked={splitForm.ativo}
              onChange={handleSplitChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="ativo" className="ml-2 block text-sm text-gray-700">
              Ativo
            </label>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/configuracoes')}
            className="mr-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : isEdicao ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    );
  };
  
  const renderGatewayForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="gateway" className="block text-sm font-medium text-gray-700">
              Nome do Gateway
            </label>
            <input
              type="text"
              id="gateway"
              name="gateway"
              value={gatewayForm.gateway}
              onChange={handleGatewayChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="chave_api" className="block text-sm font-medium text-gray-700">
              Chave API
            </label>
            <input
              type="text"
              id="chave_api"
              name="chave_api"
              value={gatewayForm.chave_api}
              onChange={handleGatewayChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="chave_secreta" className="block text-sm font-medium text-gray-700">
              Chave Secreta
            </label>
            <input
              type="password"
              id="chave_secreta"
              name="chave_secreta"
              value={gatewayForm.chave_secreta}
              onChange={handleGatewayChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="ambiente" className="block text-sm font-medium text-gray-700">
              Ambiente
            </label>
            <select
              id="ambiente"
              name="ambiente"
              value={gatewayForm.ambiente}
              onChange={handleGatewayChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="teste">Teste</option>
              <option value="producao">Produção</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ativo"
              name="ativo"
              checked={gatewayForm.ativo}
              onChange={handleGatewayChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="ativo" className="ml-2 block text-sm text-gray-700">
              Ativo
            </label>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  As chaves de API e segredos devem ser tratados com cuidado. Não compartilhe essas informações.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/configuracoes')}
            className="mr-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : isEdicao ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    );
  };
  
  const renderFormByType = () => {
    switch (tipoConfiguracao) {
      case 'taxa':
        return renderTaxaForm();
      case 'servico':
        return renderServicoForm();
      case 'split':
        return renderSplitForm();
      case 'gateway':
        return renderGatewayForm();
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdicao ? 'Editar' : 'Nova'} {
            tipoConfiguracao === 'taxa' ? 'Taxa' :
            tipoConfiguracao === 'servico' ? 'Serviço' :
            tipoConfiguracao === 'split' ? 'Regra de Split' :
            'Gateway de Pagamento'
          }
        </h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          {renderFormByType()}
        </div>
      </div>
    </div>
  );
}; 