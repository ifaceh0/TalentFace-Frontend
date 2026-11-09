import CompletionRing from './CompletionRing';
import type { CandidateProfile } from '../../types/candidate.types';
import { Fragment } from 'react';
function extractSummaryText(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') {
    try {
      return extractSummaryText(JSON.parse(value));
    } catch {
      return value;
    }
  }
  if (Array.isArray(value)) return value.map(extractSummaryText).join('');
  if (typeof value !== 'object') return '';

  const node = value as { text?: unknown; content?: unknown[] };
  if (typeof node.text === 'string') return node.text;
  return Array.isArray(node.content) ? node.content.map(extractSummaryText).join('') : '';
}

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

const GROUP_LABELS: Partial<Record<Section, string>> = { basic: 'Profile', analyzer: 'Tools' };

function getStatus(id: Section, profile: CandidateProfile | null): BadgeStatus {
  if (!profile) return 'empty';

  const score = profile.profileCompletionScore ?? 0;
  const summaryText = extractSummaryText(profile.summary);

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
      if (summaryText.trim().length > 50) return 'done';
      if (summaryText.trim().length > 0)  return 'partial';
      // if (profile.summary && profile.summary.trim().length > 50) return 'done';
      // if (profile.summary && profile.summary.trim().length > 0)   return 'partial';
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

function SectionBadge({ status, pts }: { status: BadgeStatus; pts: number; active: boolean }) {
  if (status === 'locked') {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-gray-400 shrink-0">
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 018 0v4" />
      </svg>
    );
  }
  if (pts === 0) return null;
  if (status === 'done') {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-emerald-500 shrink-0">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  return (
    <span className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${status === 'partial' ? 'bg-amber-500' : 'border border-gray-300'}`} />
  );
}

interface SidebarProps {
  profile: CandidateProfile | null;
  activeSection: Section;
  onSelect: (s: Section) => void;
  onPhotoClick: () => void;
}

export default function Sidebar({ profile, activeSection, onSelect, onPhotoClick }: SidebarProps) {
  const score = profile?.profileCompletionScore ?? 0;

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-white border-r border-gray-200 h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-200 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M3 6h18M3 12h12M3 18h7" />
          </svg>
        </div>
        <span className="font-bold text-gray-900 text-sm tracking-tight">TalentFace</span>
      </div>

      {/* Profile card */}
      <div className="px-4 py-6 border-b border-gray-200 flex flex-col items-center gap-3">
        <button onClick={onPhotoClick} className="relative group" title="Change photo">
          {profile?.profilePhoto ? (
            <img
              src={profile.profilePhoto}
              alt="Profile"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-200 group-hover:ring-red-500 transition-all"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-indigo-soft flex items-center justify-center text-2xl font-bold text-indigo transition-colors ring-2 ring-gray-200 group-hover:ring-red-500">
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
          <p className="text-gray-900 font-semibold text-sm leading-tight">{profile?.name ?? 'Your Name'}</p>
          {profile?.currentCollege && (
            <p className="text-gray-500 text-xs mt-0.5 leading-tight">{profile.currentCollege}</p>
          )}
          {profile?.uniqueId && (
            <p className="mt-1.5 inline-block text-[10px] font-mono font-semibold tracking-wider text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-2 py-0.5">
              {profile.uniqueId}
            </p>
          )}
        </div>

        <CompletionRing score={score} size={72} strokeWidth={6} />
        <p className="text-gray-500 text-xs -mt-1">Profile Completion</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {score < 50 && (
          <p className="text-[10px] text-gray-400 px-3 pb-2">
            Fill sections below to reach <span className="text-amber-600 font-medium">50%</span>
          </p>
        )}

        {BASE_NAV_ITEMS.map(({ id, label, pts }) => {
          const status = getStatus(id, profile);
          const active = id === activeSection;
          const isLocked = status === 'locked';

          return (
            <Fragment key={id}>
              {GROUP_LABELS[id] && (
                <p className="px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {GROUP_LABELS[id]}
                </p>
              )}
              <button
                onClick={() => !isLocked && onSelect(id)}
                disabled={isLocked}
                title={isLocked ? 'Reach 50% profile score to unlock' : undefined}
                className={`w-full flex items-center px-3 py-2 rounded-lg mb-0.5 text-left text-sm border-l-2 transition-colors
                  ${active
                    ? 'bg-indigo-soft text-navy font-medium border-red-500'
                    : isLocked
                      ? 'text-gray-300 cursor-not-allowed border-transparent'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent'
                  }`}
              >
                <span className="flex-1 leading-tight">{label}</span>
                <SectionBadge status={status} pts={pts} active={active} />
              </button>
            </Fragment>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className={`text-xs px-2.5 py-1.5 rounded-lg font-medium ${
          profile?.profileComplete
            ? 'bg-green-50 text-green-700'
            : 'bg-amber-50 text-amber-700'
        }`}>
          {profile?.profileComplete ? 'Your profile is complete' : 'Almost there, keep going'}
        </div>
      </div>
    </aside>
  );
}

export type { Section };