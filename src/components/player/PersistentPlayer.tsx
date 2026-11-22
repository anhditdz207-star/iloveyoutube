import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  ListMusic,
  Sliders,
  Moon,
  Headphones,
  Film,
  Maximize2,
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from '@/context/ThemeContext';

export const PersistentPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isAudioOnly,
    playbackRate,
    queue,
    isFavorite,
    isVideoExpanded,
    setIsVideoExpanded,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleAudioOnly,
    nextTrack,
    previousTrack,
    setPlaybackRate,
    toggleFavorite,
    setQueueOpen,
    setEqualizerOpen,
    setSleepTimerOpen,
    sleepTimerRemaining,
  } = usePlayer();

  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isRateMenuOpen, setIsRateMenuOpen] = useState(false);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <footer
        className={`fixed bottom-0 left-0 right-0 h-16 border-t px-4 flex items-center justify-center text-xs z-40 transition-colors ${
          isLight ? 'bg-white border-zinc-200 text-zinc-500' : 'bg-[#212121] border-[#303030] text-zinc-400'
        }`}
      >
        Chọn một bài hát hoặc video YouTube để bắt đầu nghe.
      </footer>
    );
  }

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 h-18 border-t z-40 px-4 flex flex-col justify-center select-none shadow-xl transition-colors duration-200 ${
        isLight
          ? 'bg-white/95 backdrop-blur-md border-zinc-200 text-zinc-900'
          : 'bg-[#212121]/95 backdrop-blur-md border-[#333333] text-[#F1F1F1]'
      }`}
    >
      {/* Top Red Seekbar */}
      <div className="absolute top-0 left-0 right-0 group">
        <div
          className={`relative h-1 cursor-pointer hover:h-2 transition-all ${
            isLight ? 'bg-zinc-200' : 'bg-[#383838]'
          }`}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            seek(clickPos * duration);
          }}
        >
          <div
            className="h-full bg-red-600 relative transition-all"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Main Controls Row */}
      <div className="flex items-center justify-between gap-3 mt-0.5">
        {/* Left: Track Info & Artwork */}
        <div className="flex items-center gap-3 min-w-[200px] max-w-[32%]">
          <div
            className="relative aspect-video w-14 rounded-lg overflow-hidden shrink-0 cursor-pointer bg-black"
            onClick={() => {
              if (currentTrack.youtubeId) setIsVideoExpanded(!isVideoExpanded);
            }}
            title={currentTrack.youtubeId ? 'Bấm để phóng to / thu nhỏ video' : undefined}
          >
            <img
              src={currentTrack.artwork}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
            {currentTrack.youtubeId && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>

          <div className="overflow-hidden min-w-0">
            <div className="font-semibold text-xs truncate flex items-center gap-1.5">
              <span className="truncate">{currentTrack.title}</span>
            </div>
            <div className="text-[11px] text-zinc-400 truncate mt-0.5">
              {currentTrack.channelTitle || currentTrack.artist}
            </div>
          </div>

          <button
            onClick={() => toggleFavorite()}
            title={isFavorite ? 'Bỏ thích' : 'Thích'}
            className={`p-1.5 rounded-full transition-colors shrink-0 ${
              isFavorite ? 'text-red-600' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600' : ''}`} />
          </button>
        </div>

        {/* Center: Playback Buttons */}
        <div className="flex flex-col items-center justify-center gap-0.5 flex-1 max-w-md">
          <div className="flex items-center gap-4">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              title={isShuffle ? 'Tắt phát ngẫu nhiên' : 'Bật phát ngẫu nhiên'}
              className={`p-1.5 rounded-full transition-colors ${
                isShuffle ? 'text-red-600' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Previous */}
            <button
              onClick={previousTrack}
              title="Bài trước đó"
              className="p-1.5 rounded-full text-zinc-300 hover:text-white transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              title={isPlaying ? 'Tạm dừng' : 'Phát'}
              className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={nextTrack}
              title="Bài kế tiếp"
              className="p-1.5 rounded-full text-zinc-300 hover:text-white transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Repeat */}
            <button
              onClick={cycleRepeat}
              title="Lặp lại"
              className={`p-1.5 rounded-full transition-colors ${
                repeatMode !== 'off' ? 'text-red-600' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Time display */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Audio/Video Switch, Equalizer, Volume, Queue */}
        <div className="flex items-center gap-2">
          {/* Toggle Audio Only mode */}
          <button
            onClick={toggleAudioOnly}
            title={isAudioOnly ? 'Chế độ: Chỉ nghe nhạc' : 'Chế độ: Xem video'}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              isAudioOnly
                ? 'bg-red-600/20 text-red-500 border border-red-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {isAudioOnly ? <Headphones className="w-3.5 h-3.5" /> : <Film className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline text-[11px]">{isAudioOnly ? 'Chỉ nghe' : 'Xem video'}</span>
          </button>

          {/* Speed Selector */}
          <div className="relative">
            <button
              onClick={() => setIsRateMenuOpen(!isRateMenuOpen)}
              title="Tốc độ phát"
              className="px-2 py-1 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              {playbackRate}x
            </button>

            {isRateMenuOpen && (
              <div
                className={`absolute bottom-9 right-0 border rounded-xl shadow-xl py-1 z-50 text-xs w-20 ${
                  isLight ? 'bg-white border-zinc-200 text-zinc-800' : 'bg-[#282828] border-zinc-700 text-white'
                }`}
              >
                {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      setPlaybackRate(rate);
                      setIsRateMenuOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left hover:bg-red-600 hover:text-white ${
                      playbackRate === rate ? 'font-bold text-red-600' : ''
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Equalizer */}
          <button
            onClick={() => setEqualizerOpen(true)}
            title="Bộ chỉnh âm"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Sleep Timer */}
          <button
            onClick={() => setSleepTimerOpen(true)}
            title={sleepTimerRemaining ? `Hẹn giờ tắt: Còn ${Math.ceil(sleepTimerRemaining / 60)} phút` : 'Hẹn giờ tắt'}
            className={`p-1.5 rounded-lg relative ${
              sleepTimerRemaining ? 'text-red-600' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Moon className="w-4 h-4" />
            {sleepTimerRemaining && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-600 animate-ping" />
            )}
          </button>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button onClick={toggleMute} className="text-zinc-400 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-18 md:w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Queue Drawer */}
          <button
            onClick={() => setQueueOpen((prev) => !prev)}
            title="Danh sách phát đang chờ"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 relative"
          >
            <ListMusic className="w-4 h-4" />
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 text-[9px] font-bold px-1 rounded-full bg-red-600 text-white">
                {queue.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};
