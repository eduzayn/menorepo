import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
  Button, Badge, Spinner, Tabs, TabsContent, TabsList, TabsTrigger,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  Form, FormField, Input, Select, DatePicker, Textarea
} from '@edunexia/ui-components';
import { 
  PlusIcon, FilterIcon, FileTextIcon, 
  DownloadIcon, UploadIcon, SearchIcon, 
  TrashIcon, EditIcon, EyeIcon, 
  ArrowUpIcon, ArrowDownIcon, FolderIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock de dados de lançamentos contábeis
const LANCAMENTOS_MOCK = [
  {
    id: '1',
    data: '2024-03-15',
    numeroDocumento: 'LC-2024-0001',
    descricao: 'Pagamento de fornecedores',
    tipo: 'DEBITO',
    contaDebito: '1.1.1.01.001',
    contaCredito: '2.1.1.01.002',
    valor: 5280.75,
    centroCusto: 'ADM-001',
    status: 'confirmado'
  },
  {
    id: '2',
    data: '2024-03-18',
    numeroDocumento: 'LC-2024-0002',
    descricao: 'Recebimento de mensalidades',
    tipo: 'CREDITO',
    contaDebito: '1.1.1.02.001',
    contaCredito: '3.1.1.01.001',
    valor: 12450.00,
    centroCusto: 'FIN-002',
    status: 'confirmado'
  },
  {
    id: '3',
    data: '2024-03-20',
    numeroDocumento: 'LC-2024-0003',
    descricao: 'Provisão de férias',
    tipo: 'PROVISAO',
    contaDebito: '3.1.3.01.001',
    contaCredito: '2.1.2.01.003',
    valor: 8250.30,
    centroCusto: 'RH-001',
    status: 'pendente'
  },
  {
    id: '4',
    data: '2024-03-22',
    numeroDocumento: 'LC-2024-0004',
    descricao: 'Depreciação de equipamentos',
    tipo: 'LANCAMENTO',
    contaDebito: '3.1.4.01.005',
    contaCredito: '1.2.3.01.002',
    valor: 2135.45,
    centroCusto: 'CONT-002',
    status: 'confirmado'
  },
  {
    id: '5',
    data: '2024-03-25',
    numeroDocumento: 'LC-2024-0005',
    descricao: 'Adiantamento de salários',
    tipo: 'DEBITO',
    contaDebito: '1.1.3.03.001',
    contaCredito: '1.1.1.01.001',
    valor: 4500.00,
    centroCusto: 'RH-001',
    status: 'pendente'
  }
];

// Tipos para os lançamentos
type TipoLancamento = 'DEBITO' | 'CREDITO' | 'PROVISAO' | 'LANCAMENTO';
type StatusLancamento = 'pendente' | 'confirmado' | 'estornado' | 'cancelado';

interface Lancamento {
  id: string;
  data: string;
  numeroDocumento: string;
  descricao: string;
  tipo: TipoLancamento;
  contaDebito: string;
  contaCredito: string;
  valor: number;
  centroCusto: string;
  status: StatusLancamento;
  anexo?: string;
}

interface FiltroBusca {
  dataInicio: string;
  dataFim: string;
  tipo?: TipoLancamento;
  status?: StatusLancamento;
  numerodocumento?: string;
  descricao?: string;
  centroCusto?: string;
}

/**
 * Página de Lançamentos Contábeis
 * Permite visualizar, adicionar, editar e excluir lançamentos contábeis
 */
export default function Lancamentos() {
  // Estado para armazenar os lançamentos
  const [lancamentos, setLancamentos] = useState<Lancamento[]>(LANCAMENTOS_MOCK);
  const [lancamentoSelecionado, setLancamentoSelecionado] = useState<Lancamento | null>(null);
  const [modoDialogo, setModoDialogo] = useState<'criar' | 'editar' | 'visualizar'>('criar');
  
  // Estado para armazenar os filtros de busca
  const [filtros, setFiltros] = useState<FiltroBusca>({
    dataInicio: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    dataFim: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd')
  });
  
  // Estados para controle de operações
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  // Função para formatar data
  const formatarData = (data: string) => {
    return format(new Date(data), 'dd/MM/yyyy', { locale: ptBR });
  };
  
  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };
  
  // Função para gerar um badge de status
  const getStatusBadge = (status: StatusLancamento) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'confirmado':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmado</Badge>;
      case 'estornado':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Estornado</Badge>;
      case 'cancelado':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
      default:
        return null;
    }
  };
  
  // Função para obter a cor do tipo de lançamento
  const getTipoBadge = (tipo: TipoLancamento) => {
    switch (tipo) {
      case 'DEBITO':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Débito</Badge>;
      case 'CREDITO':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Crédito</Badge>;
      case 'PROVISAO':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Provisão</Badge>;
      case 'LANCAMENTO':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Lançamento</Badge>;
      default:
        return null;
    }
  };
  
  // Função para abrir o diálogo de criação
  const abrirCriarLancamento = () => {
    setLancamentoSelecionado(null);
    setModoDialogo('criar');
    setIsDialogOpen(true);
  };
  
  // Função para abrir o diálogo de edição
  const abrirEditarLancamento = (lancamento: Lancamento) => {
    setLancamentoSelecionado(lancamento);
    setModoDialogo('editar');
    setIsDialogOpen(true);
  };
  
  // Função para abrir o diálogo de visualização
  const abrirVisualizarLancamento = (lancamento: Lancamento) => {
    setLancamentoSelecionado(lancamento);
    setModoDialogo('visualizar');
    setIsDialogOpen(true);
  };
  
  // Função para salvar um lançamento (criar ou editar)
  const salvarLancamento = (dados: any) => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (modoDialogo === 'criar') {
        const novoLancamento: Lancamento = {
          id: `${lancamentos.length + 1}`,
          ...dados,
          numeroDocumento: `LC-2024-${String(lancamentos.length + 1).padStart(4, '0')}`,
          status: 'pendente'
        };
        
        setLancamentos([...lancamentos, novoLancamento]);
      } else if (modoDialogo === 'editar' && lancamentoSelecionado) {
        const lancamentosAtualizados = lancamentos.map(lancamento => 
          lancamento.id === lancamentoSelecionado.id ? { ...lancamento, ...dados } : lancamento
        );
        
        setLancamentos(lancamentosAtualizados);
      }
      
      setIsLoading(false);
      setIsDialogOpen(false);
    }, 500);
  };
  
  // Função para aplicar filtros na busca
  const aplicarFiltros = () => {
    setIsLoading(true);
    
    // Simular chamada de API com filtros
    setTimeout(() => {
      // Aqui seria implementada a lógica de filtragem real
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Lançamentos Contábeis</h1>
          <p className="text-muted-foreground">Gerencie os lançamentos contábeis da instituição</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={abrirCriarLancamento}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Lançamento
          </Button>
          
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UploadIcon className="w-4 h-4 mr-2" />
                Importar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar Lançamentos</DialogTitle>
                <DialogDescription>
                  Faça upload de um arquivo CSV ou Excel com os lançamentos a serem importados.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md">
                <UploadIcon className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Arraste e solte seu arquivo aqui ou clique para selecionar
                </p>
                <Input type="file" className="max-w-xs" />
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button>
                  Importar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      
      {/* Filtros de Busca */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FilterIcon className="w-5 h-5 mr-2 text-primary" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField label="Data Inicial">
              <DatePicker 
                value={filtros.dataInicio} 
                onChange={(date) => setFiltros({ ...filtros, dataInicio: date })}
              />
            </FormField>
            
            <FormField label="Data Final">
              <DatePicker 
                value={filtros.dataFim} 
                onChange={(date) => setFiltros({ ...filtros, dataFim: date })}
              />
            </FormField>
            
            <FormField label="Tipo">
              <Select 
                value={filtros.tipo} 
                onChange={(value) => setFiltros({ ...filtros, tipo: value as TipoLancamento })}
              >
                <option value="">Todos</option>
                <option value="DEBITO">Débito</option>
                <option value="CREDITO">Crédito</option>
                <option value="PROVISAO">Provisão</option>
                <option value="LANCAMENTO">Lançamento</option>
              </Select>
            </FormField>
            
            <FormField label="Status">
              <Select 
                value={filtros.status} 
                onChange={(value) => setFiltros({ ...filtros, status: value as StatusLancamento })}
              >
                <option value="">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="estornado">Estornado</option>
                <option value="cancelado">Cancelado</option>
              </Select>
            </FormField>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <FormField label="Número Documento">
              <Input 
                value={filtros.numerodocumento || ''} 
                onChange={(e) => setFiltros({ ...filtros, numerodocumento: e.target.value })}
                placeholder="Ex: LC-2024-0001"
              />
            </FormField>
            
            <FormField label="Descrição">
              <Input 
                value={filtros.descricao || ''} 
                onChange={(e) => setFiltros({ ...filtros, descricao: e.target.value })}
                placeholder="Buscar por descrição"
              />
            </FormField>
            
            <FormField label="Centro de Custo">
              <Input 
                value={filtros.centroCusto || ''} 
                onChange={(e) => setFiltros({ ...filtros, centroCusto: e.target.value })}
                placeholder="Ex: ADM-001"
              />
            </FormField>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={aplicarFiltros}>
              <SearchIcon className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabela de Lançamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileTextIcon className="w-5 h-5 mr-2 text-primary" />
            Lançamentos Contábeis
          </CardTitle>
          <CardDescription>
            Exibindo {lancamentos.length} lançamentos no período selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nº Documento</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Contas (D/C)</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lancamentos.map((lancamento) => (
                    <TableRow key={lancamento.id}>
                      <TableCell>{formatarData(lancamento.data)}</TableCell>
                      <TableCell>{lancamento.numeroDocumento}</TableCell>
                      <TableCell>
                        <div className="max-w-[250px] truncate" title={lancamento.descricao}>
                          {lancamento.descricao}
                        </div>
                      </TableCell>
                      <TableCell>{getTipoBadge(lancamento.tipo)}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>D: {lancamento.contaDebito}</div>
                          <div>C: {lancamento.contaCredito}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatarMoeda(lancamento.valor)}
                      </TableCell>
                      <TableCell>{getStatusBadge(lancamento.status)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => abrirVisualizarLancamento(lancamento)}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => abrirEditarLancamento(lancamento)}
                          >
                            <EditIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Diálogo para Criar/Editar Lançamento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {modoDialogo === 'criar' ? 'Novo Lançamento Contábil' : 
               modoDialogo === 'editar' ? 'Editar Lançamento Contábil' : 
               'Detalhes do Lançamento'}
            </DialogTitle>
            <DialogDescription>
              {modoDialogo === 'criar' ? 'Preencha os campos para criar um novo lançamento contábil.' : 
               modoDialogo === 'editar' ? 'Edite as informações do lançamento contábil.' : 
               'Visualize os detalhes do lançamento contábil.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form onSubmit={salvarLancamento}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Data do Lançamento" required>
                <DatePicker 
                  value={lancamentoSelecionado?.data || format(new Date(), 'yyyy-MM-dd')}
                  onChange={() => {}}
                  disabled={modoDialogo === 'visualizar'}
                />
              </FormField>
              
              <FormField label="Tipo de Lançamento" required>
                <Select 
                  value={lancamentoSelecionado?.tipo || 'LANCAMENTO'}
                  onChange={() => {}}
                  disabled={modoDialogo === 'visualizar'}
                >
                  <option value="DEBITO">Débito</option>
                  <option value="CREDITO">Crédito</option>
                  <option value="PROVISAO">Provisão</option>
                  <option value="LANCAMENTO">Lançamento</option>
                </Select>
              </FormField>
              
              <FormField label="Conta Débito" required>
                <Input 
                  value={lancamentoSelecionado?.contaDebito || ''}
                  onChange={() => {}}
                  disabled={modoDialogo === 'visualizar'}
                  placeholder="Ex: 1.1.1.01.001"
                />
              </FormField>
              
              <FormField label="Conta Crédito" required>
                <Input 
                  value={lancamentoSelecionado?.contaCredito || ''}
                  onChange={() => {}}
                  disabled={modoDialogo === 'visualizar'}
                  placeholder="Ex: 2.1.1.01.002"
                />
              </FormField>
              
              <FormField label="Valor" required>
                <Input 
                  type="number"
                  step="0.01"
                  value={lancamentoSelecionado?.valor || ''}
                  onChange={() => {}}
                  disabled={modoDialogo === 'visualizar'}
                  placeholder="0,00"
                />
              </FormField>
              
              <FormField label="Centro de Custo">
                <Input 
                  value={lancamentoSelecionado?.centroCusto || ''}
                  onChange={() => {}}
                  disabled={modoDialogo === 'visualizar'}
                  placeholder="Ex: ADM-001"
                />
              </FormField>
            </div>
            
            <FormField label="Descrição" required className="mt-4">
              <Textarea 
                value={lancamentoSelecionado?.descricao || ''}
                onChange={() => {}}
                disabled={modoDialogo === 'visualizar'}
                placeholder="Descreva o lançamento contábil"
                rows={3}
              />
            </FormField>
            
            {modoDialogo === 'visualizar' && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Número do Documento</p>
                    <p>{lancamentoSelecionado?.numeroDocumento}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p>{getStatusBadge(lancamentoSelecionado?.status || 'pendente')}</p>
                  </div>
                </div>
              </div>
            )}
            
            <FormField label="Anexo" className="mt-4">
              <div className="flex items-center gap-2">
                <Input 
                  type="file"
                  disabled={modoDialogo === 'visualizar'}
                />
                {modoDialogo === 'visualizar' && lancamentoSelecionado?.anexo && (
                  <Button variant="outline" size="sm">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </FormField>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                {modoDialogo === 'visualizar' ? 'Fechar' : 'Cancelar'}
              </Button>
              
              {modoDialogo !== 'visualizar' && (
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Spinner size="sm" className="mr-2" />}
                  {modoDialogo === 'criar' ? 'Criar Lançamento' : 'Salvar Alterações'}
                </Button>
              )}
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 