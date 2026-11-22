export type ContentSourceType = 'youtube' | 'stream' | 'local' | 'royalty-free';

export interface Track {
  id: string;
  youtubeId?: string; // Real YouTube Video ID (e.g. 'jfKfPfyJRdk')
  title: string;
  artist: string;
  channelTitle?: string;
  channelAvatar?: string;
  album?: string;
  duration: number; // in seconds
  artwork: string;
  audioUrl?: string; // Direct audio fallback
  videoUrl?: string;
  isLocal?: boolean;
  source: ContentSourceType;
  genre?: string;
  views?: string;
  publishedAt?: string;
  license?: string;
  addedAt?: number;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  artwork?: string;
  tracks: Track[];
  createdAt: number;
  updatedAt: number;
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  trackCount: number;
  bio?: string;
  genres?: string[];
}

export type RepeatMode = 'off' | 'one' | 'all';

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isContinuous: boolean;
  isAudioOnly: boolean;
  playbackRate: number;
  queue: Track[];
  queueIndex: number;
}

export interface ListeningHistoryItem {
  id: string;
  track: Track;
  playedAt: number;
  listenDuration: number;
  userId?: string;
}

export interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  joinedAt?: number;
}
