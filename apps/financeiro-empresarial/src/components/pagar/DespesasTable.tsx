import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@edunexia/ui-components';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Eye, 
  FileText, 
  MoreVertical, 
  X, 
  CheckCircle, 
  Clock, 
  Upload,
  Download,
  Ban
} from 'lucide-react';

import type { Pagamento, CategoriaFinanceira, MetodoPagamento } from '../../types/financeiro';

// Utilitário para formatar valores monetários
const formatarValor = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

// Mapeia status para cores de badge
const statusConfig = {
  confirmado: { color: 'green', label: 'Confirmado', icon: CheckCircle },
  pendente: { color: 'yellow', label: 'Pendente', icon: Clock },
  cancelado: { color: 'gray', label: 'Cancelado', icon: X },
  estornado: { color: 'pink', label: 'Estornado', icon: Ban }
};

// Mapeia categorias para labels amigáveis
const categoriasLabel: Record<CategoriaFinanceira, string> = {
  mensalidade: 'Mensalidade',
  matricula: 'Matrícula',
  taxa: 'Taxa',
  multa: 'Multa',
  desconto: 'Desconto',
  comissao: 'Comissão',
  salario: 'Salário',
  aluguel: 'Aluguel',
  servico: 'Serviço',
  marketing: 'Marketing',
  outros: 'Outros'
};

interface DespesasTableProps {
  pagamentos: Pagamento[];
  isLoading: boolean;
  onConfirmarPagamento: (id: string, data: string, comprovante?: File) => void;
  onCancelarPagamento: (id: string, motivo: string) => void;
  onViewDetails: (id: string) => void;
}

export function DespesasTable({
  pagamentos,
  isLoading,
  onConfirmarPagamento,
  onCancelarPagamento,
  onViewDetails
}: DespesasTableProps) {
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<Pagamento | null>(null);
  const [dialogConfirmacao, setDialogConfirmacao] = useState(false);
  const [dialogCancelamento, setDialogCancelamento] = useState(false);
  
  // Estado para confirmação de pagamento
  const [dataPagamento, setDataPagamento] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [comprovante, setComprovante] = useState<File | null>(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  
  // Funções auxiliares
  const abrirDialogConfirmacao = (pagamento: Pagamento) => {
    setPagamentoSelecionado(pagamento);
    setDataPagamento(format(new Date(), 'yyyy-MM-dd'));
    setComprovante(null);
    setDialogConfirmacao(true);
  };
  
  const abrirDialogCancelamento = (pagamento: Pagamento) => {
    setPagamentoSelecionado(pagamento);
    setMotivoCancelamento('');
    setDialogCancelamento(true);
  };
  
  const confirmarPagamento = () => {
    if (pagamentoSelecionado && dataPagamento) {
      onConfirmarPagamento(
        pagamentoSelecionado.id,
        dataPagamento,
        comprovante || undefined
      );
      setDialogConfirmacao(false);
    }
  };
  
  const confirmarCancelamento = () => {
    if (pagamentoSelecionado && motivoCancelamento) {
      onCancelarPagamento(pagamentoSelecionado.id, motivoCancelamento);
      setDialogCancelamento(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setComprovante(files[0]);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando despesas...</div>;
  }

  if (pagamentos.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-gray-500">Nenhuma despesa encontrada com os filtros atuais.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data Venc.</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Destinatário</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagamentos.map((pagamento) => {
            const status = statusConfig[pagamento.status];
            const StatusIcon = status.icon;
            
            return (
              <TableRow key={pagamento.id}>
                <TableCell>
                  <div className="font-medium">{pagamento.descricao}</div>
                  <div className="text-xs text-gray-500">ID: {pagamento.id.substring(0, 8)}...</div>
                </TableCell>
                <TableCell>
                  {categoriasLabel[pagamento.categoria] || pagamento.categoria}
                </TableCell>
                <TableCell className="font-medium">
                  {formatarValor(pagamento.valor)}
                </TableCell>
                <TableCell>
                  {format(new Date(pagamento.data_pagamento), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Badge variant={status.color as "default" | "secondary" | "destructive" | "outline"}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">
                    {pagamento.destinatario_id 
                      ? `${pagamento.destinatario_tipo}: ${pagamento.destinatario_id}`
                      : 'N/A'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onViewDetails(pagamento.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="end">
                        <div className="grid gap-1">
                          {pagamento.status === 'pendente' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="justify-start"
                              onClick={() => abrirDialogConfirmacao(pagamento)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Confirmar Pagamento
                            </Button>
                          )}
                          
                          {(pagamento.status === 'pendente' || pagamento.status === 'confirmado') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="justify-start"
                              onClick={() => abrirDialogCancelamento(pagamento)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancelar Pagamento
                            </Button>
                          )}
                          
                          {pagamento.comprovante_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="justify-start"
                              onClick={() => window.open(pagamento.comprovante_url, '_blank')}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Ver Comprovante
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Solicitar Nota Fiscal
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {/* Dialog para confirmação de pagamento */}
      <Dialog open={dialogConfirmacao} onOpenChange={setDialogConfirmacao}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Pagamento</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="data" className="text-right">
                Data
              </label>
              <div className="col-span-3">
                <Input
                  id="data"
                  type="date"
                  value={dataPagamento}
                  onChange={(e) => setDataPagamento(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="comprovante" className="text-right">
                Comprovante
              </label>
              <div className="col-span-3">
                <Input
                  id="comprovante"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatos aceitos: PDF, JPG, PNG (máx. 5MB)
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogConfirmacao(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarPagamento}>
              Confirmar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para cancelamento */}
      <Dialog open={dialogCancelamento} onOpenChange={setDialogCancelamento}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Pagamento</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="motivo" className="text-right">
                Motivo
              </label>
              <Input
                id="motivo"
                className="col-span-3"
                value={motivoCancelamento}
                onChange={(e) => setMotivoCancelamento(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogCancelamento(false)}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={confirmarCancelamento}>
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 