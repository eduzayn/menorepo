import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, Calendar, BarChart2, PieChart, TrendingUp, DollarSign } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePermissoes } from '../../hooks/usePermissoes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos de relatórios disponíveis
type TipoRelatorio = 
  | 'fluxo-caixa' 
  | 'receitas-despesas' 
  | 'inadimplencia' 
  | 'previsao-financeira'
  | 'alunos-adimplentes'
  | 'comissoes'
  | 'contratos';

// Interface de parâmetros para relatórios
interface FiltrosRelatorio {
  dataInicio: string;
  dataFim: string;
  instituicaoId: string;
  tipoRelatorio: TipoRelatorio;
  agruparPor?: 'dia' | 'semana' | 'mes' | 'trimestre' | 'ano';
  formato?: 'pdf' | 'excel' | 'csv';
  incluirGraficos?: boolean;
  categorias?: string[];
  status?: string[];
}

// Componente de card para seleção de relatório
interface RelatorioCardProps {
  tipo: TipoRelatorio;
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  selecionado: boolean;
  onClick: () => void;
}

const RelatorioCard: React.FC<RelatorioCardProps> = ({
  tipo,
  titulo,
  descricao,
  icone,
  selecionado,
  onClick
}) => {
  return (
    <div 
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        selecionado 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <div className={`p-2 rounded-full ${selecionado ? 'bg-blue-100' : 'bg-gray-100'} mr-3`}>
          {icone}
        </div>
        <h3 className="font-medium">{titulo}</h3>
      </div>
      <p className="text-sm text-gray-600">{descricao}</p>
    </div>
  );
};

// Componente para períodos pré-definidos
interface PeriodoProps {
  label: string;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
  onClick: () => void;
}

const PeriodoButton: React.FC<PeriodoProps> = ({ label, ativo, onClick }) => {
  return (
    <button
      className={`px-3 py-1 text-sm rounded-full ${
        ativo
          ? 'bg-blue-100 text-blue-800 font-medium'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export const RelatoriosPage: React.FC = () => {
  const { user } = useAuth();
  const { verificarPermissao } = usePermissoes();
  const [isLoading, setIsLoading] = useState(false);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<TipoRelatorio | null>(null);
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({
    dataInicio: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    dataFim: format(new Date(), 'yyyy-MM-dd'),
    instituicaoId: user?.instituicao_id || '',
    tipoRelatorio: 'fluxo-caixa',
    agruparPor: 'mes',
    formato: 'pdf',
    incluirGraficos: true
  });

  // Verifica permissão para acessar relatórios
  useEffect(() => {
    if (!verificarPermissao('relatorios', 'visualizar')) {
      // Redirecionamento ou mensagem de erro seria implementado aqui
      console.error('Usuário sem permissão para acessar relatórios');
    }
  }, [verificarPermissao]);

  // Lista de relatórios disponíveis
  const relatoriosDisponiveis: Array<{
    tipo: TipoRelatorio;
    titulo: string;
    descricao: string;
    icone: React.ReactNode;
    permissao?: string;
  }> = [
    {
      tipo: 'fluxo-caixa',
      titulo: 'Fluxo de Caixa',
      descricao: 'Entradas e saídas detalhadas por período',
      icone: <TrendingUp size={20} className="text-blue-700" />
    },
    {
      tipo: 'receitas-despesas',
      titulo: 'Receitas x Despesas',
      descricao: 'Comparativo entre receitas e despesas',
      icone: <BarChart2 size={20} className="text-green-700" />
    },
    {
      tipo: 'inadimplencia',
      titulo: 'Inadimplência',
      descricao: 'Análise de taxas e valores em atraso',
      icone: <PieChart size={20} className="text-red-700" />
    },
    {
      tipo: 'previsao-financeira',
      titulo: 'Previsão Financeira',
      descricao: 'Projeção de receitas para os próximos meses',
      icone: <TrendingUp size={20} className="text-purple-700" />
    },
    {
      tipo: 'alunos-adimplentes',
      titulo: 'Adimplência de Alunos',
      descricao: 'Listagem de alunos com pagamentos em dia',
      icone: <FileText size={20} className="text-teal-700" />
    },
    {
      tipo: 'comissoes',
      titulo: 'Comissões',
      descricao: 'Relatório de comissões para parceiros e vendedores',
      icone: <DollarSign size={20} className="text-amber-700" />,
      permissao: 'comissoes'
    },
    {
      tipo: 'contratos',
      titulo: 'Contratos',
      descricao: 'Análise de contratos ativos e cancelados',
      icone: <FileText size={20} className="text-gray-700" />
    }
  ];

  // Define um período pré-configurado
  const selecionarPeriodo = (tipo: 'hoje' | 'ontem' | 'semana' | 'mes' | 'trimestre' | 'ano') => {
    const hoje = new Date();
    let inicio = new Date();
    let fim = new Date();

    switch (tipo) {
      case 'hoje':
        inicio = hoje;
        fim = hoje;
        break;
      case 'ontem':
        inicio = new Date(hoje.getTime() - 24 * 60 * 60 * 1000);
        fim = new Date(hoje.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'semana':
        inicio = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
        fim = hoje;
        break;
      case 'mes':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        fim = hoje;
        break;
      case 'trimestre':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1);
        fim = hoje;
        break;
      case 'ano':
        inicio = new Date(hoje.getFullYear(), 0, 1);
        fim = hoje;
        break;
    }

    setFiltros(prev => ({
      ...prev,
      dataInicio: format(inicio, 'yyyy-MM-dd'),
      dataFim: format(fim, 'yyyy-MM-dd')
    }));
  };

  // Gera o relatório selecionado
  const gerarRelatorio = async () => {
    if (!relatorioSelecionado) {
      alert('Selecione um tipo de relatório');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Gerando relatório com parâmetros:', {
        ...filtros,
        tipoRelatorio: relatorioSelecionado
      });

      // Simulação de geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Download simulado
      const dataAtual = format(new Date(), 'dd-MM-yyyy', { locale: ptBR });
      const nomeArquivo = `relatorio-${relatorioSelecionado}-${dataAtual}.${filtros.formato}`;
      
      alert(`Relatório gerado com sucesso! ${nomeArquivo}`);

      // Em uma implementação real, aqui seria feito o download do arquivo
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Ocorreu um erro ao gerar o relatório. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Manipulação de mudanças nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFiltros(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Relatórios Financeiros</h1>
        <p className="text-gray-600">Gere relatórios detalhados para análise financeira</p>
      </div>

      {/* Seleção de tipo de relatório */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Selecione o tipo de relatório</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {relatoriosDisponiveis
            .filter(rel => !rel.permissao || verificarPermissao(rel.permissao, 'visualizar'))
            .map(rel => (
              <RelatorioCard
                key={rel.tipo}
                tipo={rel.tipo}
                titulo={rel.titulo}
                descricao={rel.descricao}
                icone={rel.icone}
                selecionado={relatorioSelecionado === rel.tipo}
                onClick={() => setRelatorioSelecionado(rel.tipo)}
              />
            ))}
        </div>
      </div>

      {relatorioSelecionado && (
        <>
          {/* Filtros do relatório */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Filtros e configurações</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-sm text-gray-700 mb-2">Período</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <PeriodoButton 
                    label="Hoje"
                    dataInicio={format(new Date(), 'yyyy-MM-dd')}
                    dataFim={format(new Date(), 'yyyy-MM-dd')}
                    ativo={filtros.dataInicio === format(new Date(), 'yyyy-MM-dd') && 
                           filtros.dataFim === format(new Date(), 'yyyy-MM-dd')}
                    onClick={() => selecionarPeriodo('hoje')}
                  />
                  <PeriodoButton 
                    label="Ontem"
                    dataInicio={format(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')}
                    dataFim={format(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')}
                    ativo={filtros.dataInicio === format(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd') && 
                           filtros.dataFim === format(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')}
                    onClick={() => selecionarPeriodo('ontem')}
                  />
                  <PeriodoButton 
                    label="Semana"
                    dataInicio={format(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')}
                    dataFim={format(new Date(), 'yyyy-MM-dd')}
                    ativo={filtros.dataInicio === format(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd') && 
                           filtros.dataFim === format(new Date(), 'yyyy-MM-dd')}
                    onClick={() => selecionarPeriodo('semana')}
                  />
                  <PeriodoButton 
                    label="Mês atual"
                    dataInicio={format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd')}
                    dataFim={format(new Date(), 'yyyy-MM-dd')}
                    ativo={filtros.dataInicio === format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd') && 
                           filtros.dataFim === format(new Date(), 'yyyy-MM-dd')}
                    onClick={() => selecionarPeriodo('mes')}
                  />
                  <PeriodoButton 
                    label="Trimestre"
                    dataInicio={format(new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1), 'yyyy-MM-dd')}
                    dataFim={format(new Date(), 'yyyy-MM-dd')}
                    ativo={filtros.dataInicio === format(new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1), 'yyyy-MM-dd') && 
                           filtros.dataFim === format(new Date(), 'yyyy-MM-dd')}
                    onClick={() => selecionarPeriodo('trimestre')}
                  />
                  <PeriodoButton 
                    label="Ano atual"
                    dataInicio={format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd')}
                    dataFim={format(new Date(), 'yyyy-MM-dd')}
                    ativo={filtros.dataInicio === format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd') && 
                           filtros.dataFim === format(new Date(), 'yyyy-MM-dd')}
                    onClick={() => selecionarPeriodo('ano')}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data inicial
                    </label>
                    <input
                      type="date"
                      name="dataInicio"
                      value={filtros.dataInicio}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data final
                    </label>
                    <input
                      type="date"
                      name="dataFim"
                      value={filtros.dataFim}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700 mb-2">Configurações do relatório</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agrupar por
                  </label>
                  <select
                    name="agruparPor"
                    value={filtros.agruparPor}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="dia">Dia</option>
                    <option value="semana">Semana</option>
                    <option value="mes">Mês</option>
                    <option value="trimestre">Trimestre</option>
                    <option value="ano">Ano</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Formato de saída
                  </label>
                  <select
                    name="formato"
                    value={filtros.formato}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      name="incluirGraficos"
                      checked={filtros.incluirGraficos}
                      onChange={e => setFiltros(prev => ({ ...prev, incluirGraficos: e.target.checked }))}
                      className="mr-2 h-4 w-4"
                    />
                    Incluir gráficos no relatório
                  </label>
                </div>
              </div>
            </div>

            {/* Filtros específicos por tipo de relatório */}
            {relatorioSelecionado === 'receitas-despesas' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-sm text-gray-700 mb-2">Filtros adicionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categorias de receita
                    </label>
                    <select
                      multiple
                      name="categoriasReceita"
                      className="w-full p-2 border border-gray-300 rounded-lg h-24"
                    >
                      <option value="mensalidade">Mensalidades</option>
                      <option value="matricula">Matrículas</option>
                      <option value="material">Material didático</option>
                      <option value="taxas">Taxas administrativas</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categorias de despesa
                    </label>
                    <select
                      multiple
                      name="categoriasDespesa"
                      className="w-full p-2 border border-gray-300 rounded-lg h-24"
                    >
                      <option value="folha">Folha de pagamento</option>
                      <option value="aluguel">Aluguel</option>
                      <option value="utilidades">Utilidades (água, luz, etc)</option>
                      <option value="marketing">Marketing</option>
                      <option value="software">Software</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {relatorioSelecionado === 'inadimplencia' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-sm text-gray-700 mb-2">Filtros adicionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Período de atraso
                    </label>
                    <select
                      name="periodoAtraso"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="todos">Todos</option>
                      <option value="ate15">Até 15 dias</option>
                      <option value="15a30">15 a 30 dias</option>
                      <option value="30a60">30 a 60 dias</option>
                      <option value="60a90">60 a 90 dias</option>
                      <option value="acima90">Acima de 90 dias</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de cobrança
                    </label>
                    <select
                      name="tipoCobranca"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="todos">Todos</option>
                      <option value="mensalidade">Mensalidades</option>
                      <option value="taxas">Taxas administrativas</option>
                      <option value="material">Material didático</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botão para gerar o relatório */}
          <div className="flex justify-end">
            <button
              type="button"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={gerarRelatorio}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Gerando relatório...
                </>
              ) : (
                <>
                  <FileText size={18} className="mr-2" />
                  Gerar relatório
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Relatórios recentes */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Relatórios recentes</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Data de geração
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Fluxo de Caixa - Maio 2023</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Fluxo de Caixa</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">15/05/2023</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">João Silva</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-800 flex items-center justify-end">
                    <Download size={16} className="mr-1" />
                    Download
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Inadimplência - Abril 2023</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Inadimplência</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">03/05/2023</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Ana Costa</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-800 flex items-center justify-end">
                    <Download size={16} className="mr-1" />
                    Download
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Receitas x Despesas - Trimestre 1</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Receitas x Despesas</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">10/04/2023</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Carlos Oliveira</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-800 flex items-center justify-end">
                    <Download size={16} className="mr-1" />
                    Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 