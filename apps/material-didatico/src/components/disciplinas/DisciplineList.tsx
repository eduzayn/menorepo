import { DisciplineCard } from './DisciplineCard'
import type { Discipline } from '@/services/disciplines'
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  type DroppableProvided,
  type DraggableProvided,
  type DraggableStateSnapshot
} from '@hello-pangea/dnd'

interface DisciplineListProps {
  disciplines: Discipline[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onReorder: (orderedIds: string[]) => void
}

export function DisciplineList({
  disciplines,
  onEdit,
  onDelete,
  onReorder
}: DisciplineListProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(disciplines)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onReorder(items.map(item => item.id))
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="disciplines">
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {disciplines.map((discipline, index) => (
              <Draggable
                key={discipline.id}
                draggableId={discipline.id}
                index={index}
              >
                {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <DisciplineCard
                      {...discipline}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isDragging={snapshot.isDragging}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
} 