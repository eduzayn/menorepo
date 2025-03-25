import { useState, useRef } from 'react';
import { PaperClipIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { uploadArquivo } from '../../services/comunicacao';
import { Input, Button, IconButton } from '../ui';

interface ChatInputProps {
  onEnviar: (conteudo: string, tipo: 'TEXTO' | 'IMAGEM' | 'ARQUIVO') => void;
}

export function ChatInput({ onEnviar }: ChatInputProps) {
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) return;

    try {
      setLoading(true);
      await onEnviar(mensagem, 'TEXTO');
      setMensagem('');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await uploadArquivo(file, 'temp');
      await onEnviar(url, file.type.startsWith('image/') ? 'IMAGEM' : 'ARQUIVO');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="flex-1">
        <Input
          type="text"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={loading}
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
          disabled={loading}
        />
        <IconButton
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          icon={<PhotoIcon className="w-5 h-5" />}
        />
        <IconButton
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          icon={<PaperClipIcon className="w-5 h-5" />}
        />
        <Button
          type="submit"
          disabled={loading || !mensagem.trim()}
          loading={loading}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
    </form>
  );
} 