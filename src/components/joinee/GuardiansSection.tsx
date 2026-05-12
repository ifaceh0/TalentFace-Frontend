import { useState } from 'react';
import Modal from '../ui/Modal';
import FormField from '../ui/FormField';
import { addGuardian, updateGuardian, deleteGuardian } from '../../services/joinee.service';
import type { Guardian } from '../../types/joinee.types';

const empty = (): Guardian => ({ name: '', relation: '', phone: '', email: '', occupation: '' });

interface GuardiansSectionProps {
  items: Guardian[];
  onChange: (items: Guardian[]) => void;
}

export default function GuardiansSection({ items, onChange }: GuardiansSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Guardian | null>(null);
  const [form, setForm] = useState<Guardian>(empty());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const f = (field: keyof Guardian, val: string) => setForm((p) => ({ ...p, [field]: val }));
  const openAdd = () => { setEditing(null); setForm(empty()); setShowModal(true); };
  const openEdit = (item: Guardian) => { setEditing(item); setForm({ ...item }); setShowModal(true); };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = editing?._id ? await updateGuardian(editing._id, form) : await addGuardian(form);
      onChange(updated);
      setShowModal(false);
    } catch { /* */ } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try { onChange(await deleteGuardian(id)); } catch { /* */ } finally { setDeleting(null); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Guardians</h2>
          <p className="text-sm text-gray-500 mt-0.5">Parent or guardian contact information</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
          Add
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-3xl mb-2">👨‍👩‍👦</p>
          <p className="text-gray-500 text-sm">No guardian contacts added.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-sm font-bold text-red-500">
                      {item.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.relation}</p>
                    </div>
                  </div>
                  <div className="mt-2.5 space-y-1">
                    {item.phone && <p className="text-xs text-gray-600 flex items-center gap-1.5">📞 {item.phone}</p>}
                    {item.email && <p className="text-xs text-gray-600 flex items-center gap-1.5">✉️ {item.email}</p>}
                    {item.occupation && <p className="text-xs text-gray-600 flex items-center gap-1.5">💼 {item.occupation}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => item._id && handleDelete(item._id)} disabled={deleting === item._id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Guardian' : 'Add Guardian'} size="sm">
        <div className="space-y-4">
          <FormField label="Full Name" value={form.name ?? ''} onChange={(e) => f('name', (e.target as HTMLInputElement).value)} placeholder="Guardian's name" required />
          <FormField label="Relation" value={form.relation ?? ''} onChange={(e) => f('relation', (e.target as HTMLInputElement).value)} placeholder="Father, Mother, Uncle…" />
          <FormField label="Phone" type="tel" value={form.phone ?? ''} onChange={(e) => f('phone', (e.target as HTMLInputElement).value)} placeholder="+91 98765 43210" />
          <FormField label="Email" type="email" value={form.email ?? ''} onChange={(e) => f('email', (e.target as HTMLInputElement).value)} placeholder="guardian@email.com" />
          <FormField label="Occupation" value={form.occupation ?? ''} onChange={(e) => f('occupation', (e.target as HTMLInputElement).value)} placeholder="Engineer, Teacher…" />
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
