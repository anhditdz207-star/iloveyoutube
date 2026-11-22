import React, { useState } from 'react';
import {
  Play,
  Flame,
  Music,
  Clock,
  Sparkles,
  Compass,
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from '@/context/ThemeContext';
import { TrackCard } from '@/components/common/TrackCard';
import {
  CURATED_TRACKS,
  CURATED_PLAYLISTS,
} from '@/data/curatedMedia';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { currentTrack, isPlaying, togglePlay } = usePlayer();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeChip, setActiveChip] = useState('all');

  const chips = [
    { id: 'all', label: 'Tất cả' },
    { id: 'vpop', label: 'V-Pop' },
    { id: 'lofi', label: 'Lofi Chill' },
    { id: 'indie', label: 'Indie & Acoustic' },
    { id: 'pop', label: 'Âm nhạc US-UK' },
    { id: 'study', label: 'Tập trung học tập' },
  ];

  const filteredTracks =
    activeChip === 'all'
      ? CURATED_TRACKS
      : activeChip === 'vpop'
      ? CURATED_TRACKS.filter((t) => t.genre?.includes('V-Pop'))
      : activeChip === 'lofi'
      ? CURATED_TRACKS.filter((t) => t.genre?.includes('Lo-Fi'))
      : activeChip === 'indie'
      ? CURATED_TRACKS.filter((t) => t.genre?.includes('Indie') || t.genre?.includes('Acoustic'))
      : activeChip === 'pop'
      ? CURATED_TRACKS.filter((t) => t.genre?.includes('Pop'))
      : CURATED_TRACKS;

  return (
    <div className="space-y-6 pb-20 select-none">
      {/* 1. YouTube Style Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sticky top-14 py-2 z-10 backdrop-blur-xs">
        {chips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setActiveChip(chip.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeChip === chip.id
                ? isLight
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
                : isLight
                ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                : 'bg-[#272727] text-zinc-200 hover:bg-[#383838]'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* 2. YouTube-style "Tiếp tục xem / nghe" (Compact & Native, not SoundCloud!) */}
      {currentTrack && (
        <div
          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 transition-colors ${
            isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#181818] border-[#2E2E2E]'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative aspect-video w-24 rounded-xl overflow-hidden shrink-0 bg-black">
              <img
                src={currentTrack.artwork}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Play className="w-4 h-4 fill-white text-white" />
              </div>
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                Tiếp tục xem
              </span>
              <h3 className="font-semibold text-xs md:text-sm truncate">{currentTrack.title}</h3>
              <p className="text-[11px] text-zinc-400 truncate">{currentTrack.channelTitle || currentTrack.artist}</p>
            </div>
          </div>

          <button
            onClick={togglePlay}
            className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs shrink-0 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isPlaying ? 'Tạm dừng' : 'Tiếp tục'}</span>
          </button>
        </div>
      )}

      {/* 3. YouTube Main Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-4 gap-y-8">
        {filteredTracks.map((track) => (
          <TrackCard key={track.id} track={track} queueContext={filteredTracks} />
        ))}
      </div>

      {/* 4. Curated Playlists / Mixes section (YouTube Mixes style) */}
      <div className="pt-4 border-t border-zinc-200 dark:border-[#272727] space-y-4">
        <div className="flex items-center gap-2 text-base font-bold">
          <Flame className="w-5 h-5 text-red-600" />
          <h2>Danh sách phát phối lại (YouTube Mixes)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CURATED_PLAYLISTS.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onNavigate('playlists')}
              className={`p-3 rounded-2xl border flex items-center gap-3.5 cursor-pointer transition-colors ${
                isLight ? 'bg-white border-zinc-200 hover:bg-zinc-50' : 'bg-[#181818] border-[#272727] hover:bg-[#222222]'
              }`}
            >
              <div className="relative aspect-video w-32 rounded-xl overflow-hidden shrink-0 bg-black">
                <img
                  src={pl.artwork}
                  alt={pl.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="w-5 h-5 fill-white text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
                  Danh sách kết hợp
                </span>
                <h4 className="font-semibold text-xs md:text-sm truncate mt-0.5">{pl.title}</h4>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{pl.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
