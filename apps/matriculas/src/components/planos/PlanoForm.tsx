import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { planoService } from '../../services/planoService';
import { cursoService } from '../../services/cursoService';

type Curso = {
  id: string;
  nome: string;
};

type PlanoFormData = {
  nome: string;
  descricao: string;
  valor_total: number;
  num_parcelas: number;
  entrada: number;
  curso_id: string;
  ativo: boolean;
};

export const PlanoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [formData, setFormData] = useState<PlanoFormData>({
    nome: '',
    descricao: '',
    valor_total: 0,
    num_parcelas: 1,
    entrada: 0,
    curso_id: '',
    ativo: true,
  });

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await cursoService.listarCursos();
        setCursos(data);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      }
    };

    fetchCursos();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchPlano = async () => {
        setLoading(true);
        try {
          const plano = await planoService.buscarPlano(id);
          setFormData({
            nome: plano.nome,
            descricao: plano.descricao || '',
            valor_total: plano.valor_total,
            num_parcelas: plano.num_parcelas,
            entrada: plano.entrada || 0,
            curso_id: plano.curso_id,
            ativo: plano.ativo,
          });
        } catch (error) {
          console.error('Erro ao carregar plano:', error);
          alert('Não foi possível carregar os dados do plano.');
        } finally {
          setLoading(false);
        }
      };

      fetchPlano();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseFloat(value) || 0 
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      if (isEditing) {
        await planoService.atualizarPlano(id, formData);
      } else {
        await planoService.criarPlano(formData);
      }
      
      navigate('/planos');
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
      alert('Não foi possível salvar o plano. Verifique os dados e tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditing ? 'Editar Plano de Pagamento' : 'Novo Plano de Pagamento'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-md p-6">
        <div className="mb-4">
          <label htmlFor="nome" className="block text-gray-700 font-medium mb-2">
            Nome do Plano*
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            required
            value={formData.nome}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ex: Plano Semestral Padrão"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="descricao" className="block text-gray-700 font-medium mb-2">
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Detalhes do plano de pagamento"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="curso_id" className="block text-gray-700 font-medium mb-2">
              Curso*
            </label>
            <select
              id="curso_id"
              name="curso_id"
              required
              value={formData.curso_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione um curso</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="valor_total" className="block text-gray-700 font-medium mb-2">
              Valor Total (R$)*
            </label>
            <input
              type="number"
              id="valor_total"
              name="valor_total"
              required
              min="0"
              step="0.01"
              value={formData.valor_total}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="0,00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="num_parcelas" className="block text-gray-700 font-medium mb-2">
              Número de Parcelas*
            </label>
            <input
              type="number"
              id="num_parcelas"
              name="num_parcelas"
              required
              min="1"
              max="48"
              value={formData.num_parcelas}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="entrada" className="block text-gray-700 font-medium mb-2">
              Valor de Entrada (R$)
            </label>
            <input
              type="number"
              id="entrada"
              name="entrada"
              min="0"
              step="0.01"
              value={formData.entrada}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="0,00"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="ativo"
                checked={formData.ativo}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Plano Ativo</span>
            </label>
          </div>
        </div>

        {formData.num_parcelas > 1 && formData.valor_total > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Resumo do Parcelamento</h3>
            <div className="text-sm text-gray-600">
              <p>
                Valor total: <span className="font-medium">R$ {formData.valor_total.toFixed(2)}</span>
              </p>
              <p>
                {formData.entrada > 0 ? (
                  <>
                    Entrada: <span className="font-medium">R$ {formData.entrada.toFixed(2)}</span>
                    <br />
                    {formData.num_parcelas - 1} parcelas de{' '}
                    <span className="font-medium">
                      R$ {((formData.valor_total - formData.entrada) / (formData.num_parcelas - 1)).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <>
                    {formData.num_parcelas} parcelas de{' '}
                    <span className="font-medium">
                      R$ {(formData.valor_total / formData.num_parcelas).toFixed(2)}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/planos')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : isEditing ? 'Atualizar Plano' : 'Criar Plano'}
          </button>
        </div>
      </form>
    </div>
  );
}; 