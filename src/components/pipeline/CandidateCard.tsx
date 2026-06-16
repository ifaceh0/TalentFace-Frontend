import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import type { Candidate, CandidateStatus } from '../../store/useStore';
import { useStore } from '../../store/useStore';
import { MapPin, Briefcase } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
}

const statusOptions: CandidateStatus[] = [
  'Applied',
  'Shortlisted',
  'Interview',
  'Offer',
  'Hired',
];

const statusColors: Record<CandidateStatus, string> = {
  Applied: 'text-blue-600',
  Shortlisted: 'text-yellow-600',
  Interview: 'text-purple-600',
  Offer: 'text-orange-600',
  Hired: 'text-green-600',
};

export default function CandidateCard({
  candidate,
}: CandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: candidate.id,
  });

  const { updateCandidateStatus } = useStore();
  const [showMenu, setShowMenu] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const handleStatusChange = async (
    newStatus: CandidateStatus
  ) => {
    await updateCandidateStatus(
      candidate.id,
      newStatus
    );
    setShowMenu(false);
  };

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    setShowMenu((prev) => !prev);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onContextMenu={handleContextMenu}
      className="
        bg-white
        rounded-lg
        p-2.5
        shadow-sm
        border
        border-gray-100
        cursor-grab
        active:cursor-grabbing
        hover:shadow-md
        transition-shadow
        relative
        text-xs
      "
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
          {candidate.name?.charAt(0)?.toUpperCase() || 'J'}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-800 truncate">
            {candidate.name}
          </p>

          <p className="text-[10px] text-gray-400 truncate">
            {candidate.email}
          </p>
          <p className="text-[11px] text-blue-600 font-medium">
  Applied for: {candidate.jobTitle}
</p>
        </div>
      </div>

      {/* Role */}
      <div className="flex items-center gap-1 mb-1">
  <Briefcase
    size={11}
    className="text-gray-400 shrink-0"
  />
  <span className="text-gray-600 truncate">
    {candidate.role}
  </span>
</div>

{candidate.appliedJob && (
  <div className="text-[10px] text-blue-600 font-medium truncate mb-1">
    Applied: {candidate.appliedJob}
  </div>
)}

      {/* Location */}
      <div className="flex items-center gap-1 mb-2">
        <MapPin
          size={11}
          className="text-gray-400 shrink-0"
        />
        <span className="text-gray-600 truncate">
          {candidate.location}
        </span>
      </div>

      {/* Skills */}
      {candidate.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {candidate.skills
            .slice(0, 2)
            .map((skill) => (
              <span
                key={skill}
                className="
                  text-[10px]
                  bg-indigo-50
                  text-indigo-600
                  px-1.5
                  py-0.5
                  rounded-full
                  font-medium
                "
              >
                {skill}
              </span>
            ))}

          {candidate.skills.length > 2 && (
            <span className="text-[10px] text-gray-400">
              +{candidate.skills.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Status Menu */}
      {showMenu && (
        <div
          className="
            absolute
            top-full
            right-0
            mt-1
            bg-white
            border
            border-gray-200
            rounded-lg
            shadow-lg
            z-50
            min-w-[140px]
          "
        >
          <div className="p-1">
            <p className="text-[11px] font-semibold text-gray-600 px-2 py-1">
              Change Status
            </p>

            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() =>
                  handleStatusChange(status)
                }
                className={`
                  w-full
                  text-left
                  px-2
                  py-1.5
                  text-xs
                  rounded
                  hover:bg-gray-50
                  transition-colors
                  ${
                    candidate.status === status
                      ? `font-semibold ${statusColors[status]}`
                      : 'text-gray-700'
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}