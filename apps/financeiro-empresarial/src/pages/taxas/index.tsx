import { useState } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import type { TaxaAdministrativa } from '../../types/financeiro';

// Dados simulados
const TAXAS_SIMULADAS: TaxaAdministrativa[] = [
  {
    id: '1',
    nome: 'Taxa de Matrícula',
    descricao: 'Taxa cobrada no momento da matrícula de novos alunos',
    valor: 150.00,
    percentual: false,
    ativo: true,
    aplicacao: 'matricula'
  },
  {
    id: '2',
    nome: 'Taxa de Certificado',
    descricao: 'Taxa para emissão de certificado de conclusão',
    valor: 80.00,
    percentual: false,
    ativo: true,
    aplicacao: 'certificado'
  },
  {
    id: '3',
    nome: 'Juros por Atraso',
    descricao: 'Percentual de juros aplicado em cobranças atrasadas',
    valor: 2.00,
    percentual: true,
    ativo: true,
    aplicacao: 'mensalidade'
  },
  {
    id: '4',
    nome: 'Multa por Atraso',
    descricao: 'Valor fixo aplicado em cobranças atrasadas',
    valor: 30.00,
    percentual: false,
    ativo: true,
    aplicacao: 'mensalidade'
  },
  {
    id: '5',
    nome: 'Desconto por Pontualidade',
    descricao: 'Desconto percentual para pagamentos até a data de vencimento',
    valor: 5.00,
    percentual: true,
    ativo: true,
    aplicacao: 'mensalidade'
  },
  {
    id: '6',
    nome: 'Taxa de Reemissão',
    descricao: 'Valor cobrado para reemissão de boletos ou outros documentos',
    valor: 15.00,
    percentual: false,
    ativo: false,
    aplicacao: 'todas'
  },
  {
    id: '7',
    nome: 'Taxa de Material Didático',
    descricao: 'Taxa para material didático físico',
    valor: 120.00,
    percentual: false,
    ativo: true,
    aplicacao: 'material'
  }
];

// Componente de badge para tipo de aplicação
function AplicacaoBadge({ aplicacao }: { aplicacao: TaxaAdministrativa['aplicacao'] }) {
  const configs = {
    matricula: {
      className: 'bg-blue-100 text-blue-700',
      label: 'Matrícula'
    },
    mensalidade: {
      className: 'bg-green-100 text-green-700',
      label: 'Mensalidade'
    },
    material: {
      className: 'bg-purple-100 text-purple-700',
      label: 'Material'
    },
    certificado: {
      className: 'bg-orange-100 text-orange-700',
      label: 'Certificado'
    },
    todas: {
      className: 'bg-gray-100 text-gray-700',
      label: 'Todas'
    }
  };

  const config = configs[aplicacao];

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

export default function TaxasPage() {
  const [taxas, setTaxas] = useState<TaxaAdministrativa[]>(TAXAS_SIMULADAS);
  const [filtro, setFiltro] = useState<'todas' | 'ativas' | 'inativas'>('todas');
  
  // Filtrar taxas com base no filtro
  const taxasFiltradas = (() => {
    switch (filtro) {
      case 'ativas':
        return taxas.filter(taxa => taxa.ativo);
      case 'inativas':
        return taxas.filter(taxa => !taxa.ativo);
      default:
        return taxas;
    }
  })();
  
  // Função para alternar o status ativo/inativo
  const handleToggleStatus = (id: string) => {
    setTaxas(prev => 
      prev.map(taxa => 
        taxa.id === id ? { ...taxa, ativo: !taxa.ativo } : taxa
      )
    );
  };
  
  // Função para excluir uma taxa
  const handleExcluirTaxa = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta taxa?')) {
      setTaxas(prev => prev.filter(taxa => taxa.id !== id));
    }
  };
  
  // Formatar valor como moeda ou percentual
  const formatarValor = (taxa: TaxaAdministrativa) => {
    if (taxa.percentual) {
      return `${taxa.valor}%`;
    } else {
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(taxa.valor);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Taxas Administrativas</h1>
          <p className="text-gray-500">Gerencie as taxas e valores cobrados</p>
        </div>
        
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Nova Taxa</span>
        </button>
      </div>
      
      {/* Filtros simples */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setFiltro('todas')}
          className={`px-4 py-2 text-sm rounded-md ${
            filtro === 'todas' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFiltro('ativas')}
          className={`px-4 py-2 text-sm rounded-md ${
            filtro === 'ativas' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Ativas
        </button>
        <button
          onClick={() => setFiltro('inativas')}
          className={`px-4 py-2 text-sm rounded-md ${
            filtro === 'inativas' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Inativas
        </button>
      </div>
      
      {/* Tabela de taxas */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aplicação
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {taxasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-10 w-10 text-gray-400 mb-2" />
                    <p>Nenhuma taxa encontrada com os filtros aplicados.</p>
                  </div>
                </td>
              </tr>
            ) : (
              taxasFiltradas.map((taxa) => (
                <tr key={taxa.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{taxa.nome}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{taxa.descricao}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <AplicacaoBadge aplicacao={taxa.aplicacao} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">{formatarValor(taxa)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleToggleStatus(taxa.id)}
                      className={`inline-flex items-center ${
                        taxa.ativo ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={taxa.ativo ? 'Desativar' : 'Ativar'}
                    >
                      {taxa.ativo ? (
                        <>
                          <ToggleRight size={20} />
                          <span className="ml-1 text-xs">Ativa</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={20} />
                          <span className="ml-1 text-xs">Inativa</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="text-gray-600 hover:text-gray-800"
                        title="Editar taxa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleExcluirTaxa(taxa.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Excluir taxa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Informações adicionais */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-2">Informações sobre taxas</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• As taxas podem ser aplicadas automaticamente nas cobranças, conforme sua configuração.</li>
          <li>• Taxas percentuais são calculadas sobre o valor base da cobrança.</li>
          <li>• Taxas inativas não são aplicadas nas novas cobranças, mas permanecem nas cobranças já emitidas.</li>
          <li>• Para aplicar uma taxa manualmente, acesse a página de nova cobrança e selecione a taxa desejada.</li>
        </ul>
      </div>
    </div>
  );
} 