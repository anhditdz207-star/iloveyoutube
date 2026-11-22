import type { AppSettings } from '@/types/settings';
import type { Track } from '@/types/music';

const SETTINGS_KEY = 'personal_music_hub_settings';
const LAST_SESSION_KEY = 'personal_music_hub_last_session';

export const DEFAULT_SETTINGS: AppSettings = {
  profile: {
    name: 'Music Creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    customSiteName: 'Personal Music Hub & Studio',
  },
  theme: {
    accentColor: '#9B5CFF',
    neonIntensity: 85,
  },
  player: {
    defaultVolume: 0.8,
    continuousListeningDefault: true,
    audioOnlyDefault: false,
    autoRestoreSession: true,
  },
  equalizer: {
    enabled: true,
    preset: 'default',
    bands: [
      { frequency: 60, gain: 0 },
      { frequency: 170, gain: 0 },
      { frequency: 350, gain: 0 },
      { frequency: 1000, gain: 0 },
      { frequency: 3000, gain: 0 },
      { frequency: 8000, gain: 0 },
      { frequency: 14000, gain: 0 },
    ],
  },
  companion: {
    enabled: false,
    endpoint: 'http://127.0.0.1:3111',
    authToken: 'local-token-secure-pmh',
  },
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Không thể đọc cài đặt từ localStorage', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Không thể lưu cài đặt vào localStorage', e);
  }
}

export interface LastSessionState {
  currentTrack: Track | null;
  currentTime: number;
  queue: Track[];
  queueIndex: number;
  volume: number;
  isContinuous: boolean;
  isAudioOnly: boolean;
}

export function saveLastSession(state: LastSessionState): void {
  try {
    localStorage.setItem(LAST_SESSION_KEY, JSON.stringify(state));
  } catch (e) {
    // Ignore storage errors
  }
}

export function loadLastSession(): LastSessionState | null {
  try {
    const raw = localStorage.getItem(LAST_SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Ignore
  }
  return null;
}
