import React, { useState, useEffect } from 'react';
import { ListMusic, Plus, Play, Shuffle, Trash2, Edit2, X, Music } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { CURATED_PLAYLISTS, CURATED_TRACKS } from '@/data/curatedMedia';
import { getAllPlaylists, savePlaylist, deletePlaylist as dbDeletePlaylist } from '@/storage/indexedDb';
import type { Playlist, Track } from '@/types/music';

export const PlaylistsPage: React.FC = () => {
  const { playTrack } = usePlayer();
  const [playlists, setPlaylists] = useState<Playlist[]>(CURATED_PLAYLISTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newArtwork, setNewArtwork] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    getAllPlaylists().then((dbLists) => {
      if (dbLists.length > 0) {
        setPlaylists([...CURATED_PLAYLISTS, ...dbLists]);
      }
    });
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;

    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Playlist cá nhân tự tạo',
      artwork:
        newArtwork.trim() ||
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      tracks: [CURATED_TRACKS[0], CURATED_TRACKS[1]],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await savePlaylist(newPl);
    setPlaylists((prev) => [newPl, ...prev]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewArtwork('');
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc chắn muốn xóa playlist này?')) {
      await dbDeletePlaylist(id);
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
      if (selectedPlaylist?.id === id) setSelectedPlaylist(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 text-2xl font-extrabold text-[#F5F3FA]">
            <div className="p-2 rounded-xl bg-[#9B5CFF]/20 text-[#C084FC]">
              <ListMusic className="w-6 h-6" />
            </div>
            <h1>Playlist Của Tôi</h1>
          </div>
          <p className="text-sm text-[#A39AAF] mt-1">
            Tạo, quản lý và sắp xếp các danh sách phát phục vụ học tập, thư giãn hoặc dựng video.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9B5CFF] to-[#C084FC] text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-[#9B5CFF]/30 hover:scale-105 active:scale-95 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo playlist mới</span>
        </button>
      </div>

      {/* Playlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => setSelectedPlaylist(playlist)}
            className="group p-4 rounded-2xl bg-[#191625]/60 hover:bg-[#191625] border border-[#2A2440] hover:border-[#9B5CFF]/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3.5 bg-[#12101A]">
                <img
                  src={playlist.artwork}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (playlist.tracks.length > 0) playTrack(playlist.tracks[0], playlist.tracks);
                    }}
                    className="w-12 h-12 rounded-full bg-[#9B5CFF] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                  >
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono text-white">
                  {playlist.tracks.length} bài
                </div>
              </div>

              <h3 className="font-bold text-base text-[#F5F3FA] group-hover:text-[#C084FC] transition-colors truncate">
                {playlist.title}
              </h3>
              <p className="text-xs text-[#A39AAF] mt-1 line-clamp-2">{playlist.description}</p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2A2440]/60 text-xs text-[#6C657A]">
              <span>Cập nhật gần đây</span>
              {playlist.id.startsWith('pl-') && (
                <button
                  onClick={(e) => handleDelete(playlist.id, e)}
                  title="Xóa playlist"
                  className="p-1 text-[#6C657A] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Playlist Detail Modal */}
      {selectedPlaylist && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12101A] border border-[#2A2440] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#2A2440] pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPlaylist.artwork}
                  alt={selectedPlaylist.title}
                  className="w-14 h-14 rounded-xl object-cover border border-[#2A2440]"
                />
                <div>
                  <h3 className="font-bold text-lg text-[#F5F3FA]">{selectedPlaylist.title}</h3>
                  <p className="text-xs text-[#A39AAF]">{selectedPlaylist.tracks.length} bài hát</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlaylist(null)}
                className="p-2 text-[#A39AAF] hover:text-[#F5F3FA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (selectedPlaylist.tracks.length > 0) {
                    playTrack(selectedPlaylist.tracks[0], selectedPlaylist.tracks);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#9B5CFF] text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#8A46FF]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Phát danh sách này</span>
              </button>
            </div>

            {/* Tracks */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {selectedPlaylist.tracks.map((track, i) => (
                <div
                  key={`${track.id}-${i}`}
                  onClick={() => playTrack(track, selectedPlaylist.tracks)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#191625] hover:bg-[#252136] text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="w-5 text-center text-[#6C657A] font-mono">{i + 1}</span>
                    <div className="truncate">
                      <div className="font-medium text-[#F5F3FA] group-hover:text-[#C084FC] truncate">
                        {track.title}
                      </div>
                      <div className="text-[10px] text-[#A39AAF]">{track.artist}</div>
                    </div>
                  </div>
                  <span className="text-[#6C657A] font-mono text-[11px]">
                    {Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12101A] border border-[#2A2440] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2440] pb-3">
              <h3 className="font-bold text-base text-[#F5F3FA]">Tạo Playlist Mới</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#A39AAF] hover:text-[#F5F3FA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#A39AAF] font-medium block mb-1">Tên playlist (*)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nhạc Lofi Dựng Phim..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#191625] border border-[#2A2440] text-[#F5F3FA] focus:outline-none focus:border-[#9B5CFF]"
                />
              </div>

              <div>
                <label className="text-[#A39AAF] font-medium block mb-1">Mô tả (tùy chọn)</label>
                <textarea
                  placeholder="Ghi chú về mục đích sử dụng danh sách này..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#191625] border border-[#2A2440] text-[#F5F3FA] focus:outline-none focus:border-[#9B5CFF] resize-none h-20"
                />
              </div>

              <div>
                <label className="text-[#A39AAF] font-medium block mb-1">Ảnh bìa (URL ảnh)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newArtwork}
                  onChange={(e) => setNewArtwork(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#191625] border border-[#2A2440] text-[#F5F3FA] focus:outline-none focus:border-[#9B5CFF]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2440]">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#A39AAF] hover:text-[#F5F3FA]"
              >
                Hủy
              </button>
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim()}
                className="px-5 py-2 rounded-xl bg-[#9B5CFF] text-white font-semibold text-xs hover:bg-[#8A46FF] disabled:opacity-50 transition-colors"
              >
                Tạo ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
