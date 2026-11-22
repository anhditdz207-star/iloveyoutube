import React from 'react';
import { Heart, Play, Shuffle } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useAuth } from '@/context/AuthContext';
import { TrackCard } from '@/components/common/TrackCard';

export const FavoritesPage: React.FC = () => {
  const { favorites, playTrack } = usePlayer();
  const { user } = useAuth();

  const handlePlayAll = () => {
    if (favorites.length > 0) {
      playTrack(favorites[0], favorites);
    }
  };

  const handleShuffleAll = () => {
    if (favorites.length > 0) {
      const shuffled = [...favorites].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-[#272727] pb-4">
        <div>
          <div className="flex items-center gap-2.5 text-2xl font-extrabold">
            <Heart className="w-6 h-6 text-red-600 fill-red-600" />
            <h1>Video &amp; Bài Hát Đã Thích</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {favorites.length} video trong danh sách yêu thích
            {user ? ` của ${user.name}` : ''}.
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayAll}
              className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Phát tất cả</span>
            </button>
            <button
              onClick={handleShuffleAll}
              className="px-4 py-2 rounded-full border border-zinc-700 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center gap-2 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Xáo trộn</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      {favorites.length === 0 ? (
        <div className="text-center py-24 text-zinc-500 space-y-2">
          <Heart className="w-10 h-10 mx-auto text-zinc-600" />
          <h3 className="text-sm font-semibold">Chưa có video nào được thích</h3>
          <p className="text-xs">Bấm biểu tượng trái tim khi xem để lưu video vào danh sách này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-4 gap-y-8">
          {favorites.map((track) => (
            <TrackCard key={track.id} track={track} queueContext={favorites} />
          ))}
        </div>
      )}
    </div>
  );
};
