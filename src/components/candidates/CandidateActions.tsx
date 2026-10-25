import { useEffect, useState } from 'react';
import { MoreHorizontal, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../../store/useStore';
import type { Candidate, CandidateStatus } from '../../store/useStore';

const MOVE_TO: CandidateStatus[] = ['Shortlisted', 'Interview', 'Offer', 'Hired'];

export default function CandidateActions({ candidate }: { candidate: Candidate }) {
  const updateCandidateStatus = useStore((s) => s.updateCandidateStatus);
  const [pos, setPos] = useState<{ top?: number; bottom?: number; right: number } | null>(null);

  // Close on outside click or scroll
  useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    window.addEventListener('click', close);
    window.addEventListener('scroll', close, true);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [pos]);

  const change = async (status: CandidateStatus) => {
    setPos(null);
    if (status === 'Rejected' && !window.confirm(`Reject ${candidate.name}?`)) return;
    await updateCandidateStatus(candidate.id, status);
    // the store swallows errors, so verify the change actually landed
    const ok = useStore.getState().candidates.find((c) => c.id === candidate.id)?.status === status;
    ok ? toast.success(`${candidate.name} moved to ${status}`) : toast.error('Failed to update status');
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (pos) return setPos(null);
          const r = e.currentTarget.getBoundingClientRect();
          const MENU_H = 230; // approx menu height
          const right = window.innerWidth - r.right;
          setPos(
            r.bottom + MENU_H > window.innerHeight
              ? { bottom: window.innerHeight - r.top + 4, right }
              : { top: r.bottom + 4, right }
          );
        }}
        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
        aria-label="Candidate actions"
      >
        <MoreHorizontal size={16} />
      </button>

      {pos && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ top: pos.top, bottom: pos.bottom, right: pos.right }}
          className="fixed z-50 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 text-sm"
        >
          <p className="px-3 py-1 text-xs text-gray-400">Move to</p>
          {MOVE_TO.filter((s) => s !== candidate.status).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => change(s)}
              className="w-full text-left px-3 py-1.5 text-gray-700 hover:bg-gray-50"
            >
              {s}
            </button>
          ))}
          {candidate.status !== 'Rejected' && (
            <button
              type="button"
              onClick={() => change('Rejected')}
              className="w-full flex items-center gap-2 px-3 py-1.5 mt-1 border-t border-gray-100 text-red-600 hover:bg-red-50"
            >
              <XCircle size={14} /> Reject
            </button>
          )}
        </div>
      )}
    </>
  );
}