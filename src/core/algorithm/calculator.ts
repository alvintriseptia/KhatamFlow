import { DailyGoal } from '@/types/goal';
import { calculateDaysRemaining } from './dateUtils';

/**
 * Core adaptive algorithm: calculates daily pages needed based on remaining pages and days
 * Formula: Daily Pages = ⌈(Total Pages - Current Page) / Days Remaining⌉
 *
 * @param totalPages - Total pages in Mushaf
 * @param currentPage - Last completed page
 * @param targetDate - Unix timestamp of target completion date
 * @param maghribTime - Maghrib time in HH:mm format
 * @returns DailyGoal object with calculated values
 */
export function calculateDailyGoal(
  totalPages: number,
  currentPage: number,
  targetDate: number,
  maghribTime: string = "18:00"
): DailyGoal {
  const now = Date.now();
  const pagesRemaining = Math.max(0, totalPages - currentPage);
  const daysRemaining = calculateDaysRemaining(targetDate, maghribTime);

  // Handle completion
  if (pagesRemaining === 0) {
    return {
      pagesNeeded: 0,
      pagesRemaining: 0,
      daysRemaining,
      lastCalculated: now,
      isImpossible: false
    };
  }

  // Handle 0 days remaining or past deadline
  if (daysRemaining === 0) {
    return {
      pagesNeeded: pagesRemaining,
      pagesRemaining,
      daysRemaining: 0,
      lastCalculated: now,
      isImpossible: true
    };
  }

  // Calculate pages needed per day (ceiling division)
  const pagesNeeded = Math.ceil(pagesRemaining / daysRemaining);

  return {
    pagesNeeded,
    pagesRemaining,
    daysRemaining,
    lastCalculated: now,
    isImpossible: false
  };
}

/**
 * Calculate pages needed per prayer (5 daily prayers)
 * Distributes extra pages to earlier prayers
 *
 * @param dailyPages - Total pages needed today
 * @returns Array of 5 numbers representing pages per prayer [Fajr, Dhuhr, Asr, Maghrib, Isha]
 */
export function splitByPrayers(dailyPages: number): number[] {
  const basePages = Math.floor(dailyPages / 5);
  const remainder = dailyPages % 5;

  // Distribute base pages to all 5 prayers
  const prayerPages = Array(5).fill(basePages);

  // Distribute remainder to earlier prayers
  for (let i = 0; i < remainder; i++) {
    prayerPages[i]++;
  }

  return prayerPages;
}
