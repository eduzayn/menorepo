import React, { useState, useEffect } from 'react';
import { 
  AcademicCapIcon, 
  DocumentCheckIcon, 
  DocumentDuplicateIcon, 
  DocumentPlusIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

type StatusCertificacao = 'pendente' | 'em_analise' | 'aprovado' | 'emitido' | 'rejeitado';

type Certificacao = {
  id: string;
  aluno: {
    id: string;
    nome: string;
    email: string;
    cpf: string;
  };
  curso: {
    id: string;
    nome: string;
    tipo: string;
  };
  data_solicitacao: string;
  data_emissao?: string;
  status: StatusCertificacao;
  documentos_pendentes: boolean;
  observacoes?: string;
};

const Certificacoes: React.FC = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<StatusCertificacao | ''>('');
  const [certificacoes, setCertificacoes] = useState<Certificacao[]>([]);
  const [filteredCertificacoes, setFilteredCertificacoes] = useState<Certificacao[]>([]);
  const [activeTab, setActiveTab] = useState<'todas' | 'pendentes' | 'em_processo' | 'concluidas'>('todas');

  useEffect(() => {
    const fetchCertificacoes = () => {
      setLoading(true);
      
      // Simulando dados para demonstração
      setTimeout(() => {
        const mockCertificacoes: Certificacao[] = Array.from({ length: 15 }, (_, index) => {
          const status = ['pendente', 'em_analise', 'aprovado', 'emitido', 'rejeitado'][Math.floor(Math.random() * 5)] as StatusCertificacao;
          const hoje = new Date();
          const dataSolicitacao = new Date(hoje);
          dataSolicitacao.setDate(hoje.getDate() - Math.floor(Math.random() * 60));
          
          let dataEmissao;
          if (status === 'emitido') {
            dataEmissao = new Date(dataSolicitacao);
            dataEmissao.setDate(dataSolicitacao.getDate() + Math.floor(Math.random() * 15) + 5);
          }
          
          const cursos = [
            { id: 'C001', nome: 'Engenharia de Software', tipo: 'Graduação' },
            { id: 'C002', nome: 'Ciência de Dados', tipo: 'Pós-Graduação' },
            { id: 'C003', nome: 'Gestão de Projetos', tipo: 'MBA' },
            { id: 'C004', nome: 'Desenvolvimento Web', tipo: 'Curso Livre' }
          ];
          
          const curso = cursos[Math.floor(Math.random() * cursos.length)];
          
          const nomes = [
            'Ana Silva', 'Carlos Oliveira', 'Juliana Santos', 'Roberto Lima',
            'Fernanda Costa', 'Marcos Souza', 'Patricia Ferreira', 'Bruno Almeida'
          ];
          
          const nome = nomes[Math.floor(Math.random() * nomes.length)];
          const email = nome.toLowerCase().replace(' ', '.') + '@email.com';
          const cpf = `${Math.floor(Math.random() * 999)}.${Math.floor(Math.random() * 999)}.${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 99)}`;
          
          return {
            id: `CERT${String(index + 1).padStart(5, '0')}`,
            aluno: {
              id: `ALN${Math.floor(Math.random() * 10000)}`,
              nome,
              email,
              cpf
            },
            curso,
            data_solicitacao: dataSolicitacao.toISOString(),
            data_emissao: dataEmissao?.toISOString(),
            status,
            documentos_pendentes: Math.random() > 0.7,
            observacoes: Math.random() > 0.7 ? 'Aguardando documentação complementar' : undefined
          };
        });
        
        // Ordenar por data mais recente
        mockCertificacoes.sort((a, b) => new Date(b.data_solicitacao).getTime() - new Date(a.data_solicitacao).getTime());
        
        setCertificacoes(mockCertificacoes);
        setFilteredCertificacoes(mockCertificacoes);
        setLoading(false);
      }, 1000);
      
      // Em produção:
      // const response = await api.certificacoes.listar();
      // setCertificacoes(response.certificacoes);
      // setFilteredCertificacoes(response.certificacoes);
      // setLoading(false);
    };
    
    fetchCertificacoes();
  }, []);
  
  useEffect(() => {
    // Aplicar filtros
    let result = [...certificacoes];
    
    // Filtro por tab
    if (activeTab === 'pendentes') {
      result = result.filter(c => c.status === 'pendente');
    } else if (activeTab === 'em_processo') {
      result = result.filter(c => ['em_analise', 'aprovado'].includes(c.status));
    } else if (activeTab === 'concluidas') {
      result = result.filter(c => ['emitido', 'rejeitado'].includes(c.status));
    }
    
    // Filtro por status específico
    if (statusFiltro) {
      result = result.filter(c => c.status === statusFiltro);
    }
    
    // Filtro por texto
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.aluno.nome.toLowerCase().includes(termLower) || 
        c.aluno.email.toLowerCase().includes(termLower) ||
        c.aluno.cpf.includes(searchTerm) ||
        c.curso.nome.toLowerCase().includes(termLower) ||
        c.id.toLowerCase().includes(termLower)
      );
    }
    
    setFilteredCertificacoes(result);
  }, [certificacoes, activeTab, statusFiltro, searchTerm]);
  
  // Formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  // Obter cor por status
  const getStatusInfo = (status: StatusCertificacao) => {
    switch (status) {
      case 'pendente':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente', icon: DocumentPlusIcon };
      case 'em_analise':
        return { color: 'bg-blue-100 text-blue-800', label: 'Em Análise', icon: DocumentTextIcon };
      case 'aprovado':
        return { color: 'bg-purple-100 text-purple-800', label: 'Aprovado', icon: DocumentDuplicateIcon };
      case 'emitido':
        return { color: 'bg-green-100 text-green-800', label: 'Emitido', icon: DocumentCheckIcon };
      case 'rejeitado':
        return { color: 'bg-red-100 text-red-800', label: 'Rejeitado', icon: DocumentTextIcon };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'Desconhecido', icon: DocumentTextIcon };
    }
  };
  
  const renderTabs = () => {
    const tabs = [
      { id: 'todas', label: 'Todas' },
      { id: 'pendentes', label: 'Pendentes' },
      { id: 'em_processo', label: 'Em Processo' },
      { id: 'concluidas', label: 'Concluídas' }
    ];
    
    return (
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    );
  };
  
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificações</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as solicitações de certificação dos seus alunos
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            type="button"
            className="btn-primary flex items-center"
            title="Nova solicitação"
          >
            <AcademicCapIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Nova Solicitação
          </button>
        </div>
      </div>
      
      {/* Tabs de categorias */}
      <div className="mt-4">
        {renderTabs()}
      </div>
      
      {/* Filtros */}
      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Filtrar por Status
            </label>
            <div className="mt-1 flex items-center">
              <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
              <select
                id="status"
                name="status"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value as StatusCertificacao | '')}
              >
                <option value="">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="em_analise">Em Análise</option>
                <option value="aprovado">Aprovado</option>
                <option value="emitido">Emitido</option>
                <option value="rejeitado">Rejeitado</option>
              </select>
            </div>
          </div>
          
          <div className="relative max-w-xs w-full">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Buscar
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Nome, CPF, curso ou protocolo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de certificações */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="px-4 py-5 sm:p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {filteredCertificacoes.length === 0 ? (
              <div className="px-4 py-5 sm:p-6 text-center">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma certificação encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Não foram encontradas certificações com os filtros atuais.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFiltro('');
                      setActiveTab('todas');
                    }}
                  >
                    <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Limpar filtros
                  </button>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredCertificacoes.map((certificacao) => {
                  const statusInfo = getStatusInfo(certificacao.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <li key={certificacao.id}>
                      <div className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <StatusIcon className="h-6 w-6 text-gray-400 mr-3" aria-hidden="true" />
                              <p className="text-sm font-medium text-primary truncate">
                                {certificacao.aluno.nome}
                              </p>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}>
                                {statusInfo.label}
                              </p>
                              {certificacao.documentos_pendentes && (
                                <p className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                  Docs Pendentes
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <AcademicCapIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                {certificacao.curso.nome} ({certificacao.curso.tipo})
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                <DocumentTextIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                {certificacao.id}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>
                                Solicitação: {formatDate(certificacao.data_solicitacao)}
                                {certificacao.data_emissao && (
                                  <span className="ml-2">• Emissão: {formatDate(certificacao.data_emissao)}</span>
                                )}
                              </p>
                            </div>
                          </div>
                          {certificacao.observacoes && (
                            <div className="mt-2 text-sm text-gray-500 italic border-t border-gray-100 pt-2">
                              {certificacao.observacoes}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
      
      {/* Seção de informação */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Informações sobre certificações
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                O processo de certificação segue as seguintes etapas:
              </p>
              <ol className="list-decimal pl-5 mt-1 space-y-1">
                <li>Solicitação e envio de documentos</li>
                <li>Análise da documentação pela instituição certificadora</li>
                <li>Aprovação e emissão do certificado</li>
                <li>Disponibilização para download ou envio físico</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificacoes; 