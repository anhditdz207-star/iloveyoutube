import React, { useState } from 'react';
import {
  Settings,
  User,
  Palette,
  Volume2,
  Database,
  Download,
  Upload,
  Check,
  Sun,
  Moon,
  Sparkles,
  ShieldCheck,
  LogOut,
  LogIn,
} from 'lucide-react';
import { loadSettings, saveSettings } from '@/storage/localStorage';
import { exportFullDatabaseBackup, importFullDatabaseBackup } from '@/storage/indexedDb';
import type { AppSettings } from '@/types/settings';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { LampCordToggle } from '@/components/common/LampCordToggle';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, openLoginModal, logout } = useAuth();
  const isLight = theme === 'light';
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    saveSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportBackup = async () => {
    const json = await exportFullDatabaseBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iloveyoutube_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = await importFullDatabaseBackup(content);
        if (ok) {
          alert('Khôi phục dữ liệu sao lưu thành công! Đang tải lại trang...');
          window.location.reload();
        } else {
          alert('Tệp sao lưu không hợp lệ hoặc bị lỗi định dạng.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5 text-xl sm:text-2xl font-black tracking-tight">
            <div className="p-2 rounded-xl bg-red-600/10 text-red-600">
              <Settings className="w-6 h-6" />
            </div>
            <h1>Cài Đặt &amp; Quản Lý</h1>
          </div>
          <p className="text-xs md:text-sm mt-1 text-zinc-400">
            Tùy biến trải nghiệm giao diện I LOVE YOUTUBE, tài khoản và dữ liệu cá nhân.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
          <span>{isSaved ? 'Đã lưu' : 'Lưu cài đặt'}</span>
        </button>
      </div>

      {/* 1. Tài Khoản Google & Đồng Bộ */}
      <div
        className={`p-5 md:p-6 rounded-2xl border transition-colors ${
          isLight ? 'bg-white border-zinc-200 shadow-xs' : 'bg-[#181818] border-[#2E2E2E]'
        } space-y-4`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-bold">
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <h2>Tài Khoản Google Của Bạn</h2>
          </div>
          {user ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
              Đã kết nối
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-500/20 text-zinc-400 text-[11px]">
              Chưa đăng nhập
            </span>
          )}
        </div>

        {user ? (
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-zinc-100 dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-red-500"
              />
              <div>
                <h4 className="font-bold text-sm">{user.name}</h4>
                <p className="text-xs text-zinc-400">{user.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="px-3.5 py-1.5 rounded-full border border-red-500/40 text-red-500 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800">
            <div>
              <p className="text-xs font-semibold">Đăng nhập tài khoản Google</p>
              <p className="text-[11px] text-zinc-400">
                Để lưu lại lịch sử xem, video đã thích và playlist riêng của bạn.
              </p>
            </div>
            <button
              onClick={openLoginModal}
              className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập ngay</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Theme Giao Diện (Theme Sáng / Tối) */}
      <div
        className={`p-5 md:p-6 rounded-2xl border transition-colors ${
          isLight ? 'bg-white border-zinc-200 shadow-xs' : 'bg-[#181818] border-[#2E2E2E]'
        } space-y-4`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-bold">
            <Palette className="w-4 h-4 text-red-600" />
            <h2>Chế Độ Giao Diện (Sáng / Tối)</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Chuyển nhanh:</span>
            <LampCordToggle />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <button
            onClick={() => {
              if (theme !== 'dark') toggleTheme();
            }}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
              theme === 'dark'
                ? 'bg-red-600/10 border-red-600 text-white font-bold shadow-xs'
                : 'bg-zinc-100/50 border-zinc-200 text-zinc-500 hover:bg-zinc-100'
            }`}
          >
            <Moon className="w-6 h-6 text-red-500" />
            <div>
              <div className="text-sm font-bold">Chế độ Tối (Dark YouTube)</div>
              <div className="text-[11px] opacity-75">Nền xám đậm chuẩn YouTube (#0F0F0F)</div>
            </div>
          </button>

          <button
            onClick={() => {
              if (theme !== 'light') toggleTheme();
            }}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
              theme === 'light'
                ? 'bg-red-50 border-red-600 text-zinc-900 font-bold shadow-xs'
                : 'bg-[#121212] border-zinc-800 text-zinc-400 hover:bg-[#1A1A1A]'
            }`}
          >
            <Sun className="w-6 h-6 text-amber-500" />
            <div>
              <div className="text-sm font-bold">Chế độ Sáng (Light YouTube)</div>
              <div className="text-[11px] opacity-75">Giao diện trắng tinh tế, thoáng đãng</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Tùy Chọn Phát Nhạc & Video */}
      <div
        className={`p-5 md:p-6 rounded-2xl border transition-colors ${
          isLight ? 'bg-white border-zinc-200 shadow-xs' : 'bg-[#181818] border-[#2E2E2E]'
        } space-y-3 text-xs`}
      >
        <div className="flex items-center gap-2 text-sm font-bold mb-2">
          <Volume2 className="w-4 h-4 text-red-600" />
          <h2>Tùy Chọn Phát Video &amp; Âm Nhạc</h2>
        </div>

        <label
          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer ${
            isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#121212] border-[#2E2E2E]'
          }`}
        >
          <div>
            <span className="font-semibold block">Tự động phát video tiếp theo</span>
            <span className="text-[11px] text-zinc-400">
              Tự động chuyển sang video gợi ý tiếp theo khi bài hát kết thúc
            </span>
          </div>
          <input
            type="checkbox"
            checked={settings.player.continuousListeningDefault}
            onChange={(e) =>
              setSettings({
                ...settings,
                player: { ...settings.player, continuousListeningDefault: e.target.checked },
              })
            }
            className="w-4 h-4 accent-red-600 cursor-pointer"
          />
        </label>
      </div>

      {/* 4. Dữ Liệu & Sao Lưu Cục Bộ (JSON Backup) */}
      <div
        className={`p-5 md:p-6 rounded-2xl border transition-colors ${
          isLight ? 'bg-white border-zinc-200 shadow-xs' : 'bg-[#181818] border-[#2E2E2E]'
        } space-y-3`}
      >
        <div className="flex items-center gap-2 text-sm font-bold">
          <Database className="w-4 h-4 text-emerald-500" />
          <h2>Sao Lưu &amp; Khôi Phục Dữ Liệu (JSON)</h2>
        </div>

        <p className="text-xs text-zinc-400">
          Toàn bộ lịch sử nghe, danh sách video yêu thích được bảo mật cục bộ. Bạn có thể xuất file sao lưu để chuyển đổi thiết bị bất cứ lúc nào.
        </p>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            onClick={handleExportBackup}
            className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
              isLight
                ? 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800'
                : 'bg-[#121212] hover:bg-[#202020] border-[#2E2E2E] text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-red-500" />
            <span>Xuất file sao lưu (.json)</span>
          </button>

          <label
            className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              isLight
                ? 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800'
                : 'bg-[#121212] hover:bg-[#202020] border-[#2E2E2E] text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-red-500" />
            <span>Khôi phục từ file</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};
