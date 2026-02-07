import { useState, useEffect } from 'react';
import mushafData from '@/data/mushaf/madinah-604.json';

export interface SurahInfo {
  number: number;
  name: string;
  transliteration: string;
  revelationType: string;
}

export interface PageInfo {
  page: number;
  surahs: SurahInfo[];
  juz: number;
  startAyah: string;
  endAyah: string;
  isProstrationVerse: boolean;
}

interface MushafData {
  type: string;
  totalPages: number;
  description: string;
  generatedAt: string;
  pages: PageInfo[];
}

export const useMushaf = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data] = useState<MushafData>(mushafData as MushafData);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getPageInfo = (pageNumber: number): PageInfo | undefined => {
    return data.pages.find((p) => p.page === pageNumber);
  };

  const getPageRange = (startPage: number, endPage: number): PageInfo[] => {
    return data.pages.filter((p) => p.page >= startPage && p.page <= endPage);
  };

  const getTotalPages = (): number => {
    return data.totalPages;
  };

  return {
    isLoaded,
    getPageInfo,
    getPageRange,
    getTotalPages,
  };
};
