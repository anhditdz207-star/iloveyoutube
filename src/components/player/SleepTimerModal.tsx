import React from 'react';
import { X, Moon, Clock, Check } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

export const SleepTimerModal: React.FC = () => {
  const {
    isSleepTimerOpen,
    setSleepTimerOpen,
    sleepTimerRemaining,
    setSleepTimer,
    duration,
    currentTime,
  } = usePlayer();

  if (!isSleepTimerOpen) return null;

  const handleSelectMinutes = (mins: number | null) => {
    setSleepTimer(mins);
    setSleepTimerOpen(false);
  };

  const handleEndOfCurrentTrack = () => {
    const remainingSeconds = Math.max(1, Math.ceil(duration - currentTime));
    setSleepTimer(remainingSeconds / 60);
    setSleepTimerOpen(false);
  };

  const options = [
    { label: '15 phút', minutes: 15 },
    { label: '30 phút', minutes: 30 },
    { label: '45 phút', minutes: 45 },
    { label: '60 phút (1 giờ)', minutes: 60 },
    { label: '90 phút', minutes: 90 },
  ];

  const formatRemaining = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} phút ${s < 10 ? '0' : ''}${s} giây`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#12101A] border border-[#2A2440] rounded-2xl w-full max-w-sm p-6 shadow-2xl relative flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-[#2A2440] pb-3">
          <div className="flex items-center gap-2 text-[#C084FC]">
            <Moon className="w-5 h-5" />
            <h2 className="text-base font-bold text-[#F5F3FA]">Hẹn giờ tắt nhạc</h2>
          </div>
          <button
            onClick={() => setSleepTimerOpen(false)}
            className="p-1 text-[#A39AAF] hover:text-[#F5F3FA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sleepTimerRemaining && (
          <div className="p-3 rounded-xl bg-[#9B5CFF]/15 border border-[#9B5CFF]/40 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#C084FC] animate-spin" />
            <div className="text-xs">
              <span className="text-[#A39AAF]">Đang đếm ngược: </span>
              <span className="font-bold text-[#F5F3FA]">{formatRemaining(sleepTimerRemaining)}</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt.minutes}
              onClick={() => handleSelectMinutes(opt.minutes)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#191625] border border-[#2A2440] hover:border-[#9B5CFF]/50 text-sm font-medium text-[#F5F3FA] hover:text-[#C084FC] transition-colors"
            >
              <span>{opt.label}</span>
              <Clock className="w-4 h-4 text-[#6C657A]" />
            </button>
          ))}

          <button
            onClick={handleEndOfCurrentTrack}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#191625] border border-[#2A2440] hover:border-[#9B5CFF]/50 text-sm font-medium text-[#F5F3FA] hover:text-[#C084FC] transition-colors"
          >
            <span>Dừng khi hết bài này</span>
            <Check className="w-4 h-4 text-[#6C657A]" />
          </button>

          {sleepTimerRemaining && (
            <button
              onClick={() => handleSelectMinutes(null)}
              className="w-full p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors mt-2"
            >
              Hủy hẹn giờ tắt
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
