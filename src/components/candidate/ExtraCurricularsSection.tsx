// import { useState } from 'react';
// import Modal from '../ui/Modal';
// import FormField from '../ui/FormField';
// import { addExtraCurricular, updateExtraCurricular, deleteExtraCurricular } from '../../services/joinee.service';
// import type { ExtraCurricular } from '../../types/joinee.types';

// const empty = (): ExtraCurricular => ({ activity: '', description: '', achievement: '' });

// interface ExtraCurricularsSectionProps {
//   items: ExtraCurricular[];
//   onChange: (items: ExtraCurricular[]) => void;
// }

// export default function ExtraCurricularsSection({ items, onChange }: ExtraCurricularsSectionProps) {
//   const [showModal, setShowModal] = useState(false);
//   const [editing, setEditing] = useState<ExtraCurricular | null>(null);
//   const [form, setForm] = useState<ExtraCurricular>(empty());
//   const [loading, setLoading] = useState(false);
//   const [deleting, setDeleting] = useState<string | null>(null);

//   const f = (field: keyof ExtraCurricular, val: string) => setForm((p) => ({ ...p, [field]: val }));
//   const openAdd = () => { setEditing(null); setForm(empty()); setShowModal(true); };
//   const openEdit = (item: ExtraCurricular) => { setEditing(item); setForm({ ...item }); setShowModal(true); };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const updated = editing?._id ? await updateExtraCurricular(editing._id, form) : await addExtraCurricular(form);
//       onChange(updated);
//       setShowModal(false);
//     } catch { /* */ } finally { setLoading(false); }
//   };

//   const handleDelete = async (id: string) => {
//     setDeleting(id);
//     try { onChange(await deleteExtraCurricular(id)); } catch { /* */ } finally { setDeleting(null); }
//   };

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-gray-900">Extra-Curricular Activities</h2>
//           <p className="text-sm text-gray-500 mt-0.5">Sports, music, arts, hobbies and other interests</p>
//         </div>
//         <button onClick={openAdd} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5">
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
//           Add
//         </button>
//       </div>

//       {items.length === 0 ? (
//         <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-2xl">
//           <p className="text-3xl mb-2">⚡</p>
//           <p className="text-gray-500 text-sm">No extra-curricular activities yet.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           {items.map((item) => (
//             <div key={item._id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex items-start justify-between gap-2">
//                 <div>
//                   <p className="font-semibold text-gray-900">{item.activity || '—'}</p>
//                   {item.achievement && (
//                     <span className="inline-block mt-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-lg">{item.achievement}</span>
//                   )}
//                   {item.description && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{item.description}</p>}
//                 </div>
//                 <div className="flex gap-1.5 shrink-0">
//                   <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
//                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
//                   </button>
//                   <button onClick={() => item._id && handleDelete(item._id)} disabled={deleting === item._id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
//                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Activity' : 'Add Activity'} size="sm">
//         <div className="space-y-4">
//           <FormField label="Activity" value={form.activity ?? ''} onChange={(e) => f('activity', (e.target as HTMLInputElement).value)} placeholder="Football, Guitar, Debate…" required />
//           <FormField label="Achievement" value={form.achievement ?? ''} onChange={(e) => f('achievement', (e.target as HTMLInputElement).value)} placeholder="District champion, Grade A…" />
//           <FormField as="textarea" label="Description" value={form.description ?? ''} onChange={(e) => f('description', (e.target as HTMLTextAreaElement).value)} placeholder="More details…" rows={3} />
//           <div className="flex justify-end gap-3 pt-2">
//             <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 font-medium">Cancel</button>
//             <button onClick={handleSave} disabled={loading} className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl disabled:bg-red-300">
//               {loading ? 'Saving…' : editing ? 'Update' : 'Add'}
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }
