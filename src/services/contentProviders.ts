import type { Track, Artist, Playlist } from '@/types/music';
import type { MediaAsset } from '@/types/media';
import { CURATED_TRACKS, CURATED_ARTISTS, CURATED_PLAYLISTS, INITIAL_MEDIA_ASSETS } from '@/data/curatedMedia';

export interface UnifiedSearchResult {
  tracks: Track[];
  artists: Artist[];
  playlists: Playlist[];
  assets: MediaAsset[];
}

export class ContentProviderManager {
  private allTracks: Track[] = [...CURATED_TRACKS];
  private allArtists: Artist[] = [...CURATED_ARTISTS];
  private allPlaylists: Playlist[] = [...CURATED_PLAYLISTS];
  private allAssets: MediaAsset[] = [...INITIAL_MEDIA_ASSETS];

  public getTracks(): Track[] {
    return this.allTracks;
  }

  public getArtists(): Artist[] {
    return this.allArtists;
  }

  public getPlaylists(): Playlist[] {
    return this.allPlaylists;
  }

  public getAssets(): MediaAsset[] {
    return this.allAssets;
  }

  public addLocalTrack(track: Track) {
    this.allTracks.unshift(track);
  }

  public addAsset(asset: MediaAsset) {
    this.allAssets.unshift(asset);
  }

  public search(query: string, filterTab: 'all' | 'music' | 'video' | 'assets' = 'all'): UnifiedSearchResult {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        tracks: filterTab === 'video' || filterTab === 'assets' ? [] : this.allTracks,
        artists: filterTab === 'music' || filterTab === 'all' ? this.allArtists : [],
        playlists: filterTab === 'music' || filterTab === 'all' ? this.allPlaylists : [],
        assets: filterTab === 'music' ? [] : this.allAssets,
      };
    }

    const matchedTracks = (filterTab === 'video' || filterTab === 'assets')
      ? []
      : this.allTracks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.artist.toLowerCase().includes(q) ||
            (t.genre && t.genre.toLowerCase().includes(q))
        );

    const matchedArtists = (filterTab === 'video' || filterTab === 'assets')
      ? []
      : this.allArtists.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            (a.genres && a.genres.some((g) => g.toLowerCase().includes(q)))
        );

    const matchedPlaylists = (filterTab === 'video' || filterTab === 'assets')
      ? []
      : this.allPlaylists.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q))
        );

    const matchedAssets = (filterTab === 'music')
      ? []
      : this.allAssets.filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.filename.toLowerCase().includes(q) ||
            m.tags.some((tag) => tag.toLowerCase().includes(q)) ||
            (filterTab === 'video' ? ['footage', 'cinematic', 'nature', 'background'].includes(m.category) : true)
        );

    return {
      tracks: matchedTracks,
      artists: matchedArtists,
      playlists: matchedPlaylists,
      assets: matchedAssets,
    };
  }
}

export const contentProviders = new ContentProviderManager();
