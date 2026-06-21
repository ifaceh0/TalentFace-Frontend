const SETTINGS_KEY_BASE = 'tf_settings';

type FontSizeOption = 'small' | 'medium' | 'large';

export interface UserSettings {
  fontSize: FontSizeOption;
  profilesPerPage: number;
}

export function getSettingsStorageKey(userId?: string) {
  return userId ? `${SETTINGS_KEY_BASE}_${userId}` : SETTINGS_KEY_BASE;
}

export function loadUserSettings(userId?: string): UserSettings {
  if (typeof window === 'undefined') {
    return { fontSize: 'medium', profilesPerPage: 10 };
  }

  const raw = localStorage.getItem(getSettingsStorageKey(userId));
  if (!raw) {
    return { fontSize: 'medium', profilesPerPage: 10 };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      fontSize: parsed.fontSize === 'small' || parsed.fontSize === 'large' ? parsed.fontSize : 'medium',
      profilesPerPage:
        typeof parsed.profilesPerPage === 'number' && parsed.profilesPerPage > 0
          ? parsed.profilesPerPage
          : 10,
    };
  } catch {
    return { fontSize: 'medium', profilesPerPage: 10 };
  }
}

export function saveUserSettings(settings: UserSettings, userId?: string) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(getSettingsStorageKey(userId), JSON.stringify(settings));
  } catch {
    // ignore storage failures
  }
}

export function applyFontSize(fontSize: FontSizeOption) {
  if (typeof document === 'undefined') return;

  const size = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';
  document.documentElement.style.fontSize = size;
}
