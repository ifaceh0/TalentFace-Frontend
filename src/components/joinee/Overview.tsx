import type { JoineeProfile } from '../../types/joinee.types';

interface OverviewProps {
  profile: JoineeProfile;
}

const SOCIAL_ICONS: Record<string, string> = {
  linkedin: '💼', github: '🐙', twitter: '🐦', portfolio: '🌐',
  hackerrank: '💻', leetcode: '🔢', other: '🔗',
};

export default function Overview({ profile }: OverviewProps) {
  const score = profile.profileCompletionScore ?? 0;

  const stats = [
    { label: 'Profile Score',   value: `${score}%`,                        color: score >= 60 ? 'text-green-600' : 'text-amber-600' },
    { label: 'Education',       value: profile.education?.length ?? 0,     color: 'text-blue-600' },
    { label: 'Work Experience', value: profile.workExperience?.length ?? 0, color: 'text-purple-600' },
    { label: 'Projects',        value: profile.projects?.length ?? 0,      color: 'text-red-600' },
    { label: 'Skills',          value: profile.skills?.length ?? 0,        color: 'text-teal-600' },
    { label: 'Applied Jobs',    value: profile.appliedJobs?.length ?? 0,   color: 'text-orange-600' },
  ];

  const checks = [
    { label: 'Phone number',     done: !!profile.phone },
    { label: 'Date of birth',    done: !!profile.dateOfBirth },
    { label: 'Gender',           done: !!profile.gender },
    { label: 'Profile summary',  done: !!profile.summary },
    { label: 'College info',     done: !!profile.currentCollege },
    { label: 'Profile photo',    done: !!profile.profilePhoto },
    { label: 'Resume uploaded',  done: !!profile.resumeUrl },
    { label: 'Skills added',     done: (profile.skills?.length ?? 0) > 0 },
    { label: 'Education added',  done: (profile.education?.length ?? 0) > 0 },
    { label: 'Social profiles',  done: (profile.socialProfiles?.length ?? 0) > 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #7f1d1d 100%)' }}
      >
        <div className="relative z-10">
          <p className="text-slate-400 text-sm">Welcome back 👋</p>
          <h1 className="text-2xl font-bold mt-1">{profile.name ?? 'Candidate'}</h1>
          {profile.currentCollege && (
            <p className="text-slate-300 text-sm mt-1">{profile.department} · {profile.currentCollege}</p>
          )}
          {profile.email && (
            <p className="text-slate-400 text-xs mt-1">{profile.email}</p>
          )}
        </div>
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full bg-red-500/20" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Completeness checklist */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
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
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
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
                  <span>{SOCIAL_ICONS[sp.platform ?? 'other']}</span>
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
