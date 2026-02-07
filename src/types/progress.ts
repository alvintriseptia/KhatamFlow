export interface ProgressLog {
  id: string;
  pageNumber: number;
  timestamp: number;
  pagesRead: number;
  notes?: string;
}

export interface CurrentProgress {
  currentPage: number;
  lastUpdated: number;
  totalPagesRead: number;
}
