export type MushafType = 'madinah-604' | 'indopak' | 'custom';

export interface MushafMetadata {
  type: MushafType;
  totalPages: number;
  name: string;
}

export interface PageInfo {
  page: number;
  surah: string;
  surahNumber: number;
  juz: number;
  ayahRange?: string;
  isProstrationVerse: boolean;
}

export interface MushafData {
  type: MushafType;
  totalPages: number;
  pages: PageInfo[];
}
