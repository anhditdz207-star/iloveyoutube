import type { EqualizerBand, EqualizerPreset } from '@/types/settings';

export const EQUALIZER_FREQUENCIES = [60, 170, 350, 1000, 3000, 8000, 14000];

export const EQUALIZER_PRESETS: Record<EqualizerPreset, number[]> = {
  default: [0, 0, 0, 0, 0, 0, 0],
  bass_boost: [6, 5, 3, 0, 0, 0, 0],
  pop: [-1, 2, 4, 3, 1, 2, 3],
  rock: [5, 3, -2, -1, 2, 4, 5],
  classical: [4, 3, 2, 0, 2, 3, 3],
  acoustic: [3, 2, 1, 2, 3, 3, 2],
  custom: [0, 0, 0, 0, 0, 0, 0],
};

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private filters: BiquadFilterNode[] = [];
  private analyserNode: AnalyserNode | null = null;
  private isConnected = false;
  private audioElement: HTMLAudioElement | null = null;

  public init(audioEl: HTMLAudioElement) {
    if (this.audioElement === audioEl && this.isConnected) return;
    this.audioElement = audioEl;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        const resumeCtx = () => {
          this.audioCtx?.resume();
          window.removeEventListener('click', resumeCtx);
          window.removeEventListener('keydown', resumeCtx);
        };
        window.addEventListener('click', resumeCtx, { once: true });
        window.addEventListener('keydown', resumeCtx, { once: true });
      }

      if (!this.sourceNode) {
        try {
          this.sourceNode = this.audioCtx.createMediaElementSource(audioEl);
        } catch (e) {
          console.warn('AudioContext createMediaElementSource bypass:', e);
          return;
        }
      }

      // Gain Node
      this.gainNode = this.audioCtx.createGain();

      // Analyser Node for visualizers
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 64;

      // Equalizer Biquad Filters (7 bands)
      this.filters = EQUALIZER_FREQUENCIES.map((freq, index) => {
        const filter = this.audioCtx!.createBiquadFilter();
        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === EQUALIZER_FREQUENCIES.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = 0;
        return filter;
      });

      // Connect graph: Source -> Filter 0 -> Filter 1 -> ... -> Filter 6 -> Gain -> Analyser -> Destination
      let lastNode: AudioNode = this.sourceNode;
      for (const filter of this.filters) {
        lastNode.connect(filter);
        lastNode = filter;
      }

      lastNode.connect(this.gainNode);
      this.gainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioCtx.destination);

      this.isConnected = true;
    } catch (err) {
      console.warn('Web Audio API không khả dụng, sử dụng phát lại trực tiếp:', err);
    }
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.audioCtx.currentTime);
    }
  }

  public setEqualizerBands(bands: EqualizerBand[]) {
    if (!this.audioCtx || this.filters.length === 0) return;
    bands.forEach((band, index) => {
      if (this.filters[index]) {
        this.filters[index].gain.setValueAtTime(band.gain, this.audioCtx!.currentTime);
      }
    });
  }

  public applyPreset(preset: EqualizerPreset): EqualizerBand[] {
    const gains = EQUALIZER_PRESETS[preset] || EQUALIZER_PRESETS.default;
    const bands: EqualizerBand[] = EQUALIZER_FREQUENCIES.map((freq, idx) => ({
      frequency: freq,
      gain: gains[idx] ?? 0,
    }));
    this.setEqualizerBands(bands);
    return bands;
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(32);
    const buffer = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(buffer);
    return buffer;
  }

  public resume() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }
}

export const audioEngine = new AudioEngine();
