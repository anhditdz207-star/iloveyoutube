import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const LampCordToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isLight ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng'}
      title={isLight ? 'Giao diện tối (Dark mode)' : 'Giao diện sáng (Light mode)'}
      className={`relative p-2 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer select-none ${
        isLight
          ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 active:scale-95'
          : 'bg-[#222222] hover:bg-[#303030] text-amber-400 active:scale-95 border border-[#383838]'
      }`}
    >
      {isLight ? (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
      ) : (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
      )}
    </button>
  );
};
