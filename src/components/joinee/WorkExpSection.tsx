import { useState } from 'react';
import Modal from '../ui/Modal';
import FormField from '../ui/FormField';
import { addWorkExperience, updateWorkExperience, deleteWorkExperience } from '../../services/joinee.service';
import type { WorkExperience } from '../../types/joinee.types';

const TYPE_LABELS: Record<string, string> = {
  internship: '🧪 Internship', 'full-time': '💼 Full-time',
  'part-time': '⏰ Part-time', freelance: '🔧 Freelance',
};

const empty = (): WorkExperience => ({
  company: '', role: '', description: '', startDate: '', endDate: '',
  isCurrentlyWorking: false, type: 'internship',
});

interface WorkExpSectionProps {
  items: WorkExperience[];
  onChange: (items: WorkExperience[]) => void;
}

export default function WorkExpSection({ items, onChange }: WorkExpSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<WorkExperience | null>(null);
  const [form, setForm] = useState<WorkExperience>(empty());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const f = (field: keyof WorkExperience, val: string | boolean) =>
    setForm((p) => ({ ...p, [field]: val }));

  const openAdd = () => { setEditing(null); setForm(empty()); setShowModal(true); };
  const openEdit = (item: WorkExperience) => { setEditing(item); setForm({ ...item }); setShowModal(true); };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = editing?._id
        ? await updateWorkExperience(editing._id, form)
        : await addWorkExperience(form);
      onChange(updated);
      setShowModal(false);
    } catch { /* handled */ }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try { onChange(await deleteWorkExperience(id)); } catch { /* */ }
    finally { setDeleting(null); }
  };

  const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
          <p className="text-sm text-gray-500 mt-0.5">Internships, jobs and freelance work</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
          Add
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-3xl mb-2">💼</p>
          <p className="text-gray-500 text-sm">No work experience yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((exp) => (
            <div key={exp._id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{exp.role || '—'}</p>
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-lg font-medium">
                      {TYPE_LABELS[exp.type ?? 'internship'] ?? exp.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{exp.company}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {fmtDate(exp.startDate)} – {exp.isCurrentlyWorking ? 'Present' : fmtDate(exp.endDate)}
                  </p>
                  {exp.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{exp.description}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(exp)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => exp._id && handleDelete(exp._id)} disabled={deleting === exp._id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Work Experience' : 'Add Work Experience'} size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Company" value={form.company ?? ''} onChange={(e) => f('company', (e.target as HTMLInputElement).value)} placeholder="Google, Startup…" />
            <FormField label="Role / Position" value={form.role ?? ''} onChange={(e) => f('role', (e.target as HTMLInputElement).value)} placeholder="Software Intern" />
          </div>
          <FormField as="select" label="Type" value={form.type ?? 'internship'} onChange={(e) => f('type', (e.target as HTMLSelectElement).value)}>
            <option value="internship">Internship</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="freelance">Freelance</option>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date" type="date" value={form.startDate?.slice(0,10) ?? ''} onChange={(e) => f('startDate', (e.target as HTMLInputElement).value)} />
            <FormField label="End Date" type="date" value={form.endDate?.slice(0,10) ?? ''} onChange={(e) => f('endDate', (e.target as HTMLInputElement).value)} disabled={form.isCurrentlyWorking} />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" checked={form.isCurrentlyWorking ?? false} onChange={(e) => f('isCurrentlyWorking', e.target.checked)} className="w-4 h-4 accent-red-500" />
            <span className="text-sm text-gray-700">Currently working here</span>
          </label>
          <FormField as="textarea" label="Description" value={form.description ?? ''} onChange={(e) => f('description', (e.target as HTMLTextAreaElement).value)} placeholder="Describe your responsibilities…" rows={4} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
            <button onClick={handleSave} disabled={loading} className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:bg-red-300">
              {loading ? 'Saving…' : editing ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
