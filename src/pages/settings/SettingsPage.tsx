import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { applyFontSize, loadUserSettings, saveUserSettings, type UserSettings } from '../../utils/settings';

type FontSizeOption = 'small' | 'medium' | 'large';

export default function SettingsPage() {
  const { user } = useAuth();
  const [fontSize, setFontSize] = useState<FontSizeOption>('medium');
  const [profilesPerPage, setProfilesPerPage] = useState<number>(10);

  useEffect(() => {
    const settings = loadUserSettings(user?._id);
    setFontSize(settings.fontSize);
    setProfilesPerPage(settings.profilesPerPage);
    applyFontSize(settings.fontSize);
  }, [user]);

  useEffect(() => {
    const settings: UserSettings = { fontSize, profilesPerPage };
    saveUserSettings(settings, user?._id);
    applyFontSize(fontSize);
  }, [fontSize, profilesPerPage, user]);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 sm:px-6 lg:px-8 text-slate-900">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-blue-600 px-6 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-blue-100">Configuration</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Settings</h1>
            <p className="mt-2 max-w-2xl text-sm text-blue-100/90">Control the interface density and review workflow with a polished recruiter experience.</p>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <SectionCard title="Font size" subtitle="Set the content density for a compact layout." className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="grid grid-cols-3 gap-3">
              <ChoiceButton active={fontSize === 'small'} label="Small" onClick={() => setFontSize('small')} />
              <ChoiceButton active={fontSize === 'medium'} label="Medium" onClick={() => setFontSize('medium')} />
              <ChoiceButton active={fontSize === 'large'} label="Large" onClick={() => setFontSize('large')} />
            </div>
          </SectionCard>

          <SectionCard title="Profiles per review list" subtitle="How many candidate cards load per page." className="rounded-3xl border border-slate-200 bg-slate-50 p-5 gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="number"
                value={profilesPerPage}
                min={1}
                max={100}
                onChange={(e) => setProfilesPerPage(Number(e.target.value))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
              />
              <span className="text-slate-500">Use smaller values to keep pages compact and focused.</span>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className ?? ''}>
      <div className="mb-4">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function ChoiceButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-3xl border px-4 py-3 text-sm font-semibold transition ${active ? 'border-blue-600 bg-blue-600 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50'}`}
    >
      {label}
    </button>
  );
}
