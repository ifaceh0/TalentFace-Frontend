import { useState } from 'react';
import TagInput from '../ui/TagInput';
import { updateSkills } from '../../services/joinee.service';
import type { JoineeProfile } from '../../types/joinee.types';

interface SkillsSectionProps {
  profile: JoineeProfile;
  onUpdate: (p: JoineeProfile) => void;
}

export default function SkillsSection({ profile, onUpdate }: SkillsSectionProps) {
  const [skills, setSkills] = useState<string[]>(profile.skills ?? []);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await updateSkills(skills);
      onUpdate({ ...profile, skills: res.skills });
      setMsg({ type: 'success', text: 'Skills updated!' });
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Skills</h2>
        <p className="text-sm text-gray-500 mt-1">Add technical skills and tools you know</p>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>🛠️</span> Technical Skills
        </h3>
        <TagInput
          tags={skills}
          onChange={setSkills}
          placeholder="React, Node.js, Python, SQL…"
        />
      </div>

      {skills.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{skills.length}</span> skill{skills.length !== 1 ? 's' : ''} added
        </div>
      )}

      {msg && (
        <div className={`text-sm px-4 py-3 rounded-xl ${
          msg.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {msg.text}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={loading}
        className="px-6 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
      >
        {loading && (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
        {loading ? 'Saving…' : 'Save Skills'}
      </button>
    </div>
  );
}
