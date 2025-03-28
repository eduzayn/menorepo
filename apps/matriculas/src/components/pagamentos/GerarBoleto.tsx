import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';

type Matricula = {
  id: string;
  aluno_id: string;
  curso_id: string;
  plano_id: string;
  status: string;
  data_matricula: string;
  aluno_nome: string;
  curso_nome: string;
  plano_nome: string;
};

type Parcela = {
  id: string;
  matricula_id: string;
  numero: number;
  valor: number;
  vencimento: string;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
  data_pagamento?: string;
  codigo_barras?: string;
  boleto_url?: string;
  pix_qrcode?: string;
  pix_copia_cola?: string;
};

export const GerarBoleto = () => {
  const { matriculaId } = useParams<{ matriculaId: string }>();
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState<Matricula | null>(null);
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState(true);
  const [gerando, setGerando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sucessoMensagem, setSucessoMensagem] = useState<string | null>(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        // Simula busca de dados da matrícula e suas parcelas
        // Em um ambiente real, usaríamos um service para buscar esses dados
        setTimeout(() => {
          const matriculaSimulada: Matricula = {
            id: matriculaId || '1',
            aluno_id: '1',
            curso_id: '1',
            plano_id: '1',
            status: 'ativa',
            data_matricula: new Date().toISOString(),
            aluno_nome: 'João da Silva',
            curso_nome: 'Desenvolvimento Web',
            plano_nome: 'Plano Padrão',
          };
          
          const parcelasSimuladas: Parcela[] = [
            {
              id: '1',
              matricula_id: matriculaId || '1',
              numero: 1,
              valor: 199.90,
              vencimento: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
              status: 'pendente',
            },
            {
              id: '2',
              matricula_id: matriculaId || '1',
              numero: 2,
              valor: 199.90,
              vencimento: new Date(new Date().setDate(new Date().getDate() + 40)).toISOString(),
              status: 'pendente',
            },
            {
              id: '3',
              matricula_id: matriculaId || '1',
              numero: 3,
              valor: 199.90,
              vencimento: new Date(new Date().setDate(new Date().getDate() + 70)).toISOString(),
              status: 'pendente',
            },
          ];
          
          setMatricula(matriculaSimulada);
          setParcelas(parcelasSimuladas);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Não foi possível carregar os dados da matrícula e parcelas.');
        setLoading(false);
      }
    };

    fetchDados();
  }, [matriculaId]);

  const handleGerarBoleto = async (parcela: Parcela) => {
    try {
      setGerando(true);
      
      // Simulação de chamada à API de pagamentos para gerar boleto
      // Em um ambiente real, usaríamos um service para gerar o boleto via API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simula resposta da API
      const boletoGerado = {
        codigo_barras: '34191.79001 01043.510047 91020.150008 9 88230000029900',
        boleto_url: 'https://exemplo.com/boleto/123456',
        pix_qrcode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB5ElEQVR4nO2aMW4DMQxFCQwsKtcZxF7Q1z0A739RC7MxNkjKkJ+XzG9SCAQfn0jKWf3bt2yGKKI2a6t2k011vpoXgLYOO/j60lS7zjXALrq1Qe1bBFTFANQANTnrTQvz9mP3DWCJgLreHegIkFj/hwZQV++MoACuVXP+I+pW/fQY/ghQ0yJA7PBnD6iVWvsBnAEBoHZ9d2UME0AdiE5u+CYTQFoMXAJV+yMA+jMAqDMgBMCxX47GiDUHAYCqbBgA0OucL+YA9d6lXgAcQFUGgXYGqJoD5tgDU4B1BogdqJYCYKYATQGOOcAXA/UUUGsB2AOcMRDTAE0DnDHQ0wClAC0GuAPFzQNgD1ABIHaABABdCnBeA5wB4A7UTQDsAYqAa4dJAPVSwOsaEAKgXwO8AbAHSAJgCQAaoJwAIgKMAFAX5YGvgO5rQNGXgbYGLBIAHiAELNcAFoBFAoAGYA14ePzdBHABGF8C18w/ZFaJ2BsAjQBlHlA4P4BmgMjnBzAB1MQHSQYYBCjyELAGtIPAeTD6j5HWgDENGAQILMMkQIX2QUB9H7ABBA7+QcB9vQyeBOTfBX9lGTwJcMbL4DiMlsHhbQKIlsHJbdIyOLht5mXwPzZ+cKhAI63TAAAAAElFTkSuQmCC',
        pix_copia_cola: '00020101021226930014br.gov.bcb.pix2571pix.example.com/9bdbf6c8-5b76-4b85-8136-1c61fe2098b952040000530398654041000.005802BR5914EDUNEXIA LTDA6008Sao Paulo62070503***63042109',
      };
      
      // Atualiza a parcela com as informações do boleto
      const parcelasAtualizadas = parcelas.map(p => {
        if (p.id === parcela.id) {
          return {
            ...p,
            codigo_barras: boletoGerado.codigo_barras,
            boleto_url: boletoGerado.boleto_url,
            pix_qrcode: boletoGerado.pix_qrcode,
            pix_copia_cola: boletoGerado.pix_copia_cola,
          };
        }
        return p;
      });
      
      setParcelas(parcelasAtualizadas);
      setSucessoMensagem(`Boleto gerado com sucesso para a parcela ${parcela.numero}.`);
      
      // Limpa a mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setSucessoMensagem(null);
      }, 5000);
    } catch (err) {
      console.error('Erro ao gerar boleto:', err);
      setError('Não foi possível gerar o boleto. Tente novamente.');
      
      // Limpa a mensagem de erro após 5 segundos
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setGerando(false);
    }
  };

  const handleCopiarPixCopiaECola = (texto: string) => {
    navigator.clipboard.writeText(texto)
      .then(() => {
        alert('Código PIX copiado para a área de transferência!');
      })
      .catch(err => {
        console.error('Erro ao copiar texto:', err);
        alert('Não foi possível copiar o código PIX. Tente copiar manualmente.');
      });
  };

  const handleVisualizarBoleto = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-red-700 font-medium hover:underline mt-2"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!matricula) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <p className="text-red-700">Matrícula não encontrada.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-red-700 font-medium hover:underline mt-2"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Boletos e Pagamentos</h1>
          <p className="text-gray-600 mt-1">
            Matrícula: <span className="font-medium">{matricula.aluno_nome}</span> - {matricula.curso_nome}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Voltar
        </button>
      </div>

      {sucessoMensagem && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700">{sucessoMensagem}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Parcelas do Curso</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parcela
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parcelas.map((parcela) => (
                  <tr key={parcela.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcela.numero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(parcela.valor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(parcela.vencimento)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {parcela.status === 'pago' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Pago
                        </span>
                      )}
                      {parcela.status === 'pendente' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pendente
                        </span>
                      )}
                      {parcela.status === 'atrasado' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Atrasado
                        </span>
                      )}
                      {parcela.status === 'cancelado' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Cancelado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {parcela.status !== 'pago' && parcela.status !== 'cancelado' && !parcela.boleto_url && (
                        <button
                          onClick={() => handleGerarBoleto(parcela)}
                          disabled={gerando}
                          className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {gerando ? 'Gerando...' : 'Gerar Boleto'}
                        </button>
                      )}
                      
                      {parcela.boleto_url && (
                        <button
                          onClick={() => handleVisualizarBoleto(parcela.boleto_url!)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Visualizar Boleto
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {parcelas.some(p => p.pix_qrcode) && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Opções de Pagamento</h3>
            
            {parcelas.filter(p => p.pix_qrcode && p.status !== 'pago' && p.status !== 'cancelado').map((parcela) => (
              <div key={`pix-${parcela.id}`} className="mb-6 p-4 border border-gray-200 rounded-md">
                <h4 className="font-medium text-gray-800 mb-2">
                  PIX para parcela {parcela.numero} - {formatCurrency(parcela.valor)}
                </h4>
                
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                    <img 
                      src={parcela.pix_qrcode} 
                      alt="QR Code PIX" 
                      className="w-32 h-32 border border-gray-200 rounded-md"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <p className="text-sm text-gray-600 mb-2">Código PIX Copia e Cola:</p>
                    <div className="flex items-center mb-4">
                      <input
                        type="text"
                        value={parcela.pix_copia_cola}
                        readOnly
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 bg-gray-50"
                      />
                      <button
                        onClick={() => handleCopiarPixCopiaECola(parcela.pix_copia_cola!)}
                        className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Copiar
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Utilize o QR Code ou o código PIX acima para efetuar o pagamento.
                      O pagamento será processado automaticamente após a confirmação.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 