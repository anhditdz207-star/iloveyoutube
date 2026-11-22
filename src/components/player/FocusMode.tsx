import React, { useEffect, useRef } from 'react';
import { Minimize2, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { audioEngine } from '@/services/audioEngine';

export const FocusMode: React.FC = () => {
  const {
    isFocusMode,
    setFocusMode,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isFavorite,
    toggleFavorite,
  } = usePlayer();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isFocusMode) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      animId = requestAnimationFrame(render);
      const data = audioEngine.getVisualizerData();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / data.length) * 1.5;
      let x = 0;

      for (let i = 0; i < data.length; i++) {
        const barHeight = (data[i] / 255) * canvas.height * 0.7;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, 'rgba(155, 92, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(192, 132, 252, 0.8)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 3, barHeight);
        x += barWidth;
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isFocusMode]);

  if (!isFocusMode || !currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0A10] flex flex-col justify-between p-6 md:p-12 overflow-hidden select-none">
      {/* Background Soft Glow */}
      <div
        className="absolute inset-0 opacity-20 blur-3xl pointer-events-none scale-125 transition-all duration-1000"
        style={{
          backgroundImage: `radial-gradient(circle at center, #9B5CFF 0%, transparent 70%), url(${currentTrack.artwork})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C084FC] bg-[#191625]/80 px-3 py-1.5 rounded-full border border-[#9B5CFF]/30">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Chế độ Tập trung • Focus Mode</span>
        </div>
        <button
          onClick={() => setFocusMode(false)}
          title="Thoát chế độ tập trung (Esc)"
          className="p-2.5 rounded-xl bg-[#191625]/80 border border-[#2A2440] text-[#A39AAF] hover:text-[#F5F3FA] hover:border-[#9B5CFF] transition-all"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Center Artwork & Visualizer */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        <div className="relative group">
          <img
            src={currentTrack.artwork}
            alt={currentTrack.title}
            className={`w-64 h-64 md:w-84 md:h-84 rounded-3xl object-cover shadow-[0_20px_50px_rgba(155,92,255,0.35)] border-2 border-[#2A2440] transition-transform duration-700 ${
              isPlaying ? 'scale-105' : 'scale-100 opacity-90'
            }`}
          />
        </div>

        {/* Real-time Web Audio Visualizer */}
        <div className="w-72 md:w-96 h-14 mt-8 flex justify-center">
          <canvas ref={canvasRef} width={384} height={56} className="w-full h-full" />
        </div>

        {/* Track Info */}
        <div className="text-center mt-4 max-w-lg">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-[#F5F3FA] tracking-tight truncate">
              {currentTrack.title}
            </h1>
            <button onClick={() => toggleFavorite()} className="text-[#9B5CFF]">
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#9B5CFF]' : ''}`} />
            </button>
          </div>
          <p className="text-base text-[#C084FC] mt-1 font-medium">{currentTrack.artist}</p>
          {currentTrack.album && (
            <p className="text-xs text-[#6C657A] mt-0.5">{currentTrack.album}</p>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 max-w-2xl mx-auto w-full space-y-4">
        {/* Seekbar */}
        <div className="space-y-1.5">
          <div
            className="h-2 bg-[#191625] rounded-full overflow-hidden cursor-pointer relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              seek(clickPos * duration);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-[#9B5CFF] to-[#C084FC] rounded-full shadow-[0_0_12px_#9B5CFF]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#A39AAF] font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-[#A39AAF] hover:text-[#F5F3FA]">
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 h-1 bg-[#2A2440] accent-[#9B5CFF] cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-6">
            <button onClick={previousTrack} className="p-2 text-[#A39AAF] hover:text-[#F5F3FA] transition-colors">
              <SkipBack className="w-7 h-7" />
            </button>
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9B5CFF] to-[#C084FC] text-white flex items-center justify-center shadow-2xl shadow-[#9B5CFF]/50 hover:scale-105 active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
            </button>
            <button onClick={nextTrack} className="p-2 text-[#A39AAF] hover:text-[#F5F3FA] transition-colors">
              <SkipForward className="w-7 h-7" />
            </button>
          </div>

          <div className="w-28 text-right text-xs text-[#6C657A]">
            Bấm <b>Esc</b> để thoát
          </div>
        </div>
      </div>
    </div>
  );
};
