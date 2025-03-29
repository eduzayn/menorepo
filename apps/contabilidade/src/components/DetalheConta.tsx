import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter,
  Button,
  Badge
} from '@edunexia/ui-components';
import { ContaContabil, TipoConta } from '../types/contabilidade';
import { formatCurrency, formatDate } from '../utils/formatters';
import { FileText, Edit, Eye, Trash, Activity } from 'lucide-react';

export interface DetalheContaProps {
  conta: ContaContabil;
  mostraSaldo?: boolean;
  mostraHistorico?: boolean;
  mostraAcoes?: boolean;
  onVerHistorico?: (conta: ContaContabil) => void;
  onEditar?: (conta: ContaContabil) => void;
  onExcluir?: (conta: ContaContabil) => void;
  onVerLancamentos?: (conta: ContaContabil) => void;
  className?: string;
}

/**
 * Componente para exibir detalhes de uma conta contábil
 */
export function DetalheConta({
  conta,
  mostraSaldo = true,
  mostraHistorico = false,
  mostraAcoes = true,
  onVerHistorico,
  onEditar,
  onExcluir,
  onVerLancamentos,
  className = ''
}: DetalheContaProps) {
  // Gerar cor com base no tipo de conta
  const getTipoContaBadge = () => {
    switch (conta.tipo) {
      case TipoConta.ATIVO:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Ativo</Badge>;
      case TipoConta.PASSIVO:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Passivo</Badge>;
      case TipoConta.RECEITA:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Receita</Badge>;
      case TipoConta.DESPESA:
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Despesa</Badge>;
      case TipoConta.PATRIMONIO:
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Patrimônio</Badge>;
      default:
        return <Badge variant="outline">Outro</Badge>;
    }
  };

  // Formatar código da conta
  const formatarCodigoConta = (codigo: string) => {
    // Adiciona pontos a cada nível do plano de contas (ex: 1.2.01.001)
    return codigo.replace(/^(\d)(\d)(\d{2})(\d{3})$/, '$1.$2.$3.$4');
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 font-medium">
              {formatarCodigoConta(conta.codigo)}
            </p>
            <CardTitle className="text-xl mt-1">{conta.nome}</CardTitle>
          </div>
          <div>{getTipoContaBadge()}</div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Informações principais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Classificação</p>
              <p className="font-medium">{conta.analitica ? 'Analítica' : 'Sintética'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">
                {conta.ativa ? (
                  <span className="text-green-600">Ativa</span>
                ) : (
                  <span className="text-red-600">Inativa</span>
                )}
              </p>
            </div>
            {conta.contaPai && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Conta Superior</p>
                <p className="font-medium">{conta.contaPai.nome} ({formatarCodigoConta(conta.contaPai.codigo)})</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Descrição</p>
              <p className="font-medium">{conta.descricao || 'Sem descrição'}</p>
            </div>
          </div>

          {/* Saldo (se aplicável) */}
          {mostraSaldo && conta.analitica && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Saldo Atual</p>
                  <p className={`text-xl font-semibold ${Number(conta.saldoAtual) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(conta.saldoAtual)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Natureza do Saldo</p>
                  <p className="font-medium">
                    {conta.naturezaSaldo === 'D' ? 'Devedor' : 'Credor'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Histórico (se habilitado) */}
          {mostraHistorico && conta.historicoSaldos && conta.historicoSaldos.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold mb-2">Histórico de Saldos</h4>
              <div className="space-y-2">
                {conta.historicoSaldos.slice(0, 3).map((historico, index) => (
                  <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-sm">{formatDate(historico.data)}</span>
                    <span className={`font-medium ${Number(historico.valor) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(historico.valor)}
                    </span>
                  </div>
                ))}
                {conta.historicoSaldos.length > 3 && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => onVerHistorico && onVerHistorico(conta)}
                    className="px-0"
                  >
                    Ver histórico completo
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {mostraAcoes && (
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex space-x-2">
            {onVerLancamentos && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onVerLancamentos(conta)}
                title="Ver lançamentos"
              >
                <Activity className="w-4 h-4 mr-1" />
                Lançamentos
              </Button>
            )}
            {onVerHistorico && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onVerHistorico(conta)}
                title="Ver histórico"
              >
                <FileText className="w-4 h-4 mr-1" />
                Histórico
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            {onEditar && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEditar(conta)}
                title="Editar conta"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onExcluir && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-700 hover:border-red-700"
                onClick={() => onExcluir(conta)}
                title="Excluir conta"
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 