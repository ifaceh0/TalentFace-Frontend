import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Candidate } from '../../store/useStore';
import { MapPin, Briefcase } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: candidate.id });

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
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      {/* Top Row */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {candidate.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{candidate.name}</p>
          <p className="text-xs text-gray-400">{candidate.email}</p>
        </div>
      </div>

      {/* Role + Experience */}
      <div className="flex items-center gap-2 mb-2">
        <Briefcase size={13} className="text-gray-400" />
        <p className="text-xs text-gray-600">{candidate.role}</p>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <MapPin size={13} className="text-gray-400" />
        <p className="text-xs text-gray-600">{candidate.location}</p>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1">
        {candidate.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}