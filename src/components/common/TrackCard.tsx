import React from 'react';
import { Play, Pause, Heart, Plus, CheckCircle2 } from 'lucide-react';
import type { Track } from '@/types/music';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from '@/context/ThemeContext';

interface TrackCardProps {
  track: Track;
  queueContext?: Track[];
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, queueContext }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue, toggleFavorite, favorites } = usePlayer();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const isCurrent = currentTrack?.id === track.id || (track.youtubeId && currentTrack?.youtubeId === track.youtubeId);
  const isFav = favorites.some((f) => f.id === track.id || (track.youtubeId && f.youtubeId === track.youtubeId));

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds <= 0) return 'Live';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCardClick = () => {
    playTrack(track, queueContext);
    window.location.hash = 'watch';
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group cursor-pointer select-none flex flex-col gap-2.5 transition-transform duration-150 ${
        isCurrent ? 'ring-2 ring-red-600 rounded-2xl p-1.5' : ''
      }`}
    >
      {/* 16:9 YouTube Thumbnail Container */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#272727] shadow-xs">
        <img
          src={track.artwork}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover / Playing Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-150 ${
            isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white ml-0.5" />
            )}
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/80 text-[11px] font-mono font-medium text-white">
          {formatDuration(track.duration)}
        </div>
      </div>

      {/* YouTube Video Info Block: Avatar + Title + Channel + Views */}
      <div className="flex items-start gap-3 px-0.5">
        <img
          src={
            track.channelAvatar ||
            `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(track.artist)}`
          }
          alt={track.artist}
          className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
        />

        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-xs md:text-sm line-clamp-2 leading-snug transition-colors ${
              isCurrent
                ? 'text-red-600 font-bold'
                : isLight
                ? 'text-[#0F0F0F] group-hover:text-red-600'
                : 'text-[#F1F1F1] group-hover:text-red-500'
            }`}
          >
            {track.title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-zinc-400 mt-1">
            <span className="truncate">{track.channelTitle || track.artist}</span>
            <CheckCircle2 className="w-3 h-3 text-zinc-400 shrink-0" />
          </div>

          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
            <span>{track.views || '1.2 Tr lượt xem'}</span>
            <span>•</span>
            <span>{track.publishedAt || 'Vừa xong'}</span>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => addToQueue(track)}
            title="Thêm vào danh sách chờ"
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleFavorite(track)}
            title={isFav ? 'Bỏ thích' : 'Thích'}
            className={`p-1 rounded-full transition-colors ${
              isFav ? 'text-red-600' : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-600' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
