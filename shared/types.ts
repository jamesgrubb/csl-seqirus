// Shapes shared between the Pages Functions API and the React UI.
export interface Category {
  slug: string;
  name: string;
}

export interface Video {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string | null;
  categoryName: string | null;
  videoUrl: string;
  posterUrl: string | null;
  durationSeconds: number | null;
  featured: boolean;
  createdAt: string;
}

export interface VideoListResponse {
  videos: Video[];
  categories: Category[];
}

/** Editable page copy, keyed like "home.statement.title". */
export type SiteContent = Record<string, string>;

export interface VideoPatch {
  title?: string;
  summary?: string;
  description?: string;
  category?: string | null;
  featured?: boolean;
}
