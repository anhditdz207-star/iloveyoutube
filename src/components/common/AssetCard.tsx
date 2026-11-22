import React, { useState } from 'react';
import {
  Play,
  Pause,
  Download,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Music,
  Volume2,
  Film,
  Camera,
  Trash2,
  Tag,
} from 'lucide-react';
import type { MediaAsset, MediaCategory } from '@/types/media';
import { downloadManager } from '@/services/downloadManager';
import { useTheme } from '@/context/ThemeContext';

interface AssetCardProps {
  asset: MediaAsset;
  onDelete?: (id: string) => void;
  onPreview?: (asset: MediaAsset) => void;
}

const CATEGORY_MAP: Record<MediaCategory, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  music: { label: 'Nhạc nền', icon: Music },
  sfx: { label: 'Hiệu ứng SFX', icon: Volume2 },
  footage: { label: 'Footage', icon: Film },
  cinematic: { label: 'Cinematic', icon: Film },
  nature: { label: 'Thiên nhiên', icon: Camera },
  background: { label: 'Background', icon: Film },
  image: { label: 'Hình ảnh', icon: Camera },
  other: { label: 'Khác', icon: Tag },
};

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onDelete, onPreview }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedAttribution, setCopiedAttribution] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const CatIcon = CATEGORY_MAP[asset.category]?.icon || Tag;
  const isVideo = ['footage', 'cinematic', 'nature', 'background'].includes(asset.category) || asset.fileType.includes('video');

  const toggleAudioPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingAudio && audioObj) {
      audioObj.pause();
      setIsPlayingAudio(false);
      return;
    }

    const audio = audioObj || new Audio(asset.url);
    if (!audioObj) setAudioObj(audio);

    audio.onended = () => setIsPlayingAudio(false);
    audio.play().then(() => setIsPlayingAudio(true)).catch(console.warn);
  };

  const handleCopyAttribution = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text =
      asset.licenseInfo.attributionText ||
      `"${asset.title}" by ${asset.licenseInfo.creator || 'Tác giả'} - Giấy phép: ${asset.licenseInfo.name} (${asset.licenseInfo.sourceWebsite})`;

    navigator.clipboard.writeText(text);
    setCopiedAttribution(true);
    setTimeout(() => setCopiedAttribution(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadManager.startDownload(asset.url, asset.title, asset.category, isVideo ? 'MP4' : 'MP3');
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      onClick={() => onPreview && onPreview(asset)}
      className={`group p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
        isLight
          ? 'bg-white border-zinc-200/80 hover:border-purple-300 hover:shadow-md'
          : 'bg-[#151222] border-[#241F36] hover:border-[#383152] hover:bg-[#1B172B]'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-medium border ${
              isLight
                ? 'bg-zinc-100 text-zinc-700 border-zinc-200'
                : 'bg-[#12101A] text-purple-300 border-[#262038]'
            }`}
          >
            <CatIcon className="w-3 h-3" />
            <span>{CATEGORY_MAP[asset.category]?.label || 'Tài nguyên'}</span>
          </span>

          <span
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
              asset.licenseInfo.commercialUse
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
            }`}
          >
            {asset.licenseInfo.commercialUse ? (
              <>
                <ShieldCheck className="w-3 h-3" />
                <span>Thương mại OK</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3" />
                <span>Phi thương mại</span>
              </>
            )}
          </span>
        </div>

        {/* Media Preview Box */}
        <div className="relative aspect-video rounded-xl bg-zinc-900 overflow-hidden mb-2.5 flex items-center justify-center">
          {asset.thumbnail ? (
            <img
              src={asset.thumbnail}
              alt={asset.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-zinc-400">
              <CatIcon className="w-6 h-6 text-purple-400" />
              <span className="text-[10px] uppercase font-mono">{asset.fileType}</span>
            </div>
          )}

          {/* Quick Play Trigger */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={isVideo ? () => onPreview && onPreview(asset) : toggleAudioPreview}
              className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
            >
              {isPlayingAudio ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>
          </div>

          {/* Specs */}
          <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-white">
            {asset.resolution || (asset.sampleRate ? `${asset.sampleRate / 1000}kHz` : '')}
          </div>

          {asset.duration && (
            <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-white">
              {asset.duration < 60
                ? `${asset.duration.toFixed(1)}s`
                : `${Math.floor(asset.duration / 60)}:${Math.floor(asset.duration % 60).toString().padStart(2, '0')}`}
            </div>
          )}
        </div>

        {/* Title */}
        <h4
          className={`font-semibold text-xs truncate transition-colors ${
            isLight ? 'text-zinc-900 group-hover:text-purple-700' : 'text-[#F5F3FA] group-hover:text-purple-300'
          }`}
        >
          {asset.title}
        </h4>
        <p className={`text-[11px] mt-0.5 line-clamp-1 ${isLight ? 'text-zinc-500' : 'text-[#9B92A8]'}`}>
          {asset.notes || asset.filename}
        </p>
      </div>

      {/* Footer */}
      <div
        className={`mt-2.5 pt-2 border-t flex items-center justify-between text-xs ${
          isLight ? 'border-zinc-100' : 'border-[#262038]'
        }`}
      >
        <span className={`text-[11px] font-mono ${isLight ? 'text-zinc-400' : 'text-[#6B627A]'}`}>
          {formatSize(asset.fileSize)}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyAttribution}
            title="Sao chép thông tin ghi công"
            className={`p-1 rounded-md transition-colors flex items-center gap-1 text-[11px] ${
              isLight ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100' : 'text-[#9B92A8] hover:text-[#F5F3FA]'
            }`}
          >
            {copiedAttribution ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{copiedAttribution ? 'Đã chép' : 'Ghi công'}</span>
          </button>

          <button
            onClick={handleDownload}
            title="Tải tệp tin về máy"
            className={`p-1.5 rounded-lg transition-colors ${
              isLight
                ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                : 'bg-purple-500/20 text-purple-300 hover:bg-purple-600 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(asset.id);
              }}
              title="Xóa"
              className="p-1 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
