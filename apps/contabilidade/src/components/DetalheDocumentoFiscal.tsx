import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter, 
  Badge, 
  Button,
  Separator
} from '@edunexia/ui-components';
import { DocumentoFiscal, ItemDocumentoFiscal } from '../types/contabilidade';
import { formatCurrency, formatDate, formatCNPJ, formatCPF } from '../utils/formatters';
import { FileText, Download, ExternalLink, Edit, Archive } from 'lucide-react';

export interface DetalheDocumentoFiscalProps {
  documento: DocumentoFiscal;
  onVisualizarPDF?: (documento: DocumentoFiscal) => void;
  onDownload?: (documento: DocumentoFiscal) => void;
  onEditar?: (documento: DocumentoFiscal) => void;
  onArquivar?: (documento: DocumentoFiscal) => void;
  mostraAcoes?: boolean;
  mostraItens?: boolean;
  className?: string;
}

/**
 * Componente para exibir detalhes de documentos fiscais
 */
export function DetalheDocumentoFiscal({
  documento,
  onVisualizarPDF,
  onDownload,
  onEditar,
  onArquivar,
  mostraAcoes = true,
  mostraItens = true,
  className = ''
}: DetalheDocumentoFiscalProps) {
  // Determinar o status do documento
  const getStatusBadge = () => {
    switch (documento.status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
      case 'processado':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Processado</Badge>;
      case 'cancelado':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
      case 'arquivado':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Arquivado</Badge>;
      default:
        return <Badge variant="outline">Indefinido</Badge>;
    }
  };

  // Obter o tipo de documento com formatação adequada
  const getTipoDocumento = () => {
    const tipos: Record<string, string> = {
      'nfe': 'Nota Fiscal Eletrônica',
      'nfse': 'Nota Fiscal de Serviço',
      'recibo': 'Recibo',
      'fatura': 'Fatura',
      'boleto': 'Boleto',
      'contrato': 'Contrato',
      'outros': 'Outros'
    };

    return tipos[documento.tipo] || documento.tipo;
  };

  // Formatar o documento de identificação (CPF/CNPJ)
  const formatarDocumentoIdentificacao = (doc?: string) => {
    if (!doc) return '-';
    return doc.length === 11 ? formatCPF(doc) : formatCNPJ(doc);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">
              {getTipoDocumento()} #{documento.numero}
            </p>
            <CardTitle className="text-xl mt-1">{documento.descricao || 'Documento Fiscal'}</CardTitle>
          </div>
          <div className="flex space-x-2">
            {getStatusBadge()}
            {documento.arquivoUrl && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                PDF Disponível
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Informações principais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Data de Emissão</p>
              <p className="font-medium">{formatDate(documento.dataEmissao)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data de Vencimento</p>
              <p className="font-medium">{formatDate(documento.dataVencimento)}</p>
            </div>
            
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Valor Total</p>
              <p className="font-medium text-xl">{formatCurrency(documento.valorTotal)}</p>
            </div>

            {documento.chaveAcesso && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Chave de Acesso</p>
                <p className="font-medium text-xs break-all font-mono">{documento.chaveAcesso}</p>
              </div>
            )}

            <Separator className="col-span-2 my-2" />

            {/* Emitente */}
            <div className="col-span-2">
              <p className="text-sm text-gray-500 font-semibold">Emitente</p>
              <div className="mt-2 pl-2 border-l-2 border-gray-200">
                <p className="font-medium">{documento.emitente.nome}</p>
                <p className="text-sm text-gray-600">
                  {formatarDocumentoIdentificacao(documento.emitente.documento)}
                </p>
                {documento.emitente.endereco && (
                  <p className="text-sm text-gray-600 mt-1">{documento.emitente.endereco}</p>
                )}
              </div>
            </div>

            {/* Destinatário */}
            <div className="col-span-2 mt-2">
              <p className="text-sm text-gray-500 font-semibold">Destinatário</p>
              <div className="mt-2 pl-2 border-l-2 border-gray-200">
                <p className="font-medium">{documento.destinatario.nome}</p>
                <p className="text-sm text-gray-600">
                  {formatarDocumentoIdentificacao(documento.destinatario.documento)}
                </p>
                {documento.destinatario.endereco && (
                  <p className="text-sm text-gray-600 mt-1">{documento.destinatario.endereco}</p>
                )}
              </div>
            </div>
          </div>

          {/* Itens do documento */}
          {mostraItens && documento.itens && documento.itens.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Itens do Documento</h4>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qtd
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor Unit.
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documento.itens.map((item: ItemDocumentoFiscal, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.codigo || (index + 1)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.descricao}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                          {item.quantidade}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                          {formatCurrency(item.valorUnitario)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(item.valorTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-right text-sm font-medium">
                        Total
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-bold">
                        {formatCurrency(documento.valorTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Observações */}
          {documento.observacoes && (
            <div>
              <p className="text-sm text-gray-500">Observações</p>
              <p className="mt-1 text-sm text-gray-700">{documento.observacoes}</p>
            </div>
          )}
          
          {/* Lançamentos relacionados */}
          {documento.lancamentosRelacionados && documento.lancamentosRelacionados.length > 0 && (
            <div className="pt-2 border-t">
              <h4 className="font-semibold mb-2">Lançamentos Contábeis Relacionados</h4>
              <ul className="space-y-1">
                {documento.lancamentosRelacionados.map((lancamento, index) => (
                  <li key={index} className="text-sm">
                    #{lancamento.numero} - {lancamento.descricao} ({formatCurrency(lancamento.valor)})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>

      {mostraAcoes && (
        <CardFooter className="flex justify-end border-t pt-4 space-x-2">
          {onVisualizarPDF && documento.arquivoUrl && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onVisualizarPDF(documento)}
              title="Visualizar PDF"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Visualizar
            </Button>
          )}
          
          {onDownload && documento.arquivoUrl && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDownload(documento)}
              title="Baixar documento"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          )}
          
          {onEditar && documento.status !== 'cancelado' && documento.status !== 'arquivado' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEditar(documento)}
              title="Editar documento"
            >
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
          )}
          
          {onArquivar && documento.status !== 'arquivado' && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => onArquivar(documento)}
              title="Arquivar documento"
            >
              <Archive className="w-4 h-4 mr-1" />
              Arquivar
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
} 