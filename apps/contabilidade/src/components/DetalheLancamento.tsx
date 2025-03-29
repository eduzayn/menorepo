import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter, 
  Badge, 
  Button 
} from '@edunexia/ui-components';
import { LancamentoContabil, TipoLancamento } from '../types/contabilidade';
import { formatCurrency, formatDate } from '../utils/formatters';
import { FileEdit, Printer, Copy, FileX } from 'lucide-react';

export interface DetalheLancamentoProps {
  lancamento: LancamentoContabil;
  onEditar?: (lancamento: LancamentoContabil) => void;
  onEstornar?: (lancamento: LancamentoContabil) => void;
  onDuplicar?: (lancamento: LancamentoContabil) => void;
  onImprimir?: (lancamento: LancamentoContabil) => void;
  mostraAcoes?: boolean;
  className?: string;
}

/**
 * Componente para exibir detalhes de um lançamento contábil
 */
export function DetalheLancamento({
  lancamento,
  onEditar,
  onEstornar,
  onDuplicar,
  onImprimir,
  mostraAcoes = true,
  className = ''
}: DetalheLancamentoProps) {
  // Determinar status do lançamento
  const getStatusBadge = () => {
    if (lancamento.estornado) {
      return <Badge variant="destructive">Estornado</Badge>;
    }
    
    if (lancamento.status === 'pendente') {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
    }
    
    if (lancamento.status === 'aprovado') {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovado</Badge>;
    }
    
    if (lancamento.status === 'rejeitado') {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeitado</Badge>;
    }
    
    return <Badge variant="outline">Indefinido</Badge>;
  };

  // Gerar tipo de lançamento 
  const getTipoLancamento = () => {
    if (lancamento.tipo === TipoLancamento.DEBITO) {
      return <Badge className="bg-blue-100 text-blue-800 border-0">Débito</Badge>;
    }
    
    if (lancamento.tipo === TipoLancamento.CREDITO) {
      return <Badge className="bg-green-100 text-green-800 border-0">Crédito</Badge>;
    }
    
    if (lancamento.tipo === TipoLancamento.TRANSFERENCIA) {
      return <Badge className="bg-purple-100 text-purple-800 border-0">Transferência</Badge>;
    }
    
    return <Badge>Outro</Badge>;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">
              #{lancamento.numero} • {formatDate(lancamento.data, true)}
            </p>
            <CardTitle className="text-xl mt-1">{lancamento.descricao}</CardTitle>
          </div>
          <div className="flex space-x-2">
            {getTipoLancamento()}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Informações principais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Data de Competência</p>
              <p className="font-medium">{formatDate(lancamento.dataCompetencia)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Valor</p>
              <p className="font-medium text-xl">{formatCurrency(lancamento.valor)}</p>
            </div>
            
            {lancamento.centroCusto && (
              <div>
                <p className="text-sm text-gray-500">Centro de Custo</p>
                <p className="font-medium">{lancamento.centroCusto.nome}</p>
              </div>
            )}
            
            {lancamento.documentoFiscal && (
              <div>
                <p className="text-sm text-gray-500">Documento Fiscal</p>
                <p className="font-medium">
                  {lancamento.documentoFiscal.tipo} #{lancamento.documentoFiscal.numero}
                </p>
              </div>
            )}
          </div>

          {/* Detalhes das contas */}
          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-50 p-3 font-medium border-b">
              Detalhes da Movimentação
            </div>
            <div className="divide-y">
              {/* Conta de débito */}
              <div className="p-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Conta Debitada</p>
                    <p className="font-medium">
                      {lancamento.contaDebito.codigo} - {lancamento.contaDebito.nome}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Valor Debitado</p>
                    <p className="font-medium text-red-600">{formatCurrency(lancamento.valor)}</p>
                  </div>
                </div>
              </div>
              
              {/* Conta de crédito */}
              <div className="p-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Conta Creditada</p>
                    <p className="font-medium">
                      {lancamento.contaCredito.codigo} - {lancamento.contaCredito.nome}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Valor Creditado</p>
                    <p className="font-medium text-green-600">{formatCurrency(lancamento.valor)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Histórico e observações */}
          {lancamento.observacoes && (
            <div>
              <p className="text-sm text-gray-500">Observações</p>
              <p className="mt-1 text-gray-700">{lancamento.observacoes}</p>
            </div>
          )}
          
          {/* Informações sobre usuário */}
          <div className="pt-2 border-t text-sm text-gray-500">
            <p>
              Registrado por {lancamento.usuarioCriacao?.nome || 'Sistema'} em {' '}
              {formatDate(lancamento.dataCriacao, true)}
              {lancamento.usuarioModificacao && (
                <>
                  {' • '}Última modificação por {lancamento.usuarioModificacao.nome} em {' '}
                  {formatDate(lancamento.dataModificacao, true)}
                </>
              )}
            </p>
          </div>
          
          {/* Informações de estorno */}
          {lancamento.estornado && lancamento.lancamentoEstorno && (
            <div className="pt-2 mt-2 border-t">
              <p className="text-sm text-red-500 font-medium">
                Este lançamento foi estornado em {formatDate(lancamento.lancamentoEstorno.data)} 
                {lancamento.lancamentoEstorno.motivo && ` - Motivo: ${lancamento.lancamentoEstorno.motivo}`}
              </p>
              <p className="text-sm text-red-500">
                Lançamento de estorno: #{lancamento.lancamentoEstorno.numero}
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {mostraAcoes && !lancamento.estornado && (
        <CardFooter className="flex justify-end border-t pt-4 space-x-2">
          {onImprimir && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onImprimir(lancamento)}
              title="Imprimir lançamento"
            >
              <Printer className="w-4 h-4 mr-1" />
              Imprimir
            </Button>
          )}
          
          {onDuplicar && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDuplicar(lancamento)}
              title="Duplicar lançamento"
            >
              <Copy className="w-4 h-4 mr-1" />
              Duplicar
            </Button>
          )}
          
          {onEditar && lancamento.status !== 'aprovado' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEditar(lancamento)}
              title="Editar lançamento"
            >
              <FileEdit className="w-4 h-4 mr-1" />
              Editar
            </Button>
          )}
          
          {onEstornar && lancamento.status === 'aprovado' && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onEstornar(lancamento)}
              title="Estornar lançamento"
            >
              <FileX className="w-4 h-4 mr-1" />
              Estornar
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
} 