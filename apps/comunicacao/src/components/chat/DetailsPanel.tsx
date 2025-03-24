import { useState } from 'react';
import { Lead, Aluno } from '../../types/comunicacao';
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface DetailsPanelProps {
  lead?: Lead;
  aluno?: Aluno;
  historicoInteracoes: any[];
  onAcaoRapida: (acao: string) => void;
}

export function DetailsPanel({
  lead,
  aluno,
  historicoInteracoes,
  onAcaoRapida,
}: DetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'historico'>('info');

  const dados = lead || aluno;

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">
          {lead ? 'Detalhes do Lead' : 'Detalhes do Aluno'}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAcaoRapida('matricular')}
            className="px-3 py-1 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md"
          >
            {lead ? 'Matricular' : 'Ver Matrícula'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'info'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Informações
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'historico'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Histórico
        </button>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'info' ? (
          <div className="space-y-4">
            {/* Informações Básicas */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Informações Básicas</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-900">{dados?.nome}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-900">{dados?.telefone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-900">{dados?.email}</span>
                </div>
              </div>
            </div>

            {/* Status e Métricas */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Status e Métricas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-900">Última Interação</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(dados?.ultima_interacao || '').toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-900">Engajamento</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {dados?.engajamento || '0'}%
                  </p>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Ações Rápidas</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAcaoRapida('enviar_mensagem')}
                  className="px-3 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary-light"
                >
                  Enviar Mensagem
                </button>
                <button
                  onClick={() => onAcaoRapida('agendar_contato')}
                  className="px-3 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary-light"
                >
                  Agendar Contato
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {historicoInteracoes.map((interacao, index) => (
              <div key={index} className="border-l-2 border-primary pl-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {interacao.tipo}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(interacao.data).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{interacao.descricao}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 