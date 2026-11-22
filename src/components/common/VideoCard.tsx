import React, { useState } from 'react';
import { Play, Download, X } from 'lucide-react';
import type { MediaAsset } from '@/types/media';
import { downloadManager } from '@/services/downloadManager';
import { useTheme } from '@/context/ThemeContext';

interface VideoCardProps {
  asset: MediaAsset;
  onPreview?: (asset: MediaAsset) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ asset, onPreview }) => {
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const formatSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadManager.startDownload(asset.url, asset.title, asset.category, 'MP4');
  };

  return (
    <div
      className={`group rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        isLight
          ? 'bg-white border-zinc-200/80 hover:border-purple-300 hover:shadow-md'
          : 'bg-[#151222] border-[#241F36] hover:border-[#383152] hover:bg-[#1B172B]'
      }`}
    >
      {/* Video Thumbnail / Inline Player */}
      <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
        {isPlayingInline ? (
          <div className="relative w-full h-full">
            <video
              src={asset.url}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setIsPlayingInline(false)}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/80 text-white hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <img
              src={asset.thumbnail || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600'}
              alt={asset.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div
              onClick={() => {
                if (onPreview) onPreview(asset);
                else setIsPlayingInline(true);
              }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
            </div>

            {/* Badges */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
              {asset.resolution && (
                <span className="px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] font-bold text-purple-300">
                  {asset.resolution.includes('3840') ? '4K' : '1080p'}
                </span>
              )}
            </div>

            {asset.duration && (
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[10px] font-mono text-white">
                {Math.floor(asset.duration)}s
              </div>
            )}
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <h3
            className={`font-semibold text-xs truncate transition-colors ${
              isLight ? 'text-zinc-900 group-hover:text-purple-700' : 'text-[#F5F3FA] group-hover:text-purple-300'
            }`}
          >
            {asset.title}
          </h3>
          <p className={`text-[11px] mt-0.5 line-clamp-1 ${isLight ? 'text-zinc-500' : 'text-[#9B92A8]'}`}>
            {asset.notes || asset.licenseInfo.name}
          </p>
        </div>

        <div
          className={`flex items-center justify-between mt-2.5 pt-2 border-t text-xs ${
            isLight ? 'border-zinc-100' : 'border-[#262038]'
          }`}
        >
          <span className={`text-[11px] font-mono ${isLight ? 'text-zinc-400' : 'text-[#6B627A]'}`}>
            {formatSize(asset.fileSize)}
          </span>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border ${
                isLight ? 'bg-zinc-100 text-zinc-600 border-zinc-200' : 'bg-[#151222] text-[#9B92A8] border-[#262038]'
              }`}
            >
              {asset.licenseInfo.sourceWebsite}
            </span>
            <button
              onClick={handleDownload}
              title="Tải video về máy"
              className={`p-1.5 rounded-lg transition-colors ${
                isLight
                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  : 'bg-purple-500/20 text-purple-300 hover:bg-purple-600 hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
