import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';

// Simulação de tipos para o formulário
interface NovaCobrancaForm {
  aluno_id: string;
  aluno_nome: string;
  valor: number;
  descricao: string;
  vencimento: string;
  curso_id?: string;
  curso_nome?: string;
  metodo_pagamento: string;
  parcelamento: number;
}

// Opções simuladas para selects
const alunosOptions = [
  { id: 'aluno-001', nome: 'Ana Silva' },
  { id: 'aluno-002', nome: 'Carlos Oliveira' },
  { id: 'aluno-003', nome: 'Mariana Costa' },
  { id: 'aluno-004', nome: 'Pedro Santos' },
  { id: 'aluno-005', nome: 'Juliana Mendes' }
];

const cursosOptions = [
  { id: 'curso-001', nome: 'Gestão Empresarial' },
  { id: 'curso-002', nome: 'Marketing Digital' },
  { id: 'curso-003', nome: 'Excel Avançado' },
  { id: 'curso-004', nome: 'Python para Análise de Dados' },
  { id: 'curso-005', nome: 'Design Gráfico' }
];

const metodosOptions = [
  { id: 'pix', nome: 'PIX' },
  { id: 'boleto', nome: 'Boleto Bancário' },
  { id: 'cartao', nome: 'Cartão de Crédito' },
  { id: 'transferencia', nome: 'Transferência Bancária' }
];

export default function NovaCobrancaPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<NovaCobrancaForm>({
    aluno_id: '',
    aluno_nome: '',
    valor: 0,
    descricao: '',
    vencimento: '',
    metodo_pagamento: 'boleto',
    parcelamento: 1
  });
  
  // Manipula mudanças nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'aluno_id') {
      const aluno = alunosOptions.find(a => a.id === value);
      setForm({
        ...form,
        aluno_id: value,
        aluno_nome: aluno?.nome || ''
      });
    } else if (name === 'curso_id') {
      const curso = cursosOptions.find(c => c.id === value);
      setForm({
        ...form,
        curso_id: value,
        curso_nome: curso?.nome || ''
      });
    } else {
      setForm({
        ...form,
        [name]: value
      });
    }
  };
  
  // Lida com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui seria feita a integração com o backend
    console.log('Dados da nova cobrança:', form);
    
    // Simula sucesso e redireciona para a lista de cobranças
    alert('Cobrança criada com sucesso!');
    navigate('/cobrancas');
  };
  
  // Cancela a criação e volta para a lista
  const handleCancel = () => {
    if (window.confirm('Tem certeza que deseja cancelar? Os dados não serão salvos.')) {
      navigate('/cobrancas');
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/cobrancas')}
          className="text-blue-600 flex items-center gap-1 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Cobranças
        </button>
        
        <h1 className="text-2xl font-bold mt-2">Nova Cobrança</h1>
        <p className="text-gray-500">
          Crie uma nova cobrança para um aluno
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seção Aluno */}
            <div className="space-y-4 md:col-span-2">
              <h2 className="text-lg font-semibold border-b pb-2">Dados do Aluno</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Aluno</label>
                <select
                  name="aluno_id"
                  value={form.aluno_id}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Selecione um aluno</option>
                  {alunosOptions.map(aluno => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Curso (opcional)</label>
                <select
                  name="curso_id"
                  value={form.curso_id || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Selecione um curso (opcional)</option>
                  {cursosOptions.map(curso => (
                    <option key={curso.id} value={curso.id}>
                      {curso.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Seção Pagamento */}
            <div className="space-y-4 md:col-span-2">
              <h2 className="text-lg font-semibold border-b pb-2">Dados de Pagamento</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="valor"
                    value={form.valor}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    name="vencimento"
                    value={form.vencimento}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Descreva o motivo desta cobrança..."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Método de Pagamento</label>
                  <select
                    name="metodo_pagamento"
                    value={form.metodo_pagamento}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    {metodosOptions.map(metodo => (
                      <option key={metodo.id} value={metodo.id}>
                        {metodo.nome}
                      </option>
                    ))}
                  </select>
                </div>
                
                {form.metodo_pagamento === 'cartao' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Parcelamento</label>
                    <select
                      name="parcelamento"
                      value={form.parcelamento}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(parcela => (
                        <option key={parcela} value={parcela}>
                          {parcela}x {parcela === 1 ? 'à vista' : `de R$ ${(form.valor / parcela).toFixed(2)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className="flex justify-end gap-2 mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Gerar Cobrança
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 