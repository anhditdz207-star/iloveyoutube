import React, { useState } from 'react';
import { TrackCard } from '@/components/common/TrackCard';
import { CURATED_TRACKS } from '@/data/curatedMedia';
import { useTheme } from '@/context/ThemeContext';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [activeChip, setActiveChip] = useState('all');

  const chips = [
    { id: 'all', label: 'Tất cả' },
    { id: 'vpop', label: 'V-Pop' },
    { id: 'usuk', label: 'Pop US-UK' },
    { id: 'lofi', label: 'Lo-Fi Chill' },
    { id: 'rock', label: 'Pop Rock' },
  ];

  const filteredTracks =
    activeChip === 'all'
      ? CURATED_TRACKS
      : activeChip === 'vpop'
      ? CURATED_TRACKS.filter((t) => t.genre?.includes('V-Pop'))
      : activeChip === 'usuk'
      ? CURATED_TRACKS.filter((t) => t.genre?.includes('Pop US-UK') || t.genre?.includes('Funk'))
      : activeChip === 'lofi'
      ? CURATED_TRACKS.filter((t) => t.genre?.includes('Lo-Fi'))
      : activeChip === 'rock'
      ? CURATED_TRACKS.filter((t) => t.genre?.includes('Rock'))
      : CURATED_TRACKS;

  return (
    <div className="space-y-5 pb-20 select-none max-w-7xl mx-auto">
      {/* 1. Category Pills Bar (YouTube Standard) */}
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

      {/* 2. YouTube Feed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-7">
        {filteredTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            queueContext={filteredTracks}
          />
        ))}
      </div>
    </div>
  );
};
