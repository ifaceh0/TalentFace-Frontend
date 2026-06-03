import { useEffect, useState } from 'react';

const STORAGE_KEY = 'tf_settings';

type Theme = 'light' | 'dark';

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSize] = useState<'small'|'medium'|'large'>('medium');
  const [profilesPerPage, setProfilesPerPage] = useState<number>(10);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      setTheme(parsed.theme || 'light');
      setFontSize(parsed.fontSize || 'medium');
      setProfilesPerPage(parsed.profilesPerPage || 10);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, fontSize, profilesPerPage }));
    // Apply theme and font size immediately
    document.documentElement.classList.toggle('dark', theme === 'dark');
    const size = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';
    document.documentElement.style.fontSize = size;
  }, [theme, fontSize, profilesPerPage]);

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-xl font-semibold">Settings</h2>

      <div className="p-4 border rounded-lg bg-white">
        <h3 className="font-medium mb-2">Theme</h3>
        <div className="flex gap-2">
          <button onClick={() => setTheme('light')} className={`px-3 py-2 rounded ${theme==='light' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Light</button>
          <button onClick={() => setTheme('dark')} className={`px-3 py-2 rounded ${theme==='dark' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Dark</button>
        </div>
      </div>

      <div className="p-4 border rounded-lg bg-white">
        <h3 className="font-medium mb-2">Font size</h3>
        <div className="flex gap-2">
          <button onClick={() => setFontSize('small')} className={`px-3 py-2 rounded ${fontSize==='small' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Small</button>
          <button onClick={() => setFontSize('medium')} className={`px-3 py-2 rounded ${fontSize==='medium' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Medium</button>
          <button onClick={() => setFontSize('large')} className={`px-3 py-2 rounded ${fontSize==='large' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Large</button>
        </div>
      </div>

      <div className="p-4 border rounded-lg bg-white">
        <h3 className="font-medium mb-2">Profiles per review list</h3>
        <input type="number" value={profilesPerPage} min={1} max={100} onChange={(e) => setProfilesPerPage(Number(e.target.value))} className="input w-32" />
        <p className="text-sm text-gray-500 mt-2">Controls how many candidate profiles appear in paginated review lists.</p>
      </div>
    </div>
  );
}
