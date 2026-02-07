import { differenceInCalendarDays, isAfter, setHours, setMinutes } from 'date-fns';

/**
 * Calculate days remaining considering Maghrib time (Islamic day starts at sunset)
 * If current time is after Maghrib, we're already in the "next" Islamic day
 *
 * @param targetDate - Unix timestamp of target date
 * @param maghribTime - Time in HH:mm format (default "18:00")
 * @returns Number of days remaining
 */
export function calculateDaysRemaining(
  targetDate: number,
  maghribTime: string = "18:00"
): number {
  const now = new Date();
  const target = new Date(targetDate);

  // Parse Maghrib time
  const [hours, minutes] = maghribTime.split(':').map(Number);

  // Set Maghrib time for today
  const todayMaghrib = setMinutes(setHours(new Date(), hours), minutes);

  // If current time is after Maghrib, we're in the next Islamic day
  const effectiveCurrentDate = isAfter(now, todayMaghrib)
    ? new Date(now.getTime() + 24 * 60 * 60 * 1000) // Add 1 day
    : now;

  // Calculate difference in calendar days
  const days = differenceInCalendarDays(target, effectiveCurrentDate);

  // Return at least 0 days (handle past dates)
  return Math.max(0, days);
}

/**
 * Get current Islamic date considering Maghrib time
 *
 * @param maghribTime - Time in HH:mm format (default "18:00")
 * @returns Date object representing current Islamic day
 */
export function getCurrentIslamicDate(maghribTime: string = "18:00"): Date {
  const now = new Date();
  const [hours, minutes] = maghribTime.split(':').map(Number);
  const todayMaghrib = setMinutes(setHours(new Date(), hours), minutes);

  // If after Maghrib, return tomorrow's date
  if (isAfter(now, todayMaghrib)) {
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }

  return now;
}

/**
 * Check if a timestamp is from today (Islamic day)
 *
 * @param timestamp - Unix timestamp to check
 * @param maghribTime - Time in HH:mm format (default "18:00")
 * @returns True if timestamp is from current Islamic day
 */
export function isToday(timestamp: number, maghribTime: string = "18:00"): boolean {
  const date = new Date(timestamp);
  const islamicToday = getCurrentIslamicDate(maghribTime);

  return differenceInCalendarDays(islamicToday, date) === 0;
}
