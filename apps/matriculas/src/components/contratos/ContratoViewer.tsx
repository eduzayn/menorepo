import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contratoService } from '../../services/contratoService';
import { formatDate } from '../../utils/formatters';
import SignatureCanvas from 'react-signature-canvas';

type Contrato = {
  id: string;
  aluno_id: string;
  matricula_id: string;
  html_content: string;
  assinado: boolean;
  data_assinatura?: string;
  assinatura_url?: string;
  assinatura_aluno?: string;
  assinatura_instituicao?: string;
  created_at: string;
  updated_at: string;
};

export const ContratoViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const signatureRef = useRef<SignatureCanvas>(null);
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assinando, setAssinando] = useState(false);
  const [assinaturaFinalizada, setAssinaturaFinalizada] = useState(false);
  const [enviandoAssinatura, setEnviandoAssinatura] = useState(false);
  const [concordaTermos, setConcordaTermos] = useState(false);

  useEffect(() => {
    const fetchContrato = async () => {
      try {
        const data = await contratoService.buscarContrato(id!);
        setContrato(data);
        
        // Se já estiver assinado, marca como finalizado
        if (data.assinado) {
          setAssinaturaFinalizada(true);
        }
      } catch (error) {
        console.error('Erro ao carregar contrato:', error);
        setError('Não foi possível carregar o contrato.');
      } finally {
        setLoading(false);
      }
    };

    fetchContrato();
  }, [id]);

  const handleStartSignature = () => {
    setAssinando(true);
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleFinishSignature = async () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      alert('Por favor, assine o contrato antes de finalizar.');
      return;
    }
    
    if (!concordaTermos) {
      alert('Você precisa concordar com os termos do contrato para continuar.');
      return;
    }
    
    setEnviandoAssinatura(true);
    
    try {
      // Captura a imagem da assinatura como data URL
      const assinaturaDataURL = signatureRef.current.toDataURL('image/png');
      
      // Criar objeto com dados da assinatura
      const assinaturaData = {
        assinado: true,
        data_assinatura: new Date().toISOString(),
        assinatura_url: assinaturaDataURL,
        assinatura_aluno: assinaturaDataURL
      };
      
      // Atualizar o contrato com a assinatura
      await contratoService.assinarContrato(id!, assinaturaData);
      
      // Atualizar estado local
      setContrato((prevContrato) => 
        prevContrato ? { ...prevContrato, ...assinaturaData } : null
      );
      
      setAssinaturaFinalizada(true);
      setAssinando(false);
    } catch (error) {
      console.error('Erro ao assinar contrato:', error);
      alert('Não foi possível registrar a assinatura. Tente novamente.');
    } finally {
      setEnviandoAssinatura(false);
    }
  };

  const handleCancelSignature = () => {
    setAssinando(false);
    setConcordaTermos(false);
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const renderContratoHTML = () => {
    if (!contrato || !contrato.html_content) return null;
    
    return (
      <div 
        className="contrato-content border border-gray-300 rounded-md p-6 bg-white text-gray-800 prose max-w-none"
        dangerouslySetInnerHTML={{ __html: contrato.html_content }}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !contrato) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error || 'Contrato não encontrado.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-red-700 font-medium hover:underline"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contrato de Matrícula</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Voltar
          </button>
          {!contrato.assinado && !assinando && !assinaturaFinalizada && (
            <button
              onClick={handleStartSignature}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Assinar Contrato
            </button>
          )}
          {contrato.assinado && (
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Imprimir
            </button>
          )}
        </div>
      </div>

      {contrato.assinado && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
          <p className="text-green-700">
            Este contrato foi assinado em {formatDate(contrato.data_assinatura || '')}.
          </p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-md overflow-hidden mb-8">
        {renderContratoHTML()}
      </div>

      {contrato.assinado && contrato.assinatura_url && (
        <div className="bg-white shadow-md rounded-md p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Assinatura</h3>
          <div className="border border-gray-300 rounded-md p-4">
            <img 
              src={contrato.assinatura_url} 
              alt="Assinatura do Aluno" 
              className="max-h-32"
            />
          </div>
        </div>
      )}

      {assinando && !assinaturaFinalizada && (
        <div className="bg-white shadow-md rounded-md p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Assinatura Digital</h3>
          
          <div className="border border-gray-300 rounded-md mb-4">
            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
              canvasProps={{
                className: 'w-full h-64 cursor-crosshair',
              }}
            />
          </div>
          
          <div className="flex justify-between mb-6">
            <button
              type="button"
              onClick={handleClearSignature}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Limpar
            </button>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={concordaTermos}
                onChange={(e) => setConcordaTermos(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">
                Li e concordo com todos os termos do contrato acima.
              </span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancelSignature}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={enviandoAssinatura}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleFinishSignature}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={enviandoAssinatura || !concordaTermos}
            >
              {enviandoAssinatura ? 'Finalizando...' : 'Finalizar Assinatura'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 