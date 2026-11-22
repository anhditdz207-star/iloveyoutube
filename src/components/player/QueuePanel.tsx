import React from 'react';
import { X, Trash2, ArrowUp, ArrowDown, Play, Sparkles, Radio, Music } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { CURATED_TRACKS } from '@/data/curatedMedia';

export const QueuePanel: React.FC = () => {
  const {
    isQueueOpen,
    setQueueOpen,
    queue,
    queueIndex,
    currentTrack,
    playTrack,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    addToQueue,
  } = usePlayer();

  if (!isQueueOpen) return null;

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= queue.length) return;
    const copy = [...queue];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    reorderQueue(copy);
  };

  // Smart suggestions: find tracks not currently in queue or similar genre
  const smartSuggestions = CURATED_TRACKS.filter(
    (t) => !queue.some((q) => q.id === t.id)
  );

  return (
    <aside className="fixed inset-y-0 right-0 w-80 md:w-96 bg-[#12101A]/95 backdrop-blur-2xl border-l border-[#2A2440] z-50 flex flex-col shadow-2xl transition-all">
      {/* Header */}
      <div className="h-16 px-4 border-b border-[#2A2440] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-[#9B5CFF]" />
          <h2 className="font-bold text-base text-[#F5F3FA]">Hàng đợi phát ({queue.length})</h2>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              title="Xóa danh sách chờ"
              className="p-1.5 rounded-lg text-xs text-[#A39AAF] hover:text-red-400 hover:bg-[#191625] transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa</span>
            </button>
          )}
          <button
            onClick={() => setQueueOpen(false)}
            aria-label="Đóng hàng đợi"
            className="p-1.5 rounded-lg text-[#A39AAF] hover:text-[#F5F3FA] hover:bg-[#191625] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Queue Track List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {queue.length === 0 ? (
          <div className="text-center py-12 text-[#6C657A] text-sm">
            Hàng đợi đang trống. Hãy thêm bài hát từ Thư viện hoặc Trang chủ!
          </div>
        ) : (
          queue.map((track, idx) => {
            const isCurrent = idx === queueIndex;
            return (
              <div
                key={`${track.id}-${idx}`}
                className={`flex items-center gap-2 p-2 rounded-xl border transition-all group ${
                  isCurrent
                    ? 'bg-[#9B5CFF]/15 border-[#9B5CFF]/40 shadow-[0_0_12px_rgba(155,92,255,0.2)]'
                    : 'bg-[#191625]/60 border-[#2A2440]/60 hover:bg-[#191625]'
                }`}
              >
                {/* Index / Playing indicator */}
                <span className="w-5 text-center text-xs text-[#A39AAF] font-mono">
                  {isCurrent ? '▶' : idx + 1}
                </span>

                {/* Artwork */}
                <img
                  src={track.artwork}
                  alt={track.title}
                  className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#2A2440]"
                />

                {/* Info */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => playTrack(track)}
                >
                  <div className={`text-xs font-semibold truncate ${isCurrent ? 'text-[#C084FC]' : 'text-[#F5F3FA]'}`}>
                    {track.title}
                  </div>
                  <div className="text-[11px] text-[#A39AAF] truncate">{track.artist}</div>
                </div>

                {/* Reorder Buttons */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => moveItem(idx, idx - 1)}
                    disabled={idx === 0}
                    title="Di chuyển lên"
                    className="p-1 text-[#A39AAF] hover:text-[#F5F3FA] disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, idx + 1)}
                    disabled={idx === queue.length - 1}
                    title="Di chuyển xuống"
                    className="p-1 text-[#A39AAF] hover:text-[#F5F3FA] disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeFromQueue(idx)}
                    title="Xóa khỏi hàng đợi"
                    className="p-1 text-[#A39AAF] hover:text-red-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Smart Queue Suggestions */}
        {smartSuggestions.length > 0 && (
          <div className="pt-6 pb-2">
            <div className="flex items-center gap-1.5 px-2 mb-3 text-xs font-bold text-[#C084FC] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gợi ý thông minh (Smart Queue)</span>
            </div>
            <div className="space-y-1.5">
              {smartSuggestions.slice(0, 3).map((suggested) => (
                <div
                  key={suggested.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#191625]/40 border border-[#2A2440]/40 hover:border-[#9B5CFF]/30 transition-all text-xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img
                      src={suggested.artwork}
                      alt={suggested.title}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div className="truncate">
                      <div className="font-medium text-[#F5F3FA] truncate">{suggested.title}</div>
                      <div className="text-[10px] text-[#A39AAF]">{suggested.artist}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => addToQueue(suggested)}
                    className="px-2 py-1 rounded-lg bg-[#9B5CFF]/20 text-[#C084FC] hover:bg-[#9B5CFF] hover:text-white transition-colors text-[11px] font-medium shrink-0"
                  >
                    + Thêm
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
