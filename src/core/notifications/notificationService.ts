/**
 * Notification Service for KhatamFlow
 * Handles browser notifications for reading reminders and celebrations
 */

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default';

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: any;
}

class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermissionStatus = 'default';

  private constructor() {
    this.checkPermission();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Check if notifications are supported in this browser
   */
  public isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Check current notification permission status
   */
  private checkPermission(): void {
    if (this.isSupported()) {
      this.permission = Notification.permission as NotificationPermissionStatus;
    }
  }

  /**
   * Request notification permission from the user
   */
  public async requestPermission(): Promise<NotificationPermissionStatus> {
    if (!this.isSupported()) {
      console.warn('Notifications are not supported in this browser');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission as NotificationPermissionStatus;
      return this.permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Get current permission status
   */
  public getPermissionStatus(): NotificationPermissionStatus {
    this.checkPermission();
    return this.permission;
  }

  /**
   * Send a notification immediately
   */
  public async sendNotification(options: NotificationOptions): Promise<void> {
    if (!this.isSupported()) {
      console.warn('Notifications not supported');
      return;
    }

    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      await registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192.png',
        badge: options.badge || '/icon-192.png',
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        data: options.data,
      } as NotificationOptions);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Send daily reading reminder
   */
  public async sendDailyReminder(pagesRemaining: number): Promise<void> {
    await this.sendNotification({
      title: 'KhatamFlow Reading Reminder',
      body: `You have ${pagesRemaining} pages to read today. Keep up the great work! 📖`,
      tag: 'daily-reminder',
      requireInteraction: false,
    });
  }

  /**
   * Send prayer time reading reminder
   */
  public async sendPrayerReminder(prayer: string, pagesToRead: number): Promise<void> {
    await this.sendNotification({
      title: `${prayer} Time - Reading Reminder`,
      body: `Time for ${prayer}! Complete ${pagesToRead} pages to stay on track 🕌`,
      tag: `prayer-${prayer.toLowerCase()}`,
      requireInteraction: false,
    });
  }

  /**
   * Send goal completion celebration
   */
  public async sendCompletionCelebration(): Promise<void> {
    await this.sendNotification({
      title: '🎉 Congratulations!',
      body: 'You have completed your Khatam! May Allah accept your efforts. 🤲',
      tag: 'completion',
      requireInteraction: true,
    });
  }

  /**
   * Send milestone celebration (e.g., 25%, 50%, 75%)
   */
  public async sendMilestoneCelebration(percentage: number): Promise<void> {
    await this.sendNotification({
      title: `${percentage}% Complete! 🌟`,
      body: `You've read ${percentage}% of your goal. Keep going! 💪`,
      tag: `milestone-${percentage}`,
      requireInteraction: false,
    });
  }

  /**
   * Schedule a notification (for daily reminders)
   * Note: This requires the Notifications API and may not work on all browsers
   */
  public scheduleNotification(
    scheduledTime: Date,
    options: NotificationOptions
  ): void {
    const now = new Date();
    const delay = scheduledTime.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        this.sendNotification(options);
      }, delay);
    }
  }

  /**
   * Schedule daily reminder for a specific time
   */
  public scheduleDailyReminder(hour: number, minute: number = 0): void {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    this.scheduleNotification(scheduledTime, {
      title: 'Daily Reading Reminder',
      body: 'Don\'t forget to complete your daily Quran reading! 📖',
      tag: 'daily-scheduled',
    });
  }

  /**
   * Clear all notifications with a specific tag
   */
  public async clearNotifications(tag?: string): Promise<void> {
    if (!this.isSupported()) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const notifications = await registration.getNotifications({ tag });

      notifications.forEach((notification) => notification.close());
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance();
