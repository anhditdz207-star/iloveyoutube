import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const GoogleLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginWithGooglePopup, loginWithGoogleProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleGoogleClick = async () => {
    setIsLoading(true);
    try {
      await loginWithGooglePopup();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithGoogleProfile({
      name: name.trim() || 'Người dùng YouTube',
      email: email.trim() || 'user@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#212121] text-[#F1F1F1] border border-[#383838] rounded-2xl max-w-sm w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google G Logo Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center shadow-md">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.37 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Đăng nhập với Google</h3>
          <p className="text-xs text-zinc-400">
            Lưu trữ lịch sử xem, video đã thích và playlist của riêng bạn.
          </p>
        </div>

        {/* Real Google / Firebase Sign-in Button */}
        <button
          onClick={handleGoogleClick}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-white hover:bg-zinc-100 text-zinc-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-3 shadow-md transition-all active:scale-98 disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.37 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{isLoading ? 'Đang kết nối Google...' : 'Đăng nhập bằng tài khoản Google'}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-zinc-700 w-full" />
          <span className="bg-[#212121] px-2 text-[11px] text-zinc-500 uppercase tracking-wider absolute">
            hoặc nhập nhanh
          </span>
        </div>

        {/* Custom Google Account Info Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-zinc-400 block mb-1">Tên hiển thị:</label>
            <input
              type="text"
              placeholder="Ví dụ: Hoàng Long, Minh Anh..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#141414] border border-zinc-700 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1">Gmail cá nhân:</label>
            <input
              type="email"
              placeholder="tenban@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#141414] border border-zinc-700 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors mt-2"
          >
            Đăng nhập ngay
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bảo mật Firebase &amp; Lưu trữ cục bộ an toàn</span>
        </div>
      </div>
    </div>
  );
};
