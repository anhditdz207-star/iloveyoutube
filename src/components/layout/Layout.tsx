import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { YouTubeMiniplayer } from '@/components/player/YouTubeMiniplayer';
import { GoogleLoginModal } from '@/components/common/GoogleLoginModal';
import { TrackCard } from '@/components/common/TrackCard';
import { searchYouTube } from '@/services/youtubeSearch';
import { useTheme } from '@/context/ThemeContext';
import type { Track } from '@/types/music';

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchYouTube(searchQuery.trim());
        setSearchResults(results);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-150 selection:bg-red-600 selection:text-white ${
        isLight ? 'bg-[#F9F9F9] text-[#0F0F0F]' : 'bg-[#0F0F0F] text-[#F1F1F1]'
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSearchQuery('');
          }}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto h-[calc(100vh-3.5rem)] px-4 sm:px-6 md:px-8 py-4">
          {searchResults && activeTab !== 'watch' ? (
            /* Real YouTube Search Results Grid */
            <div className="space-y-4 pb-20 max-w-7xl mx-auto">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#272727] pb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-bold">
                    Kết quả tìm kiếm cho: "{searchQuery}"
                  </h2>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults(null);
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Xóa tìm kiếm
                  </button>
                </div>
                {isSearching && (
                  <span className="text-xs text-zinc-400 animate-pulse">Đang tìm trên YouTube...</span>
                )}
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-4 gap-y-8">
                  {searchResults.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      queueContext={searchResults}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-zinc-500">
                  Không tìm thấy video nào. Hãy thử từ khóa khác hoặc dán link YouTube trực tiếp!
                </div>
              )}
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* YouTube Miniplayer (Only shows when navigating away from Watch page) */}
      <YouTubeMiniplayer
        activeTab={activeTab}
        onOpenWatch={() => setActiveTab('watch')}
      />

      {/* Google Login Modal */}
      <GoogleLoginModal />
    </div>
  );
};
