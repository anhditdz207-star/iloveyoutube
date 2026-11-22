export interface UserProfile {
  name: string;
  avatar: string;
  customSiteName: string;
}

export interface EqualizerBand {
  frequency: number; // in Hz: 60, 170, 350, 1000, 3000, 8000, 14000
  gain: number;      // -12dB to +12dB
}

export type EqualizerPreset = 'default' | 'bass_boost' | 'pop' | 'rock' | 'classical' | 'acoustic' | 'custom';

export interface EqualizerConfig {
  enabled: boolean;
  preset: EqualizerPreset;
  bands: EqualizerBand[];
}

export interface AppSettings {
  profile: UserProfile;
  theme: {
    accentColor: string; // e.g., '#9B5CFF'
    neonIntensity: number; // 0 to 100
  };
  player: {
    defaultVolume: number;
    continuousListeningDefault: boolean;
    audioOnlyDefault: boolean;
    autoRestoreSession: boolean;
  };
  equalizer: EqualizerConfig;
  companion: {
    enabled: boolean;
    endpoint: string; // default: 'http://127.0.0.1:3111'
    authToken: string;
  };
}
