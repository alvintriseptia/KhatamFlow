import { useEffect, useState } from 'react';
import { notificationService, NotificationPermissionStatus } from '@/core/notifications/notificationService';

export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  dailyReminderTime: string; // Format: "HH:mm"
  prayerReminders: boolean;
  milestones: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  dailyReminder: true,
  dailyReminderTime: '09:00',
  prayerReminders: false,
  milestones: true,
};

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermissionStatus>('default');
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notification-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    setPermission(notificationService.getPermissionStatus());
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    const result = await notificationService.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      updateSettings({ ...settings, enabled: true });
      return true;
    }

    return false;
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('notification-settings', JSON.stringify(updated));

    // Schedule daily reminder if enabled
    if (updated.enabled && updated.dailyReminder && updated.dailyReminderTime) {
      const [hour, minute] = updated.dailyReminderTime.split(':').map(Number);
      notificationService.scheduleDailyReminder(hour, minute);
    }
  };

  const sendTestNotification = async () => {
    if (permission !== 'granted') {
      await requestPermission();
    }

    await notificationService.sendNotification({
      title: 'Test Notification',
      body: 'Notifications are working! You\'ll receive reminders like this. 📱',
      tag: 'test',
    });
  };

  return {
    permission,
    settings,
    isSupported: notificationService.isSupported(),
    requestPermission,
    updateSettings,
    sendTestNotification,
    notificationService,
  };
}
