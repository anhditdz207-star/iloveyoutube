import React, { useState } from 'react';
import { Film, Play, Download, Sparkles, Filter, X, ShieldCheck } from 'lucide-react';
import { INITIAL_MEDIA_ASSETS } from '@/data/curatedMedia';
import { VideoCard } from '@/components/common/VideoCard';
import type { MediaAsset } from '@/types/media';
import { downloadManager } from '@/services/downloadManager';

export const VideoPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewingVideo, setPreviewingVideo] = useState<MediaAsset | null>(null);

  const videoAssets = INITIAL_MEDIA_ASSETS.filter((a) =>
    ['nature', 'cinematic', 'footage', 'background'].includes(a.category)
  );

  const filtered = selectedCategory === 'all'
    ? videoAssets
    : videoAssets.filter((v) => v.category === selectedCategory);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 text-2xl font-extrabold text-[#F5F3FA]">
          <div className="p-2 rounded-xl bg-[#9B5CFF]/20 text-[#C084FC]">
            <Film className="w-6 h-6" />
          </div>
          <h1>Chuyên Mục Video & Footage Dựng Phim (20%)</h1>
        </div>
        <p className="text-sm text-[#A39AAF] mt-1">
          Kho video stock 4K/Full HD, b-roll thiên nhiên và motion background phục vụ dự án dựng phim cá nhân.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'Tất cả video' },
          { id: 'nature', label: 'Thiên nhiên & Rừng núi' },
          { id: 'cinematic', label: 'Cinematic & Đô thị' },
          { id: 'background', label: 'Motion Background Loop' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === c.id
                ? 'bg-[#9B5CFF] text-white shadow-md shadow-[#9B5CFF]/30'
                : 'bg-[#191625] text-[#A39AAF] border border-[#2A2440] hover:text-[#F5F3FA]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((video) => (
          <VideoCard
            key={video.id}
            asset={video}
            onPreview={(v) => setPreviewingVideo(v)}
          />
        ))}
      </div>

      {/* Video Inspector & Preview Modal */}
      {previewingVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12101A] border border-[#2A2440] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#2A2440] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-[#9B5CFF]" />
                <h3 className="font-bold text-base text-[#F5F3FA] truncate max-w-lg">
                  {previewingVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewingVideo(null)}
                className="p-1.5 text-[#A39AAF] hover:text-[#F5F3FA] rounded-xl hover:bg-[#191625]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                src={previewingVideo.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            {/* Inspector Details */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#191625] p-3 rounded-2xl border border-[#2A2440] text-xs">
                <div>
                  <span className="text-[#6C657A] block">Độ phân giải:</span>
                  <span className="font-bold text-[#F5F3FA] font-mono">{previewingVideo.resolution || '1920x1080'}</span>
                </div>
                <div>
                  <span className="text-[#6C657A] block">Thời lượng:</span>
                  <span className="font-bold text-[#F5F3FA] font-mono">{previewingVideo.duration} giây</span>
                </div>
                <div>
                  <span className="text-[#6C657A] block">Dung lượng:</span>
                  <span className="font-bold text-[#F5F3FA] font-mono">{(previewingVideo.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                </div>
                <div>
                  <span className="text-[#6C657A] block">Giấy phép:</span>
                  <span className="font-bold text-emerald-400">{previewingVideo.licenseInfo.name}</span>
                </div>
              </div>

              {previewingVideo.notes && (
                <p className="text-xs text-[#A39AAF] bg-[#0B0A10] p-3 rounded-xl border border-[#2A2440]/60">
                  <span className="font-semibold text-[#F5F3FA]">Ghi chú biên tập: </span>
                  {previewingVideo.notes}
                </p>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#6C657A]">Nguồn: {previewingVideo.licenseInfo.sourceWebsite}</span>
                <button
                  onClick={() => {
                    downloadManager.startDownload(previewingVideo.url, previewingVideo.title, previewingVideo.category, 'MP4');
                    setPreviewingVideo(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#9B5CFF] text-white font-semibold text-xs flex items-center gap-2 hover:bg-[#8A46FF] transition-all shadow-md shadow-[#9B5CFF]/30"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải video này về máy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
