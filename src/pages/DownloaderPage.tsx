import React, { useState, useEffect } from 'react';
import {
  Download,
  Link,
  CheckCircle,
  Clock,
  RotateCcw,
  Trash2,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { downloadManager } from '@/services/downloadManager';
import { getAllDownloads } from '@/storage/indexedDb';
import type { DownloadItem, MediaCategory } from '@/types/media';
import { useTheme } from '@/context/ThemeContext';

export const DownloaderPage: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [urlInput, setUrlInput] = useState('');
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [selectedFormat, setSelectedFormat] = useState('MP3');
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory>('music');
  const [detectedPreview, setDetectedPreview] = useState<{
    title: string;
    sourceName: string;
    category: MediaCategory;
    format: string;
    license: { name: string; commercialUse: boolean };
  } | null>(null);

  useEffect(() => {
    getAllDownloads().then((initial) => {
      downloadManager.init(initial);
    });

    const unsubscribe = downloadManager.subscribe((updatedItems) => {
      setItems(updatedItems);
    });

    return unsubscribe;
  }, []);

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    if (url.trim().length > 10) {
      const info = downloadManager.detectMediaInfo(url);
      setDetectedPreview({
        title: info.title,
        sourceName: info.sourceName,
        category: info.category,
        format: info.format,
        license: {
          name: info.license.name,
          commercialUse: info.license.commercialUse,
        },
      });
      setSelectedFormat(info.format);
      setSelectedCategory(info.category);
    } else {
      setDetectedPreview(null);
    }
  };

  const handleStartDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    await downloadManager.startDownload(
      urlInput.trim(),
      detectedPreview?.title,
      selectedCategory,
      selectedFormat
    );

    setUrlInput('');
    setDetectedPreview(null);
  };

  const samplePresets = [
    {
      title: 'Cinematic Whoosh SFX (Pixabay)',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3527a4e69.mp3?filename=whoosh-6316.mp3',
      cat: 'sfx' as MediaCategory,
      format: 'MP3',
      source: 'Pixabay',
    },
    {
      title: 'Relaxing Piano Melody (Pixabay CC0)',
      url: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c976935de9.mp3?filename=reflected-light-147724.mp3',
      cat: 'music' as MediaCategory,
      format: 'MP3',
      source: 'Pixabay',
    },
    {
      title: '4K Drone Forest B-Roll (Public Storage)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      cat: 'nature' as MediaCategory,
      format: 'MP4',
      source: 'Pexels / Google Storage',
    },
    {
      title: 'Camera Shutter Foley Click (Freesound)',
      url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_731456c666.mp3?filename=camera-shutter-6305.mp3',
      cat: 'sfx' as MediaCategory,
      format: 'WAV',
      source: 'Freesound',
    },
  ];

  return (
    <div className="space-y-6 pb-16 max-w-4xl">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2.5 text-2xl font-extrabold">
          <div
            className={`p-2 rounded-xl ${
              isLight ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/20 text-purple-400'
            }`}
          >
            <Download className="w-6 h-6" />
          </div>
          <h1>Trình Tải Media Studio</h1>
        </div>
        <p className={`text-xs md:text-sm mt-1 ${isLight ? 'text-zinc-500' : 'text-[#9B92A8]'}`}>
          Tải trực tiếp âm nhạc, hiệu ứng âm thanh (SFX) và footage từ các nguồn hợp pháp cho phép tải về máy tính.
        </p>
      </div>

      {/* Input Form Box */}
      <div
        className={`p-5 md:p-6 rounded-3xl border transition-colors ${
          isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-[#151222] border-[#262038]'
        } space-y-4`}
      >
        <form onSubmit={handleStartDownload} className="space-y-3">
          <label className={`text-xs font-semibold uppercase tracking-wider block ${isLight ? 'text-zinc-500' : 'text-[#9B92A8]'}`}>
            Nhập đường dẫn media trực tiếp (URL):
          </label>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Link className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="Dán URL từ Pixabay, Pexels, Mixkit, Freesound, Wikimedia..."
                className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-xs md:text-sm border focus:outline-none transition-all ${
                  isLight
                    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-purple-600 focus:bg-white'
                    : 'bg-[#12101A] border-[#262038] text-[#F5F3FA] focus:border-purple-500'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={!urlInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 transition-all shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Bắt đầu tải về</span>
            </button>
          </div>
        </form>

        {/* Auto Detection Preview */}
        {detectedPreview && (
          <div
            className={`p-3.5 rounded-2xl border space-y-2.5 ${
              isLight ? 'bg-purple-50/50 border-purple-200' : 'bg-[#1D182E] border-purple-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                <FileCheck className="w-4 h-4" />
                <span>Phát hiện tài nguyên:</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{detectedPreview.license.name}</span>
              </span>
            </div>

            <div className="text-xs font-semibold">{detectedPreview.title}</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className={`block mb-1 text-[11px] ${isLight ? 'text-zinc-500' : 'text-[#9B92A8]'}`}>
                  Phân loại:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as MediaCategory)}
                  className={`w-full p-2 rounded-xl border text-xs focus:outline-none ${
                    isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#12101A] border-[#262038] text-[#F5F3FA]'
                  }`}
                >
                  <option value="music">Nhạc nền (BGM)</option>
                  <option value="sfx">Hiệu ứng âm thanh (SFX)</option>
                  <option value="footage">Footage quay sẵn</option>
                  <option value="cinematic">Video Cinematic</option>
                  <option value="nature">Video Thiên nhiên</option>
                  <option value="background">Motion Background</option>
                </select>
              </div>

              <div>
                <label className={`block mb-1 text-[11px] ${isLight ? 'text-zinc-500' : 'text-[#9B92A8]'}`}>
                  Định dạng:
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className={`w-full p-2 rounded-xl border text-xs focus:outline-none font-mono ${
                    isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#12101A] border-[#262038] text-[#F5F3FA]'
                  }`}
                >
                  <option value="MP3">MP3 (Chuẩn Audio)</option>
                  <option value="WAV">WAV (Lossless)</option>
                  <option value="FLAC">FLAC</option>
                  <option value="MP4">MP4 (Video)</option>
                  <option value="WebM">WebM</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Quick Samples */}
        <div>
          <span className={`text-[11px] font-semibold uppercase tracking-wider block mb-2 ${isLight ? 'text-zinc-400' : 'text-[#9B92A8]'}`}>
            Tài nguyên mẫu miễn phí bản quyền:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {samplePresets.map((preset) => (
              <button
                key={preset.title}
                onClick={() => handleUrlChange(preset.url)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isLight
                    ? 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800'
                    : 'bg-[#12101A] hover:bg-[#1A1726] border-[#262038] text-[#F5F3FA]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                  <span>{preset.source}</span>
                  <span className="font-mono text-zinc-400">{preset.format}</span>
                </div>
                <div className="text-xs font-medium truncate mt-1">
                  {preset.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Download Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-bold">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h2>Hàng Đợi & Lịch Sử Tải ({items.length})</h2>
          </div>
        </div>

        {items.length === 0 ? (
          <div
            className={`text-center py-12 rounded-2xl border space-y-1.5 ${
              isLight ? 'bg-white border-zinc-200 text-zinc-500' : 'bg-[#151222] border-[#262038] text-[#6B627A]'
            }`}
          >
            <Download className="w-6 h-6 mx-auto text-zinc-400" />
            <h3 className="text-xs font-semibold">Chưa có tệp nào trong hàng đợi</h3>
            <p className="text-[11px]">Dán link tải media vào khung bên trên để tải về máy.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isLight ? 'bg-white border-zinc-200' : 'bg-[#151222] border-[#262038]'
                }`}
              >
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                        isLight ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-purple-900/30 text-purple-300 border-purple-500/30'
                      }`}
                    >
                      {item.format}
                    </span>
                    <h4 className="font-semibold text-xs truncate">{item.title}</h4>
                  </div>
                  <div className={`text-[11px] ${isLight ? 'text-zinc-500' : 'text-[#9B92A8]'}`}>
                    <span>Nguồn: {item.sourceName}</span>
                    {item.fileSize && (
                      <span className="font-mono ml-2">
                        {(item.fileSize / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    )}
                  </div>

                  {item.status === 'downloading' && (
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="bg-purple-600 h-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                      item.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : item.status === 'downloading'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {item.status === 'completed' && <CheckCircle className="w-3.5 h-3.5" />}
                    {item.status === 'completed' ? 'Đã tải xong' : `${item.progress}%`}
                  </span>

                  {item.status === 'failed' && (
                    <button
                      onClick={() => downloadManager.retry(item.id)}
                      className="p-1 text-zinc-400 hover:text-zinc-700"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => downloadManager.remove(item.id)}
                    className="p-1 text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
