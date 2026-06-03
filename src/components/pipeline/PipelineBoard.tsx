import { useEffect, useRef } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useStore } from '../../store/useStore';
import type { CandidateStatus } from '../../store/useStore';
import CandidateCard from './CandidateCard';

const columns: { id: CandidateStatus; label: string; color: string; dot: string }[] = [
  { id: 'Applied', label: 'Applied', color: 'bg-blue-50 border-blue-200', dot: 'bg-blue-400' },
  { id: 'Shortlisted', label: 'Shortlisted', color: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-400' },
  { id: 'Interview', label: 'Interview', color: 'bg-purple-50 border-purple-200', dot: 'bg-purple-400' },
  { id: 'Offer', label: 'Offer', color: 'bg-orange-50 border-orange-200', dot: 'bg-orange-400' },
  { id: 'Hired', label: 'Hired', color: 'bg-green-50 border-green-200', dot: 'bg-green-400' },
];

export default function PipelineBoard() {
  const { candidates, fetchCandidates, updateCandidateStatus } = useStore();

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      return;
    }

    event.preventDefault();
    container.scrollLeft += event.deltaY;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const candidateId = active.id as string;
    const overId = over.id as string;

    // Check if dropped over a column
    const isColumn = columns.find((col) => col.id === overId);
    if (isColumn) {
      updateCandidateStatus(candidateId, overId as CandidateStatus);
      return;
    }

    // Check if dropped over another candidate — find that candidate's column
    const overCandidate = candidates.find((c) => c.id === overId);
    if (overCandidate) {
      updateCandidateStatus(candidateId, overCandidate.status);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const candidateId = active.id as string;
    const overId = over.id as string;

    const isColumn = columns.find((col) => col.id === overId);
    if (isColumn) {
      updateCandidateStatus(candidateId, overId as CandidateStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4"
        onWheel={handleWheel}
      >
        {columns.map((col) => {
          const columnCandidates = candidates.filter((c) => c.status === col.id);
          return (
            <div
              key={col.id}
              className={`flex-shrink-0 w-60 rounded-xl border-2 ${col.color} p-3`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                  <span className="text-sm font-semibold text-gray-700">
                    {col.label}
                  </span>
                </div>
                <span className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                  {columnCandidates.length}
                </span>
              </div>

              {/* Cards */}
              <SortableContext
                items={columnCandidates.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-20">
                  {columnCandidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}