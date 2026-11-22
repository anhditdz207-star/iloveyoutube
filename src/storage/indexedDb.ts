import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { MediaAsset, DownloadItem } from '@/types/media';
import type { Playlist, ListeningHistoryItem, Track } from '@/types/music';

interface MusicHubDB extends DBSchema {
  assets: {
    key: string;
    value: MediaAsset;
    indexes: { 'by-category': string; 'by-favorite': number; 'by-created': number };
  };
  playlists: {
    key: string;
    value: Playlist;
    indexes: { 'by-updated': number };
  };
  favorites: {
    key: string;
    value: Track;
    indexes: { 'by-added': number };
  };
  history: {
    key: string;
    value: ListeningHistoryItem;
    indexes: { 'by-played': number };
  };
  downloads: {
    key: string;
    value: DownloadItem;
    indexes: { 'by-created': number; 'by-status': string };
  };
}

const DB_NAME = 'personal_music_hub_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<MusicHubDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<MusicHubDB>> {
  if (!dbPromise) {
    dbPromise = openDB<MusicHubDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Assets store
        if (!db.objectStoreNames.contains('assets')) {
          const assetStore = db.createObjectStore('assets', { keyPath: 'id' });
          assetStore.createIndex('by-category', 'category');
          assetStore.createIndex('by-favorite', 'isFavorite');
          assetStore.createIndex('by-created', 'createdAt');
        }

        // Playlists store
        if (!db.objectStoreNames.contains('playlists')) {
          const playlistStore = db.createObjectStore('playlists', { keyPath: 'id' });
          playlistStore.createIndex('by-updated', 'updatedAt');
        }

        // Favorites store (Tracks)
        if (!db.objectStoreNames.contains('favorites')) {
          const favStore = db.createObjectStore('favorites', { keyPath: 'id' });
          favStore.createIndex('by-added', 'addedAt');
        }

        // History store
        if (!db.objectStoreNames.contains('history')) {
          const historyStore = db.createObjectStore('history', { keyPath: 'id' });
          historyStore.createIndex('by-played', 'playedAt');
        }

        // Downloads store
        if (!db.objectStoreNames.contains('downloads')) {
          const downloadStore = db.createObjectStore('downloads', { keyPath: 'id' });
          downloadStore.createIndex('by-created', 'createdAt');
          downloadStore.createIndex('by-status', 'status');
        }
      },
    });
  }
  return dbPromise;
}

// Media Assets operations
export async function getAllAssets(): Promise<MediaAsset[]> {
  const db = await getDB();
  return db.getAllFromIndex('assets', 'by-created');
}

export async function saveAsset(asset: MediaAsset): Promise<void> {
  const db = await getDB();
  await db.put('assets', asset);
}

export async function deleteAsset(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('assets', id);
}

// Playlists operations
export async function getAllPlaylists(): Promise<Playlist[]> {
  const db = await getDB();
  return db.getAllFromIndex('playlists', 'by-updated');
}

export async function savePlaylist(playlist: Playlist): Promise<void> {
  const db = await getDB();
  await db.put('playlists', playlist);
}

export async function deletePlaylist(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('playlists', id);
}

// Favorites operations
export async function getAllFavorites(): Promise<Track[]> {
  const db = await getDB();
  return db.getAll('favorites');
}

export async function addFavorite(track: Track): Promise<void> {
  const db = await getDB();
  await db.put('favorites', { ...track, addedAt: Date.now() });
}

export async function removeFavorite(trackId: string): Promise<void> {
  const db = await getDB();
  await db.delete('favorites', trackId);
}

export async function isFavoriteTrack(trackId: string): Promise<boolean> {
  const db = await getDB();
  const item = await db.get('favorites', trackId);
  return !!item;
}

// Listening History operations
export async function addHistoryItem(track: Track, listenDuration: number = 0): Promise<void> {
  const db = await getDB();
  const item: ListeningHistoryItem = {
    id: `${track.id}_${Date.now()}`,
    track,
    playedAt: Date.now(),
    listenDuration,
  };
  await db.put('history', item);
}

export async function getRecentHistory(limit: number = 50): Promise<ListeningHistoryItem[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('history', 'by-played');
  return all.reverse().slice(0, limit);
}

export async function clearHistory(): Promise<void> {
  const db = await getDB();
  await db.clear('history');
}

// Downloads operations
export async function getAllDownloads(): Promise<DownloadItem[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('downloads', 'by-created');
  return all.reverse();
}

export async function saveDownload(item: DownloadItem): Promise<void> {
  const db = await getDB();
  await db.put('downloads', item);
}

export async function deleteDownload(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('downloads', id);
}

// Backup & Restore
export async function exportFullDatabaseBackup(): Promise<string> {
  const db = await getDB();
  const backup = {
    version: DB_VERSION,
    timestamp: Date.now(),
    assets: await db.getAll('assets'),
    playlists: await db.getAll('playlists'),
    favorites: await db.getAll('favorites'),
    history: await db.getAll('history'),
    downloads: await db.getAll('downloads'),
  };
  return JSON.stringify(backup, null, 2);
}

export async function importFullDatabaseBackup(jsonString: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString);
    const db = await getDB();

    if (Array.isArray(data.assets)) {
      for (const item of data.assets) await db.put('assets', item);
    }
    if (Array.isArray(data.playlists)) {
      for (const item of data.playlists) await db.put('playlists', item);
    }
    if (Array.isArray(data.favorites)) {
      for (const item of data.favorites) await db.put('favorites', item);
    }
    if (Array.isArray(data.history)) {
      for (const item of data.history) await db.put('history', item);
    }
    if (Array.isArray(data.downloads)) {
      for (const item of data.downloads) await db.put('downloads', item);
    }
    return true;
  } catch (err) {
    console.error('Lỗi nhập dữ liệu sao lưu:', err);
    return false;
  }
}
