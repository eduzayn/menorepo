import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter, 
  Badge, 
  Button,
  Progress
} from '@edunexia/ui-components';
import { ObrigacaoFiscal, StatusObrigacao } from '../types/contabilidade';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Calendar, CheckCircle, AlertCircle, FileText, FileUp, Clock } from 'lucide-react';

export interface DetalheObrigacaoFiscalProps {
  obrigacao: ObrigacaoFiscal;
  onEnviar?: (obrigacao: ObrigacaoFiscal) => void;
  onBaixarArquivo?: (obrigacao: ObrigacaoFiscal) => void;
  onVerDetalhes?: (obrigacao: ObrigacaoFiscal) => void;
  mostraAcoes?: boolean;
  className?: string;
}

/**
 * Componente para exibir detalhes de uma obrigação fiscal
 */
export function DetalheObrigacaoFiscal({
  obrigacao,
  onEnviar,
  onBaixarArquivo,
  onVerDetalhes,
  mostraAcoes = true,
  className = ''
}: DetalheObrigacaoFiscalProps) {
  // Verificar se está atrasada
  const isAtrasada = () => {
    if (obrigacao.status === StatusObrigacao.ENTREGUE) return false;
    const hoje = new Date();
    const prazoFinal = new Date(obrigacao.prazoEntrega);
    return hoje > prazoFinal;
  };

  // Calcular dias restantes ou atrasados
  const calcularDias = () => {
    const hoje = new Date();
    const prazo = new Date(obrigacao.prazoEntrega);
    const diff = Math.floor((prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff >= 0) {
      return `${diff} dia${diff !== 1 ? 's' : ''} restante${diff !== 1 ? 's' : ''}`;
    } else {
      return `Atrasada em ${Math.abs(diff)} dia${Math.abs(diff) !== 1 ? 's' : ''}`;
    }
  };

  // Status badge com formatação baseada no status
  const getStatusBadge = () => {
    switch (obrigacao.status) {
      case StatusObrigacao.PENDENTE:
        return isAtrasada() 
          ? <Badge variant="destructive">Atrasada</Badge>
          : <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
      case StatusObrigacao.EM_ANDAMENTO:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Em Andamento</Badge>;
      case StatusObrigacao.ENTREGUE:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Entregue</Badge>;
      default:
        return <Badge variant="outline">Indefinido</Badge>;
    }
  };

  // Calcular porcentagem concluída
  const getProgressoCompleto = () => {
    if (obrigacao.status === StatusObrigacao.ENTREGUE) return 100;
    if (obrigacao.status === StatusObrigacao.PENDENTE) return 0;
    return obrigacao.percentualConcluido || 50;
  };

  // Obter cor do progresso
  const getProgressoColor = () => {
    if (obrigacao.status === StatusObrigacao.ENTREGUE) return 'bg-green-500';
    if (isAtrasada()) return 'bg-red-500';
    return 'bg-blue-500';
  };

  // Ícone para o status atual
  const getStatusIcon = () => {
    if (obrigacao.status === StatusObrigacao.ENTREGUE) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    if (isAtrasada()) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    
    if (obrigacao.status === StatusObrigacao.EM_ANDAMENTO) {
      return <Clock className="w-5 h-5 text-blue-500" />;
    }
    
    return <Calendar className="w-5 h-5 text-amber-500" />;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{obrigacao.nome}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {obrigacao.tipoObrigacao} • {obrigacao.periodicidade}
            </p>
          </div>
          <div className="flex space-x-2">
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Informações principais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Período de Referência</p>
              <p className="font-medium">{obrigacao.periodoReferencia}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Prazo de Entrega</p>
              <p className={`font-medium ${isAtrasada() && obrigacao.status !== StatusObrigacao.ENTREGUE ? 'text-red-600' : ''}`}>
                {formatDate(obrigacao.prazoEntrega)} 
                {obrigacao.status !== StatusObrigacao.ENTREGUE && (
                  <span className="text-sm ml-2 font-normal">
                    ({calcularDias()})
                  </span>
                )}
              </p>
            </div>
            
            {obrigacao.dataEntrega && (
              <div>
                <p className="text-sm text-gray-500">Data de Entrega</p>
                <p className="font-medium">{formatDate(obrigacao.dataEntrega)}</p>
              </div>
            )}
            
            {obrigacao.status === StatusObrigacao.EM_ANDAMENTO && (
              <div className="col-span-2 mt-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-500">Progresso</p>
                  <p className="text-sm font-medium">{getProgressoCompleto()}%</p>
                </div>
                <Progress value={getProgressoCompleto()} className={getProgressoColor()} />
              </div>
            )}
            
            {obrigacao.responsavel && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Responsável</p>
                <p className="font-medium">{obrigacao.responsavel.nome}</p>
              </div>
            )}
            
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Descrição</p>
              <p className="text-sm text-gray-700 mt-1">
                {obrigacao.descricao || 'Sem descrição disponível'}
              </p>
            </div>
          </div>

          {/* Histórico de entregas */}
          {obrigacao.historicoEntregas && obrigacao.historicoEntregas.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Histórico de Entregas
              </h4>
              <div className="space-y-2">
                {obrigacao.historicoEntregas.map((historico, index) => (
                  <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">
                        {formatDate(historico.data)}
                      </span>
                      <span className="text-xs ml-2 text-gray-500">
                        {historico.tipo}
                      </span>
                    </div>
                    <span className="text-sm">
                      {historico.usuario?.nome || 'Sistema'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {mostraAcoes && (
        <CardFooter className="flex justify-end border-t pt-4 space-x-2">
          {onVerDetalhes && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onVerDetalhes(obrigacao)}
              title="Ver detalhes completos"
            >
              <FileText className="w-4 h-4 mr-1" />
              Detalhes
            </Button>
          )}
          
          {onBaixarArquivo && obrigacao.arquivoUrl && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onBaixarArquivo(obrigacao)}
              title="Baixar arquivo de entrega"
            >
              <FileText className="w-4 h-4 mr-1" />
              Baixar
            </Button>
          )}
          
          {onEnviar && obrigacao.status !== StatusObrigacao.ENTREGUE && (
            <Button 
              variant={isAtrasada() ? "destructive" : "default"}
              size="sm"
              onClick={() => onEnviar(obrigacao)}
              title={isAtrasada() ? "Entregar com atraso" : "Entregar obrigação"}
            >
              <FileUp className="w-4 h-4 mr-1" />
              {obrigacao.status === StatusObrigacao.EM_ANDAMENTO ? 'Finalizar e Enviar' : 'Enviar'}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
} 