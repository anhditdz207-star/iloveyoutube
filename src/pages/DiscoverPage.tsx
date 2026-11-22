import React, { useState } from 'react';
import { Compass, Music, Sparkles, Filter, Play } from 'lucide-react';
import { CURATED_TRACKS } from '@/data/curatedMedia';
import { TrackCard } from '@/components/common/TrackCard';
import { usePlayer } from '@/context/PlayerContext';

export const DiscoverPage: React.FC = () => {
  const { playTrack } = usePlayer();
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const genres = [
    { id: 'all', label: 'Tất cả thể loại' },
    { id: 'lo-fi', label: 'Lo-Fi / Chillhop' },
    { id: 'synthwave', label: 'Synthwave / Retro' },
    { id: 'ambient', label: 'Ambient / Piano' },
    { id: 'cinematic', label: 'Cinematic / Phim' },
    { id: 'acoustic', label: 'Acoustic / Mộc' },
    { id: 'electronic', label: 'Electronic / Focus' },
  ];

  const filteredTracks = selectedGenre === 'all'
    ? CURATED_TRACKS
    : CURATED_TRACKS.filter((t) => t.genre?.toLowerCase().includes(selectedGenre));

  const moods = [
    { title: 'Tập trung viết mã', desc: 'Nhịp điệu Lo-fi êm dịu, không lời gây xao nhãng', color: 'from-purple-900/60 to-indigo-900/40' },
    { title: 'Dựng phim Cinematic', desc: 'Âm hưởng giao hưởng hào hùng cho video du lịch & trailer', color: 'from-amber-900/60 to-rose-900/40' },
    { title: 'Thư giãn ban đêm', desc: 'Tiếng mưa rơi nhẹ cùng phím piano sâu lắng', color: 'from-blue-900/60 to-purple-900/40' },
    { title: 'Cảm hứng sáng tạo', desc: 'Dòng chảy synthwave neon đầy năng lượng', color: 'from-fuchsia-900/60 to-purple-900/40' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 text-2xl font-extrabold text-[#F5F3FA]">
          <div className="p-2 rounded-xl bg-[#9B5CFF]/20 text-[#C084FC]">
            <Compass className="w-6 h-6" />
          </div>
          <h1>Khám Phá Âm Nhạc & Cảm Hứng</h1>
        </div>
        <p className="text-sm text-[#A39AAF] mt-1">
          Tìm kiếm những sắc thái âm thanh mới, lọc theo thể loại và cảm xúc sáng tác.
        </p>
      </div>

      {/* Mood Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {moods.map((mood, i) => (
          <div
            key={mood.title}
            onClick={() => {
              const track = CURATED_TRACKS[i % CURATED_TRACKS.length];
              if (track) playTrack(track, CURATED_TRACKS);
            }}
            className={`p-5 rounded-2xl bg-gradient-to-br ${mood.color} border border-[#2A2440] hover:border-[#9B5CFF]/50 transition-all cursor-pointer group flex flex-col justify-between h-36`}
          >
            <div>
              <h3 className="font-bold text-base text-[#F5F3FA] group-hover:text-[#C084FC] transition-colors">
                {mood.title}
              </h3>
              <p className="text-xs text-[#A39AAF] mt-1 line-clamp-2">{mood.desc}</p>
            </div>
            <div className="flex justify-end">
              <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#9B5CFF] text-white flex items-center justify-center transition-all">
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGenre(g.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGenre === g.id
                ? 'bg-[#9B5CFF] text-white shadow-md shadow-[#9B5CFF]/30'
                : 'bg-[#191625] text-[#A39AAF] border border-[#2A2440] hover:text-[#F5F3FA]'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Track Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-[#A39AAF]">
          <span>Hiển thị <b>{filteredTracks.length}</b> bài hát</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredTracks.map((track) => (
            <TrackCard key={track.id} track={track} queueContext={filteredTracks} />
          ))}
        </div>
      </div>
    </div>
  );
};
