import type { DownloadItem, DownloadStatus, MediaCategory, LicenseInfo } from '@/types/media';
import { saveDownload, deleteDownload } from '@/storage/indexedDb';

export class DownloadManager {
  private activeControllers = new Map<string, AbortController>();
  private listeners = new Set<(items: DownloadItem[]) => void>();
  private items: DownloadItem[] = [];

  public init(initialItems: DownloadItem[]) {
    this.items = [...initialItems];
    this.notify();
  }

  public subscribe(listener: (items: DownloadItem[]) => void) {
    this.listeners.add(listener);
    listener(this.items);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn([...this.items]));
  }

  public detectMediaInfo(url: string): {
    title: string;
    sourceName: string;
    category: MediaCategory;
    format: string;
    license: LicenseInfo;
  } {
    const lower = url.toLowerCase();
    let sourceName = 'Trực tiếp / Direct URL';
    let category: MediaCategory = 'music';
    let format = 'MP3';
    let licenseName = 'Không rõ (Cần kiểm tra lại)';
    let commercialUse = false;
    let attributionRequired = true;

    if (lower.includes('pixabay.com')) {
      sourceName = 'Pixabay';
      licenseName = 'Pixabay Content License (Miễn phí thương mại)';
      commercialUse = true;
      attributionRequired = false;
      if (lower.includes('video') || lower.includes('.mp4')) {
        category = 'footage';
        format = 'MP4';
      } else if (lower.includes('sound-effects') || lower.includes('whoosh') || lower.includes('shutter') || lower.includes('sfx')) {
        category = 'sfx';
        format = 'MP3';
      } else {
        category = 'music';
        format = 'MP3';
      }
    } else if (lower.includes('pexels.com')) {
      sourceName = 'Pexels';
      category = 'footage';
      format = 'MP4';
      licenseName = 'Pexels License (Miễn phí sử dụng)';
      commercialUse = true;
      attributionRequired = false;
    } else if (lower.includes('mixkit.co')) {
      sourceName = 'Mixkit';
      licenseName = 'Mixkit Free License';
      commercialUse = true;
      attributionRequired = false;
      if (lower.includes('video') || lower.includes('footage')) {
        category = 'cinematic';
        format = 'MP4';
      } else if (lower.includes('sfx') || lower.includes('sound-effects')) {
        category = 'sfx';
        format = 'WAV';
      }
    } else if (lower.includes('freesound.org')) {
      sourceName = 'Freesound';
      category = 'sfx';
      format = 'WAV';
      licenseName = 'Creative Commons (CC-BY / CC0)';
      attributionRequired = true;
    } else if (lower.includes('archive.org') || lower.includes('wikimedia.org')) {
      sourceName = lower.includes('archive.org') ? 'Internet Archive' : 'Wikimedia Commons';
      licenseName = 'Public Domain / Creative Commons';
      commercialUse = true;
      attributionRequired = true;
    }

    if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov')) {
      if (category === 'music' || category === 'sfx') category = 'footage';
      format = lower.endsWith('.webm') ? 'WebM' : lower.endsWith('.mov') ? 'MOV' : 'MP4';
    } else if (lower.endsWith('.wav')) {
      format = 'WAV';
    } else if (lower.endsWith('.flac')) {
      format = 'FLAC';
    } else if (lower.endsWith('.ogg')) {
      format = 'OGG';
    }

    const segments = url.split('/');
    const lastSeg = segments[segments.length - 1].split('?')[0];
    const cleanTitle = decodeURIComponent(lastSeg.replace(/[-_]/g, ' ').replace(/\.[a-z0-9]+$/i, '')) || 'Tài nguyên media mới';

    return {
      title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
      sourceName,
      category,
      format,
      license: {
        name: licenseName,
        sourceWebsite: sourceName,
        sourceUrl: url,
        attributionRequired,
        attributionText: attributionRequired ? `Tài nguyên từ ${sourceName} (${url})` : undefined,
        commercialUse,
        downloadDate: Date.now(),
      },
    };
  }

  public async startDownload(
    url: string,
    customTitle?: string,
    customCategory?: MediaCategory,
    customFormat?: string
  ): Promise<DownloadItem> {
    const existing = this.items.find((item) => item.sourceUrl === url && item.status !== 'failed');
    if (existing) {
      return existing;
    }

    const info = this.detectMediaInfo(url);
    const item: DownloadItem = {
      id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: customTitle || info.title,
      sourceUrl: url,
      sourceName: info.sourceName,
      category: customCategory || info.category,
      fileType: (customFormat || info.format).toLowerCase().includes('mp4') ? 'video/mp4' : 'audio/mpeg',
      format: customFormat || info.format,
      progress: 0,
      status: 'pending',
      licenseInfo: info.license,
      createdAt: Date.now(),
    };

    this.items.unshift(item);
    this.notify();
    await saveDownload(item);

    this.executeDownload(item);
    return item;
  }

  private async executeDownload(item: DownloadItem) {
    const controller = new AbortController();
    this.activeControllers.set(item.id, controller);

    this.updateItem(item.id, { status: 'downloading', progress: 5 });

    try {
      const response = await fetch(item.sourceUrl, {
        signal: controller.signal,
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      if (!response.body) {
        const blob = await response.blob();
        this.finishDownload(item, blob);
        return;
      }

      const reader = response.body.getReader();
      let receivedLength = 0;
      const chunks: Uint8Array<ArrayBuffer>[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (total > 0) {
          const progress = Math.min(95, Math.round((receivedLength / total) * 100));
          this.updateItem(item.id, { progress, fileSize: receivedLength });
        }
      }

      const blob = new Blob(chunks as BlobPart[], { type: item.fileType });
      this.finishDownload(item, blob);
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        this.updateItem(item.id, { status: 'paused' });
      } else {
        // Fallback: direct browser anchor trigger if CORS fetch is blocked
        console.warn('Direct fetch error, kích hoạt chế độ tải liên kết trình duyệt:', err);
        try {
          const a = document.createElement('a');
          a.href = item.sourceUrl;
          a.download = `${item.title.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_')}.${item.format.toLowerCase()}`;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          this.updateItem(item.id, {
            status: 'completed',
            progress: 100,
            completedAt: Date.now(),
          });
        } catch (downloadErr) {
          this.updateItem(item.id, {
            status: 'failed',
            error: 'Không thể tải trực tiếp qua trình duyệt: ' + ((err as Error)?.message || 'Lỗi mạng'),
          });
        }
      }
    } finally {
      this.activeControllers.delete(item.id);
    }
  }

  private finishDownload(item: DownloadItem, blob: Blob) {
    const blobUrl = URL.createObjectURL(blob);
    const filename = `${item.title.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_')}.${item.format.toLowerCase()}`;

    // Trigger browser file download
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    this.updateItem(item.id, {
      status: 'completed',
      progress: 100,
      fileSize: blob.size,
      downloadedBlobUrl: blobUrl,
      completedAt: Date.now(),
    });
  }

  public pause(id: string) {
    const ctrl = this.activeControllers.get(id);
    if (ctrl) {
      ctrl.abort();
      this.activeControllers.delete(id);
      this.updateItem(id, { status: 'paused' });
    }
  }

  public retry(id: string) {
    const item = this.items.find((x) => x.id === id);
    if (item) {
      this.executeDownload(item);
    }
  }

  public async remove(id: string) {
    this.pause(id);
    this.items = this.items.filter((x) => x.id !== id);
    this.notify();
    await deleteDownload(id);
  }

  private async updateItem(id: string, patch: Partial<DownloadItem>) {
    const idx = this.items.findIndex((x) => x.id === id);
    if (idx !== -1) {
      this.items[idx] = { ...this.items[idx], ...patch };
      this.notify();
      await saveDownload(this.items[idx]);
    }
  }
}

export const downloadManager = new DownloadManager();
