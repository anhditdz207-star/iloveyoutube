export type MediaCategory =
  | 'music'       // Nhạc nền
  | 'sfx'         // Hiệu ứng âm thanh
  | 'footage'     // Footage
  | 'cinematic'   // Video cinematic
  | 'nature'      // Video thiên nhiên
  | 'background'  // Background
  | 'image'       // Hình ảnh
  | 'other';      // Khác

export interface LicenseInfo {
  name: string;
  creator?: string;
  sourceUrl?: string;
  sourceWebsite: string;
  attributionRequired: boolean;
  attributionText?: string;
  commercialUse: boolean;
  licenseDetails?: string;
  downloadDate: number;
}

export interface MediaAsset {
  id: string;
  title: string;
  filename: string;
  category: MediaCategory;
  url: string; // Blob or Direct URL
  thumbnail?: string;
  fileSize: number; // in bytes
  fileType: string; // MIME type
  duration?: number; // in seconds
  resolution?: string; // e.g., '1920x1080'
  sampleRate?: number; // e.g. 44100
  fps?: number;
  tags: string[];
  notes?: string;
  isFavorite: boolean;
  collectionId?: string;
  licenseInfo: LicenseInfo;
  createdAt: number;
  updatedAt: number;
}

export type DownloadStatus = 'pending' | 'downloading' | 'completed' | 'failed' | 'paused';

export interface DownloadItem {
  id: string;
  title: string;
  sourceUrl: string;
  sourceName: string;
  thumbnail?: string;
  category: MediaCategory;
  fileType: string;
  format: string; // 'MP3' | 'WAV' | 'MP4' | 'WebM' | 'FLAC' | 'AAC' | 'OGG'
  quality?: string;
  fileSize?: number;
  progress: number; // 0 - 100
  status: DownloadStatus;
  error?: string;
  licenseInfo?: LicenseInfo;
  downloadedBlobUrl?: string;
  createdAt: number;
  completedAt?: number;
}
