import { useState } from 'react';
import { updateSkills } from '../../services/joinee.service';
import type { JoineeProfile } from '../../types/joinee.types';

interface SkillsSectionProps {
  profile: JoineeProfile;
  onUpdate: (p: JoineeProfile) => void;
}

const SKILL_CATEGORIES = [
  {
    label: 'Frontend',
    skills: ['React.js', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'UI Development'],
  },
  {
    label: 'Backend',
    skills: ['Node.js', 'Express.js', 'Python', 'OOPs', 'JWT', 'JSON', 'CRUD Operations', 'REST API'],
  },
  {
    label: 'Database',
    skills: ['MongoDB', 'Mongoose'],
  },
  {
    label: 'Tools & Concepts',
    skills: ['Git', 'GitHub', 'MERN Stack'],
  },
];

export default function SkillsSection({ profile, onUpdate }: SkillsSectionProps) {
  const [skills, setSkills] = useState<string[]>(profile.skills ?? []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      setSkills(prev => [...prev, trimmed]);
    }
  };

  const removeSkill = (skill: string) => setSkills(prev => prev.filter(s => s !== skill));

  const toggleSuggested = (skill: string) => {
    if (skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())) {
      removeSkill(skill);
    } else {
      addSkill(skill);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(input);
      setInput('');
    } else if (e.key === 'Backspace' && input === '' && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

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

  const isSelected = (skill: string) =>
    skills.map(s => s.toLowerCase()).includes(skill.toLowerCase());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Skills</h2>
        <p className="text-sm text-gray-500 mt-1">Add technical skills and tools you know</p>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <span>🛠️</span> Technical Skills
        </h3>

        {/* Tag input box */}
        <div className="flex flex-wrap gap-2 min-h-[44px] px-3 py-2 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-red-400 bg-white">
          {skills.map(skill => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="w-3.5 h-3.5 rounded-full bg-red-200 hover:bg-red-400 text-red-700 hover:text-white flex items-center justify-center text-[10px] leading-none transition-colors"
              >
                ×
              </button>
            </span>
          ))}
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={skills.length === 0 ? 'Type a skill and press Enter…' : ''}
            className="flex-1 min-w-[140px] text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Suggestion picker toggle */}
        <button
          onClick={() => setShowPicker(p => !p)}
          className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d={showPicker ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
          </svg>
          {showPicker ? 'Hide suggestions' : 'Browse suggested skills'}
        </button>

        {/* Skill picker */}
        {showPicker && (
          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 space-y-4">
            {SKILL_CATEGORIES.map(cat => (
              <div key={cat.label}>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {cat.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSuggested(skill)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        isSelected(skill)
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-500'
                      }`}
                    >
                      {isSelected(skill) ? '✓ ' : '+ '}{skill}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">{skills.length}</span>{' '}
          skill{skills.length !== 1 ? 's' : ''} added
        </p>
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