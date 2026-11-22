/**
 * OFFICIAL YOUTUBE IFRAME PLAYER ENGINE
 * Plays genuine YouTube videos & music via Google's official YouTube IFrame API.
 */

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const clean = urlOrId.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }

  // youtube.com/watch?v=...
  const watchMatch = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // youtube.com/shorts/...
  const shortsMatch = clean.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }

  return null;
}

class YouTubeEngine {
  private player: any = null;
  private isReady = false;
  private currentVideoId: string | null = null;
  private listeners: Set<(state: number) => void> = new Set();
  private pendingVideoId: string | null = null;

  public loadAPI(): Promise<void> {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }

      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        resolve();
      };
    });
  }

  public initPlayer(containerId: string): Promise<void> {
    return this.loadAPI().then(() => {
      return new Promise((resolve) => {
        if (this.player) {
          resolve();
          return;
        }

        try {
          this.player = new window.YT.Player(containerId, {
            height: '100%',
            width: '100%',
            playerVars: {
              autoplay: 1,
              controls: 1,
              modestbranding: 1,
              rel: 0,
              playsinline: 1,
              origin: window.location.origin,
            },
            events: {
              onReady: () => {
                this.isReady = true;
                if (this.pendingVideoId) {
                  this.loadVideo(this.pendingVideoId);
                  this.pendingVideoId = null;
                }
                resolve();
              },
              onStateChange: (event: any) => {
                this.notifyState(event.data);
              },
            },
          });
        } catch (e) {
          console.warn('Không thể khởi tạo YouTube IFrame Player:', e);
          resolve();
        }
      });
    });
  }

  public onStateChange(listener: (state: number) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyState(state: number) {
    this.listeners.forEach((fn) => fn(state));
  }

  public loadVideo(videoId: string) {
    this.currentVideoId = videoId;
    if (!this.isReady || !this.player || !this.player.loadVideoById) {
      this.pendingVideoId = videoId;
      return;
    }
    try {
      this.player.loadVideoById(videoId);
      this.player.playVideo();
    } catch (e) {
      console.warn('Lỗi loadVideo YouTube:', e);
    }
  }

  public play() {
    if (this.player && this.player.playVideo) {
      try {
        this.player.playVideo();
      } catch (e) {}
    }
  }

  public pause() {
    if (this.player && this.player.pauseVideo) {
      try {
        this.player.pauseVideo();
      } catch (e) {}
    }
  }

  public seekTo(seconds: number) {
    if (this.player && this.player.seekTo) {
      try {
        this.player.seekTo(seconds, true);
      } catch (e) {}
    }
  }

  public setVolume(volume0to1: number) {
    if (this.player && this.player.setVolume) {
      try {
        this.player.setVolume(Math.round(volume0to1 * 100));
      } catch (e) {}
    }
  }

  public getCurrentTime(): number {
    if (this.player && this.player.getCurrentTime) {
      try {
        return this.player.getCurrentTime() || 0;
      } catch (e) {}
    }
    return 0;
  }

  public getDuration(): number {
    if (this.player && this.player.getDuration) {
      try {
        return this.player.getDuration() || 0;
      } catch (e) {}
    }
    return 0;
  }

  public isLoaded(): boolean {
    return this.isReady;
  }
}

export const youtubeEngine = new YouTubeEngine();
