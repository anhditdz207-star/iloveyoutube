import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Minimize2, Maximize2, X, Headphones, Film } from 'lucide-react';

export const YouTubeVideoFrame: React.FC = () => {
  const {
    currentTrack,
    isVideoExpanded,
    setIsVideoExpanded,
    isAudioOnly,
    toggleAudioOnly,
  } = usePlayer();

  const hasYouTube = !!currentTrack?.youtubeId;

  return (
    <div
      className={`transition-all duration-300 z-40 ${
        !hasYouTube
          ? 'hidden'
          : isAudioOnly
          ? 'fixed -left-[9999px] -top-[9999px] w-1 h-1 opacity-0 pointer-events-none'
          : isVideoExpanded
          ? 'fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 z-50'
          : 'fixed bottom-24 right-4 w-72 md:w-84 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-zinc-700 bg-black'
      }`}
    >
      {/* Top Controls when in Floating or Expanded Mode */}
      {!isAudioOnly && (
        <div
          className={`flex items-center justify-between w-full px-3 py-1.5 bg-[#1F1F1F]/90 text-white text-xs z-10 ${
            isVideoExpanded ? 'max-w-4xl rounded-t-2xl' : ''
          }`}
        >
          <div className="flex items-center gap-1.5 truncate pr-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span className="font-semibold truncate text-[11px]">{currentTrack?.title}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={toggleAudioOnly}
              title="Chuyển sang chế độ chỉ nghe nhạc"
              className="p-1 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-700"
            >
              <Headphones className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsVideoExpanded(!isVideoExpanded)}
              title={isVideoExpanded ? 'Thu nhỏ video' : 'Mở rộng toàn màn hình'}
              className="p-1 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-700"
            >
              {isVideoExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            {!isVideoExpanded && (
              <button
                onClick={toggleAudioOnly}
                title="Đóng khung video (tiếp tục nghe nhạc)"
                className="p-1 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* The Actual YouTube IFrame Container */}
      <div
        className={`w-full overflow-hidden ${
          isVideoExpanded ? 'max-w-4xl aspect-video rounded-b-2xl shadow-2xl' : 'aspect-video'
        }`}
      >
        <div id="global-youtube-player-iframe" className="w-full h-full" />
      </div>
    </div>
  );
};
