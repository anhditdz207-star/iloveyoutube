import type { Track } from '@/types/music';

export interface MediaSessionHandlers {
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeekTo?: (time: number) => void;
}

export function updateMediaSession(track: Track | null, handlers: MediaSessionHandlers) {
  if (!('mediaSession' in navigator)) return;

  if (!track) {
    navigator.mediaSession.metadata = null;
    return;
  }

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album || 'Personal Music Hub',
      artwork: [
        { src: track.artwork, sizes: '96x96', type: 'image/jpeg' },
        { src: track.artwork, sizes: '128x128', type: 'image/jpeg' },
        { src: track.artwork, sizes: '256x256', type: 'image/jpeg' },
        { src: track.artwork, sizes: '512x512', type: 'image/jpeg' },
      ],
    });

    navigator.mediaSession.setActionHandler('play', handlers.onPlay);
    navigator.mediaSession.setActionHandler('pause', handlers.onPause);
    navigator.mediaSession.setActionHandler('previoustrack', handlers.onPrevious);
    navigator.mediaSession.setActionHandler('nexttrack', handlers.onNext);

    if (handlers.onSeekTo) {
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          handlers.onSeekTo!(details.seekTime);
        }
      });
    }
  } catch (err) {
    console.warn('MediaSession API warning:', err);
  }
}

export function updateMediaSessionPositionState(currentTime: number, duration: number, playbackRate: number = 1.0) {
  if (!('mediaSession' in navigator) || !navigator.mediaSession.setPositionState) return;
  try {
    if (duration > 0 && currentTime >= 0 && currentTime <= duration) {
      navigator.mediaSession.setPositionState({
        duration: Math.max(0, duration),
        playbackRate,
        position: Math.max(0, Math.min(currentTime, duration)),
      });
    }
  } catch (e) {
    // Ignore invalid position states
  }
}
