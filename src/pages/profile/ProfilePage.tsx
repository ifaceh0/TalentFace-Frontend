import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';

interface RecruiterProfile {
  companyName?: string;
  companyWebsite?: string;
  designation?: string;
  phone?: string;
  bio?: string;
}

const STORAGE_KEY = 'recruiter_profile';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<RecruiterProfile>({});
  const [tab, setTab] = useState<'overview' | 'company' | 'edit'>('overview');

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setProfile(JSON.parse(raw));
  }, []);

  const save = (next: RecruiterProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setProfile(next);
    setTab('overview');
  };

  if (!user) return <div>Loading...</div>;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-4xl px-4 pb-10 sm:px-6 lg:px-8 space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-blue-600 px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-2xl font-semibold text-white">
                {initials}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-blue-100">Recruiter profile</p>
                <h1 className="mt-1 text-2xl font-semibold text-white">{user.name}</h1>
                <p className="text-sm text-blue-100/90">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setTab('edit')}
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
            >
              Edit profile
            </button>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-slate-200">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Role" value="Recruiter" />
            <StatCard label="Company" value={profile.companyName || '—'} />
            <StatCard label="Status" value="Active" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Profile sections</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Manage details</h2>
          </div>
          <p className="text-sm text-slate-500">Fast access to your recruiter profile and company settings.</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
            <TabButton active={tab === 'overview'} onClick={() => setTab('overview')}>Overview</TabButton>
            <TabButton active={tab === 'company'} onClick={() => setTab('company')}>Company</TabButton>
            <TabButton active={tab === 'edit'} onClick={() => setTab('edit')}>Edit</TabButton>
          </div>

          {tab === 'overview' && (
            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard label="Name" value={user.name} />
                <InfoCard label="Email" value={user.email} />
                <InfoCard label="Designation" value={profile.designation || '—'} />
                <InfoCard label="Phone" value={profile.phone || '—'} />
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900">Recruiter summary</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{profile.bio || 'No summary available. Add a short bio to let candidates know more about your hiring approach and company values.'}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <ActionButton label="View job postings" variant="solid" />
                <ActionButton label="Manage integrations" variant="outline" />
              </div>
            </div>
          )}

          {tab === 'company' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Company" value={profile.companyName || '—'} />
              <DetailRow label="Website" value={profile.companyWebsite || '—'} />
            </div>
          )}

          {tab === 'edit' && (
            <ProfileEditor initial={profile} onCancel={() => setTab('overview')} onSave={save} />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm">
      <p className="uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ActionButton({ label, variant }: { label: string; variant: 'solid' | 'outline' }) {
  return (
    <button
      className={`w-full rounded-3xl px-4 py-3 text-sm font-semibold transition ${variant === 'solid' ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
    >
      {label}
    </button>
  );
}

function ProfileEditor({ initial, onSave, onCancel }: { initial: RecruiterProfile; onSave: (p: RecruiterProfile) => void; onCancel: () => void }) {
  const [form, setForm] = useState<RecruiterProfile>(initial || {});

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={form.companyName || ''}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          placeholder="Company name"
          className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
        />
        <input
          value={form.companyWebsite || ''}
          onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })}
          placeholder="Company website"
          className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={form.designation || ''}
          onChange={(e) => setForm({ ...form, designation: e.target.value })}
          placeholder="Designation"
          className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
        />
        <input
          value={form.phone || ''}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone"
          className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
        />
      </div>
      <textarea
        value={form.bio || ''}
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
        placeholder="Short bio"
        className="min-h-[120px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          className="w-full rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          onClick={() => onSave(form)}
        >
          Save changes
        </button>
        <button
          className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
