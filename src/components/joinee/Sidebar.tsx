import CompletionRing from './CompletionRing';
import type { JoineeProfile } from '../../types/joinee.types';

type Section =
  | 'overview' | 'basic' | 'summary' | 'address'
  | 'education' | 'work' | 'skills' | 'projects'
  | 'social' | 'resume';

const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: 'overview',  label: 'Overview',         icon: '📊' },
  { id: 'basic',     label: 'Basic Details',     icon: '👤' },
  { id: 'summary',   label: 'Summary',           icon: '📝' },
  { id: 'address',   label: 'Address',           icon: '🏠' },
  { id: 'education', label: 'Education',         icon: '🎓' },
  { id: 'work',      label: 'Work Experience',   icon: '💼' },
  { id: 'skills',    label: 'Skills',            icon: '🛠️' },
  { id: 'projects',  label: 'Projects',          icon: '🚀' },
  { id: 'social',    label: 'Social Profiles',   icon: '🔗' },
  { id: 'resume',    label: 'Resume',            icon: '📄' },
];

interface SidebarProps {
  profile: JoineeProfile | null;
  activeSection: Section;
  onSelect: (s: Section) => void;
  onPhotoClick: () => void;
}

export default function Sidebar({ profile, activeSection, onSelect, onPhotoClick }: SidebarProps) {
  const score = profile?.profileCompletionScore ?? 0;

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-slate-900 min-h-screen">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-800 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M3 6h18M3 12h12M3 18h7" />
          </svg>
        </div>
        <span className="font-bold text-white text-sm tracking-tight">TalentFace</span>
      </div>

      {/* Profile card */}
      <div className="px-4 py-6 border-b border-slate-800 flex flex-col items-center gap-3">
        <button onClick={onPhotoClick} className="relative group" title="Change photo">
          {profile?.profilePhoto ? (
            <img
              src={profile.profilePhoto}
              alt="Profile"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-700 group-hover:ring-red-500 transition-all"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center text-2xl font-bold text-white group-hover:bg-slate-600 transition-colors ring-2 ring-slate-600 group-hover:ring-red-500">
              {profile?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
        </button>

        <div className="text-center">
          <p className="text-white font-semibold text-sm leading-tight">{profile?.name ?? 'Your Name'}</p>
          {profile?.currentCollege && (
            <p className="text-slate-400 text-xs mt-0.5 leading-tight">{profile.currentCollege}</p>
          )}
        </div>

        <CompletionRing score={score} size={72} strokeWidth={6} />
        <p className="text-slate-400 text-xs -mt-1">Profile Completion</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_ITEMS.map(({ id, label, icon }) => {
          const active = id === activeSection;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl mb-0.5 text-left transition-all text-sm
                ${active
                  ? 'bg-red-500 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
            >
              <span className="text-base leading-none">{icon}</span>
              <span className="leading-tight">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800">
        <div className={`text-xs px-2.5 py-1.5 rounded-lg font-medium ${
          profile?.profileComplete
            ? 'bg-green-900/40 text-green-400'
            : 'bg-amber-900/30 text-amber-400'
        }`}>
          {profile?.profileComplete ? '✅ Profile Complete' : '⚠️ Complete your profile'}
        </div>
      </div>
    </aside>
  );
}

export type { Section };
