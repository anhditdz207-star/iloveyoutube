import React, { useState } from 'react';
import {
  Home,
  Compass,
  Music,
  History,
  Heart,
  ListMusic,
  Library,
  ChevronDown,
  ChevronUp,
  Download,
  FolderArchive,
  Film,
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
  const [isStudioExpanded, setIsStudioExpanded] = useState(false);

  const mainNav = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'discover', label: 'Khám phá', icon: Compass },
    { id: 'music', label: 'Âm nhạc', icon: Music },
  ];

  const personalNav = [
    { id: 'history', label: 'Lịch sử', icon: History },
    { id: 'favorites', label: 'Video đã thích', icon: Heart },
    { id: 'playlists', label: 'Danh sách phát', icon: ListMusic },
    { id: 'library', label: 'Thư viện của bạn', icon: Library },
  ];

  const studioNav = [
    { id: 'downloader', label: 'Trình tải Media', icon: Download },
    { id: 'assets', label: 'Kho tài nguyên dựng phim', icon: FolderArchive },
    { id: 'video', label: 'Video & Footage 4K', icon: Film },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: Settings },
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
        {/* Section 1: Main */}
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

        {/* Section 3: Collapsible Studio Tools Group */}
        {!isCollapsed && (
          <div>
            <button
              onClick={() => setIsStudioExpanded(!isStudioExpanded)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                isLight ? 'text-zinc-600 hover:bg-zinc-100' : 'text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <span>Công cụ Studio &amp; Dựng phim</span>
              {isStudioExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isStudioExpanded && (
              <div className="space-y-0.5 pl-1 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {studioNav.map(renderButton)}
              </div>
            )}
          </div>
        )}

        {isCollapsed && studioNav.map(renderButton)}
      </div>

      {/* Bottom Google Login Reminder if not logged in */}
      {!isCollapsed && !user && (
        <div
          className={`p-3 m-2 rounded-xl border text-xs space-y-2 ${
            isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#181818] border-[#272727]'
          }`}
        >
          <p className="text-[11px] text-zinc-400 leading-tight">
            Đăng nhập Google để lưu video yêu thích và lịch sử xem của bạn.
          </p>
          <button
            onClick={openLoginModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/50 text-blue-500 text-xs font-semibold hover:bg-blue-500/10 transition-colors w-fit"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng nhập</span>
          </button>
        </div>
      )}
    </aside>
  );
};
