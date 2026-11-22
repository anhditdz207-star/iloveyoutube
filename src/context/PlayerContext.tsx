import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { Track, RepeatMode } from '@/types/music';
import { CURATED_TRACKS } from '@/data/curatedMedia';
import { audioEngine } from '@/services/audioEngine';
import { youtubeEngine, extractYouTubeId } from '@/services/youtubeEngine';
import { updateMediaSession, updateMediaSessionPositionState } from '@/services/mediaSession';
import {
  saveLastSession,
  loadLastSession,
  loadSettings,
} from '@/storage/localStorage';
import {
  addHistoryItem,
  getAllFavorites,
  addFavorite as dbAddFavorite,
  removeFavorite as dbRemoveFavorite,
  isFavoriteTrack as dbIsFavorite,
} from '@/storage/indexedDb';

export interface PlayerContextType {
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
  favorites: Track[];
  isFavorite: boolean;

  // Video view mode
  isVideoExpanded: boolean;
  setIsVideoExpanded: (expanded: boolean) => void;

  // UI Panels
  isQueueOpen: boolean;
  isEqualizerOpen: boolean;
  isSleepTimerOpen: boolean;
  isFocusMode: boolean;
  isMiniPlayer: boolean;
  sleepTimerRemaining: number | null;

  // Controls
  playTrack: (track: Track, newQueue?: Track[]) => void;
  playYouTubeUrl: (urlOrId: string) => boolean;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleContinuous: () => void;
  toggleAudioOnly: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setPlaybackRate: (rate: number) => void;
  addToQueue: (track: Track, playNext?: boolean) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (newQueue: Track[]) => void;
  clearQueue: () => void;
  toggleFavorite: (track?: Track) => Promise<void>;

  // Panel Toggles
  setQueueOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setEqualizerOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setSleepTimerOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setFocusMode: (open: boolean | ((prev: boolean) => boolean)) => void;
  setMiniPlayer: (open: boolean | ((prev: boolean) => boolean)) => void;
  setSleepTimer: (minutes: number | null) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(() => loadSettings().player.defaultVolume);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isContinuous, setIsContinuous] = useState<boolean>(() => loadSettings().player.continuousListeningDefault);
  const [isAudioOnly, setIsAudioOnly] = useState<boolean>(() => loadSettings().player.audioOnlyDefault);
  const [playbackRate, setPlaybackRateState] = useState<number>(1.0);
  const [queue, setQueue] = useState<Track[]>(() => CURATED_TRACKS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [isVideoExpanded, setIsVideoExpanded] = useState<boolean>(false);

  const [favorites, setFavorites] = useState<Track[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Panels
  const [isQueueOpen, setQueueOpen] = useState(false);
  const [isEqualizerOpen, setEqualizerOpen] = useState(false);
  const [isSleepTimerOpen, setSleepTimerOpen] = useState(false);
  const [isFocusMode, setFocusMode] = useState(false);
  const [isMiniPlayer, setMiniPlayer] = useState(false);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);

  // Initialize YouTube Engine & Audio
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;
    audioEngine.init(audio);

    // Initialize YouTube IFrame container
    youtubeEngine.initPlayer('global-youtube-player-iframe');

    // Subscribe to YouTube state changes
    const unsubYT = youtubeEngine.onStateChange((state) => {
      // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
      if (state === 1) setIsPlaying(true);
      else if (state === 2) setIsPlaying(false);
      else if (state === 0) {
        handleTrackEnd();
      }
    });

    // YouTube time polling
    const ytTimer = setInterval(() => {
      if (currentTrack?.youtubeId && isPlaying) {
        const time = youtubeEngine.getCurrentTime();
        const dur = youtubeEngine.getDuration();
        if (time >= 0) setCurrentTime(time);
        if (dur > 0) setDuration(dur);
      }
    }, 500);

    // Load initial favorites
    getAllFavorites().then((favs) => setFavorites(favs));

    // Restore last session
    const lastSession = loadLastSession();
    if (lastSession && lastSession.currentTrack) {
      setCurrentTrack(lastSession.currentTrack);
      if (lastSession.queue && lastSession.queue.length > 0) {
        setQueue(lastSession.queue);
        setQueueIndex(lastSession.queueIndex ?? 0);
      }
    } else if (CURATED_TRACKS.length > 0) {
      setCurrentTrack(CURATED_TRACKS[0]);
    }

    return () => {
      unsubYT();
      clearInterval(ytTimer);
    };
  }, []);

  // Update favorite status of current track
  useEffect(() => {
    if (!currentTrack) {
      setIsFavorite(false);
      return;
    }
    dbIsFavorite(currentTrack.id).then((fav) => setIsFavorite(fav));
  }, [currentTrack, favorites]);

  // Audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!currentTrack?.youtubeId) {
        setCurrentTime(audio.currentTime);
        updateMediaSessionPositionState(audio.currentTime, audio.duration || 0, audio.playbackRate);
      }
    };

    const onLoadedMetadata = () => {
      if (!currentTrack?.youtubeId) {
        setDuration(audio.duration || currentTrack?.duration || 0);
      }
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => handleTrackEnd();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [queue, queueIndex, repeatMode, isContinuous, isShuffle, currentTrack]);

  // Handle Track End
  const handleTrackEnd = useCallback(() => {
    if (currentTrack) {
      addHistoryItem(currentTrack, currentTrack.duration);
    }

    if (repeatMode === 'one') {
      if (currentTrack?.youtubeId) {
        youtubeEngine.seekTo(0);
        youtubeEngine.play();
      } else if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.warn);
      }
      return;
    }

    if (isContinuous) {
      nextTrack();
    } else {
      setIsPlaying(false);
    }
  }, [currentTrack, repeatMode, isContinuous]);

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    setCurrentTrack(track);

    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex((t) => t.id === track.id);
      setQueueIndex(idx !== -1 ? idx : 0);
    } else {
      const idx = queue.findIndex((t) => t.id === track.id);
      if (idx !== -1) {
        setQueueIndex(idx);
      } else {
        const updated = [track, ...queue];
        setQueue(updated);
        setQueueIndex(0);
      }
    }

    // Play via Real YouTube Engine if youtubeId is present
    if (track.youtubeId) {
      if (audioRef.current) audioRef.current.pause();
      youtubeEngine.loadVideo(track.youtubeId);
      youtubeEngine.setVolume(volume);
      setIsPlaying(true);
    } else if (track.audioUrl && audioRef.current) {
      youtubeEngine.pause();
      audioRef.current.src = track.audioUrl;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch(console.warn);
      setIsPlaying(true);
    }

    addHistoryItem(track, 0);
  }, [queue, playbackRate, volume]);

  const playYouTubeUrl = useCallback((urlOrId: string): boolean => {
    const id = extractYouTubeId(urlOrId);
    if (!id) return false;

    const customTrack: Track = {
      id: `yt-custom-${id}-${Date.now()}`,
      youtubeId: id,
      title: `YouTube Video (${id})`,
      artist: 'Kênh YouTube',
      artwork: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      duration: 240,
      source: 'youtube',
      genre: 'YouTube Direct',
      views: 'Trực tiếp từ URL',
      publishedAt: 'Mới dán',
      addedAt: Date.now(),
    };

    playTrack(customTrack);
    return true;
  }, [playTrack]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      if (currentTrack?.youtubeId) {
        youtubeEngine.pause();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (currentTrack?.youtubeId) {
        youtubeEngine.play();
      } else if (audioRef.current) {
        audioRef.current.play().catch(console.warn);
      }
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack]);

  const seek = useCallback((time: number) => {
    setCurrentTime(time);
    if (currentTrack?.youtubeId) {
      youtubeEngine.seekTo(time);
    } else if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, [currentTrack]);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (currentTrack?.youtubeId) {
      youtubeEngine.setVolume(clamped);
    }
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    audioEngine.setVolume(clamped);
    if (clamped > 0) setIsMuted(false);
  }, [currentTrack]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(volume);
      setIsMuted(false);
    } else {
      if (currentTrack?.youtubeId) youtubeEngine.setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume, currentTrack, setVolume]);

  const toggleShuffle = useCallback(() => setIsShuffle((prev) => !prev), []);
  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
  }, []);
  const toggleContinuous = useCallback(() => setIsContinuous((prev) => !prev), []);
  const toggleAudioOnly = useCallback(() => setIsAudioOnly((prev) => !prev), []);

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;
    let nextIdx = queueIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      if (repeatMode === 'all' || isContinuous) nextIdx = 0;
      else {
        setIsPlaying(false);
        return;
      }
    }
    setQueueIndex(nextIdx);
    const nextItem = queue[nextIdx];
    if (nextItem) playTrack(nextItem);
  }, [queue, queueIndex, isShuffle, repeatMode, isContinuous, playTrack]);

  const previousTrack = useCallback(() => {
    if (currentTime > 3) {
      seek(0);
      return;
    }
    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) prevIdx = queue.length - 1;
    setQueueIndex(prevIdx);
    const prevItem = queue[prevIdx];
    if (prevItem) playTrack(prevItem);
  }, [currentTime, queue, queueIndex, playTrack, seek]);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, []);

  const addToQueue = useCallback((track: Track, playNext = false) => {
    setQueue((prev) => {
      if (playNext) {
        const copy = [...prev];
        copy.splice(queueIndex + 1, 0, track);
        return copy;
      }
      return [...prev, track];
    });
  }, [queueIndex]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
    if (index < queueIndex) setQueueIndex((prev) => prev - 1);
  }, [queueIndex]);

  const reorderQueue = useCallback((newQueue: Track[]) => {
    setQueue(newQueue);
    if (currentTrack) {
      const idx = newQueue.findIndex((t) => t.id === currentTrack.id);
      if (idx !== -1) setQueueIndex(idx);
    }
  }, [currentTrack]);

  const clearQueue = useCallback(() => {
    setQueue(currentTrack ? [currentTrack] : []);
    setQueueIndex(0);
  }, [currentTrack]);

  const toggleFavorite = useCallback(async (targetTrack?: Track) => {
    const track = targetTrack || currentTrack;
    if (!track) return;
    const exists = await dbIsFavorite(track.id);
    if (exists) {
      await dbRemoveFavorite(track.id);
      setFavorites((prev) => prev.filter((t) => t.id !== track.id));
      if (currentTrack?.id === track.id) setIsFavorite(false);
    } else {
      await dbAddFavorite(track);
      setFavorites((prev) => [track, ...prev]);
      if (currentTrack?.id === track.id) setIsFavorite(true);
    }
  }, [currentTrack]);

  const setSleepTimer = useCallback((minutes: number | null) => {
    if (minutes === null) setSleepTimerRemaining(null);
    else setSleepTimerRemaining(minutes * 60);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        isContinuous,
        isAudioOnly,
        playbackRate,
        queue,
        queueIndex,
        favorites,
        isFavorite,
        isVideoExpanded,
        setIsVideoExpanded,
        isQueueOpen,
        isEqualizerOpen,
        isSleepTimerOpen,
        isFocusMode,
        isMiniPlayer,
        sleepTimerRemaining,
        playTrack,
        playYouTubeUrl,
        togglePlay,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeat,
        toggleContinuous,
        toggleAudioOnly,
        nextTrack,
        previousTrack,
        setPlaybackRate,
        addToQueue,
        removeFromQueue,
        reorderQueue,
        clearQueue,
        toggleFavorite,
        setQueueOpen,
        setEqualizerOpen,
        setSleepTimerOpen,
        setFocusMode,
        setMiniPlayer,
        setSleepTimer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};
