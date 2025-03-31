import React, { useState } from 'react';
import { Button, Input, Label, Textarea } from '@edunexia/ui-components';
import { Interacao } from '../../types/comunicacao';
import { toast } from 'sonner';

interface NovaInteracaoFormProps {
  onSubmit: (interacao: Omit<Interacao, 'id' | 'participante_id' | 'participante_tipo' | 'criado_at'>) => void;
}

export function NovaInteracaoForm({ onSubmit }: NovaInteracaoFormProps) {
  const [tipo, setTipo] = useState<'MENSAGEM' | 'CHAMADA' | 'EMAIL' | 'VISITA' | 'MATRICULA'>('MENSAGEM');
  const [descricao, setDescricao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!descricao.trim()) {
      toast.error('Por favor, preencha a descrição da interação');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await onSubmit({
        tipo,
        descricao,
        data: new Date().toISOString(),
        usuario_id: 'sistema' // Idealmente seria o ID do usuário logado
      });
      
      // Limpar formulário
      setDescricao('');
      toast.success('Interação registrada com sucesso');
    } catch (error) {
      console.error('Erro ao registrar interação:', error);
      toast.error('Erro ao registrar interação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo de Interação</Label>
        <div className="flex flex-wrap gap-2">
          <TipoButton 
            tipo="MENSAGEM" 
            label="Mensagem" 
            selecionado={tipo === 'MENSAGEM'} 
            onClick={() => setTipo('MENSAGEM')} 
          />
          <TipoButton 
            tipo="CHAMADA" 
            label="Chamada" 
            selecionado={tipo === 'CHAMADA'} 
            onClick={() => setTipo('CHAMADA')} 
          />
          <TipoButton 
            tipo="EMAIL" 
            label="Email" 
            selecionado={tipo === 'EMAIL'} 
            onClick={() => setTipo('EMAIL')} 
          />
          <TipoButton 
            tipo="VISITA" 
            label="Visita" 
            selecionado={tipo === 'VISITA'} 
            onClick={() => setTipo('VISITA')} 
          />
          <TipoButton 
            tipo="MATRICULA" 
            label="Matrícula" 
            selecionado={tipo === 'MATRICULA'} 
            onClick={() => setTipo('MATRICULA')} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva os detalhes da interação..."
          rows={4}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registrando...' : 'Registrar Interação'}
      </Button>
    </form>
  );
}

interface TipoButtonProps {
  tipo: 'MENSAGEM' | 'CHAMADA' | 'EMAIL' | 'VISITA' | 'MATRICULA';
  label: string;
  selecionado: boolean;
  onClick: () => void;
}

function TipoButton({ tipo, label, selecionado, onClick }: TipoButtonProps) {
  // Mapeamento das cores por tipo
  const coresMap: Record<string, string> = {
    'MENSAGEM': 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200',
    'CHAMADA': 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
    'EMAIL': 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200',
    'VISITA': 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200',
    'MATRICULA': 'bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-200'
  };
  
  const classeBase = 'px-3 py-1.5 rounded-md text-sm border transition-colors';
  const classeSelecionada = coresMap[tipo];
  const classeNaoSelecionada = 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${classeBase} ${selecionado ? classeSelecionada : classeNaoSelecionada}`}
    >
      {label}
    </button>
  );
} 