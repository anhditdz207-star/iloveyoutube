export interface CompanionStatus {
  online: boolean;
  version?: string;
  ffmpegAvailable?: boolean;
  ytdlpAvailable?: boolean;
}

export class LocalCompanionClient {
  private endpoint = 'http://127.0.0.1:3111';
  private token = 'local-token-secure-pmh';

  public configure(endpoint: string, token: string) {
    this.endpoint = endpoint;
    this.token = token;
  }

  public async checkHealth(): Promise<CompanionStatus> {
    try {
      const res = await fetch(`${this.endpoint}/api/health`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          online: true,
          version: data.version,
          ffmpegAvailable: data.ffmpeg,
          ytdlpAvailable: data.ytdlp,
        };
      }
    } catch {
      // Companion is offline or not installed
    }
    return { online: false };
  }

  public async requestLocalDownload(url: string, format: string, outputName: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${this.endpoint}/api/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({ url, format, outputName }),
      });
      if (res.ok) {
        return await res.json();
      }
      return { success: false, message: `Lỗi kết nối companion: HTTP ${res.status}` };
    } catch (e) {
      return { success: false, message: 'Dịch vụ Companion cục bộ chưa được bật (localhost:3111).' };
    }
  }
}

export const localCompanion = new LocalCompanionClient();
