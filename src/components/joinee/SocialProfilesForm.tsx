import { useState } from 'react';
import { updateSocialProfiles } from '../../services/joinee.service';
import type { JoineeProfile, SocialProfile } from '../../types/joinee.types';

const PLATFORMS: SocialProfile['platform'][] = ['linkedin', 'github', 'twitter', 'portfolio', 'hackerrank', 'leetcode', 'other'];

const PLATFORM_META: Record<string, { label: string; icon: string; placeholder: string }> = {
  linkedin:   { label: 'LinkedIn',    icon: '💼', placeholder: 'https://linkedin.com/in/yourname' },
  github:     { label: 'GitHub',      icon: '🐙', placeholder: 'https://github.com/yourname' },
  twitter:    { label: 'Twitter / X', icon: '🐦', placeholder: 'https://twitter.com/yourname' },
  portfolio:  { label: 'Portfolio',   icon: '🌐', placeholder: 'https://yourportfolio.com' },
  hackerrank: { label: 'HackerRank', icon: '💻', placeholder: 'https://hackerrank.com/yourname' },
  leetcode:   { label: 'LeetCode',   icon: '🔢', placeholder: 'https://leetcode.com/yourname' },
  other:      { label: 'Other',       icon: '🔗', placeholder: 'https://…' },
};

interface SocialProfilesFormProps {
  profile: JoineeProfile;
  onUpdate: (p: JoineeProfile) => void;
}

export default function SocialProfilesForm({ profile, onUpdate }: SocialProfilesFormProps) {
  const buildMap = () => {
    const map: Record<string, string> = {};
    (profile.socialProfiles ?? []).forEach((sp) => {
      if (sp.platform) map[sp.platform] = sp.url ?? '';
    });
    return map;
  };

  const [urls, setUrls] = useState<Record<string, string>>(buildMap());
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setMsg(null);
    const payload: SocialProfile[] = PLATFORMS
      .filter((p) => urls[p ?? '']?.trim())
      .map((p) => ({ platform: p, url: urls[p ?? ''].trim() }));
    try {
      const updated = await updateSocialProfiles(payload);
      onUpdate({ ...profile, socialProfiles: updated });
      setMsg({ type: 'success', text: 'Social profiles saved!' });
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Social Profiles</h2>
        <p className="text-sm text-gray-500 mt-1">Add links to your online presence (only filled platforms will be saved)</p>
      </div>

      <div className="space-y-3">
        {PLATFORMS.map((platform) => {
          const meta = PLATFORM_META[platform!];
          return (
            <div key={platform} className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
              <span className="text-xl w-8 text-center shrink-0">{meta.icon}</span>
              <span className="text-sm font-medium text-gray-700 w-28 shrink-0">{meta.label}</span>
              <input
                type="url"
                value={urls[platform!] ?? ''}
                onChange={(e) => setUrls((prev) => ({ ...prev, [platform!]: e.target.value }))}
                placeholder={meta.placeholder}
                className="flex-1 text-sm outline-none border-0 bg-transparent text-gray-700 placeholder-gray-400"
              />
              {urls[platform!] && (
                <a href={urls[platform!]} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              )}
            </div>
          );
        })}
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
        {loading ? 'Saving…' : 'Save Social Profiles'}
      </button>
    </div>
  );
}
