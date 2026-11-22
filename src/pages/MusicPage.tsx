import React, { useState, useRef } from 'react';
import { Music, Play, Shuffle, Upload, Search, List, Grid } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from '@/context/ThemeContext';
import { TrackCard } from '@/components/common/TrackCard';
import type { Track } from '@/types/music';
import { contentProviders } from '@/services/contentProviders';

export const MusicPage: React.FC = () => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [tracks, setTracks] = useState<Track[]>(() => contentProviders.getTracks());
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filtered = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase()) ||
      (t.genre && t.genre.toLowerCase().includes(search.toLowerCase()))
  );

  const handlePlayAll = () => {
    if (filtered.length > 0) {
      playTrack(filtered[0], filtered);
    }
  };

  const handleShuffleAll = () => {
    if (filtered.length > 0) {
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const newTrack: Track = {
        id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: file.name.replace(/\.[a-z0-9]+$/i, ''),
        artist: 'Nhạc Tải Từ Máy Cục Bộ',
        duration: 0,
        artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
        audioUrl: url,
        source: 'local',
        isLocal: true,
        genre: 'Local Audio',
        addedAt: Date.now(),
      };

      contentProviders.addLocalTrack(newTrack);
      setTracks((prev) => [newTrack, ...prev]);
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 text-2xl font-extrabold">
            <div
              className={`p-2 rounded-xl ${
                isLight ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/20 text-purple-400'
              }`}
            >
              <Music className="w-6 h-6" />
            </div>
            <h1>Chuyên Trang Âm Nhạc</h1>
          </div>
          <p className={`text-xs md:text-sm mt-1 ${isLight ? 'text-zinc-500' : 'text-[#9B92A8]'}`}>
            Không gian nghe nhạc cá nhân tập trung, không quảng cáo, lưu trữ an toàn trên máy.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePlayAll}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Phát tất cả</span>
          </button>

          <button
            onClick={handleShuffleAll}
            className={`px-4 py-2 rounded-xl border font-semibold text-xs flex items-center gap-2 transition-all ${
              isLight
                ? 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-100'
                : 'bg-[#151222] border-[#262038] text-[#F5F3FA] hover:bg-[#1E192F]'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Phát ngẫu nhiên</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`px-4 py-2 rounded-xl border font-semibold text-xs flex items-center gap-2 transition-all ${
              isLight
                ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                : 'bg-purple-900/20 border-purple-500/30 text-purple-300 hover:bg-purple-900/40'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Nhập nhạc từ máy</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            multiple
            className="hidden"
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl border ${
          isLight ? 'bg-white border-zinc-200 shadow-xs' : 'bg-[#12101A] border-[#262038]'
        }`}
      >
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Lọc bài hát hoặc nghệ sĩ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full border text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none ${
              isLight
                ? 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-purple-600 focus:bg-white'
                : 'bg-[#171424] border-[#262038] text-[#F5F3FA] focus:border-purple-500'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className={`text-xs ${isLight ? 'text-zinc-500' : 'text-[#9B92A8]'}`}>
            {filtered.length} bài hát
          </span>
          <div
            className={`flex items-center p-1 rounded-xl border ${
              isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-[#171424] border-[#262038]'
            }`}
          >
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${
                viewMode === 'table'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Track Listing */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {filtered.map((track) => (
            <TrackCard key={track.id} track={track} queueContext={filtered} />
          ))}
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden ${
            isLight ? 'bg-white border-zinc-200' : 'bg-[#12101A] border-[#262038]'
          }`}
        >
          <div
            className={`grid grid-cols-12 px-4 py-2.5 border-b text-[11px] font-semibold uppercase tracking-wider ${
              isLight ? 'border-zinc-200 text-zinc-400' : 'border-[#262038] text-[#6B627A]'
            }`}
          >
            <span className="col-span-1 text-center">#</span>
            <span className="col-span-6">Bài hát / Nghệ sĩ</span>
            <span className="col-span-3">Thể loại</span>
            <span className="col-span-2 text-right">Thời lượng</span>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-[#262038]/50">
            {filtered.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => playTrack(track, filtered)}
                  className={`grid grid-cols-12 px-4 py-2.5 items-center text-xs transition-colors cursor-pointer group ${
                    isCurrent
                      ? isLight
                        ? 'bg-purple-50 text-purple-700 font-medium'
                        : 'bg-purple-900/20 text-purple-300 font-medium'
                      : isLight
                      ? 'hover:bg-zinc-50 text-zinc-800'
                      : 'hover:bg-[#171424] text-[#F5F3FA]'
                  }`}
                >
                  <span className="col-span-1 text-center font-mono text-zinc-400">
                    {isCurrent && isPlaying ? '▶' : idx + 1}
                  </span>
                  <div className="col-span-6 flex items-center gap-3">
                    <img
                      src={track.artwork}
                      alt={track.title}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-semibold truncate">{track.title}</div>
                      <div className={`text-[11px] truncate ${isLight ? 'text-zinc-500' : 'text-[#9B92A8]'}`}>
                        {track.artist}
                      </div>
                    </div>
                  </div>
                  <span className={`col-span-3 truncate ${isLight ? 'text-zinc-500' : 'text-[#9B92A8]'}`}>
                    {track.genre || 'Music'}
                  </span>
                  <span className="col-span-2 text-right font-mono text-zinc-400">
                    {Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
