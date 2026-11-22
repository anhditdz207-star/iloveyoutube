import React from 'react';
import { Play, Pause, Maximize2, X, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from '@/context/ThemeContext';

interface YouTubeMiniplayerProps {
  activeTab: string;
  onOpenWatch: () => void;
}

export const YouTubeMiniplayer: React.FC<YouTubeMiniplayerProps> = ({ activeTab, onOpenWatch }) => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    volume,
    isMuted,
    toggleMute,
    clearQueue,
  } = usePlayer();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Only show miniplayer when there is an active track AND user is not already on the watch page!
  if (!currentTrack || activeTab === 'watch') return null;

  const embedUrl = currentTrack.youtubeId
    ? `https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&rel=0`
    : null;

  return (
    <div
      className={`fixed bottom-4 right-4 w-72 sm:w-80 rounded-2xl overflow-hidden shadow-2xl border z-50 transition-all select-none animate-in slide-in-from-bottom-4 duration-200 ${
        isLight ? 'bg-white border-zinc-300' : 'bg-[#1F1F1F] border-zinc-700'
      }`}
    >
      {/* Video Container */}
      <div className="relative aspect-video w-full bg-black group cursor-pointer" onClick={onOpenWatch}>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={currentTrack.title}
            className="w-full h-full border-0 pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <img src={currentTrack.artwork} alt={currentTrack.title} className="w-full h-full object-cover" />
        )}

        {/* Hover Controls Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>
        </div>

        {/* Top Right Mini Actions */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenWatch();
            }}
            title="Mở toàn màn hình"
            className="p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearQueue();
            }}
            title="Đóng trình phát"
            className="p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mini Title & Controls Bar */}
      <div className="p-2.5 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1 cursor-pointer" onClick={onOpenWatch}>
          <h4 className="text-xs font-semibold truncate hover:text-red-500 transition-colors">
            {currentTrack.title}
          </h4>
          <p className="text-[10px] text-zinc-400 truncate">
            {currentTrack.channelTitle || currentTrack.artist}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={toggleMute}
            className="p-1 rounded-full text-zinc-400 hover:text-white"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
