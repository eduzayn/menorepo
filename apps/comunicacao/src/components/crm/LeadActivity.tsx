import { useEffect, useState } from 'react';
import type { Lead, Interacao } from '@/types/comunicacao';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ChatBubbleLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface LeadActivityProps {
  lead: Lead;
}

export function LeadActivity({ lead }: LeadActivityProps) {
  const [atividades, setAtividades] = useState<Interacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarAtividades = async () => {
      try {
        const { data, error } = await supabase
          .from('interacoes')
          .select('*')
          .eq('participante_id', lead.id)
          .eq('participante_tipo', 'LEAD')
          .order('data', { ascending: false })
          .limit(5);

        if (error) throw error;
        setAtividades(data || []);
      } catch (error) {
        console.error('Erro ao carregar atividades:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarAtividades();
  }, [lead.id]);

  const getActivityIcon = (tipo: Interacao['tipo']) => {
    switch (tipo) {
      case 'MENSAGEM':
        return <ChatBubbleLeftIcon className="h-5 w-5 text-blue-500" />;
      case 'CHAMADA':
        return <PhoneIcon className="h-5 w-5 text-green-500" />;
      case 'EMAIL':
        return <EnvelopeIcon className="h-5 w-5 text-purple-500" />;
      case 'VISITA':
        return <UserGroupIcon className="h-5 w-5 text-yellow-500" />;
      case 'MATRICULA':
        return <DocumentTextIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
      <div className="space-y-4">
        {atividades.length > 0 ? (
          atividades.map((atividade) => (
            <div key={atividade.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(atividade.tipo)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{atividade.descricao}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(atividade.data), {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Nenhuma atividade recente</p>
        )}
      </div>
    </Card>
  );
} 