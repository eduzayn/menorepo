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
  Link as LinkIcon,
  Download,
  Calendar 
} from 'lucide-react';

import type { Cobranca, MetodoPagamento } from '../../types/financeiro';

// Utilitário para formatar valores monetários
const formatarValor = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

// Mapeia status para cores de badge
const statusConfig = {
  pendente: { color: 'yellow', label: 'Pendente', icon: Clock },
  pago: { color: 'green', label: 'Pago', icon: CheckCircle },
  atrasado: { color: 'red', label: 'Atrasado', icon: X },
  cancelado: { color: 'gray', label: 'Cancelado', icon: X },
  em_processamento: { color: 'blue', label: 'Em Processamento', icon: Clock },
  estornado: { color: 'pink', label: 'Estornado', icon: X },
  parcial: { color: 'purple', label: 'Pago Parcial', icon: CheckCircle }
};

interface CobrancasTableProps {
  cobrancas: Cobranca[];
  isLoading: boolean;
  onPagamento: (id: string, valor: number, metodo: MetodoPagamento, data: string) => void;
  onGerarLink: (id: string, gateway: 'littex' | 'infinitepay' | 'manual') => Promise<string>;
  onCancelar: (id: string, motivo: string) => void;
  onViewDetails: (id: string) => void;
}

export function CobrancasTable({
  cobrancas,
  isLoading,
  onPagamento,
  onGerarLink,
  onCancelar,
  onViewDetails
}: CobrancasTableProps) {
  const [cobrancaSelecionada, setCobrancaSelecionada] = useState<Cobranca | null>(null);
  const [dialogPagamento, setDialogPagamento] = useState(false);
  const [dialogCancelamento, setDialogCancelamento] = useState(false);
  
  // Estado para registro de pagamento
  const [valorPagamento, setValorPagamento] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>('pix');
  const [dataPagamento, setDataPagamento] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  
  // Funções auxiliares
  const abrirDialogPagamento = (cobranca: Cobranca) => {
    setCobrancaSelecionada(cobranca);
    setValorPagamento(String(cobranca.valor_total - (cobranca.valor_pago || 0)));
    setDialogPagamento(true);
  };
  
  const abrirDialogCancelamento = (cobranca: Cobranca) => {
    setCobrancaSelecionada(cobranca);
    setDialogCancelamento(true);
  };
  
  const confirmarPagamento = () => {
    if (cobrancaSelecionada && valorPagamento) {
      onPagamento(
        cobrancaSelecionada.id,
        Number(valorPagamento),
        metodoPagamento,
        dataPagamento
      );
      setDialogPagamento(false);
    }
  };
  
  const confirmarCancelamento = () => {
    if (cobrancaSelecionada && motivoCancelamento) {
      onCancelar(cobrancaSelecionada.id, motivoCancelamento);
      setDialogCancelamento(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando cobranças...</div>;
  }

  if (cobrancas.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-gray-500">Nenhuma cobrança encontrada com os filtros atuais.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aluno/Matrícula</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cobrancas.map((cobranca) => {
            const status = statusConfig[cobranca.status];
            const StatusIcon = status.icon;
            
            // Verifica se está atrasada mas não foi marcada ainda
            const isAtrasada = 
              cobranca.status === 'pendente' && 
              new Date(cobranca.data_vencimento) < new Date() &&
              !cobranca.data_pagamento;
            
            // Se estiver atrasada, sobrescreve o status
            const displayStatus = isAtrasada 
              ? statusConfig.atrasado 
              : status;
            
            return (
              <TableRow key={cobranca.id}>
                <TableCell className="font-mono text-xs">
                  {cobranca.id.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  <span className="capitalize">{cobranca.tipo}</span>
                  {cobranca.parcelas && (
                    <span className="ml-1 text-xs text-gray-500">
                      ({cobranca.parcela_atual}/{cobranca.parcelas})
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{formatarValor(cobranca.valor_total)}</div>
                  {cobranca.valor_pago && cobranca.valor_pago > 0 && (
                    <div className="text-xs text-gray-500">
                      Pago: {formatarValor(cobranca.valor_pago)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(cobranca.data_vencimento), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Badge variant={displayStatus.color as "default" | "secondary" | "destructive" | "outline"}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {displayStatus.label}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">
                    {cobranca.aluno_id || cobranca.matricula_id || '-'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onViewDetails(cobranca.id)}
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
                          {cobranca.status !== 'pago' && cobranca.status !== 'cancelado' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="justify-start"
                              onClick={() => abrirDialogPagamento(cobranca)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Registrar Pagamento
                            </Button>
                          )}
                          
                          {cobranca.status !== 'cancelado' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="justify-start"
                              onClick={() => abrirDialogCancelamento(cobranca)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancelar Cobrança
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start"
                            onClick={async () => {
                              const link = await onGerarLink(cobranca.id, 'littex');
                              if (link) {
                                window.open(link, '_blank');
                              }
                            }}
                          >
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Gerar Link
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Emitir Nota Fiscal
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Baixar Boleto
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
      
      {/* Dialog para registro de pagamento */}
      <Dialog open={dialogPagamento} onOpenChange={setDialogPagamento}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="valor" className="text-right">
                Valor
              </label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                className="col-span-3"
                value={valorPagamento}
                onChange={(e) => setValorPagamento(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="metodo" className="text-right">
                Método
              </label>
              <Select value={metodoPagamento} onValueChange={(value) => setMetodoPagamento(value as MetodoPagamento)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Método de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="data" className="text-right">
                Data
              </label>
              <div className="col-span-3 flex">
                <Input
                  id="data"
                  type="date"
                  value={dataPagamento}
                  onChange={(e) => setDataPagamento(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogPagamento(false)}>
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
            <DialogTitle>Cancelar Cobrança</DialogTitle>
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