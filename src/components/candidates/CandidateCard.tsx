import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Candidate } from '../../store/useStore';

interface CandidateCardProps {
  candidate: Candidate;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white
        rounded-lg
        p-3
        border border-gray-200
        shadow-sm
        hover:shadow-md
        transition-all
        cursor-grab
        active:cursor-grabbing
        ${isDragging ? 'ring-2 ring-blue-400' : ''}
      `}
    >
      <div className="flex items-start gap-2">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
          {candidate.avatar}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {candidate.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {candidate.location}
          </p>
          {candidate.email && (
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {candidate.email}
            </p>
          )}
        </div>
      </div>

      {/* Skills */}
      {candidate.skills && candidate.skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {candidate.skills.slice(0, 2).map((skill, idx) => (
            <span
              key={idx}
              className="inline-block text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded"
            >
              {skill}
            </span>
          ))}
          {candidate.skills.length > 2 && (
            <span className="text-xs text-gray-500">
              +{candidate.skills.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Experience */}
      {candidate.experience && candidate.experience > 0 && (
        <p className="text-xs text-gray-600 mt-2">
          {candidate.experience} yrs exp
        </p>
      )}

      {/* Work experience count */}
      {candidate.workExperience && candidate.workExperience.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          {candidate.workExperience.length} work history item(s)
        </p>
      )}


    </div>
  );
}