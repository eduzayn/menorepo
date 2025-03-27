import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentoService } from '../../services/documentoService';

type TipoDocumento = {
  id: string;
  nome: string;
  obrigatorio: boolean;
};

// Lista de tipos de documentos aceitos
const TIPOS_DOCUMENTO: TipoDocumento[] = [
  { id: 'rg', nome: 'RG', obrigatorio: true },
  { id: 'cpf', nome: 'CPF', obrigatorio: true },
  { id: 'comp_residencia', nome: 'Comprovante de Residência', obrigatorio: true },
  { id: 'certificado', nome: 'Certificado de Conclusão', obrigatorio: true },
  { id: 'historico', nome: 'Histórico Escolar', obrigatorio: true },
  { id: 'titulo_eleitor', nome: 'Título de Eleitor', obrigatorio: false },
  { id: 'cert_nascimento', nome: 'Certidão de Nascimento', obrigatorio: false },
  { id: 'cert_casamento', nome: 'Certidão de Casamento', obrigatorio: false },
  { id: 'carteira_trabalho', nome: 'Carteira de Trabalho', obrigatorio: false },
  { id: 'outros', nome: 'Outros', obrigatorio: false },
];

export const DocumentoUpload = () => {
  const { alunoId } = useParams<{ alunoId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tipoDocumento, setTipoDocumento] = useState('');
  const [outroTipo, setOutroTipo] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [nomePersonalizado, setNomePersonalizado] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setErro('O arquivo excede o tamanho máximo de 10MB.');
        setArquivo(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setErro('Formato de arquivo não suportado. Utilize PDF, JPEG, PNG ou DOC/DOCX.');
        setArquivo(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      setArquivo(file);
      setErro(null);
      
      // Define um nome personalizado baseado no nome original do arquivo
      if (!nomePersonalizado) {
        setNomePersonalizado(file.name);
      }
    }
  };

  const getTipoDocumentoNome = () => {
    if (tipoDocumento === 'outros') {
      return outroTipo;
    }
    
    const tipo = TIPOS_DOCUMENTO.find(t => t.id === tipoDocumento);
    return tipo ? tipo.nome : '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!arquivo) {
      setErro('Selecione um arquivo para upload.');
      return;
    }
    
    if (!tipoDocumento) {
      setErro('Selecione o tipo de documento.');
      return;
    }
    
    if (tipoDocumento === 'outros' && !outroTipo.trim()) {
      setErro('Informe o tipo de documento.');
      return;
    }
    
    setEnviando(true);
    setErro(null);
    
    try {
      const formData = new FormData();
      formData.append('arquivo', arquivo);
      formData.append('aluno_id', alunoId || '');
      formData.append('tipo', getTipoDocumentoNome());
      formData.append('nome_arquivo', nomePersonalizado || arquivo.name);
      
      // Aqui estamos simulando o upload, mas o ideal seria usar o serviço real
      // que faria o upload para o storage e depois salvaria no banco
      const documentoUpload = {
        aluno_id: alunoId || '',
        tipo: getTipoDocumentoNome(),
        nome_arquivo: nomePersonalizado || arquivo.name,
        url: URL.createObjectURL(arquivo), // Simulação para teste
        status: 'pendente' as const,
        observacao: ''
      };
      
      await documentoService.criarDocumento(documentoUpload);
      
      navigate(`/documentos/${alunoId}`);
    } catch (error) {
      console.error('Erro no upload do documento:', error);
      setErro('Não foi possível fazer o upload do documento. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload de Documento</h1>
      
      <div className="bg-white shadow-md rounded-md p-6">
        {erro && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{erro}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="tipoDocumento" className="block text-gray-700 font-medium mb-2">
              Tipo de Documento*
            </label>
            <select
              id="tipoDocumento"
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecione um tipo</option>
              {TIPOS_DOCUMENTO.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome} {tipo.obrigatorio ? '(Obrigatório)' : ''}
                </option>
              ))}
            </select>
          </div>
          
          {tipoDocumento === 'outros' && (
            <div className="mb-4">
              <label htmlFor="outroTipo" className="block text-gray-700 font-medium mb-2">
                Especifique o Tipo*
              </label>
              <input
                type="text"
                id="outroTipo"
                value={outroTipo}
                onChange={(e) => setOutroTipo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ex: Carteira de Vacinação"
                required
              />
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="arquivo" className="block text-gray-700 font-medium mb-2">
              Arquivo*
            </label>
            <input
              type="file"
              id="arquivo"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Formatos aceitos: PDF, JPEG, PNG, DOC, DOCX. Tamanho máximo: 10MB.
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="nomePersonalizado" className="block text-gray-700 font-medium mb-2">
              Nome do Arquivo (opcional)
            </label>
            <input
              type="text"
              id="nomePersonalizado"
              value={nomePersonalizado}
              onChange={(e) => setNomePersonalizado(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ex: CPF_JoaoSilva"
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/documentos/${alunoId}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={enviando}
            >
              {enviando ? 'Enviando...' : 'Enviar Documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 