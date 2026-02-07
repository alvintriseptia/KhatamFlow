import { ProgressLog } from '@/types/progress';
import { Projection } from '@/types/goal';
import { differenceInDays } from 'date-fns';

/**
 * Calculate completion projection based on current pace
 *
 * @param currentPage - Current page progress
 * @param totalPages - Total pages in Mushaf
 * @param targetDate - Target completion date (Unix timestamp)
 * @param logs - Array of progress logs
 * @param startDate - Start date of reading (Unix timestamp)
 * @returns Projection object with estimates
 */
export function calculateProjection(
  currentPage: number,
  totalPages: number,
  targetDate: number,
  logs: ProgressLog[],
  startDate: number
): Projection {
  const now = Date.now();
  const pagesRemaining = totalPages - currentPage;

  // Calculate average pages per day from logs
  let averagePagesPerDay = 0;

  if (logs.length > 0) {
    const totalPagesRead = logs.reduce((sum, log) => sum + log.pagesRead, 0);
    const daysElapsed = Math.max(1, differenceInDays(now, startDate));
    averagePagesPerDay = totalPagesRead / daysElapsed;
  } else {
    // No logs yet, use ideal pace
    const totalDays = Math.max(1, differenceInDays(targetDate, startDate));
    averagePagesPerDay = totalPages / totalDays;
  }

  // Avoid division by zero
  if (averagePagesPerDay === 0) {
    averagePagesPerDay = 1;
  }

  // Calculate estimated completion date
  const daysNeeded = Math.ceil(pagesRemaining / averagePagesPerDay);
  const estimatedCompletionDate = now + (daysNeeded * 24 * 60 * 60 * 1000);

  // Calculate if on track
  const targetDaysRemaining = Math.max(0, differenceInDays(targetDate, now));
  const daysAheadOrBehind = targetDaysRemaining - daysNeeded;
  const isOnTrack = daysAheadOrBehind >= 0;

  return {
    estimatedCompletionDate,
    averagePagesPerDay: Math.round(averagePagesPerDay * 10) / 10, // Round to 1 decimal
    isOnTrack,
    daysAheadOrBehind
  };
}
