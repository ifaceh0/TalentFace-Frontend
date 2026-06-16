// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/useAuth';
// import Sidebar, { type Section } from '../../components/joinee/Sidebar';
// import Overview from '../../components/joinee/Overview';
// import BasicDetailsForm from '../../components/joinee/BasicDetailsForm';
// import SummaryForm from '../../components/joinee/SummaryForm';
// import AddressForm from '../../components/joinee/AddressForm';
// import EducationSection from '../../components/joinee/EducationSection';
// import WorkExpSection from '../../components/joinee/WorkExpSection';
// import SkillsSection from '../../components/joinee/SkillsSection';
// import ProjectsSection from '../../components/joinee/ProjectsSection';
// import SocialProfilesForm from '../../components/joinee/SocialProfilesForm';
// import ResumeSection from '../../components/joinee/ResumeSection';
// import { getProfile, uploadProfilePhoto } from '../../services/joinee.service';
// import type { JoineeProfile } from '../../types/joinee.types';

// export default function JoineeDashboard() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState<JoineeProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeSection, setActiveSection] = useState<Section>('overview');
//   const [photoUploading, setPhotoUploading] = useState(false);
//   const photoInputRef = useRef<HTMLInputElement>(null);
//   const mainRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     getProfile()
//       .then((p) => setProfile(p))
//       .catch((err: unknown) =>
//         setError(err instanceof Error ? err.message : 'Failed to load profile.')
//       )
//       .finally(() => setLoading(false));
//   }, []);

//   // Scroll to top on section change
//   useEffect(() => {
//     mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [activeSection]);

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login', { replace: true });
//   };

//   // const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const file = e.target.files?.[0];
//   //   if (!file || !profile) return;
//   //   setPhotoUploading(true);
//   //   try {
//   //     const res = await uploadProfilePhoto(file);
//   //     setProfile((p) => (p ? { ...p, profilePhoto: res.profilePhoto } : p));
//   //   } catch { /* silent */ }
//   //   finally { setPhotoUploading(false); }
//   // };
//   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !profile) return;
//     setPhotoUploading(true);
//     try {
//       const res = await uploadProfilePhoto(file);
//       setProfile((p) => (p ? { ...p, profilePhoto: res.profilePhoto } : p));
//     } catch (err) {
//       console.error('Photo upload failed:', err); 
//     } finally {
//         setPhotoUploading(false);
//         if (photoInputRef.current) photoInputRef.current.value = ''; 
//       }
//   };

//   const updateProfile = (updated: JoineeProfile) => setProfile(updated);

//   // ─── Loading ────────────────────────────────────────────────────────────────

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <svg className="animate-spin w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none">
//             <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
//             <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
//           </svg>
//           <p className="text-gray-500 text-sm">Loading your profile…</p>
//         </div>
//       </div>
//     );
//   }

//   // ─── Error ──────────────────────────────────────────────────────────────────

//   if (error) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="text-center max-w-sm mx-auto px-4">
//           <p className="text-5xl mb-4">⚠️</p>
//           <h1 className="text-lg font-bold text-gray-900">Failed to load profile</h1>
//           <p className="text-sm text-gray-500 mt-1">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ─── Section Router ──────────────────────────────────────────────────────────

//   const renderSection = () => {
//     if (!profile) return null;
//     switch (activeSection) {
//       case 'overview':
//         return <Overview profile={profile} />;
//       case 'basic':
//         return <BasicDetailsForm profile={profile} onUpdate={updateProfile} />;
//       case 'summary':
//         return <SummaryForm profile={profile} onUpdate={updateProfile} />;
//       case 'address':
//         return <AddressForm profile={profile} onUpdate={updateProfile} />;
//       case 'education':
//         return (
//           <EducationSection
//             items={profile.education ?? []}
//             onChange={(ed) => setProfile((p) => (p ? { ...p, education: ed } : p))}
//           />
//         );
//       case 'work':
//         return (
//           <WorkExpSection
//             items={profile.workExperience ?? []}
//             onChange={(we) => setProfile((p) => (p ? { ...p, workExperience: we } : p))}
//           />
//         );
//       case 'skills':
//         return <SkillsSection profile={profile} onUpdate={updateProfile} />;
//       case 'projects':
//         return (
//           <ProjectsSection
//             items={profile.projects ?? []}
//             onChange={(pr) => setProfile((p) => (p ? { ...p, projects: pr } : p))}
//           />
//         );
//       case 'social':
//         return <SocialProfilesForm profile={profile} onUpdate={updateProfile} />;
//       case 'resume':
//         return <ResumeSection profile={profile} onUpdate={updateProfile} />;
//     }
//   };

//   const SECTION_LABELS: Record<Section, string> = {
//     overview: 'Overview',
//     basic:    'Basic Details',
//     summary:  'Summary',
//     address:  'Address',
//     education:'Education',
//     work:     'Work Experience',
//     skills:   'Skills',
//     projects: 'Projects',
//     social:   'Social Profiles',
//     resume:   'Resume',
//   };

//   // ─── Render ─────────────────────────────────────────────────────────────────

//   return (
//     <div className="flex min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
//       {/* Sidebar */}
//       <Sidebar
//         profile={profile}
//         activeSection={activeSection}
//         onSelect={setActiveSection}
//         onPhotoClick={() => photoInputRef.current?.click()}
//       />
//       <input
//         ref={photoInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handlePhotoUpload}
//         className="hidden"
//       />

//       {/* Main area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Top bar */}
//         <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shrink-0">
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium text-gray-400">Dashboard</span>
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300">
//               <path d="M9 18l6-6-6-6" />
//             </svg>
//             <span className="text-sm font-semibold text-gray-800">
//               {SECTION_LABELS[activeSection]}
//             </span>
//           </div>

//           <div className="flex items-center gap-4">
//             {photoUploading && (
//               <div className="flex items-center gap-1.5 text-xs text-gray-500">
//                 <svg className="animate-spin w-3 h-3 text-red-500" viewBox="0 0 24 24" fill="none">
//                   <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
//                   <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
//                 </svg>
//                 Uploading photo…
//               </div>
//             )}
//             <span className="text-xs text-gray-400">{user?.email}</span>
//             <div className="w-px h-4 bg-gray-200" />
//             <button
//               onClick={handleLogout}
//               className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
//             >
//               Sign out
//             </button>
//           </div>
//         </header>

//         {/* Content panel */}
//         <main
//           ref={mainRef}
//           className="flex-1 overflow-y-auto p-6 lg:p-8"
//           key={activeSection}
//           style={{ animation: 'fadeIn 0.22s ease' }}
//         >
//           <div className="max-w-3xl mx-auto">
//             {renderSection()}
//           </div>
//         </main>
//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(8px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Sidebar, { type Section } from '../../components/joinee/Sidebar';
import Overview from '../../components/joinee/Overview';
import BasicDetailsForm from '../../components/joinee/BasicDetailsForm';
import SummaryForm from '../../components/joinee/SummaryForm';
import AddressForm from '../../components/joinee/AddressForm';
import EducationSection from '../../components/joinee/EducationSection';
import WorkExpSection from '../../components/joinee/WorkExpSection';
import SkillsSection from '../../components/joinee/SkillsSection';
import ProjectsSection from '../../components/joinee/ProjectsSection';
import SocialProfilesForm from '../../components/joinee/SocialProfilesForm';
import ResumeSection from '../../components/joinee/ResumeSection';
import { getProfile, uploadProfilePhoto } from '../../services/joinee.service';
import type { JoineeProfile } from '../../types/joinee.types';
import RecruiterSection from '../../components/joinee/RecruiterSection';

// ─── Extended section type with recruiter panel ───────────────────────────────
type ExtendedSection = Section | 'recruiter';


// ─── Recruiter Panel (thin wrapper) ──────────────────────────────────────────
// Delegates to the dedicated RecruiterSection component which auto-generates
// a resume from the user's profile data (filled during profile creation).
function RecruiterPanel({ profile }: { profile: JoineeProfile }) {
  return <RecruiterSection profile={profile} />;
}



// ─── Profile Score Pop-up / Banner ────────────────────────────────────────────
// Shows when user tries to access Recruiter section but score < 85
function ProfileScoreGate({
  score,
  onClose,
  onGoComplete,
}: {
  score: number;
  onClose: () => void;
  onGoComplete: () => void;
}) {
  const remaining = 50 - score;
  const circumference = 2 * Math.PI * 36; // r=36
  const dash = (score / 100) * circumference;

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(13,27,62,0.55)',
        backdropFilter: 'blur(4px)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 20,
          padding: '40px 36px',
          maxWidth: 440,
          width: '100%',
          boxShadow: '0 32px 80px rgba(13,27,62,0.28)',
          textAlign: 'center',
          position: 'relative',
          animation: 'popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 14, right: 14, background: '#F8F9FF', border: '1px solid #E8EDF8', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 14, color: '#6B7280' }}
        >✕</button>

        {/* Circular progress */}
        <div style={{ display: 'inline-flex', position: 'relative', marginBottom: 20 }}>
          <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="48" cy="48" r="36" fill="none" stroke="#F0F4FF" strokeWidth="8" />
            <circle
              cx="48" cy="48" r="36" fill="none"
              stroke={score >= 85 ? '#22C55E' : '#D62B2B'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: score >= 85 ? '#22C55E' : '#D62B2B' }}>{score}%</span>
          </div>
        </div>

        {/* Icon */}
        <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0D1B3E', margin: '0 0 10px' }}>
          Profile Not Ready for Recruiters
        </h2>
        <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.65, margin: '0 0 20px' }}>
          Your profile score is currently <strong style={{ color: '#D62B2B' }}>{score}%</strong>.
          You need at least <strong style={{ color: '#0D1B3E' }}>50%</strong> to be visible in the Recruiter Section
          and get hired.
        </p>

        {/* Progress bar */}
        <div style={{ background: '#F0F4FF', borderRadius: 99, height: 10, marginBottom: 8, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(score / 50) * 100}%`,
            background: 'linear-gradient(90deg,#D62B2B,#1C3FA8)',
            borderRadius: 99,
            transition: 'width 0.6s ease',
          }} />
        </div>
        <p style={{ fontSize: 12, color: '#A0AABF', marginBottom: 24 }}>
          {remaining} more point{remaining !== 1 ? 's' : ''} needed to unlock Recruiter Section
        </p>

        {/* What to complete */}
        <div style={{ background: '#FFF5F5', border: '1px solid #FECDD3', borderRadius: 12, padding: '14px 16px', textAlign: 'left', marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#D62B2B', margin: '0 0 8px' }}>Complete these sections to reach 50%:</p>
          <ul style={{ fontSize: 12, color: '#4A5568', lineHeight: 1.8, margin: 0, paddingLeft: 16 }}>
            <li>Basic Details (name, phone, date of birth, gender)</li>
            <li>Profile Summary</li>
            <li>At least 1 Education entry</li>
            <li>At least 3 Skills</li>
            <li>At least 1 Work Experience or Project</li>
            <li>Social Profiles (LinkedIn / GitHub)</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, background: '#F8F9FF', border: '1.5px solid #E8EDF8', borderRadius: 10, padding: '10px 0', fontSize: 13, color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Maybe Later
          </button>
          <button
            onClick={onGoComplete}
            style={{ flex: 2, background: 'linear-gradient(135deg,#D62B2B,#1C3FA8)', border: 'none', borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Complete My Profile →
          </button>
        </div>

        <style>{`
          @keyframes popIn {
            from { transform: scale(0.88); opacity: 0; }
            to   { transform: scale(1);    opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

// ─── Score Badge (shown in header when score < 85) ────────────────────────────
function ScoreWarningBadge({ score, onClick }: { score: number; onClick: () => void }) {
  if (score >= 50) return null;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: '#FFF5F5', border: '1.5px solid #FECDD3',
        borderRadius: 20, padding: '4px 12px',
        fontSize: 12, fontWeight: 600, color: '#D62B2B',
        cursor: 'pointer', fontFamily: 'inherit',
        animation: 'pulse 2s infinite',
      }}
    >
      ⚠️ Profile {score}% — Complete to unlock Recruiter Section
      <style>{`
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(214,43,43,0.25); }
          50%      { box-shadow: 0 0 0 5px rgba(214,43,43,0); }
        }
      `}</style>
    </button>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function JoineeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<JoineeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<ExtendedSection>('overview');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [showScoreGate, setShowScoreGate] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: GET /api/profile/me — Headers: { Authorization: "Bearer <token>" }
    getProfile()
      .then((p) => setProfile(p))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load profile.')
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);

  const handleLogout = async () => {
    // TODO: POST /api/auth/logout — then clear token
    await logout();
    navigate('/login', { replace: true });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setPhotoUploading(true);
    try {
      // TODO: POST /api/profile/photo — multipart/form-data with file
      const res = await uploadProfilePhoto(file);
      setProfile((p) => (p ? { ...p, profilePhoto: res.profilePhoto } : p));
    } catch (err) {
      console.error('Photo upload failed:', err);
    } finally {
      setPhotoUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const updateProfile = (updated: JoineeProfile) => setProfile(updated);

  // ── Compute profile score ──────────────────────────────────────────────────
  // TODO: Ideally receive this from GET /api/profile/me → profile.completionScore
  // Below is a local approximation matching backend logic.
  const computeScore = (p: JoineeProfile | null): number => {
    if (!p) return 0;
    let score = 0;
    if (p.firstName && p.lastName) score += 10; // Basic name
    if (p.phone) score += 10; // Phone
    if (p.dateOfBirth) score += 5;  // DOB
    if (p.gender) score += 5;  // Gender
    if (p.summary && p.summary.length > 50) score += 15; // Summary
    if (p.city || p.state) score += 5;  // Address
    if (p.education && p.education.length > 0) score += 15; // Education
    if (p.skills && p.skills.length >= 3) score += 10; // Skills
    if (p.workExperience && p.workExperience.length > 0) score += 10; // Work exp
    if (p.projects && p.projects.length > 0) score += 10; // Projects
    if (p.linkedIn || p.github) score += 5;  // Social
    return Math.min(score, 100);
  };

  const profileScore = computeScore(profile);
  const canAccessRecruiter = profileScore >= 50;

  // ── Handle recruiter section click ────────────────────────────────────────
  const handleSectionSelect = (section: ExtendedSection) => {
    if (section === 'recruiter' && !canAccessRecruiter) {
      setShowScoreGate(true);
      return;
    }
    setActiveSection(section);
  };

  // ─── Loading ───────────────────────────────────────────────────────────────
 if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p className="text-gray-500 text-sm">Loading your profile…</p>
        </div>
      </div>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <p className="text-5xl mb-4">⚠️</p>
          <h1 className="text-lg font-bold text-gray-900 dark:text-slate-100">Failed to load profile</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─── Section renderer ──────────────────────────────────────────────────────
  const renderSection = () => {
    if (!profile) return null;

    // Recruiter panel
    if (activeSection === 'recruiter') {
      return <RecruiterPanel profile={profile} />;
    }

    switch (activeSection as Section) {
      case 'overview':
        return <Overview profile={profile} />;
      case 'basic':
        return <BasicDetailsForm profile={profile} onUpdate={updateProfile} />;
      case 'summary':
        return <SummaryForm profile={profile} onUpdate={updateProfile} />;
      case 'address':
        return <AddressForm profile={profile} onUpdate={updateProfile} />;
      case 'education':
        return (
          <EducationSection
            items={profile.education ?? []}
            onChange={(ed) => setProfile((p) => (p ? { ...p, education: ed } : p))}
          />
        );
      case 'work':
        return (
          <WorkExpSection
            items={profile.workExperience ?? []}
            onChange={(we) => setProfile((p) => (p ? { ...p, workExperience: we } : p))}
          />
        );
      case 'skills':
        return <SkillsSection profile={profile} onUpdate={updateProfile} />;
      case 'projects':
        return (
          <ProjectsSection
            items={profile.projects ?? []}
            onChange={(pr) => setProfile((p) => (p ? { ...p, projects: pr } : p))}
          />
        );
      case 'social':
        return <SocialProfilesForm profile={profile} onUpdate={updateProfile} />;
      case 'resume':
        return <ResumeSection profile={profile} onUpdate={updateProfile} />;
    }
  };

  const SECTION_LABELS: Record<ExtendedSection, string> = {
    overview: 'Overview',
    basic: 'Basic Details',
    summary: 'Summary',
    address: 'Address',
    education: 'Education',
    work: 'Work Experience',
    skills: 'Skills',
    projects: 'Projects',
    social: 'Social Profiles',
    resume: 'Resume',
    recruiter: 'Recruiter Section',
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
   <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Enhanced Sidebar with Recruiter Section ── */}
      <EnhancedSidebar
        profile={profile}
        activeSection={activeSection}
        onSelect={handleSectionSelect}
        onPhotoClick={() => photoInputRef.current?.click()}
        profileScore={profileScore}
        canAccessRecruiter={canAccessRecruiter}
      />

      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 px-6 py-3.5 flex items-center justify-between shrink-0" style={{ gap: 12 }}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-400 dark:text-slate-400">Dashboard</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300">
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">
              {SECTION_LABELS[activeSection]}
            </span>
            {/* Recruiter badge in breadcrumb */}
            {activeSection === 'recruiter' && (
              <span style={{ fontSize: 10, background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>
                ✓ Live to Recruiters
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            {/* Score warning badge — pulses when below 85 */}
            <ScoreWarningBadge score={profileScore} onClick={() => setShowScoreGate(true)} />

            {photoUploading && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <svg className="animate-spin w-3 h-3 text-red-500" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Uploading photo…
              </div>
            )}
            <span className="text-xs text-gray-400">{user?.email}</span>
            <div className="w-px h-4 bg-gray-200" />
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Content panel */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto p-6 lg:p-8 dark:bg-slate-900"
          key={activeSection}
          style={{ animation: 'fadeIn 0.22s ease' }}
        >
          <div className="max-w-3xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>

      {/* ── Profile Score Gate Modal ── */}
      {showScoreGate && (
        <ProfileScoreGate
          score={profileScore}
          onClose={() => setShowScoreGate(false)}
          onGoComplete={() => {
            setShowScoreGate(false);
            // Navigate to whichever section needs most work
            setActiveSection('basic');
          }}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Enhanced Sidebar ─────────────────────────────────────────────────────────
// Wraps your existing Sidebar and adds the Recruiter Section item below.
function EnhancedSidebar({
  profile,
  activeSection,
  onSelect,
  onPhotoClick,
  profileScore,
  canAccessRecruiter,
}: {
  profile: JoineeProfile | null;
  activeSection: ExtendedSection;
  onSelect: (s: ExtendedSection) => void;
  onPhotoClick: () => void;
  profileScore: number;
  canAccessRecruiter: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 240, flexShrink: 0 }}>
      {/* Existing sidebar (handles all original sections) */}
      <Sidebar
        profile={profile}
        activeSection={activeSection === 'recruiter' ? 'overview' : (activeSection as Section)}
        onSelect={(s) => onSelect(s as ExtendedSection)}
        onPhotoClick={onPhotoClick}
      />

      {/* ── Recruiter Section entry — injected at bottom of sidebar ── */}
      {/* NOTE: If your Sidebar renders a fixed-height list you may need to
           position this as an absolute footer inside the sidebar container.
           Alternatively, add this item directly inside your Sidebar component. */}
      <div style={{
        background: '#0D1B3E',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '12px 10px',
        marginTop: 'auto',
      }}>
        <button
          onClick={() => onSelect('recruiter')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 10,
            border: activeSection === 'recruiter' ? '1.5px solid rgba(255,255,255,0.2)' : '1.5px solid transparent',
            background: activeSection === 'recruiter'
              ? 'linear-gradient(135deg,rgba(214,43,43,0.3),rgba(28,63,168,0.3))'
              : canAccessRecruiter
                ? 'rgba(34,197,94,0.12)'
                : 'rgba(214,43,43,0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
            position: 'relative',
          }}
        >
          {/* Icon */}
          <span style={{ fontSize: 18, flexShrink: 0 }}>
            {canAccessRecruiter ? '📋' : '🔒'}
          </span>

          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
              Recruiter Section
            </div>
            <div style={{ fontSize: 10, color: canAccessRecruiter ? '#86EFAC' : '#FCA5A5', marginTop: 1 }}>
              {canAccessRecruiter ? '✓ Your resume is live' : `Needs ${50 - profileScore}% more`}
            </div>
          </div>

          {/* Score pill */}
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: canAccessRecruiter ? '#16A34A' : '#D62B2B',
            background: canAccessRecruiter ? '#F0FDF4' : '#FFF5F5',
            border: `1px solid ${canAccessRecruiter ? '#BBF7D0' : '#FECDD3'}`,
            borderRadius: 20,
            padding: '2px 7px',
            flexShrink: 0,
          }}>
            {profileScore}%
          </span>
        </button>

        {/* Mini progress bar */}
        {!canAccessRecruiter && (
          <div style={{ marginTop: 8, padding: '0 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Profile Score</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>50% needed</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(profileScore / 50) * 100}%`,
                background: 'linear-gradient(90deg,#D62B2B,#F59E0B)',
                borderRadius: 99,
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
