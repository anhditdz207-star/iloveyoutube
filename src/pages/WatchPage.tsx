import React, { useState } from 'react';
import {
  ThumbsUp,
  Share2,
  Download,
  CheckCircle2,
  MessageSquare,
  Send,
  ExternalLink,
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { CURATED_TRACKS } from '@/data/curatedMedia';
import type { Track } from '@/types/music';

interface WatchPageProps {
  onNavigate: (tab: string) => void;
}

export const WatchPage: React.FC<WatchPageProps> = ({ onNavigate }) => {
  const { currentTrack, playTrack, toggleFavorite, isFavorite } = usePlayer();
  const { theme } = useTheme();
  const { user } = useAuth();
  const isLight = theme === 'light';

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likeCount, setLikeCount] = useState(145000);
  const [isLiked, setIsLiked] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ id: string; user: string; text: string; time: string }[]>([
    {
      id: 'c-1',
      user: 'Nguyễn Văn Minh',
      text: 'Bản phối nghe cuốn thật sự, âm thanh sạch và chất lượng rất cao!',
      time: '2 ngày trước',
    },
    {
      id: 'c-2',
      user: 'Trần Thị Thu Hà',
      text: 'Mở bài này lúc làm việc tập trung cực kỳ hiệu quả.',
      time: '5 ngày trước',
    },
  ]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    toggleFavorite();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setComments([
      {
        id: `c-${Date.now()}`,
        user: user?.name || 'Bạn',
        text: commentText.trim(),
        time: 'Vừa xong',
      },
      ...comments,
    ]);
    setCommentText('');
  };

  const relatedTracks = CURATED_TRACKS.filter((t) => t.id !== currentTrack?.id);

  if (!currentTrack) {
    return (
      <div className="text-center py-24 text-zinc-500 space-y-3">
        <p className="text-sm">Chưa chọn video nào để xem.</p>
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 bg-red-600 text-white rounded-full text-xs font-semibold"
        >
          Quay lại Trang chủ
        </button>
      </div>
    );
  }

  const embedUrl = currentTrack.youtubeId
    ? `https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&rel=0`
    : null;

  return (
    <div className="max-w-7xl mx-auto pb-20 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Big YouTube Video Player & Meta Details */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main 16:9 Video Player */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-800">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={currentTrack.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <img
                  src={currentTrack.artwork}
                  alt={currentTrack.title}
                  className="max-h-72 rounded-xl object-contain shadow-lg"
                />
                <audio src={currentTrack.audioUrl} controls autoPlay className="w-full max-w-md mt-4" />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-lg md:text-xl font-bold tracking-tight leading-snug">
            {currentTrack.title}
          </h1>

          {/* Channel Row & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-zinc-200 dark:border-[#272727]">
            {/* Channel Info */}
            <div className="flex items-center gap-3">
              <img
                src={
                  currentTrack.channelAvatar ||
                  `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(currentTrack.artist)}`
                }
                alt={currentTrack.artist}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-1 font-bold text-sm">
                  <span>{currentTrack.channelTitle || currentTrack.artist}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div className="text-xs text-zinc-400">1.82 Tr người đăng ký</div>
              </div>

              <button
                onClick={() => setIsSubscribed(!isSubscribed)}
                className={`ml-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isSubscribed
                    ? 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                }`}
              >
                {isSubscribed ? 'Đã đăng ký' : 'Đăng ký'}
              </button>
            </div>

            {/* Actions: Like, Share, Download, YouTube Official */}
            <div className="flex items-center gap-2">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  isLiked || isFavorite
                    ? 'bg-red-600 text-white'
                    : isLight
                    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                    : 'bg-[#272727] hover:bg-[#383838] text-white'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked || isFavorite ? 'fill-white' : ''}`} />
                <span>{(likeCount / 1000).toFixed(0)}K</span>
              </button>

              {/* Share */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Đã sao chép liên kết video vào bộ nhớ tạm!');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  isLight
                    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                    : 'bg-[#272727] hover:bg-[#383838] text-white'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>Chia sẻ</span>
              </button>

              {/* Save / Download to Studio */}
              <button
                onClick={() => onNavigate('downloader')}
                title="Lưu vào Media Studio"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  isLight
                    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                    : 'bg-[#272727] hover:bg-[#383838] text-white'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Tải về</span>
              </button>

              {/* Watch on YouTube Official */}
              {currentTrack.youtubeId && (
                <a
                  href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Mở video trực tiếp trên YouTube"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    isLight
                      ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                      : 'bg-[#272727] hover:bg-[#383838] text-white'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-red-500" />
                  <span className="hidden sm:inline">Mở trên</span>
                  <span>YouTube</span>
                </a>
              )}
            </div>
          </div>

          {/* Description Box */}
          <div
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className={`p-3.5 rounded-xl cursor-pointer text-xs transition-colors ${
              isLight ? 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800' : 'bg-[#272727] hover:bg-[#303030] text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1 text-[11px] text-zinc-400">
              <span>{currentTrack.views || '1.2 Tr lượt xem'}</span>
              <span>•</span>
              <span>{currentTrack.publishedAt || 'Gần đây'}</span>
              <span>•</span>
              <span className="text-red-500">{currentTrack.genre || 'Âm nhạc'}</span>
            </div>

            <p className={`whitespace-pre-line leading-relaxed ${isDescExpanded ? '' : 'line-clamp-3'}`}>
              Chào mừng bạn đến với I LOVE YOUTUBE - Nền tảng nghe nhạc, xem video và quản lý tài nguyên media cá nhân tối giản, mượt mà và thông minh.
              {'\n\n'}
              • Video: {currentTrack.title}{'\n'}
              • Nghệ sĩ / Kênh: {currentTrack.channelTitle || currentTrack.artist}{'\n'}
              • ID YouTube: {currentTrack.youtubeId || 'Audio Stream'}{'\n'}
              {'\n'}
              Hãy đăng ký kênh và nhấn Like để ủng hộ tác phẩm âm nhạc này nhé!
            </p>

            <span className="text-[11px] font-bold text-zinc-400 mt-2 block">
              {isDescExpanded ? 'Thu gọn ▲' : 'Hiện thêm ▼'}
            </span>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-red-600" />
              <h3 className="font-bold text-sm">{comments.length} bình luận</h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-3">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
                }
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Viết bình luận công khai..."
                  className={`flex-1 border-b py-1.5 px-1 text-xs bg-transparent focus:outline-none transition-colors ${
                    isLight
                      ? 'border-zinc-300 focus:border-black text-zinc-900'
                      : 'border-zinc-700 focus:border-white text-white'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-full text-xs font-semibold flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Gửi</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 text-xs">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {comment.user.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{comment.user}</span>
                      <span className="text-[10px] text-zinc-400">{comment.time}</span>
                    </div>
                    <p className="text-zinc-300 mt-0.5 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Up Next / Related Videos (YouTube Style) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-200 dark:border-[#272727]">
            <h3 className="font-bold text-sm">Video tiếp theo</h3>
            <span className="text-xs text-zinc-400">Tự động phát</span>
          </div>

          <div className="space-y-3">
            {relatedTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track, CURATED_TRACKS)}
                className={`group flex gap-2.5 p-1.5 rounded-xl cursor-pointer transition-colors ${
                  isLight ? 'hover:bg-zinc-100' : 'hover:bg-[#202020]'
                }`}
              >
                {/* 16:9 Mini Thumbnail */}
                <div className="relative aspect-video w-36 rounded-lg overflow-hidden shrink-0 bg-black">
                  <img
                    src={track.artwork}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 rounded text-[10px] font-mono text-white">
                    {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : 'Live'}
                  </span>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-xs line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1 truncate">
                    {track.channelTitle || track.artist}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {track.views || '1.1 Tr lượt xem'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
