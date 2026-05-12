import { useState } from 'react';
import Modal from '../ui/Modal';
import FormField from '../ui/FormField';
import {
  addEducation, updateEducation, deleteEducation,
} from '../../services/joinee.service';
import type { Education } from '../../types/joinee.types';

interface EducationSectionProps {
  items: Education[];
  onChange: (items: Education[]) => void;
}

const empty = (): Education => ({
  degree: '', institution: '', board: '', startYear: undefined, endYear: undefined,
  percentage: undefined, cgpa: undefined, isCurrentlyStudying: false,
});

export default function EducationSection({ items, onChange }: EducationSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState<Education>(empty());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const openAdd = () => { setEditing(null); setForm(empty()); setShowModal(true); };
  const openEdit = (item: Education) => { setEditing(item); setForm({ ...item }); setShowModal(true); };

  const f = (field: keyof Education, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setLoading(true);
    try {
      let updated: Education[];
      if (editing?._id) {
        updated = await updateEducation(editing._id, form);
      } else {
        updated = await addEducation(form);
      }
      onChange(updated);
      setShowModal(false);
    } catch { /* errors shown inline via toast */ }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const updated = await deleteEducation(id);
      onChange(updated);
    } catch { /* ignore */ }
    finally { setDeleting(null); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Education</h2>
          <p className="text-sm text-gray-500 mt-0.5">Add your degrees, diplomas and schooling</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
          Add
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-3xl mb-2">🎓</p>
          <p className="text-gray-500 text-sm">No education records yet. Click <strong>Add</strong> to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((edu) => (
            <div key={edu._id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{edu.degree || '—'}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{edu.institution}</p>
                  {edu.board && <p className="text-xs text-gray-400">{edu.board}</p>}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {(edu.startYear || edu.endYear) && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                        {edu.startYear} – {edu.isCurrentlyStudying ? 'Present' : edu.endYear}
                      </span>
                    )}
                    {edu.percentage != null && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">{edu.percentage}%</span>
                    )}
                    {edu.cgpa != null && (
                      <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg">CGPA {edu.cgpa}</span>
                    )}
                    {edu.isCurrentlyStudying && (
                      <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-lg">Currently Studying</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(edu)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button
                    onClick={() => edu._id && handleDelete(edu._id)}
                    disabled={deleting === edu._id}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Education' : 'Add Education'}
        size="md"
      >
        <div className="space-y-4">
          <FormField label="Degree / Certificate" value={form.degree ?? ''} onChange={(e) => f('degree', (e.target as HTMLInputElement).value)} placeholder="B.Tech / B.Sc / HSC" />
          <FormField label="Institution" value={form.institution ?? ''} onChange={(e) => f('institution', (e.target as HTMLInputElement).value)} placeholder="University / School name" />
          <FormField label="Board / University" value={form.board ?? ''} onChange={(e) => f('board', (e.target as HTMLInputElement).value)} placeholder="CBSE / Anna University" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Year" type="number" value={form.startYear ?? ''} onChange={(e) => f('startYear', Number((e.target as HTMLInputElement).value))} placeholder="2020" />
            <FormField label="End Year" type="number" value={form.isCurrentlyStudying ? '' : (form.endYear ?? '')} onChange={(e) => f('endYear', Number((e.target as HTMLInputElement).value))} placeholder="2024" disabled={form.isCurrentlyStudying} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Percentage (%)" type="number" value={form.percentage ?? ''} onChange={(e) => f('percentage', Number((e.target as HTMLInputElement).value))} placeholder="85.5" />
            <FormField label="CGPA" type="number" value={form.cgpa ?? ''} onChange={(e) => f('cgpa', Number((e.target as HTMLInputElement).value))} placeholder="8.5" />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isCurrentlyStudying ?? false}
              onChange={(e) => f('isCurrentlyStudying', e.target.checked)}
              className="w-4 h-4 rounded text-red-500 accent-red-500"
            />
            <span className="text-sm text-gray-700">Currently studying here</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:bg-red-300"
            >
              {loading ? 'Saving…' : editing ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
