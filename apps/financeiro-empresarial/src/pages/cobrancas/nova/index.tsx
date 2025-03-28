import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../../hooks/useAuth';
import type { 
  TipoCobranca, 
  MetodoPagamento 
} from '../../../types/financeiro';

const tiposCobranca: {value: TipoCobranca; label: string}[] = [
  { value: 'mensalidade', label: 'Mensalidade' },
  { value: 'taxa', label: 'Taxa Administrativa' },
  { value: 'material', label: 'Material Didático' },
  { value: 'uniforme', label: 'Uniforme' },
  { value: 'outro', label: 'Outro' }
];

const metodoPagamento: {value: MetodoPagamento; label: string}[] = [
  { value: 'pix', label: 'PIX' },
  { value: 'boleto', label: 'Boleto Bancário' },
  { value: 'cartao', label: 'Cartão' },
  { value: 'transferencia', label: 'Transferência' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: null, label: 'A definir pelo aluno' }
];

interface FormDados {
  aluno_id: string;
  aluno_nome: string;
  valor: number;
  data_vencimento: string;
  tipo: TipoCobranca;
  forma_pagamento: MetodoPagamento;
  observacoes: string;
}

// Lista simulada de alunos para seleção
const ALUNOS_SIMULADOS = [
  { id: 'a1', nome: 'João Pedro Silva' },
  { id: 'a2', nome: 'Maria Eduarda Santos' },
  { id: 'a3', nome: 'Carlos Henrique Oliveira' },
  { id: 'a4', nome: 'Ana Beatriz Costa' },
  { id: 'a5', nome: 'Lucas Gabriel Martins' }
];

export const NovaCobrancaPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formDados, setFormDados] = useState<FormDados>({
    aluno_id: '',
    aluno_nome: '',
    valor: 0,
    data_vencimento: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 30 dias a partir de hoje
    tipo: 'mensalidade',
    forma_pagamento: 'pix',
    observacoes: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormDados, string>>>({});
  const [buscarAluno, setBuscarAluno] = useState('');
  const [alunosFiltrados, setAlunosFiltrados] = useState<typeof ALUNOS_SIMULADOS>([]);
  const [showAlunoDropdown, setShowAlunoDropdown] = useState(false);

  // Manipulação de erros
  const validarForm = (): boolean => {
    const errors: Partial<Record<keyof FormDados, string>> = {};
    
    if (!formDados.aluno_id) {
      errors.aluno_id = 'Selecione um aluno';
    }
    
    if (formDados.valor <= 0) {
      errors.valor = 'Informe um valor válido';
    }
    
    if (!formDados.data_vencimento) {
      errors.data_vencimento = 'Informe uma data de vencimento';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormDados(prev => ({
      ...prev,
      [name]: name === 'valor' ? parseFloat(value) || 0 : value
    }));
    
    // Limpa o erro quando o campo é preenchido
    if (formErrors[name as keyof FormDados]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSelectAluno = (aluno: typeof ALUNOS_SIMULADOS[0]) => {
    setFormDados(prev => ({
      ...prev,
      aluno_id: aluno.id,
      aluno_nome: aluno.nome
    }));
    setBuscarAluno(aluno.nome);
    setShowAlunoDropdown(false);
    
    // Limpa o erro quando o campo é preenchido
    if (formErrors.aluno_id) {
      setFormErrors(prev => ({
        ...prev,
        aluno_id: undefined
      }));
    }
  };

  const handleBuscarAlunoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBuscarAluno(value);
    
    if (value.length > 2) {
      const filtered = ALUNOS_SIMULADOS.filter(aluno => 
        aluno.nome.toLowerCase().includes(value.toLowerCase())
      );
      setAlunosFiltrados(filtered);
      setShowAlunoDropdown(true);
    } else {
      setAlunosFiltrados([]);
      setShowAlunoDropdown(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulação de envio para API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Cobrança criada:', {
        ...formDados,
        instituicao_id: user?.instituicao_id
      });
      
      // Redireciona de volta para a lista
      navigate('/receber');
    } catch (error) {
      console.error('Erro ao criar cobrança:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/receber')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Nova Cobrança</h1>
          <p className="text-gray-600">Crie uma cobrança para um aluno</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seção do Aluno */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Aluno</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar Aluno
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={buscarAluno}
                    onChange={handleBuscarAlunoChange}
                    className={`w-full p-2 border rounded-lg ${formErrors.aluno_id ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Digite o nome do aluno"
                  />
                  {showAlunoDropdown && alunosFiltrados.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                      {alunosFiltrados.map(aluno => (
                        <div 
                          key={aluno.id}
                          onClick={() => handleSelectAluno(aluno)}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {aluno.nome}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formErrors.aluno_id && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.aluno_id}</p>
                )}
              </div>
              
              {formDados.aluno_id && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">{formDados.aluno_nome}</p>
                  <p className="text-sm text-gray-500">ID: {formDados.aluno_id}</p>
                </div>
              )}
            </div>
            
            {/* Seção de Detalhes */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Detalhes da Cobrança</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  name="valor"
                  value={formDados.valor}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full p-2 border rounded-lg ${formErrors.valor ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.valor && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.valor}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  name="data_vencimento"
                  value={formDados.data_vencimento}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg ${formErrors.data_vencimento ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.data_vencimento && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.data_vencimento}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  name="tipo"
                  value={formDados.tipo}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {tiposCobranca.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pagamento
                </label>
                <select
                  name="forma_pagamento"
                  value={formDados.forma_pagamento || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {metodoPagamento.map(metodo => (
                    <option key={metodo.label} value={metodo.value || ''}>
                      {metodo.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Seção de Observações */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={formDados.observacoes}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Informações adicionais sobre a cobrança"
            />
          </div>
          
          {/* Botão de Envio */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/receber')}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Processando...
                </>
              ) : (
                <>
                  <Check size={18} className="mr-2" />
                  Criar Cobrança
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 