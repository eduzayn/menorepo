import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  EyeIcon, 
  PencilSquareIcon, 
  TrashIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

type Curso = {
  id: string;
  titulo: string;
  nivel: string;
  cargaHoraria: number;
  status: 'ativa' | 'pendente' | 'suspensa' | 'encerrada';
  alunos: number;
  certificados: number;
  dataAprovacao?: string;
};

const niveis = ['Livre', 'Básico', 'Intermediário', 'Avançado', 'Especialização', 'Graduação', 'Pós-graduação'];

const Cursos: React.FC = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [filteredCursos, setFilteredCursos] = useState<Curso[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [nivelFilter, setNivelFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    // Simulando carregamento de dados da API
    const fetchCursos = () => {
      setLoading(true);
      
      // Simulando dados para demonstração
      setTimeout(() => {
        const mockCursos: Curso[] = Array.from({ length: 12 }, (_, index) => {
          const status = ['ativa', 'pendente', 'suspensa', 'encerrada'][Math.floor(Math.random() * 4)] as 'ativa' | 'pendente' | 'suspensa' | 'encerrada';
          const nivel = niveis[Math.floor(Math.random() * niveis.length)];
          const aprovado = status === 'ativa' || status === 'suspensa';
          
          return {
            id: `CRS${String(index + 1).padStart(5, '0')}`,
            titulo: `Curso de ${['Administração', 'Marketing', 'Finanças', 'Gestão de Projetos', 'Liderança', 'RH', 'Logística'][Math.floor(Math.random() * 7)]} ${index + 1}`,
            nivel,
            cargaHoraria: [20, 40, 60, 80, 120][Math.floor(Math.random() * 5)],
            status,
            alunos: Math.floor(Math.random() * 50),
            certificados: Math.floor(Math.random() * 30),
            dataAprovacao: aprovado ? new Date(2023, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1).toISOString() : undefined,
          };
        });
        
        setCursos(mockCursos);
        setFilteredCursos(mockCursos);
        setLoading(false);
      }, 1000);
      
      // Em produção:
      // const response = await api.cursos.listar();
      // setCursos(response);
      // setFilteredCursos(response);
      // setLoading(false);
    };
    
    fetchCursos();
  }, []);

  useEffect(() => {
    // Aplicar filtros aos cursos
    let result = [...cursos];
    
    // Filtro de texto
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      result = result.filter(curso => 
        curso.titulo.toLowerCase().includes(termLower) ||
        curso.id.toLowerCase().includes(termLower)
      );
    }
    
    // Filtro de nível
    if (nivelFilter) {
      result = result.filter(curso => curso.nivel === nivelFilter);
    }
    
    // Filtro de status
    if (statusFilter) {
      result = result.filter(curso => curso.status === statusFilter);
    }
    
    setFilteredCursos(result);
  }, [cursos, searchTerm, nivelFilter, statusFilter]);
  
  // Formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não aprovado';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  // Obter cor por status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspensa':
        return 'bg-red-100 text-red-800';
      case 'encerrada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os cursos oferecidos pela sua instituição
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="btn-primary flex items-center"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Novo Curso
          </button>
        </div>
      </div>

      {/* Barra de filtros/busca */}
      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:flex md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Buscar cursos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <select
                id="nivel"
                name="nivel"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                value={nivelFilter}
                onChange={(e) => setNivelFilter(e.target.value)}
              >
                <option value="">Todos os níveis</option>
                {niveis.map(nivel => (
                  <option key={nivel} value={nivel}>{nivel}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                id="status"
                name="status"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="ativa">Ativa</option>
                <option value="pendente">Pendente</option>
                <option value="suspensa">Suspensa</option>
                <option value="encerrada">Encerrada</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de cursos */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="px-4 py-5 sm:p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredCursos.length === 0 ? (
              <li className="px-4 py-5 sm:px-6">
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">Nenhum curso encontrado</p>
                </div>
              </li>
            ) : (
              filteredCursos.map((curso) => (
                <li key={curso.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-light rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">{curso.titulo.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-primary truncate">{curso.titulo}</h3>
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(curso.status)}`}>
                              {curso.status.charAt(0).toUpperCase() + curso.status.slice(1)}
                            </span>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                Nível: {curso.nivel}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                Carga horária: {curso.cargaHoraria}h
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                Alunos: {curso.alunos}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                Certificados: {curso.certificados}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>
                                Data de aprovação: {formatDate(curso.dataAprovacao)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-5 flex-shrink-0 flex space-x-4">
                        <button 
                          type="button" 
                          className="text-primary hover:text-primary-dark"
                          title="Visualizar Curso"
                        >
                          <EyeIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button 
                          type="button" 
                          className="text-primary hover:text-primary-dark"
                          title="Editar Curso"
                        >
                          <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button 
                          type="button" 
                          className="text-primary hover:text-primary-dark"
                          title="Duplicar Curso"
                        >
                          <DocumentDuplicateIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button 
                          type="button" 
                          className="text-red-500 hover:text-red-700"
                          title="Excluir Curso"
                        >
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Cursos; 