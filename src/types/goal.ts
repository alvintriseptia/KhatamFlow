import { MushafType } from './mushaf';

export interface Goal {
  targetDate: number;
  startDate: number;
  startPage: number;
  mushaf: {
    type: MushafType;
    totalPages: number;
  };
}

export interface DailyGoal {
  pagesNeeded: number;
  pagesRemaining: number;
  daysRemaining: number;
  lastCalculated: number;
  isImpossible: boolean;
}

export interface Projection {
  estimatedCompletionDate: number;
  averagePagesPerDay: number;
  isOnTrack: boolean;
  daysAheadOrBehind: number;
}
