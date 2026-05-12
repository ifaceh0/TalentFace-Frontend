import { useState } from 'react';
import Modal from '../ui/Modal';
import FormField from '../ui/FormField';
import { addAccomplishment, updateAccomplishment, deleteAccomplishment } from '../../services/joinee.service';
import type { Accomplishment } from '../../types/joinee.types';

const TYPE_BADGES: Record<string, { label: string; color: string }> = {
  award:        { label: '🏆 Award',        color: 'bg-yellow-50 text-yellow-700' },
  certification:{ label: '📜 Certification', color: 'bg-blue-50 text-blue-700' },
  publication:  { label: '📖 Publication',  color: 'bg-purple-50 text-purple-700' },
  patent:       { label: '🔬 Patent',       color: 'bg-teal-50 text-teal-700' },
  competition:  { label: '🥇 Competition',  color: 'bg-orange-50 text-orange-700' },
  other:        { label: '⭐ Other',        color: 'bg-gray-100 text-gray-600' },
};

const empty = (): Accomplishment => ({ type: 'other', title: '', issuer: '', date: '', description: '', link: '' });

interface AccomplishmentsSectionProps {
  items: Accomplishment[];
  onChange: (items: Accomplishment[]) => void;
}

export default function AccomplishmentsSection({ items, onChange }: AccomplishmentsSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Accomplishment | null>(null);
  const [form, setForm] = useState<Accomplishment>(empty());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const f = (field: keyof Accomplishment, val: string) => setForm((p) => ({ ...p, [field]: val }));
  const openAdd = () => { setEditing(null); setForm(empty()); setShowModal(true); };
  const openEdit = (item: Accomplishment) => { setEditing(item); setForm({ ...item }); setShowModal(true); };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = editing?._id
        ? await updateAccomplishment(editing._id, form)
        : await addAccomplishment(form);
      onChange(updated);
      setShowModal(false);
    } catch { /* */ }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try { onChange(await deleteAccomplishment(id)); } catch { /* */ }
    finally { setDeleting(null); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Accomplishments</h2>
          <p className="text-sm text-gray-500 mt-0.5">Awards, certifications, publications and more</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
          Add
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-3xl mb-2">🏆</p>
          <p className="text-gray-500 text-sm">No accomplishments yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const badge = TYPE_BADGES[item.type ?? 'other'];
            return (
              <div key={item._id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${badge.color}`}>{badge.label}</span>
                    </div>
                    <p className="font-semibold text-gray-900 mt-1">{item.title || '—'}</p>
                    {item.issuer && <p className="text-sm text-gray-500">{item.issuer}</p>}
                    {item.date && <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>}
                    {item.link && <a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">View →</a>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => item._id && handleDelete(item._id)} disabled={deleting === item._id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Accomplishment' : 'Add Accomplishment'} size="md">
        <div className="space-y-4">
          <FormField as="select" label="Type" value={form.type ?? 'other'} onChange={(e) => f('type', (e.target as HTMLSelectElement).value)}>
            {Object.keys(TYPE_BADGES).map((t) => <option key={t} value={t}>{TYPE_BADGES[t].label}</option>)}
          </FormField>
          <FormField label="Title" value={form.title ?? ''} onChange={(e) => f('title', (e.target as HTMLInputElement).value)} placeholder="Best Project Award" required />
          <FormField label="Issuer / Organization" value={form.issuer ?? ''} onChange={(e) => f('issuer', (e.target as HTMLInputElement).value)} placeholder="IIT Madras, Google…" />
          <FormField label="Date" type="date" value={form.date?.slice(0,10) ?? ''} onChange={(e) => f('date', (e.target as HTMLInputElement).value)} />
          <FormField as="textarea" label="Description" value={form.description ?? ''} onChange={(e) => f('description', (e.target as HTMLTextAreaElement).value)} placeholder="Brief description…" rows={3} />
          <FormField label="Link / URL" type="url" value={form.link ?? ''} onChange={(e) => f('link', (e.target as HTMLInputElement).value)} placeholder="https://…" />
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
