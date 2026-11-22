import React, { useState, useEffect } from 'react';
import { History, Trash2, Play, CheckCircle2, User } from 'lucide-react';
import { getRecentHistory, clearHistory as dbClearHistory } from '@/storage/indexedDb';
import type { ListeningHistoryItem } from '@/types/music';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export const HistoryPage: React.FC = () => {
  const { playTrack } = usePlayer();
  const { theme } = useTheme();
  const { user } = useAuth();
  const isLight = theme === 'light';
  const [history, setHistory] = useState<ListeningHistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const list = await getRecentHistory(100);
    setHistory(list);
  };

  const handleClear = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử nghe/xem?')) {
      await dbClearHistory();
      setHistory([]);
    }
  };

  const formatPlayedAt = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • ${d.toLocaleDateString('vi-VN')}`;
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-[#272727] pb-4">
        <div>
          <div className="flex items-center gap-2.5 text-2xl font-extrabold">
            <History className="w-6 h-6 text-red-600" />
            <h1>Lịch Sử Xem &amp; Nghe</h1>
          </div>
          {user ? (
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
              <span>Đang lưu theo tài khoản Google:</span>
              <b className="text-white">{user.name}</b>
              <span>({user.email})</span>
            </p>
          ) : (
            <p className="text-xs text-zinc-400 mt-1">
              Đang lưu trên trình duyệt này. Hãy đăng nhập Google để đồng bộ cá nhân.
            </p>
          )}
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="px-3.5 py-1.5 rounded-full border border-zinc-700 hover:bg-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5 transition-colors w-fit"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa tất cả nhật ký</span>
          </button>
        )}
      </div>

      {/* History Items in YouTube horizontal feed format */}
      {history.length === 0 ? (
        <div className="text-center py-24 text-zinc-500 space-y-2">
          <History className="w-10 h-10 mx-auto text-zinc-600" />
          <h3 className="text-sm font-semibold">Chưa có video nào trong nhật ký</h3>
          <p className="text-xs">Xem một video hoặc bài hát bất kỳ để bắt đầu ghi nhận tại đây.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => playTrack(item.track)}
              className={`p-2 rounded-2xl flex flex-col sm:flex-row items-start gap-4 cursor-pointer group transition-colors ${
                isLight ? 'hover:bg-zinc-100' : 'hover:bg-[#1E1E1E]'
              }`}
            >
              {/* 16:9 Thumbnail */}
              <div className="relative aspect-video w-full sm:w-56 rounded-xl overflow-hidden shrink-0 bg-black">
                <img
                  src={item.track.artwork}
                  alt={item.track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 fill-white text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <h3
                  className={`font-semibold text-sm line-clamp-2 transition-colors ${
                    isLight ? 'group-hover:text-red-600' : 'group-hover:text-red-500'
                  }`}
                >
                  {item.track.title}
                </h3>

                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <span>{item.track.channelTitle || item.track.artist}</span>
                  <CheckCircle2 className="w-3 h-3 text-zinc-400" />
                </div>

                <div className="text-[11px] text-zinc-500 font-mono">
                  Đã xem lúc: {formatPlayedAt(item.playedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
