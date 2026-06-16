import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useStore } from '../../store/useStore';
import type { Candidate, CandidateStatus } from '../../store/useStore';
import CandidateCard from '../candidates/CandidateCard';

const columns: {
  id: CandidateStatus;
  label: string;
  color: string;
  dot: string;
}[] = [
  {
    id: 'Applied',
    label: 'Applied',
    color: 'bg-blue-50 border-blue-200',
    dot: 'bg-blue-400',
  },
  {
    id: 'Shortlisted',
    label: 'Shortlisted',
    color: 'bg-yellow-50 border-yellow-200',
    dot: 'bg-yellow-400',
  },
  {
    id: 'Interview',
    label: 'Interview',
    color: 'bg-purple-50 border-purple-200',
    dot: 'bg-purple-400',
  },
  {
    id: 'Offer',
    label: 'Offer',
    color: 'bg-orange-50 border-orange-200',
    dot: 'bg-orange-400',
  },
  {
    id: 'Hired',
    label: 'Hired',
    color: 'bg-green-50 border-green-200',
    dot: 'bg-green-400',
  },
];

function PipelineColumn({
  col,
  columnCandidates,
}: {
  col: (typeof columns)[number];
  columnCandidates: Candidate[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: col.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        w-[280px]
        min-w-[280px]
        h-[420px]
        rounded-xl
        border-2
        ${col.color}
        p-2
        flex
        flex-col
        transition-all
        ${isOver ? 'ring-2 ring-blue-400' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${col.dot}`} />
          <span className="text-sm font-semibold text-gray-700">
            {col.label}
          </span>
        </div>

        <span className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
          {columnCandidates.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {columnCandidates.length > 0 ? (
          columnCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 text-xs py-8">
            Drop candidates here
          </div>
        )}
      </div>
    </div>
  );
}

interface PipelineBoardFilteredProps {
  candidates: Candidate[];
}

export default function PipelineBoardFiltered({ candidates }: PipelineBoardFilteredProps) {
  const { updateCandidateStatus } = useStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const candidateId = active.id as string;
    const overId = over.id as string;

    const overCandidate = candidates.find(
      (c) => c.id === overId
    );

    if (overCandidate) {
      updateCandidateStatus(
        candidateId,
        overCandidate.status
      );
      return;
    }

    const targetColumn = columns.find(
      (col) => col.id === overId
    );

    if (targetColumn) {
      updateCandidateStatus(
        candidateId,
        targetColumn.id
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={candidates.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex gap-3 justify-start overflow-x-auto pb-4">
          {columns.map((col) => {
            const columnCandidates = candidates.filter(
              (c) => c.status === col.id
            );

            return (
              <PipelineColumn
                key={col.id}
                col={col}
                columnCandidates={columnCandidates}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}