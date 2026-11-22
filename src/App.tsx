import React, { useState, useEffect } from 'react';
import { PlayerProvider } from '@/context/PlayerContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Layout } from '@/components/layout/Layout';

import { HomePage } from '@/pages/HomePage';
import { DiscoverPage } from '@/pages/DiscoverPage';
import { MusicPage } from '@/pages/MusicPage';
import { VideoPage } from '@/pages/VideoPage';
import { LibraryPage } from '@/pages/LibraryPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { PlaylistsPage } from '@/pages/PlaylistsPage';
import { DownloaderPage } from '@/pages/DownloaderPage';
import { AssetLibraryPage } from '@/pages/AssetLibraryPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { WatchPage } from '@/pages/WatchPage';

export function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setActiveTab(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={handleTabChange} />;
      case 'watch':
        return <WatchPage onNavigate={handleTabChange} />;
      case 'discover':
        return <DiscoverPage />;
      case 'music':
        return <MusicPage />;
      case 'video':
        return <VideoPage />;
      case 'library':
        return <LibraryPage onNavigate={handleTabChange} />;
      case 'favorites':
        return <FavoritesPage />;
      case 'playlists':
        return <PlaylistsPage />;
      case 'downloader':
        return <DownloaderPage />;
      case 'assets':
        return <AssetLibraryPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage onNavigate={handleTabChange} />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <PlayerProvider>
          <Layout activeTab={activeTab} setActiveTab={handleTabChange}>
            {renderActivePage()}
          </Layout>
        </PlayerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
