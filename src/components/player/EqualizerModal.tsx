import React, { useState, useEffect } from 'react';
import { X, Sliders, RotateCcw } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import {
  audioEngine,
  EQUALIZER_FREQUENCIES,
  EQUALIZER_PRESETS,
} from '@/services/audioEngine';
import type { EqualizerPreset, EqualizerBand } from '@/types/settings';
import { loadSettings, saveSettings } from '@/storage/localStorage';

export const EqualizerModal: React.FC = () => {
  const { isEqualizerOpen, setEqualizerOpen } = usePlayer();
  const [currentPreset, setCurrentPreset] = useState<EqualizerPreset>('default');
  const [bands, setBands] = useState<EqualizerBand[]>(() => {
    const s = loadSettings();
    return s.equalizer.bands;
  });

  useEffect(() => {
    if (isEqualizerOpen) {
      const s = loadSettings();
      setCurrentPreset(s.equalizer.preset);
      setBands(s.equalizer.bands);
    }
  }, [isEqualizerOpen]);

  if (!isEqualizerOpen) return null;

  const handlePresetChange = (preset: EqualizerPreset) => {
    setCurrentPreset(preset);
    const updated = audioEngine.applyPreset(preset);
    setBands(updated);

    const s = loadSettings();
    s.equalizer.preset = preset;
    s.equalizer.bands = updated;
    saveSettings(s);
  };

  const handleBandGainChange = (index: number, newGain: number) => {
    const copy = [...bands];
    copy[index] = { ...copy[index], gain: newGain };
    setBands(copy);
    setCurrentPreset('custom');
    audioEngine.setEqualizerBands(copy);

    const s = loadSettings();
    s.equalizer.preset = 'custom';
    s.equalizer.bands = copy;
    saveSettings(s);
  };

  const handleReset = () => {
    handlePresetChange('default');
  };

  const presetLabels: Record<EqualizerPreset, string> = {
    default: 'Mặc định',
    bass_boost: 'Bass Boost',
    pop: 'Pop',
    rock: 'Rock',
    classical: 'Classical',
    acoustic: 'Acoustic',
    custom: 'Tùy chỉnh',
  };

  const formatFreq = (hz: number) => {
    return hz >= 1000 ? `${hz / 1000}k` : `${hz}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#12101A] border border-[#2A2440] rounded-2xl w-full max-w-xl p-6 shadow-2xl relative flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2440] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#9B5CFF]/20 text-[#C084FC]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F5F3FA]">Bộ chỉnh âm (Equalizer 7-Band)</h2>
              <p className="text-xs text-[#A39AAF]">Web Audio API • Tinh chỉnh tần số chất lượng cao</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              title="Đặt lại về mặc định"
              className="p-2 rounded-xl text-[#A39AAF] hover:text-[#F5F3FA] hover:bg-[#191625] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEqualizerOpen(false)}
              className="p-2 rounded-xl text-[#A39AAF] hover:text-[#F5F3FA] hover:bg-[#191625] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Selector */}
        <div>
          <label className="text-xs font-semibold text-[#A39AAF] uppercase tracking-wider block mb-2.5">
            Cấu hình âm thanh thiết lập sẵn:
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(presetLabels) as EqualizerPreset[]).map((p) => (
              <button
                key={p}
                onClick={() => handlePresetChange(p)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currentPreset === p
                    ? 'bg-[#9B5CFF] text-white shadow-[0_0_12px_rgba(155,92,255,0.4)]'
                    : 'bg-[#191625] text-[#A39AAF] border border-[#2A2440] hover:text-[#F5F3FA]'
                }`}
              >
                {presetLabels[p]}
              </button>
            ))}
          </div>
        </div>

        {/* 7 Vertical Sliders */}
        <div className="grid grid-cols-7 gap-2 md:gap-4 py-4 bg-[#0B0A10]/60 rounded-xl p-4 border border-[#2A2440]/60">
          {bands.map((band, idx) => (
            <div key={band.frequency} className="flex flex-col items-center gap-3">
              <span className="text-[11px] font-mono text-[#C084FC]">
                {band.gain > 0 ? `+${band.gain}` : band.gain}dB
              </span>

              {/* Vertical slider wrapper */}
              <div className="h-40 flex items-center justify-center relative">
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="0.5"
                  value={band.gain}
                  onChange={(e) => handleBandGainChange(idx, parseFloat(e.target.value))}
                  className="h-36 w-2 accent-[#9B5CFF] appearance-none cursor-pointer [writing-mode:vertical-lr] [direction:rtl]"
                />
              </div>

              <span className="text-xs font-bold text-[#F5F3FA] font-mono">
                {formatFreq(band.frequency)}Hz
              </span>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-between text-xs text-[#A39AAF] pt-2">
          <span>* Áp dụng trực tiếp vào luồng âm thanh thông qua BiquadFilterNode.</span>
          <button
            onClick={() => setEqualizerOpen(false)}
            className="px-5 py-2 rounded-xl bg-[#9B5CFF] text-white font-semibold text-xs hover:bg-[#8A46FF] transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
