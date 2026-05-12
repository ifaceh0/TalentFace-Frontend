import { useState } from 'react';
import Modal from '../ui/Modal';
import FormField from '../ui/FormField';
import TagInput from '../ui/TagInput';
import { addProject, updateProject, deleteProject } from '../../services/joinee.service';
import type { Project } from '../../types/joinee.types';

const empty = (): Project => ({ title: '', description: '', techStack: [], link: '', startDate: '', endDate: '', isOngoing: false });

interface ProjectsSectionProps {
  items: Project[];
  onChange: (items: Project[]) => void;
}

export default function ProjectsSection({ items, onChange }: ProjectsSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Project>(empty());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const f = (field: keyof Project, val: string | boolean | string[]) =>
    setForm((p) => ({ ...p, [field]: val }));

  const openAdd = () => { setEditing(null); setForm(empty()); setShowModal(true); };
  const openEdit = (item: Project) => { setEditing(item); setForm({ ...item }); setShowModal(true); };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = editing?._id
        ? await updateProject(editing._id, form)
        : await addProject(form);
      onChange(updated);
      setShowModal(false);
    } catch { /* */ }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try { onChange(await deleteProject(id)); } catch { /* */ }
    finally { setDeleting(null); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Projects</h2>
          <p className="text-sm text-gray-500 mt-0.5">Showcase what you've built</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
          Add
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-3xl mb-2">🚀</p>
          <p className="text-gray-500 text-sm">No projects yet. Add your first project!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((proj) => (
            <div key={proj._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{proj.title || '—'}</p>
                    {proj.isOngoing && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-lg">Ongoing</span>}
                  </div>
                  {proj.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{proj.description}</p>}
                  {(proj.techStack?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {proj.techStack?.map((t) => (
                        <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">{t}</span>
                      ))}
                    </div>
                  )}
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 hover:underline">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      View Project
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(proj)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => proj._id && handleDelete(proj._id)} disabled={deleting === proj._id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Project' : 'Add Project'} size="lg">
        <div className="space-y-4">
          <FormField label="Project Title" value={form.title ?? ''} onChange={(e) => f('title', (e.target as HTMLInputElement).value)} placeholder="My Awesome App" required />
          <FormField as="textarea" label="Description" value={form.description ?? ''} onChange={(e) => f('description', (e.target as HTMLTextAreaElement).value)} placeholder="What does this project do?" rows={3} />
          <TagInput label="Tech Stack" tags={form.techStack ?? []} onChange={(tags) => f('techStack', tags)} placeholder="React, Node.js, MongoDB…" />
          <FormField label="Project Link (URL)" type="url" value={form.link ?? ''} onChange={(e) => f('link', (e.target as HTMLInputElement).value)} placeholder="https://github.com/…" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date" type="date" value={form.startDate?.slice(0,10) ?? ''} onChange={(e) => f('startDate', (e.target as HTMLInputElement).value)} />
            <FormField label="End Date" type="date" value={form.endDate?.slice(0,10) ?? ''} onChange={(e) => f('endDate', (e.target as HTMLInputElement).value)} disabled={form.isOngoing} />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" checked={form.isOngoing ?? false} onChange={(e) => f('isOngoing', e.target.checked)} className="w-4 h-4 accent-red-500" />
            <span className="text-sm text-gray-700">This project is ongoing</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
            <button onClick={handleSave} disabled={loading} className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl disabled:bg-red-300">
              {loading ? 'Saving…' : editing ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
