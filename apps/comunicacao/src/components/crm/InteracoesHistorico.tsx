import { useState } from 'react';
import { Interacao } from '../../types/comunicacao';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  ChatBubbleOvalLeftIcon, 
  UserIcon, 
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '../../components/ui/badge';

// Mapeamento de tipos de interação para ícones e cores
const interacaoConfig: Record<string, { icon: any, cor: string, nome: string }> = {
  'MENSAGEM': {
    icon: ChatBubbleOvalLeftIcon,
    cor: 'bg-blue-100 text-blue-800 border-blue-300',
    nome: 'Mensagem'
  },
  'CHAMADA': {
    icon: PhoneIcon,
    cor: 'bg-green-100 text-green-800 border-green-300',
    nome: 'Chamada'
  },
  'EMAIL': {
    icon: EnvelopeIcon,
    cor: 'bg-purple-100 text-purple-800 border-purple-300',
    nome: 'Email'
  },
  'VISITA': {
    icon: UserIcon,
    cor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    nome: 'Visita'
  },
  'MATRICULA': {
    icon: AcademicCapIcon,
    cor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    nome: 'Matrícula'
  }
};

interface InteracoesHistoricoProps {
  interacoes: Interacao[];
}

export function InteracoesHistorico({ interacoes }: InteracoesHistoricoProps) {
  const [filtro, setFiltro] = useState<string | null>(null);
  
  // Filtragem de interações por tipo
  const interacoesFiltradas = filtro 
    ? interacoes.filter(interacao => interacao.tipo === filtro)
    : interacoes;
    
  // Tipos de interação únicos presentes nas interações
  const tiposDisponiveis = Array.from(new Set(interacoes.map(i => i.tipo)));
  
  // Renderização de uma interação individual
  const renderizarInteracao = (interacao: Interacao) => {
    const { icon: IconComponent, cor, nome } = 
      interacaoConfig[interacao.tipo] || 
      { icon: ChatBubbleOvalLeftIcon, cor: 'bg-gray-100 text-gray-800', nome: interacao.tipo };
    
    const dataFormatada = format(
      new Date(interacao.data), 
      "dd 'de' MMMM 'de' yyyy 'às' HH:mm", 
      { locale: ptBR }
    );
    
    return (
      <div key={interacao.id} className="border-b pb-4 last:border-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div className={`p-1.5 rounded-full ${cor.split(' ')[0]} mr-2`}>
              <IconComponent className="h-4 w-4" />
            </div>
            <Badge className={cor}>
              {nome}
            </Badge>
          </div>
          <span className="text-xs text-gray-500">{dataFormatada}</span>
        </div>
        
        <div className="text-sm whitespace-pre-wrap pl-8">
          {interacao.descricao}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {interacoes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma interação registrada com este lead.
        </div>
      ) : (
        <>
          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFiltro(null)}
              className={`text-xs px-3 py-1 rounded-full ${
                filtro === null 
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            
            {tiposDisponiveis.map(tipo => {
              const config = interacaoConfig[tipo] || 
                { icon: ChatBubbleOvalLeftIcon, cor: 'bg-gray-100 text-gray-800', nome: tipo };
              
              return (
                <button
                  key={tipo}
                  onClick={() => setFiltro(tipo)}
                  className={`text-xs px-3 py-1 rounded-full flex items-center ${
                    filtro === tipo 
                      ? config.cor
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <config.icon className="h-3 w-3 mr-1" />
                  {config.nome}
                </button>
              );
            })}
          </div>
          
          {/* Lista de interações */}
          <div className="space-y-4">
            {interacoesFiltradas.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Nenhuma interação encontrada com o filtro atual.
              </div>
            ) : (
              interacoesFiltradas.map(renderizarInteracao)
            )}
          </div>
        </>
      )}
    </div>
  );
} 