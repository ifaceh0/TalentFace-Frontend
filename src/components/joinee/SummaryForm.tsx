import { useState } from 'react';
import { updateSummary } from '../../services/joinee.service';
import type { JoineeProfile } from '../../types/joinee.types';

interface SummaryFormProps {
  profile: JoineeProfile;
  onUpdate: (p: JoineeProfile) => void;
}

const MAX = 1000;

export default function SummaryForm({ profile, onUpdate }: SummaryFormProps) {
  const [text, setText] = useState(profile.summary ?? '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setMsg(null);
    try {
      await updateSummary(text.trim());
      onUpdate({ ...profile, summary: text.trim() });
      setMsg({ type: 'success', text: 'Summary updated!' });
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update.' });
    } finally {
      setLoading(false);
    }
  };

  const remaining = MAX - text.length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Profile Summary</h2>
        <p className="text-sm text-gray-500 mt-1">Write a compelling summary about yourself (max {MAX} characters)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX))}
            rows={8}
            placeholder="I am a passionate software developer with experience in..."
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400 resize-none outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all"
          />
          <span
            className={`absolute bottom-3 right-4 text-xs font-mono ${
              remaining < 50 ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {remaining}/{MAX}
          </span>
        </div>

        {/* AI hint */}
        <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 rounded-xl border border-blue-100">
          <span className="text-base mt-0.5">💡</span>
          <p className="text-xs text-blue-700">
            A strong summary mentions your role, key skills, top achievements, and career goals in 3–5 sentences.
          </p>
        </div>

        {msg && (
          <div className={`text-sm px-4 py-3 rounded-xl ${
            msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {msg.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="px-6 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
        >
          {loading && (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
          {loading ? 'Saving…' : 'Save Summary'}
        </button>
      </form>
    </div>
  );
}
