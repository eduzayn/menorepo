import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Lead, LeadStatus } from '../../types/comunicacao';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Spinner } from '../../components/ui/spinner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  ArrowUpIcon,
  ArrowDownIcon,
  PencilIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Configuração dos status dos leads
const statusConfig: Record<LeadStatus, { nome: string, cor: string }> = {
  'NOVO': { 
    nome: 'Novo', 
    cor: 'bg-blue-100 text-blue-800 border-blue-300' 
  },
  'EM_CONTATO': { 
    nome: 'Em Contato', 
    cor: 'bg-yellow-100 text-yellow-800 border-yellow-300' 
  },
  'QUALIFICADO': { 
    nome: 'Qualificado', 
    cor: 'bg-green-100 text-green-800 border-green-300' 
  },
  'PERDIDO': { 
    nome: 'Perdido', 
    cor: 'bg-red-100 text-red-800 border-red-300' 
  },
  'CONVERTIDO': { 
    nome: 'Convertido', 
    cor: 'bg-purple-100 text-purple-800 border-purple-300' 
  }
};

export function LeadsTable() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Lead>('criado_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const leadsPerPage = 10;

  // Carregar leads
  useEffect(() => {
    const carregarLeads = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('criado_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setLeads(data || []);
        setFilteredLeads(data || []);
      } catch (error) {
        console.error('Erro ao carregar leads:', error);
        toast.error('Erro ao carregar leads');
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarLeads();
  }, []);

  // Filtrar leads com base no termo de pesquisa
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLeads(leads);
      setCurrentPage(1);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    const filtered = leads.filter(lead => 
      lead.nome.toLowerCase().includes(lowerSearchTerm) ||
      lead.email.toLowerCase().includes(lowerSearchTerm) ||
      lead.telefone.toLowerCase().includes(lowerSearchTerm) ||
      (lead.observacoes && lead.observacoes.toLowerCase().includes(lowerSearchTerm))
    );
    
    setFilteredLeads(filtered);
    setCurrentPage(1);
  }, [searchTerm, leads]);

  // Função para ordenar leads
  const handleSort = (field: keyof Lead) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    
    // Ordenar os leads
    const sorted = [...filteredLeads].sort((a, b) => {
      if (a[field] == null) return 1;
      if (b[field] == null) return -1;
      
      const valA = a[field];
      const valB = b[field];
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return newDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      
      // Para números e datas (convertidos para string para comparação)
      const strA = String(valA);
      const strB = String(valB);
      
      return newDirection === 'asc' 
        ? strA.localeCompare(strB) 
        : strB.localeCompare(strA);
    });
    
    setFilteredLeads(sorted);
  };

  // Paginação
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  // Navegar para página de detalhes do lead
  const handleViewLead = (id: string) => {
    navigate(`/crm/leads/${id}`);
  };

  // Renderizar badge de status
  const renderStatusBadge = (status: LeadStatus) => {
    const config = statusConfig[status] || { nome: status, cor: 'bg-gray-100 text-gray-800' };
    
    return <Badge className={config.cor}>{config.nome}</Badge>;
  };

  // Ícone de ordenação
  const renderSortIcon = (field: keyof Lead) => {
    if (field !== sortField) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUpIcon className="h-4 w-4 ml-1" /> 
      : <ArrowDownIcon className="h-4 w-4 ml-1" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Pesquisar leads..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          Mostrando {indexOfFirstLead + 1}-{Math.min(indexOfLastLead, filteredLeads.length)} de {filteredLeads.length} leads
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="w-[200px] cursor-pointer"
                onClick={() => handleSort('nome')}
              >
                <div className="flex items-center">
                  Nome
                  {renderSortIcon('nome')}
                </div>
              </TableHead>
              
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {renderSortIcon('email')}
                </div>
              </TableHead>
              
              <TableHead>Telefone</TableHead>
              
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {renderSortIcon('status')}
                </div>
              </TableHead>
              
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('engajamento')}
              >
                <div className="flex items-center">
                  Engajamento
                  {renderSortIcon('engajamento')}
                </div>
              </TableHead>
              
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('ultima_interacao')}
              >
                <div className="flex items-center">
                  Última Interação
                  {renderSortIcon('ultima_interacao')}
                </div>
              </TableHead>
              
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {currentLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum lead encontrado
                </TableCell>
              </TableRow>
            ) : (
              currentLeads.map(lead => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.nome}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.telefone}</TableCell>
                  <TableCell>{renderStatusBadge(lead.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-16 h-1.5 bg-gray-200 rounded overflow-hidden mr-2">
                        <div 
                          className="h-full bg-indigo-500" 
                          style={{width: `${(lead.engajamento / 10) * 100}%`}}
                        ></div>
                      </div>
                      <span>{lead.engajamento}/10</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {lead.ultima_interacao
                      ? format(new Date(lead.ultima_interacao), 'dd/MM/yyyy', { locale: ptBR })
                      : 'Nunca'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewLead(lead.id)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            
            <div className="text-sm">
              Página {currentPage} de {totalPages}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 