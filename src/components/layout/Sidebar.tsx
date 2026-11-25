import React from 'react';
import {
  Home,
  Flame,
  Music2,
  History,
  ThumbsUp,
  ListMusic,
  Settings,
  LogIn,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isCollapsed }) => {
  const { theme } = useTheme();
  const { user, openLoginModal } = useAuth();
  const isLight = theme === 'light';

  const mainNav = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'trending', label: 'Thịnh hành', icon: Flame },
    { id: 'music', label: 'Âm nhạc', icon: Music2 },
  ];

  const personalNav = [
    { id: 'history', label: 'Lịch sử', icon: History },
    { id: 'favorites', label: 'Video đã thích', icon: ThumbsUp },
    { id: 'playlists', label: 'Danh sách phát', icon: ListMusic },
  ];

  const renderButton = (item: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        title={isCollapsed ? item.label : undefined}
        className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors select-none ${
          isActive
            ? isLight
              ? 'bg-zinc-100 text-black font-semibold'
              : 'bg-[#272727] text-white font-semibold'
            : isLight
            ? 'text-zinc-700 hover:bg-zinc-100 hover:text-black'
            : 'text-zinc-300 hover:bg-[#272727] hover:text-white'
        }`}
      >
        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-red-600' : 'text-zinc-400'}`} />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
      </button>
    );
  };

  return (
    <aside
      className={`h-[calc(100vh-3.5rem)] sticky top-14 border-r transition-all duration-200 flex flex-col justify-between select-none z-20 ${
        isCollapsed ? 'w-18' : 'w-56'
      } ${
        isLight
          ? 'bg-white border-zinc-200 text-zinc-900'
          : 'bg-[#0F0F0F] border-[#272727] text-[#F1F1F1]'
      }`}
    >
      <div className="overflow-y-auto py-2 px-2 space-y-1">
        {/* Section 1: Main Feed */}
        <div className="space-y-0.5">
          {mainNav.map(renderButton)}
        </div>

        {/* Divider */}
        <div className={`my-2 border-t ${isLight ? 'border-zinc-200' : 'border-[#272727]'}`} />

        {/* Section 2: Personal */}
        <div className="space-y-0.5">
          {!isCollapsed && (
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Bạn
            </div>
          )}
          {personalNav.map(renderButton)}
        </div>

        {/* Divider */}
        <div className={`my-2 border-t ${isLight ? 'border-zinc-200' : 'border-[#272727]'}`} />

        {/* Section 3: Settings */}
        <div className="space-y-0.5">
          {renderButton({ id: 'settings', label: 'Cài đặt', icon: Settings })}
        </div>
      </div>

      {/* Bottom Google Login Reminder if not logged in */}
      {!isCollapsed && !user && (
        <div
          className={`p-3 m-2 rounded-xl border text-xs space-y-2 ${
            isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#181818] border-[#272727]'
          }`}
        >
          <p className="text-[11px] text-zinc-400 leading-tight">
            Đăng nhập tài khoản Google để lưu video và playlist cá nhân.
          </p>
          <button
            onClick={openLoginModal}
            className="w-full py-1.5 px-3 rounded-full border border-blue-500/50 text-blue-500 hover:bg-blue-500/10 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng nhập</span>
          </button>
        </div>
      )}
    </aside>
  );
};
