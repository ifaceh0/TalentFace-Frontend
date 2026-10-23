import { memo, useState, useEffect, useRef } from 'react';
import { Trash2, Loader, Edit2, Globe, UserCheck, Trophy, Building2, MapPin, Briefcase, Banknote, MoreVertical } from 'lucide-react';
import type { Job } from '../../store/useStore';
import type { JobDetailTab } from '../dashboard/JobDetailModal';
import { formatSalary, getEditState } from './jobUtils';

interface JobRowProps {
  job: Job;
  deleting: boolean;
  onOpen: (jobId: string, tab?: JobDetailTab) => void;
  onReview: (jobId: string) => void;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
}

function JobRow({ job, deleting, onOpen, onReview, onEdit, onDelete }: JobRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const { canEdit, hoursLeft } = getEditState(job);
  const initial = (job.company || job.title || '?').trim().charAt(0).toUpperCase();
  const pct = job.maxApplicants ? Math.min(100, Math.round((job.applicants / job.maxApplicants) * 100)) : 0;
  const dot = job.status === 'Active' ? 'bg-green-500' : job.status === 'Draft' ? 'bg-gray-400' : 'bg-red-500';
  const salaryDisplay = formatSalary(job);
  const departmentText = typeof job.department === 'string' ? job.department : '';
  const locationText = !job.isRemote && typeof job.location === 'string' ? job.location : '';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(job.id, 'ranked')}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpen(job.id, 'ranked'); }}
      className="group flex gap-3 p-4 hover:bg-gray-50 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-300"
    >
      {/* Avatar tile */}
      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100 flex items-center justify-center text-sm font-bold flex-shrink-0">
        {initial}
      </div>

      <div className="flex-1 min-w-0">
        {/* Title + actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{job.title}</p>
            <div className="flex items-center gap-x-3 gap-y-1 flex-wrap mt-1 text-xs text-gray-500">
              {job.company && (
                <span className="flex items-center gap-1"><Building2 size={12} />{job.company}</span>
              )}
              {departmentText && (
                <span className="flex items-center gap-1"><Briefcase size={12} />{departmentText}</span>
              )}
              {locationText && (
                <span className="flex items-center gap-1 min-w-0 max-w-[16rem]" title={locationText}>
                  <MapPin size={12} className="flex-shrink-0" />
                  <span className="truncate">{locationText}</span>
                </span>
              )}
              {job.isRemote && (
                <span className="flex items-center gap-1 text-purple-600"><Globe size={12} />Remote</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Hover-revealed icon actions (always visible on mobile) */}
            <div className="hidden md:flex items-center md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition">
              <button
                type="button"
                aria-label="Review candidates"
                title="Review candidates"
                onClick={(e) => { e.stopPropagation(); onReview(job.id); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
              >
                <UserCheck size={15} />
              </button>

              {canEdit && (
                <button
                  type="button"
                  aria-label="Edit job"
                  title="Edit job (24-hour window)"
                  onClick={(e) => { e.stopPropagation(); onEdit(job); }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                >
                  <Edit2 size={15} />
                </button>
              )}

              <button
                type="button"
                aria-label="Delete job"
                title="Delete job"
                disabled={deleting}
                onClick={(e) => { e.stopPropagation(); onDelete(job.id); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-60"
              >
                {deleting ? <Loader size={15} className="animate-spin" /> : <Trash2 size={15} />}
              </button>
            </div>

            {/* Mobile menu */}
            <div ref={menuRef} className="relative md:hidden">
              <button
                type="button"
                aria-label="More actions"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"
              >
                <MoreVertical size={16} />
              </button>

              {menuOpen && (
                <div role="menu" className="absolute right-0 top-full mt-1 z-20 w-44 bg-white rounded-xl shadow-lg ring-1 ring-gray-200 py-1">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onReview(job.id); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <UserCheck size={14} /> Review candidates
                  </button>

                  {canEdit && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit(job); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Edit2 size={14} /> Edit job
                    </button>
                  )}

                  <button
                    type="button"
                    role="menuitem"
                    disabled={deleting}
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(job.id); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 size={14} /> Delete job
                  </button>
                </div>
              )}
            </div>

            {/* Primary action */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onOpen(job.id, 'ranked'); }}
              aria-label="View applicants"
              className="ml-1 flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <Trophy size={13} />
              <span className="hidden sm:inline">View applicants</span>
            </button>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-x-4 gap-y-2 flex-wrap mt-3">
          {/* Applicants */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-medium">{job.applicants}</span>
            <span className="text-gray-400">{job.maxApplicants ? `/ ${job.maxApplicants} applicants` : 'applicants'}</span>
            {job.maxApplicants ? (
              <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : 'bg-indigo-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            ) : null}
          </div>

          {salaryDisplay && (
            <span className="flex items-center gap-1 text-xs text-gray-600">
              <Banknote size={13} className="text-gray-400" />
              {salaryDisplay}
            </span>
          )}

          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-200">
            {job.jobType || 'Full-time'}
          </span>

          <span className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {job.status}
          </span>

          {canEdit && (
            <span className="text-[11px] text-amber-600">
              Editable · {Math.max(1, Math.ceil(hoursLeft))}h left
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(JobRow);