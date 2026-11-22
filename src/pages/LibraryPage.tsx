import React, { useState, useEffect } from 'react';
import {
  Library,
  Heart,
  ListMusic,
  FolderArchive,
  History,
  Play,
  ArrowRight,
  Database,
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { CURATED_PLAYLISTS } from '@/data/curatedMedia';
import { getAllAssets, getAllPlaylists } from '@/storage/indexedDb';
import type { MediaAsset } from '@/types/media';
import type { Playlist } from '@/types/music';

interface LibraryPageProps {
  onNavigate: (tab: string) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ onNavigate }) => {
  const { favorites, playTrack } = usePlayer();
  const [playlists, setPlaylists] = useState<Playlist[]>(CURATED_PLAYLISTS);
  const [assets, setAssets] = useState<MediaAsset[]>([]);

  useEffect(() => {
    getAllPlaylists().then((dbLists) => {
      if (dbLists.length > 0) setPlaylists([...CURATED_PLAYLISTS, ...dbLists]);
    });
    getAllAssets().then((dbAssets) => setAssets(dbAssets));
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 text-2xl font-extrabold text-[#F5F3FA]">
          <div className="p-2 rounded-xl bg-[#9B5CFF]/20 text-[#C084FC]">
            <Library className="w-6 h-6" />
          </div>
          <h1>Thư Viện Cá Nhân</h1>
        </div>
        <p className="text-sm text-[#A39AAF] mt-1">
          Tổng quan toàn bộ bộ sưu tập bài hát, playlist, lịch sử nghe và kho tài nguyên dựng phim của bạn.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('favorites')}
          className="p-5 rounded-2xl bg-[#191625]/60 hover:bg-[#191625] border border-[#2A2440] hover:border-[#9B5CFF]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A39AAF]">Bài hát yêu thích</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
              <Heart className="w-4 h-4 fill-pink-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#F5F3FA] mt-3 font-mono">
            {favorites.length}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#C084FC] mt-2 group-hover:underline">
            <span>Mở danh sách</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('playlists')}
          className="p-5 rounded-2xl bg-[#191625]/60 hover:bg-[#191625] border border-[#2A2440] hover:border-[#9B5CFF]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A39AAF]">Playlist cá nhân</span>
            <div className="p-2 rounded-xl bg-[#9B5CFF]/10 text-[#9B5CFF] group-hover:scale-110 transition-transform">
              <ListMusic className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#F5F3FA] mt-3 font-mono">
            {playlists.length}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#C084FC] mt-2 group-hover:underline">
            <span>Quản lý</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('assets')}
          className="p-5 rounded-2xl bg-[#191625]/60 hover:bg-[#191625] border border-[#2A2440] hover:border-[#9B5CFF]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A39AAF]">Tài nguyên dựng phim</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <FolderArchive className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#F5F3FA] mt-3 font-mono">
            {assets.length + 5}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#C084FC] mt-2 group-hover:underline">
            <span>Xem kho tài nguyên</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        <div
          onClick={() => onNavigate('history')}
          className="p-5 rounded-2xl bg-[#191625]/60 hover:bg-[#191625] border border-[#2A2440] hover:border-[#9B5CFF]/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A39AAF]">Lịch sử nghe</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#F5F3FA] mt-3 font-mono">
            Thời gian thực
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#C084FC] mt-2 group-hover:underline">
            <span>Xem nhật ký</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Playlists Quick Access */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F5F3FA]">Playlist của bạn</h2>
          <button
            onClick={() => onNavigate('playlists')}
            className="text-xs text-[#C084FC] hover:underline"
          >
            Tạo playlist mới +
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => {
                if (pl.tracks.length > 0) playTrack(pl.tracks[0], pl.tracks);
              }}
              className="p-4 rounded-2xl bg-[#191625]/60 border border-[#2A2440] hover:border-[#9B5CFF]/50 flex items-center gap-4 cursor-pointer group transition-all"
            >
              <img
                src={pl.artwork || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400'}
                alt={pl.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-[#F5F3FA] group-hover:text-[#C084FC] truncate">
                  {pl.title}
                </h3>
                <p className="text-xs text-[#A39AAF] mt-0.5">{pl.tracks.length} bài hát</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#9B5CFF]/20 text-[#C084FC] group-hover:bg-[#9B5CFF] group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
