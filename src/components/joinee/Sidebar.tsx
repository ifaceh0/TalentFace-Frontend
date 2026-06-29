import CompletionRing from './CompletionRing';
import type { JoineeProfile } from '../../types/joinee.types';

type Section =
  | 'overview' | 'basic' | 'summary' | 'address'
  | 'education' | 'work' | 'skills' | 'projects'
  | 'social' | 'resume' | 'analyzer' | 'recruiter';

type BadgeStatus = 'done' | 'partial' | 'empty' | 'locked';

const BASE_NAV_ITEMS: { id: Section; label: string; icon: string; pts: number }[] = [
  
  { id: 'overview',  label: 'Overview',        icon: '📊', pts: 0  },
  { id: 'basic',     label: 'Basic Details',   icon: '👤', pts: 5  },
  { id: 'summary',   label: 'Summary',         icon: '📝', pts: 5  },
  { id: 'address',   label: 'Address',         icon: '🏠', pts: 5  },
  { id: 'education', label: 'Education',       icon: '🎓', pts: 5  },
  { id: 'work',      label: 'Work Experience', icon: '💼', pts: 10 },
  { id: 'skills',    label: 'Skills',          icon: '🛠️', pts: 10 },
  { id: 'projects',  label: 'Projects',        icon: '🚀', pts: 20 },
  { id: 'social',    label: 'Social Profiles', icon: '🔗', pts: 10 },
  { id: 'resume',    label: 'Resume',          icon: '📄', pts: 20 },
  { id: 'analyzer',  label: 'Resume Analyzer', icon: '🤖', pts: 0  },
  { id: 'recruiter', label: 'Recruiter View',  icon: '🧑‍💼', pts: 0  },
];


function getStatus(id: Section, profile: JoineeProfile | null): BadgeStatus {
  if (!profile) return 'empty';

  const score = profile.profileCompletionScore ?? 0;

  switch (id) {
    case 'overview':
      return 'done'; // always accessible

    case 'basic':
      // fully done only when all 4 required fields are filled
      if (profile.phone && profile.dateOfBirth && profile.gender && (profile.firstName || profile.name))
        return 'done';
      if (profile.name || profile.firstName)
        return 'partial'; // has name but missing phone/dob/gender
      return 'empty';

    case 'summary':
      if (profile.summary && profile.summary.trim().length > 50) return 'done';
      if (profile.summary && profile.summary.trim().length > 0)   return 'partial';
      return 'empty';

    case 'address': {
      const a = profile.address;
      // fully done only when city, state AND pincode are filled
      if (a?.city && a?.state && a?.pincode) return 'done';
      // partial if at least one field is filled
      if (a?.city || a?.state || a?.line1 || a?.pincode) return 'partial';
      return 'empty';
    }

    case 'education':
      return (profile.education?.length ?? 0) > 0 ? 'done' : 'empty';

    case 'work':
      return (profile.workExperience?.length ?? 0) > 0 ? 'done' : 'empty';

    case 'skills':
      if ((profile.skills?.length ?? 0) >= 3) return 'done';
      if ((profile.skills?.length ?? 0) > 0)  return 'partial';
      return 'empty';

    case 'projects':
      return (profile.projects?.length ?? 0) > 0 ? 'done' : 'empty';

    case 'social': {
      const profiles = profile.socialProfiles ?? [];
      const hasLinkedInOrGithub = profiles.some(
        (s) => (s.platform === 'linkedin' || s.platform === 'github') && s.url?.trim()
      );
      // fallback to flat fields if socialProfiles not populated
      if (hasLinkedInOrGithub || profile.linkedIn || profile.github) return 'done';
      if (profiles.length > 0) return 'partial';
      return 'empty';
    }

    case 'resume':
      return profile.resume || profile.resumeUrl ? 'done' : 'empty';

    case 'analyzer':
      return 'done'; // always accessible, no completion concept

    case 'recruiter':
      return score >= 50 ? 'done' : 'locked';

    default:
      return 'empty';
  }
}
// function getStatus(id: Section, profile: JoineeProfile | null): BadgeStatus {
//   if (!profile) return id === 'overview' || id === 'basic' ? 'done' : 'empty';

//   const score = profile.profileCompletionScore ?? 0;

//   switch (id) {
//     case 'overview':  return 'done';
//     case 'basic':     return profile.name && profile.email ? 'done' : 'partial';
//     case 'summary':   return profile.summary ? 'done' : 'empty';
//     case 'address': {
//     const a = profile.address;
//     return (a?.city || a?.state || a?.line1) ? 'done' : 'empty';
// }
//     case 'education': return (profile.education?.length ?? 0) > 0 ? 'done' : 'empty';
//     case 'work':      return (profile.workExperience?.length ?? 0) > 0 ? 'done' : 'partial';
//     case 'skills':    return (profile.skills?.length ?? 0) > 0 ? 'done' : 'empty';
//     case 'projects':  return (profile.projects?.length ?? 0) > 0 ? 'done' : 'empty';
//     case 'social':    return profile.socialProfiles ? 'partial' : 'empty';
//     case 'resume':    return profile.resume ? 'done' : 'empty';
//     case 'analyzer':  return 'done';
//     case 'recruiter': return score >= 50 ? 'done' : 'locked';
//     default:          return 'empty';
//   }
// }

function SectionBadge({ status, pts, active }: { status: BadgeStatus; pts: number; active: boolean }) {
  if (active) return null;
  if (pts === 0) return null;

  if (status === 'locked') {
    return (
      <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-700 text-slate-500 shrink-0">
        🔒
      </span>
    );
  }
  if (status === 'done') {
    return (
      <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-green-900/40 text-green-400 shrink-0">
        ✓
      </span>
    );
  }
  if (status === 'partial') {
    return (
      <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-amber-900/30 text-amber-400 shrink-0">
        +{pts}
      </span>
    );
  }
  return (
    <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-red-900/20 text-red-400 shrink-0">
      +{pts}
    </span>
  );
}

interface SidebarProps {
  profile: JoineeProfile | null;
  activeSection: Section;
  onSelect: (s: Section) => void;
  onPhotoClick: () => void;
}

export default function Sidebar({ profile, activeSection, onSelect, onPhotoClick }: SidebarProps) {
  const score = profile?.profileCompletionScore ?? 0;

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-slate-900 h-full">
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
        {score < 50 && (
          <p className="text-[10px] text-slate-500 px-3 pb-2">
            Fill sections below to reach <span className="text-amber-400 font-medium">50%</span>
          </p>
        )}

        {BASE_NAV_ITEMS.map(({ id, label, icon, pts }) => {
          const status = getStatus(id, profile);
          const active = id === activeSection;
          const isLocked = status === 'locked';

          return (
            <button
              key={id}
              onClick={() => !isLocked && onSelect(id)}
              disabled={isLocked}
              title={isLocked ? 'Reach 50% profile score to unlock' : undefined}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl mb-0.5 text-left transition-all text-sm
                ${active
                  ? 'bg-red-500 text-white font-medium shadow-sm'
                  : isLocked
                    ? 'text-slate-600 cursor-not-allowed opacity-60'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
            >
              <span className="text-base leading-none shrink-0">{icon}</span>
              <span className="leading-tight flex-1">{label}</span>
              <SectionBadge status={status} pts={pts} active={active} />
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