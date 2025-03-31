// import { useDrop } from 'react-dnd';
import type { Lead } from '@/types/comunicacao';
import { LeadCard } from './LeadCard';

interface KanbanColumnProps {
  title: string;
  status: Lead['status'];
  leads: Lead[];
  onLeadDrop: (leadId: string, newStatus: Lead['status']) => void;
  onLeadEdit?: (lead: Lead) => void;
  onLeadView?: (lead: Lead) => void;
}

export function KanbanColumn({
  title,
  status,
  leads,
  onLeadDrop,
  onLeadEdit,
  onLeadView
}: KanbanColumnProps) {
  // Versão temporária sem drag-and-drop
  // const [{ isOver }, drop] = useDrop(() => ({
  //   accept: 'lead',
  //   drop: (item: { id: string }) => {
  //     onLeadDrop(item.id, status);
  //   },
  //   collect: (monitor) => ({
  //     isOver: monitor.isOver(),
  //   }),
  // }));

  return (
    <div
      // ref={drop}
      className={`
        flex-shrink-0 w-80 bg-neutral-50 rounded-lg p-4
      `}
    >
      {/* Cabeçalho da Coluna */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-primary bg-primary-lightest rounded-full">
          {leads.length}
        </span>
      </div>

      {/* Lista de Cards */}
      <div className="space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className="transform transition-transform hover:scale-[1.02]">
            <LeadCard
              lead={lead}
              onEdit={onLeadEdit}
              onView={onLeadView}
            />
          </div>
        ))}

        {leads.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-neutral-500">
              Nenhum lead neste status
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 