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

export default function JoineeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<JoineeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProfile()
      .then((p) => setProfile(p))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load profile.')
      )
      .finally(() => setLoading(false));
  }, []);

  // Scroll to top on section change
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file || !profile) return;
  //   setPhotoUploading(true);
  //   try {
  //     const res = await uploadProfilePhoto(file);
  //     setProfile((p) => (p ? { ...p, profilePhoto: res.profilePhoto } : p));
  //   } catch { /* silent */ }
  //   finally { setPhotoUploading(false); }
  // };
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setPhotoUploading(true);
    try {
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

  // ─── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
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

  // ─── Error ──────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <p className="text-5xl mb-4">⚠️</p>
          <h1 className="text-lg font-bold text-gray-900">Failed to load profile</h1>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
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

  // ─── Section Router ──────────────────────────────────────────────────────────

  const renderSection = () => {
    if (!profile) return null;
    switch (activeSection) {
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

  const SECTION_LABELS: Record<Section, string> = {
    overview: 'Overview',
    basic:    'Basic Details',
    summary:  'Summary',
    address:  'Address',
    education:'Education',
    work:     'Work Experience',
    skills:   'Skills',
    projects: 'Projects',
    social:   'Social Profiles',
    resume:   'Resume',
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <Sidebar
        profile={profile}
        activeSection={activeSection}
        onSelect={setActiveSection}
        onPhotoClick={() => photoInputRef.current?.click()}
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-400">Dashboard</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300">
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="text-sm font-semibold text-gray-800">
              {SECTION_LABELS[activeSection]}
            </span>
          </div>

          <div className="flex items-center gap-4">
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
          className="flex-1 overflow-y-auto p-6 lg:p-8"
          key={activeSection}
          style={{ animation: 'fadeIn 0.22s ease' }}
        >
          <div className="max-w-3xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
