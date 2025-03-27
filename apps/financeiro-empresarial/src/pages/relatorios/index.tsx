import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, Calendar, BarChart2, PieChart, TrendingUp, DollarSign } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePermissoes } from '../../hooks/usePermissoes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ComissoesReport } from './ComissoesReport';

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

  // Renderiza o conteúdo do relatório selecionado
  const renderConteudoRelatorio = () => {
    if (!relatorioSelecionado) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">Selecione um tipo de relatório para começar</p>
        </div>
      );
    }

    switch (relatorioSelecionado) {
      case 'fluxo-caixa':
        return <p>Conteúdo do relatório de Fluxo de Caixa</p>;
      case 'receitas-despesas':
        return <p>Conteúdo do relatório de Receitas x Despesas</p>;
      case 'inadimplencia':
        return <p>Conteúdo do relatório de Inadimplência</p>;
      case 'previsao-financeira':
        return <p>Conteúdo do relatório de Previsão Financeira</p>;
      case 'alunos-adimplentes':
        return <p>Conteúdo do relatório de Adimplência de Alunos</p>;
      case 'comissoes':
        return <ComissoesReport />;
      case 'contratos':
        return <p>Conteúdo do relatório de Contratos</p>;
      default:
        return <p>Relatório não encontrado</p>;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Relatórios Financeiros</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Coluna de seleção de relatórios */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Escolha um Relatório</h2>
            <div className="flex flex-col space-y-3">
              {relatoriosDisponiveis
                .filter(r => !r.permissao || verificarPermissao(r.permissao, 'visualizar'))
                .map(relatorio => (
                  <RelatorioCard
                    key={relatorio.tipo}
                    tipo={relatorio.tipo}
                    titulo={relatorio.titulo}
                    descricao={relatorio.descricao}
                    icone={relatorio.icone}
                    selecionado={relatorioSelecionado === relatorio.tipo}
                    onClick={() => setRelatorioSelecionado(relatorio.tipo)}
                  />
                ))}
            </div>
          </div>
        </div>
        
        {/* Coluna de conteúdo do relatório */}
        <div className="md:col-span-3">
          {renderConteudoRelatorio()}
        </div>
      </div>
    </div>
  );
}; 