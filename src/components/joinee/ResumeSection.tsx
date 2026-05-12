import { useState, useRef } from 'react';
import { uploadResume } from '../../services/joinee.service';
import type { JoineeProfile } from '../../types/joinee.types';

interface ResumeSectionProps {
  profile: JoineeProfile;
  onUpdate: (p: JoineeProfile) => void;
}

export default function ResumeSection({ profile, onUpdate }: ResumeSectionProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await uploadResume(file);
      onUpdate({ ...profile, resumeUrl: res.resumeUrl });
      setMsg({ type: 'success', text: 'Resume uploaded successfully!' });
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed.' });
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Resume</h2>
        <p className="text-sm text-gray-500 mt-1">Upload your latest resume for recruiters</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        {profile.resumeUrl ? (
          <div className="space-y-4">
            {/* Current resume */}
            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-800">Resume uploaded ✓</p>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-green-600 hover:underline"
                >
                  View current resume →
                </a>
              </div>
            </div>

            {/* Replace button */}
            <button
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              {loading ? 'Uploading…' : '🔄 Replace resume'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="w-full py-12 border-2 border-dashed border-gray-200 rounded-xl text-center hover:border-red-300 hover:bg-red-50 transition-all group"
          >
            {loading ? (
              <svg className="animate-spin w-8 h-8 mx-auto text-red-500" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              <>
                <p className="text-4xl mb-3">📤</p>
                <p className="text-sm font-semibold text-gray-600 group-hover:text-red-600">Click to upload your resume</p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX — max 10 MB</p>
              </>
            )}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {msg && (
        <div className={`text-sm px-4 py-3 rounded-xl ${
          msg.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {msg.text}
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <p className="text-xs text-blue-700 font-medium mb-1">💡 Tips for a great resume</p>
        <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
          <li>Keep it to 1–2 pages</li>
          <li>Use a clean, ATS-friendly format</li>
          <li>Tailor it to the job you're applying for</li>
          <li>Include quantifiable achievements</li>
        </ul>
      </div>
    </div>
  );
}
