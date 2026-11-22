import React, { useState } from 'react';
import {
  Search,
  Menu,
  LogIn,
  LogOut,
} from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { LampCordToggle } from '@/components/common/LampCordToggle';
import { extractYouTubeId } from '@/services/youtubeEngine';

interface NavbarProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  activeTab,
  setActiveTab,
}) => {
  const { playYouTubeUrl } = usePlayer();
  const { theme } = useTheme();
  const { user, openLoginModal, logout } = useAuth();
  const isLight = theme === 'light';

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if input is a YouTube URL or Video ID
    const ytId = extractYouTubeId(searchQuery.trim());
    if (ytId) {
      playYouTubeUrl(ytId);
      setActiveTab('watch');
      onSearchChange('');
    } else {
      if (activeTab === 'watch') {
        setActiveTab('home');
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-30 h-14 px-4 flex items-center justify-between gap-3 border-b transition-colors duration-200 select-none ${
        isLight
          ? 'bg-white border-zinc-200 text-[#0F0F0F]'
          : 'bg-[#0F0F0F] border-[#272727] text-[#F1F1F1]'
      }`}
    >
      {/* Left: Sidebar toggle & I LOVE YOUTUBE Brand Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Thu gọn danh mục"
          className={`p-2 rounded-full transition-colors ${
            isLight ? 'hover:bg-zinc-100 text-zinc-700' : 'hover:bg-zinc-800 text-zinc-300'
          }`}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => {
            setActiveTab('home');
            onSearchChange('');
          }}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <img
            src="./logo.png"
            alt="I Love YouTube Logo"
            className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-red-600">
              I LOVE
            </span>
            <span className={`text-sm sm:text-base font-bold tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              YOUTUBE
            </span>
          </div>
        </div>
      </div>

      {/* Center: Clean YouTube-style Search Box */}
      <div className="flex-1 max-w-2xl mx-2 flex items-center justify-center">
        <form
          onSubmit={handleSearchSubmit}
          className={`flex items-center w-full max-w-xl rounded-full border overflow-hidden transition-all ${
            isLight
              ? isSearchFocused
                ? 'border-blue-600 bg-white'
                : 'border-zinc-300 bg-zinc-50 hover:border-zinc-400'
              : isSearchFocused
              ? 'border-blue-500 bg-[#121212]'
              : 'border-[#303030] bg-[#121212] hover:border-[#404040]'
          }`}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Tìm kiếm bài hát, ca sĩ, hoặc dán link YouTube..."
            className={`w-full py-2 px-4 text-sm bg-transparent focus:outline-none ${
              isLight ? 'text-zinc-900 placeholder-zinc-500' : 'text-[#F1F1F1] placeholder-zinc-500'
            }`}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="px-2 text-xs text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          )}

          <button
            type="submit"
            title="Tìm kiếm"
            className={`px-5 py-2 border-l transition-colors ${
              isLight
                ? 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200'
                : 'bg-[#222222] border-[#303030] text-zinc-300 hover:bg-[#2A2A2A]'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right: Theme Toggle & Google Sign In */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Sleek Theme Toggle */}
        <LampCordToggle />

        {/* Google Authentication Account Profile / Button */}
        {user ? (
          <div className="flex items-center gap-2 pl-1 group relative">
            <img
              src={user.avatar}
              alt={user.name}
              title={`Đã đăng nhập Google: ${user.name} (${user.email})`}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-red-500 cursor-pointer"
              onClick={() => setActiveTab('settings')}
            />
            <button
              onClick={logout}
              title="Đăng xuất tài khoản Google"
              className={`p-1.5 rounded-full transition-colors ${
                isLight ? 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={openLoginModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-500/50 text-blue-500 hover:bg-blue-500/10 text-xs font-semibold transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Đăng nhập</span>
          </button>
        )}
      </div>
    </header>
  );
};
