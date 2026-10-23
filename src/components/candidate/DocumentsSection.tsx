// import { useState, useRef } from 'react';
// import { uploadResume, uploadDocument, deleteDocument } from '../../services/joinee.service';
// import type { JoineeProfile, Document as JoineeDoc } from '../../types/joinee.types';

// interface DocumentsSectionProps {
//   profile: JoineeProfile;
//   onUpdate: (p: JoineeProfile) => void;
// }

// export default function DocumentsSection({ profile, onUpdate }: DocumentsSectionProps) {
//   const [resumeLoading, setResumeLoading] = useState(false);
//   const [docLoading, setDocLoading] = useState(false);
//   const [docLabel, setDocLabel] = useState('');
//   const [deleting, setDeleting] = useState<string | null>(null);
//   const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   const resumeInputRef = useRef<HTMLInputElement>(null);
//   const docInputRef = useRef<HTMLInputElement>(null);

//   const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setResumeLoading(true);
//     setMsg(null);
//     try {
//       const res = await uploadResume(file);
//       onUpdate({ ...profile, resumeUrl: res.resumeUrl });
//       setMsg({ type: 'success', text: 'Resume uploaded!' });
//     } catch (err: unknown) {
//       setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed.' });
//     } finally { setResumeLoading(false); }
//   };

//   const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setDocLoading(true);
//     setMsg(null);
//     try {
//       const updated = await uploadDocument(file, docLabel || file.name) as JoineeDoc[];
//       onUpdate({ ...profile, documents: updated });
//       setDocLabel('');
//       setMsg({ type: 'success', text: 'Document uploaded!' });
//     } catch (err: unknown) {
//       setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed.' });
//     } finally { setDocLoading(false); }
//   };

//   const handleDeleteDoc = async (docId: string) => {
//     setDeleting(docId);
//     try {
//       const updated = await deleteDocument(docId) as JoineeDoc[];
//       onUpdate({ ...profile, documents: updated });
//     } catch { /* */ } finally { setDeleting(null); }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-xl font-bold text-gray-900">Resume &amp; Documents</h2>
//         <p className="text-sm text-gray-500 mt-1">Upload your resume and supporting documents</p>
//       </div>

//       {/* Resume */}
//       <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
//         <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><span>📄</span> Resume</h3>
//         {profile.resumeUrl ? (
//           <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
//             <div className="flex-1">
//               <p className="text-sm font-medium text-green-800">Resume uploaded</p>
//               <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-green-600 hover:underline">View current resume</a>
//             </div>
//             <button onClick={() => resumeInputRef.current?.click()} className="text-xs text-green-700 font-semibold hover:underline">Replace</button>
//           </div>
//         ) : (
//           <button
//             onClick={() => resumeInputRef.current?.click()}
//             className="w-full py-8 border-2 border-dashed border-gray-200 rounded-xl text-center hover:border-red-300 hover:bg-red-50 transition-all group"
//           >
//             {resumeLoading ? (
//               <svg className="animate-spin w-6 h-6 mx-auto text-red-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
//             ) : (
//               <>
//                 <p className="text-3xl mb-2">📤</p>
//                 <p className="text-sm font-medium text-gray-600 group-hover:text-red-600">Click to upload resume</p>
//                 <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (max 5MB)</p>
//               </>
//             )}
//           </button>
//         )}
//         <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
//       </div>

//       {/* Additional documents */}
//       <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
//         <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><span>📁</span> Additional Documents</h3>

//         {/* Upload */}
//         <div className="flex gap-2 mb-4">
//           <input
//             value={docLabel}
//             onChange={(e) => setDocLabel(e.target.value)}
//             placeholder="Document label (optional)"
//             className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50"
//           />
//           <button
//             onClick={() => docInputRef.current?.click()}
//             disabled={docLoading}
//             className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5"
//           >
//             {docLoading
//               ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
//               : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
//             }
//             Upload
//           </button>
//         </div>
//         <input ref={docInputRef} type="file" onChange={handleDocUpload} className="hidden" />

//         {/* Documents list */}
//         {(profile.documents?.length ?? 0) === 0 ? (
//           <p className="text-sm text-gray-400 text-center py-4">No documents uploaded yet.</p>
//         ) : (
//           <div className="space-y-2">
//             {profile.documents?.map((doc) => (
//               <div key={doc._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-gray-700 truncate">{doc.label}</p>
//                   {doc.uploadedAt && <p className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</p>}
//                 </div>
//                 {doc.url && <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline shrink-0">View</a>}
//                 <button
//                   onClick={() => doc._id && handleDeleteDoc(doc._id)}
//                   disabled={deleting === doc._id}
//                   className="p-1 text-gray-400 hover:text-red-600 transition-colors shrink-0"
//                 >
//                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {msg && (
//         <div className={`text-sm px-4 py-3 rounded-xl ${
//           msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
//         }`}>{msg.text}</div>
//       )}
//     </div>
//   );
// }
