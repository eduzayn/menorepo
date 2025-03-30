import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@edunexia/ui-components';
import { documentoService } from '../../services/documentoService';

// Tipos de documento aceitos no sistema
const TIPOS_DOCUMENTO = [
  { id: 'rg', label: 'RG' },
  { id: 'cpf', label: 'CPF' },
  { id: 'comprovante_residencia', label: 'Comprovante de Residência' },
  { id: 'historico_escolar', label: 'Histórico Escolar' },
  { id: 'diploma', label: 'Diploma' },
  { id: 'declaracao_matricula', label: 'Declaração de Matrícula' },
  { id: 'foto', label: 'Foto 3x4' },
  { id: 'outros', label: 'Outros' }
];

// Tipos de arquivo aceitos para upload
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const DocumentoUpload = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [tipo, setTipo] = useState<string>('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [outroTipo, setOutroTipo] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!id) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">ID da matrícula não fornecido</p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      setArquivo(null);
      return;
    }
    
    // Validar tipo de arquivo
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError(`Tipo de arquivo não permitido. Utilize: ${ALLOWED_TYPES.map(t => t.split('/')[1]).join(', ')}`);
      setArquivo(null);
      return;
    }
    
    // Validar tamanho do arquivo
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`Arquivo muito grande. O tamanho máximo permitido é ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      setArquivo(null);
      return;
    }
    
    setArquivo(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!arquivo) {
      setError('Selecione um arquivo para enviar');
      return;
    }
    
    if (!tipo) {
      setError('Selecione o tipo de documento');
      return;
    }

    const tipoFinal = tipo === 'outros' ? outroTipo : 
      TIPOS_DOCUMENTO.find(t => t.id === tipo)?.label || '';
    
    if (tipo === 'outros' && !outroTipo) {
      setError('Especifique o tipo de documento');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Criar path único para o arquivo
      const fileExtension = arquivo.name.split('.').pop();
      const timestamp = new Date().getTime();
      const path = `matricula/${id}/${tipoFinal.replace(/\s+/g, '_').toLowerCase()}_${timestamp}.${fileExtension}`;
      
      // Upload do arquivo para o storage
      const publicUrl = await documentoService.uploadDocumento(arquivo, path);
      
      // Criar registro do documento no banco
      await documentoService.criarDocumento({
        matricula_id: id,
        tipo: tipoFinal,
        nome_arquivo: arquivo.name,
        url: publicUrl,
        descricao: descricao,
        status: 'pendente'
      });
      
      setSuccess('Documento enviado com sucesso!');
      
      // Limpar formulário
      setTipo('');
      setOutroTipo('');
      setDescricao('');
      setArquivo(null);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate(`/matriculas/${id}/documentos`);
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao enviar documento:', error);
      setError('Não foi possível enviar o documento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-6">Upload de Documento</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Documento*
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
            disabled={loading}
            required
          >
            <option value="">Selecione um tipo</option>
            {TIPOS_DOCUMENTO.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>
        
        {tipo === 'outros' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especifique o tipo*
            </label>
            <input
              type="text"
              value={outroTipo}
              onChange={(e) => setOutroTipo(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              disabled={loading}
              required
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição (opcional)
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
            rows={3}
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Arquivo*
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md p-2"
            disabled={loading}
            accept={ALLOWED_TYPES.join(',')}
          />
          <p className="text-xs text-gray-500 mt-1">
            Formatos permitidos: PDF, JPG, PNG. Tamanho máximo: 5MB
          </p>
        </div>
        
        {arquivo && (
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm">
              <span className="font-medium">Arquivo selecionado:</span> {arquivo.name}
            </p>
            <p className="text-xs text-gray-500">
              Tamanho: {(arquivo.size / (1024 * 1024)).toFixed(2)}MB
            </p>
          </div>
        )}
        
        <div className="flex justify-end gap-4 pt-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/matriculas/${id}/documentos`)}
            disabled={loading}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            disabled={loading || !arquivo || !tipo || (tipo === 'outros' && !outroTipo)}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              'Enviar Documento'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}; 