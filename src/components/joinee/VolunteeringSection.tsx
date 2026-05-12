import { useState } from 'react';
import Modal from '../ui/Modal';
import FormField from '../ui/FormField';
import { addVolunteering, updateVolunteering, deleteVolunteering } from '../../services/joinee.service';
import type { Volunteering } from '../../types/joinee.types';

const empty = (): Volunteering => ({ organization: '', role: '', description: '', startDate: '', endDate: '', isOngoing: false });

interface VolunteeringSectionProps {
  items: Volunteering[];
  onChange: (items: Volunteering[]) => void;
}

export default function VolunteeringSection({ items, onChange }: VolunteeringSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Volunteering | null>(null);
  const [form, setForm] = useState<Volunteering>(empty());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const f = (field: keyof Volunteering, val: string | boolean) => setForm((p) => ({ ...p, [field]: val }));
  const openAdd = () => { setEditing(null); setForm(empty()); setShowModal(true); };
  const openEdit = (item: Volunteering) => { setEditing(item); setForm({ ...item }); setShowModal(true); };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = editing?._id ? await updateVolunteering(editing._id, form) : await addVolunteering(form);
      onChange(updated);
      setShowModal(false);
    } catch { /* */ } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try { onChange(await deleteVolunteering(id)); } catch { /* */ } finally { setDeleting(null); }
  };

  const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Volunteering</h2>
          <p className="text-sm text-gray-500 mt-0.5">NGO work, community service, social initiatives</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
          Add
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-3xl mb-2">🤝</p>
          <p className="text-gray-500 text-sm">No volunteering records yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{item.role || '—'}</p>
                  <p className="text-sm text-gray-600">{item.organization}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{fmtDate(item.startDate)} – {item.isOngoing ? 'Present' : fmtDate(item.endDate)}</p>
                  {item.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.description}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => item._id && handleDelete(item._id)} disabled={deleting === item._id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Volunteering' : 'Add Volunteering'}>
        <div className="space-y-4">
          <FormField label="Organization" value={form.organization ?? ''} onChange={(e) => f('organization', (e.target as HTMLInputElement).value)} placeholder="NGO / Community name" required />
          <FormField label="Role" value={form.role ?? ''} onChange={(e) => f('role', (e.target as HTMLInputElement).value)} placeholder="Volunteer, Coordinator…" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date" type="date" value={form.startDate?.slice(0,10) ?? ''} onChange={(e) => f('startDate', (e.target as HTMLInputElement).value)} />
            <FormField label="End Date" type="date" value={form.endDate?.slice(0,10) ?? ''} onChange={(e) => f('endDate', (e.target as HTMLInputElement).value)} disabled={form.isOngoing} />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.isOngoing ?? false} onChange={(e) => f('isOngoing', e.target.checked)} className="w-4 h-4 accent-red-500" />
            <span className="text-sm text-gray-700">Currently volunteering</span>
          </label>
          <FormField as="textarea" label="Description" value={form.description ?? ''} onChange={(e) => f('description', (e.target as HTMLTextAreaElement).value)} placeholder="What did you do?" rows={3} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 font-medium">Cancel</button>
            <button onClick={handleSave} disabled={loading} className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl disabled:bg-red-300">
              {loading ? 'Saving…' : editing ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
