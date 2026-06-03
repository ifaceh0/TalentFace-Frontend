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
    <div className="max-w-5xl">
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="mt-2 text-sm text-gray-600">{profile.bio || 'Recruiter at your company. Add a bio to tell candidates more about yourself.'}</p>
          </div>
          <div>
            <button onClick={() => { setTab('edit'); }} className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:shadow">Edit Profile</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        {/* Tabs */}
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          <TabButton active={tab === 'overview'} onClick={() => { setTab('overview'); }}>Overview</TabButton>
          <TabButton active={tab === 'company'} onClick={() => { setTab('company'); }}>Company</TabButton>
          <TabButton active={tab === 'edit'} onClick={() => { setTab('edit'); }}>Edit</TabButton>
        </div>

        {/* Content */}
        <div className="p-6">
          {tab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-3">Recruiter Summary</h3>
                <p className="text-sm text-gray-700">{profile.bio || 'No summary available.'}</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard label="Name" value={user.name} />
                  <InfoCard label="Email" value={user.email} />
                  <InfoCard label="Designation" value={profile.designation || '—'} />
                  <InfoCard label="Phone" value={profile.phone || '—'} />
                </div>
              </div>

              <div className="md:col-span-1">
                <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                <div className="flex flex-col gap-3">
                  <button className="px-3 py-2 bg-red-50 text-red-700 border rounded">View your postings</button>
                  <button className="px-3 py-2 bg-gray-50 border rounded">Manage integrations</button>
                </div>
              </div>
            </div>
          )}

          {tab === 'company' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Company Details</h3>
              <p className="text-sm"><strong>Company:</strong> {profile.companyName || '—'}</p>
              <p className="text-sm"><strong>Website:</strong> {profile.companyWebsite || '—'}</p>
            </div>
          )}

          {tab === 'edit' && (
            <ProfileEditor initial={profile} onCancel={() => { setTab('overview'); }} onSave={save} />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-t-lg text-sm font-medium ${active ? 'bg-white border-b-2 border-red-500 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
      {children}
    </button>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg border bg-gray-50">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

function ProfileEditor({ initial, onSave, onCancel }: { initial: RecruiterProfile; onSave: (p: RecruiterProfile) => void; onCancel: () => void; }) {
  const [form, setForm] = useState<RecruiterProfile>(initial || {});

  return (
    <div className="grid gap-3">
      <input value={form.companyName || ''} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="Company name" className="border p-2 rounded" />
      <input value={form.companyWebsite || ''} onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })} placeholder="Company website" className="border p-2 rounded" />
      <input value={form.designation || ''} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="Designation" className="border p-2 rounded" />
      <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="border p-2 rounded" />
      <textarea value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Short bio" className="border p-2 rounded h-28" />
      <div className="flex gap-2 mt-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => onSave(form)}>Save</button>
        <button className="px-3 py-2 border rounded" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
