import type { CandidateProfile } from '../../types/candidate.types';

function hasTiptapContent(content: unknown): boolean {
  if (!content) return false;
  if (typeof content === 'string') return content.trim().length > 0;
  if (typeof content !== 'object') return false;

  const node = content as { content?: unknown[]; text?: unknown };
  if (typeof node.text === 'string' && node.text.trim().length > 0) return true;
  return Array.isArray(node.content) && node.content.some(hasTiptapContent);
}

interface OverviewProps {
  profile: CandidateProfile;
  appliedCount: number;
}

// const SOCIAL_ICONS: Record<string, string> = {
//   linkedin: '💼', github: '🐙', twitter: '🐦', portfolio: '🌐',
//   hackerrank: '💻', leetcode: '🔢', other: '🔗',
// };

export default function Overview({ profile, appliedCount = 0 }: OverviewProps) {
  const score = profile.profileCompletionScore ?? 0;

  const stats = [
    { label: 'Profile Score',   value: `${score}%`,                        color: score >= 60 ? 'text-green-600' : 'text-amber-600' },
    { label: 'Education',       value: profile.education?.length ?? 0,     color: 'text-blue-600' },
    { label: 'Work Experience', value: profile.workExperience?.length ?? 0, color: 'text-purple-600' },
    { label: 'Projects',        value: profile.projects?.length ?? 0,      color: 'text-red-600' },
    { label: 'Skills',          value: profile.skills?.length ?? 0,        color: 'text-teal-600' },
    { label: 'Applied Jobs',    value: appliedCount,                       color: 'text-orange-600' },
  ];

  const checks = [
    { label: 'Phone number',     done: !!profile.phone },
    { label: 'Date of birth',    done: !!profile.dateOfBirth },
    { label: 'Gender',           done: !!profile.gender },
    { label: 'Profile summary',  done: hasTiptapContent(profile.summary) },
    // { label: 'Profile summary',  done: !!profile.summary },
    { label: 'College info',     done: !!profile.currentCollege },
    { label: 'Profile photo',    done: !!profile.profilePhoto },
    { label: 'Resume uploaded',  done: !!profile.resumeUrl },
    { label: 'Skills added',     done: (profile.skills?.length ?? 0) > 0 },
    { label: 'Education added',  done: (profile.education?.length ?? 0) > 0 },
    { label: 'Social profiles',  done: (profile.socialProfiles?.length ?? 0) > 0 },
  ];
  const missing = checks.filter((c) => !c.done);

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      {/* Old dark gradient hero (commented out)
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #7f1d1d 100%)' }}
      >
        ...
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full bg-red-500/20" />
      </div>
      */}
      <div className="rounded-xl bg-indigo-soft border border-indigo/10 border-l-4 border-l-indigo p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo">Welcome back</p>
        <h1 className="text-2xl font-semibold mt-1.5 text-navy">{profile.name ?? 'Candidate'}</h1>
        {profile.currentCollege && (
          <p className="text-gray-600 text-sm mt-1">{profile.department} · {profile.currentCollege}</p>
        )}
        {profile.email && (
          <p className="text-gray-500 text-xs mt-1">{profile.email}</p>
        )}
      </div>

      {/* Next step */}
      {missing.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Next step</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">Add your {missing[0].label.toLowerCase()}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {missing.length} item{missing.length !== 1 ? 's' : ''} left to complete your profile
            </p>
          </div>
          <span className="text-xs font-medium text-gray-500 shrink-0">{score}% complete</span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-2xl font-semibold text-navy">{value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Completeness checklist */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Profile Completeness</h3>
        <div className="space-y-2.5">
          {checks.map(({ label, done }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-green-100' : 'bg-gray-100'}`}>
                {done
                  ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                  : <div className="w-2 h-2 rounded-full bg-gray-300" />
                }
              </div>
              <span className={`text-sm ${done ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Social profiles */}
      {(profile.socialProfiles?.length ?? 0) > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Social Profiles</h3>
          <div className="flex flex-wrap gap-2">
            {profile.socialProfiles?.map((sp, i) => (
              sp.url && (
                <a
                  key={i}
                  href={sp.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                >
                  {/* <span>{SOCIAL_ICONS[sp.platform ?? 'other']}</span> */}
                  <span className="capitalize">{sp.platform}</span>
                </a>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}