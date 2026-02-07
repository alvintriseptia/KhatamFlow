/**
 * Notification Triggers - Checks when to send notifications based on progress
 */

import { notificationService } from './notificationService';

interface MilestoneState {
  [key: number]: boolean; // Track which milestones have been sent
}

const MILESTONES = [25, 50, 75];
const milestonesSent: MilestoneState = {};

/**
 * Reset milestone tracking (e.g., when starting a new Khatam)
 */
export function resetMilestones(): void {
  MILESTONES.forEach((milestone) => {
    milestonesSent[milestone] = false;
  });
}

/**
 * Check if we should send a notification for progress update
 */
export async function checkProgressNotifications(
  currentPage: number,
  totalPages: number,
  notificationsEnabled: boolean,
  milestonesEnabled: boolean
): Promise<void> {
  if (!notificationsEnabled || !milestonesEnabled) {
    return;
  }

  const percentage = Math.floor((currentPage / totalPages) * 100);

  // Check for completion (100%)
  if (currentPage >= totalPages) {
    await notificationService.sendCompletionCelebration();
    return;
  }

  // Check for milestone notifications (25%, 50%, 75%)
  for (const milestone of MILESTONES) {
    if (percentage >= milestone && !milestonesSent[milestone]) {
      milestonesSent[milestone] = true;
      await notificationService.sendMilestoneCelebration(milestone);
      break; // Only send one notification at a time
    }
  }
}

/**
 * Get the settings from localStorage
 */
function getNotificationSettings() {
  const settings = localStorage.getItem('notification-settings');
  if (!settings) {
    return { enabled: false, milestones: false };
  }

  try {
    const parsed = JSON.parse(settings);
    return {
      enabled: parsed.enabled || false,
      milestones: parsed.milestones || false,
    };
  } catch {
    return { enabled: false, milestones: false };
  }
}

/**
 * Wrapper function that reads settings and triggers notifications
 */
export async function triggerProgressNotifications(
  currentPage: number,
  totalPages: number
): Promise<void> {
  const settings = getNotificationSettings();
  await checkProgressNotifications(
    currentPage,
    totalPages,
    settings.enabled,
    settings.milestones
  );
}
