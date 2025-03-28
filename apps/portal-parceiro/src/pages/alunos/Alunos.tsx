import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  ArrowUpTrayIcon,
  EyeIcon,
  PencilSquareIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

type Aluno = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  dataCadastro: string;
  cursos: number;
  certificados: number;
};

const Alunos: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const alunosPorPagina = 10;
  
  useEffect(() => {
    // Simulando carregamento de dados da API
    const fetchAlunos = () => {
      setLoading(true);
      
      // Simulando dados para demonstração
      setTimeout(() => {
        const mockAlunos: Aluno[] = Array.from({ length: 35 }, (_, index) => ({
          id: `ALN${String(index + 1).padStart(5, '0')}`,
          nome: `Aluno ${index + 1}`,
          email: `aluno${index + 1}@exemplo.com`,
          cpf: `${Math.floor(Math.random() * 999)}.${Math.floor(Math.random() * 999)}.${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 99)}`,
          dataNascimento: new Date(1980 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
          dataCadastro: new Date(2023, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1).toISOString(),
          cursos: Math.floor(Math.random() * 5) + 1,
          certificados: Math.floor(Math.random() * 4),
        }));
        
        setAlunos(mockAlunos);
        setFilteredAlunos(mockAlunos);
        setTotalPages(Math.ceil(mockAlunos.length / alunosPorPagina));
        setLoading(false);
      }, 1000);
      
      // Em produção:
      // const response = await api.alunos.listar();
      // setAlunos(response);
      // setFilteredAlunos(response);
      // setTotalPages(Math.ceil(response.length / alunosPorPagina));
      // setLoading(false);
    };
    
    fetchAlunos();
  }, []);
  
  useEffect(() => {
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      const filtered = alunos.filter(
        aluno => 
          aluno.nome.toLowerCase().includes(termLower) ||
          aluno.email.toLowerCase().includes(termLower) ||
          aluno.cpf.includes(searchTerm)
      );
      setFilteredAlunos(filtered);
      setTotalPages(Math.ceil(filtered.length / alunosPorPagina));
      setCurrentPage(1);
    } else {
      setFilteredAlunos(alunos);
      setTotalPages(Math.ceil(alunos.length / alunosPorPagina));
    }
  }, [searchTerm, alunos]);
  
  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Obter alunos da página atual
  const getCurrentAlunos = () => {
    const inicio = (currentPage - 1) * alunosPorPagina;
    const fim = inicio + alunosPorPagina;
    return filteredAlunos.slice(inicio, fim);
  };
  
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alunos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os alunos vinculados à sua instituição
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:flex space-x-2">
          <button
            type="button"
            className="btn-outline flex items-center"
          >
            <ArrowUpTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Importar Alunos
          </button>
          <button
            type="button"
            className="btn-primary flex items-center"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Adicionar Aluno
          </button>
        </div>
      </div>

      {/* Barra de filtros/busca */}
      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center">
          <div className="relative flex-grow mt-2 md:mt-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Buscar por nome, email ou CPF"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabela de alunos */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="px-4 py-5 sm:p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aluno
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPF
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Nascimento
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Cadastro
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cursos
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certificados
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentAlunos().map((aluno) => (
                    <tr key={aluno.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{aluno.nome}</div>
                            <div className="text-sm text-gray-500">{aluno.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {aluno.cpf}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(aluno.dataNascimento)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(aluno.dataCadastro)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {aluno.cursos}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {aluno.certificados}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            className="text-primary hover:text-primary-dark"
                            title="Visualizar Aluno"
                          >
                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="text-primary hover:text-primary-dark"
                            title="Editar Aluno"
                          >
                            <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="text-primary hover:text-primary-dark"
                            title="Emitir Certificado"
                          >
                            <DocumentCheckIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{Math.min((currentPage - 1) * alunosPorPagina + 1, filteredAlunos.length)}</span> a <span className="font-medium">{Math.min(currentPage * alunosPorPagina, filteredAlunos.length)}</span> de <span className="font-medium">{filteredAlunos.length}</span> alunos
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Anterior</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === page ? 'bg-primary-light text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Próxima</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Alunos; 