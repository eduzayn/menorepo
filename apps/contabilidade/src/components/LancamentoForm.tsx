import React, { useState, useEffect } from 'react';
import { 
  Form, 
  FormField, 
  Input, 
  Select, 
  DatePicker, 
  Textarea, 
  Button, 
  Spinner 
} from '@edunexia/ui-components';
import { LancamentoContabil, TipoLancamento, ContaContabil } from '../types/contabilidade';
import { useContabilidade } from '../hooks/useContabilidade';

export interface LancamentoFormProps {
  lançamento?: Partial<LancamentoContabil>;
  modo: 'criar' | 'editar' | 'visualizar';
  onSubmit: (dados: Partial<LancamentoContabil>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * Componente de formulário para criação e edição de lançamentos contábeis
 */
export function LancamentoForm({
  lançamento,
  modo,
  onSubmit,
  onCancel,
  isSubmitting = false
}: LancamentoFormProps) {
  // Estado interno do formulário
  const [formData, setFormData] = useState<Partial<LancamentoContabil>>(
    lançamento || {
      data: new Date().toISOString().split('T')[0],
      dataCompetencia: new Date().toISOString().split('T')[0],
      tipoLancamento: TipoLancamento.DEBITO,
      valor: 0,
    }
  );

  // Obter plano de contas para selecionar as contas
  const { usePlanoContas } = useContabilidade();
  const { data: contas = [] } = usePlanoContas();

  // Atualizar formulário quando dados externos mudarem
  useEffect(() => {
    if (lançamento) {
      setFormData(lançamento);
    }
  }, [lançamento]);

  // Filtrar apenas contas analíticas
  const contasAnaliticas = contas.filter(conta => conta.analitica);

  // Manipular mudanças no formulário
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Enviar formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Formatar código da conta + nome
  const formatarContaOption = (conta: ContaContabil) => {
    return `${conta.codigo} - ${conta.nome}`;
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Data do Lançamento" required>
          <DatePicker
            value={formData.data}
            onChange={(date) => handleChange('data', date)}
            disabled={modo === 'visualizar'}
          />
        </FormField>

        <FormField label="Data de Competência" required>
          <DatePicker
            value={formData.dataCompetencia}
            onChange={(date) => handleChange('dataCompetencia', date)}
            disabled={modo === 'visualizar'}
          />
        </FormField>

        <FormField label="Tipo de Lançamento" required>
          <Select
            value={formData.tipoLancamento}
            onChange={(value) => handleChange('tipoLancamento', value)}
            disabled={modo === 'visualizar'}
          >
            <option value={TipoLancamento.DEBITO}>Débito</option>
            <option value={TipoLancamento.CREDITO}>Crédito</option>
          </Select>
        </FormField>

        <FormField label="Valor" required>
          <Input
            type="number"
            step="0.01"
            value={formData.valor}
            onChange={(e) => handleChange('valor', parseFloat(e.target.value))}
            disabled={modo === 'visualizar'}
            placeholder="0,00"
          />
        </FormField>

        <FormField label="Conta Débito" required>
          <Select
            value={formData.contaDebito}
            onChange={(value) => handleChange('contaDebito', value)}
            disabled={modo === 'visualizar'}
          >
            <option value="">Selecione uma conta</option>
            {contasAnaliticas.map(conta => (
              <option key={`debito-${conta.id}`} value={conta.id}>
                {formatarContaOption(conta)}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Conta Crédito" required>
          <Select
            value={formData.contaCredito}
            onChange={(value) => handleChange('contaCredito', value)}
            disabled={modo === 'visualizar'}
          >
            <option value="">Selecione uma conta</option>
            {contasAnaliticas.map(conta => (
              <option key={`credito-${conta.id}`} value={conta.id}>
                {formatarContaOption(conta)}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Centro de Custo">
          <Select
            value={Array.isArray(formData.centrosCusto) ? formData.centrosCusto[0] : ''}
            onChange={(value) => handleChange('centrosCusto', [value])}
            disabled={modo === 'visualizar'}
          >
            <option value="">Selecione um centro de custo</option>
            <option value="ADM-001">ADM-001 - Administrativo</option>
            <option value="FIN-002">FIN-002 - Financeiro</option>
            <option value="CONT-002">CONT-002 - Contabilidade</option>
            <option value="RH-001">RH-001 - Recursos Humanos</option>
          </Select>
        </FormField>

        <FormField label="Documento Fiscal">
          <Input
            value={formData.documentoFiscal || ''}
            onChange={(e) => handleChange('documentoFiscal', e.target.value)}
            disabled={modo === 'visualizar'}
            placeholder="Número do documento"
          />
        </FormField>
      </div>

      <FormField label="Descrição" required className="mt-4">
        <Textarea
          value={formData.descricao || ''}
          onChange={(e) => handleChange('descricao', e.target.value)}
          disabled={modo === 'visualizar'}
          placeholder="Descreva o lançamento contábil"
          rows={3}
        />
      </FormField>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {modo === 'visualizar' ? 'Fechar' : 'Cancelar'}
        </Button>

        {modo !== 'visualizar' && (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner size="sm" className="mr-2" />}
            {modo === 'criar' ? 'Criar Lançamento' : 'Salvar Alterações'}
          </Button>
        )}
      </div>
    </Form>
  );
} 