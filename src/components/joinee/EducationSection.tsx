import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import FormField from '../ui/FormField';
import {
  addEducation, updateEducation, deleteEducation,
  uploadEducationDocuments, deleteEducationDocument,
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
  const [showCurrentlyStudyingConfirm, setShowCurrentlyStudyingConfirm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState<Education>(empty());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [docUploading, setDocUploading] = useState<Record<string, boolean>>({});
  const [docDeleting, setDocDeleting]   = useState<Record<string, boolean>>({});
  const [pendingDocs, setPendingDocs]   = useState<{ degreeCertificate?: File; marksheet?: File }>({});
  useEffect(() => {
    if (editing?._id) {
      const fresh = items.find((e) => e._id === editing._id);
      if (fresh) setEditing(fresh);
    }
  }, [items]);

  const openAdd  = () => { setEditing(null); setForm(empty()); setPendingDocs({}); setShowModal(true); };
 const openEdit = (item: Education) => {
  const latest = items.find((e) => e._id === item._id) ?? item;
  setEditing(latest);
  setForm({ ...latest });
  setShowModal(true);
};

  const f = (field: keyof Education, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async (forceCurrentlyStudying = false) => {
    // ── Guard: only one "currently studying" allowed ──
    if (form.isCurrentlyStudying && !forceCurrentlyStudying) {
      const alreadyExists = items.some(
        (item) => item.isCurrentlyStudying && item._id !== editing?._id
      );
      if (alreadyExists) {
        setShowCurrentlyStudyingConfirm(true);
        return;
      }
    }

    setLoading(true);
    try {
      let updated: Education[];
      if (editing?._id) {
        updated = await updateEducation(editing._id, form);
      } else {
        updated = await addEducation(form);
        // If files were queued during Add, upload them now using the new _id
        if (Object.keys(pendingDocs).length > 0) {
          const newEdu = updated[updated.length - 1]; // backend appends, so last = newest
          if (newEdu._id) {
            updated = await uploadEducationDocuments(newEdu._id, pendingDocs);
          }
        }
      }
      onChange(updated);
      setShowModal(false);
      setShowCurrentlyStudyingConfirm(false);
      setPendingDocs({});
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

  const handleDocUpload = async (field: 'degreeCertificate' | 'marksheet', file: File) => {
    if (!editing?._id) return;
    const key = `${editing._id}_${field}`;
    setDocUploading((prev) => ({ ...prev, [key]: true }));
    try {
      const updated = await uploadEducationDocuments(editing._id, { [field]: file });
      onChange(updated);
      const fresh = updated.find((e) => e._id === editing._id);
      if (fresh) setEditing(fresh);
    } catch { /* toast handled globally */ }
    finally { setDocUploading((prev) => ({ ...prev, [key]: false })); }
  };

  const handleDocDelete = async (field: 'degreeCertificate' | 'marksheet') => {
    if (!editing?._id) return;
    const key = `${editing._id}_${field}`;
    setDocDeleting((prev) => ({ ...prev, [key]: true }));
    try {
      const updated = await deleteEducationDocument(editing._id, field);
      onChange(updated);
      const fresh = updated.find((e) => e._id === editing._id);
      if (fresh) setEditing(fresh);
    } catch { /* toast handled globally */ }
    finally { setDocDeleting((prev) => ({ ...prev, [key]: false })); }
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
            {/* Start Year dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Start Year</label>
              <select
                value={form.startYear ?? ''}
                onChange={(e) => f('startYear', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="">Select year</option>
                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            {/* End Year dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">End Year</label>
              <select
                value={form.isCurrentlyStudying ? '' : (form.endYear ?? '')}
                onChange={(e) => f('endYear', Number(e.target.value))}
                disabled={form.isCurrentlyStudying}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="">Select year</option>
                {Array.from({ length: 54 }, (_, i) => new Date().getFullYear() + 4 - i).map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
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

          {/* ── Document Uploads (always visible) ── */}
          <div className="space-y-3 pt-1">
            <p className="text-sm font-semibold text-gray-700">Documents</p>
            {(['degreeCertificate', 'marksheet'] as const).map((field) => {
              const label = field === 'degreeCertificate' ? 'Degree Certificate' : 'Marksheet / Transcript';
              const isUploading = editing?._id ? docUploading[`${editing._id}_${field}`] : false;
              const isDeleting  = editing?._id ? docDeleting[`${editing._id}_${field}`]  : false;
              const existingUrl = editing?.[field]?.url;
const viewerUrl = existingUrl
  ? `https://docs.google.com/viewer?url=${encodeURIComponent(existingUrl)}&embedded=false&t=${Date.now()}`
  : undefined;
              const pendingFile = pendingDocs[field];

              return (
                <div key={field} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs font-medium text-gray-600">{label}</span>
                    {existingUrl ? (
  
    <a href={viewerUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs text-blue-600 hover:underline truncate"
  >
    View uploaded file ↗
  </a>
                    ) : pendingFile ? (
                      <span className="text-xs text-green-600 truncate">
                        ✓ {pendingFile.name} <span className="text-gray-400">(will upload on save)</span>
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">No file uploaded</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label className={`cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors
                      ${isUploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                      {isUploading ? 'Uploading…' : (existingUrl || pendingFile) ? 'Replace' : 'Upload'}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (editing?._id) {
                            handleDocUpload(field, file);
                          } else {
                            setPendingDocs((prev) => ({ ...prev, [field]: file }));
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>

                    {/* Delete button — edit mode only */}
                    {existingUrl && (
                      <button
                        onClick={() => handleDocDelete(field)}
                        disabled={isDeleting}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                        title="Remove document"
                      >
                        {isDeleting
                          ? <span className="text-xs">…</span>
                          : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14H6L5 6"/>
                              <path d="M10 11v6M14 11v6"/>
                              <path d="M9 6V4h6v2"/>
                            </svg>
                        }
                      </button>
                    )}

                    {/* Clear queued file — add mode only */}
                    {!editing?._id && pendingFile && (
                      <button
                        onClick={() => setPendingDocs((prev) => ({ ...prev, [field]: undefined }))}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove queued file"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14H6L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
            <button
              onClick={() => { handleSave(); }}
              disabled={loading}
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:bg-red-300"
            >
              {loading ? 'Saving…' : editing ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Currently Studying Confirmation Modal ── */}
      {showCurrentlyStudyingConfirm && (
        <div
          onClick={() => setShowCurrentlyStudyingConfirm(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 300,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '32px 28px',
              maxWidth: 400,
              width: '100%',
              boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0D1B3E', margin: '0 0 8px' }}>
              Change Currently Studying?
            </h3>
            <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, margin: '0 0 24px' }}>
              You already have a <strong>"Currently Studying"</strong> entry.
              Do you want to switch it to this one? The previous one will be marked as completed.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowCurrentlyStudyingConfirm(false)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10,
                  border: '1.5px solid #E8EDF8', background: '#F8F9FF',
                  fontSize: 13, color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                No, Keep it Same
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={loading}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10,
                  border: 'none', background: 'linear-gradient(135deg,#D62B2B,#1C3FA8)',
                  fontSize: 13, fontWeight: 700, color: '#fff',
                  cursor: 'pointer', fontFamily: 'inherit',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Saving…' : 'Yes, Switch it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}