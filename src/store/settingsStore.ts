import { create } from 'zustand';
import { saveSetting, getSetting } from '@/core/storage/db';

interface SettingsState {
  theme: 'light' | 'dark';
  maghribTime: string;
  notificationsEnabled: boolean;
  isLoading: boolean;

  // Actions
  loadSettings: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  setMaghribTime: (time: string) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  // Initial state with defaults
  theme: 'dark',
  maghribTime: '18:00',
  notificationsEnabled: false,
  isLoading: false,

  // Load settings from storage
  loadSettings: async () => {
    set({ isLoading: true });

    try {
      const [theme, maghribTime, notificationsEnabled] = await Promise.all([
        getSetting('theme'),
        getSetting('maghribTime'),
        getSetting('notificationsEnabled')
      ]);

      set({
        theme: theme || 'dark',
        maghribTime: maghribTime || '18:00',
        notificationsEnabled: notificationsEnabled || false,
        isLoading: false
      });

      // Apply theme to document
      document.documentElement.setAttribute('data-theme', theme || 'dark');
    } catch (error) {
      console.error('Failed to load settings:', error);
      set({ isLoading: false });
    }
  },

  // Set theme
  setTheme: async (theme: 'light' | 'dark') => {
    try {
      await saveSetting('theme', theme);
      set({ theme });
      document.documentElement.setAttribute('data-theme', theme);
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  },

  // Set Maghrib time
  setMaghribTime: async (time: string) => {
    try {
      await saveSetting('maghribTime', time);
      set({ maghribTime: time });
    } catch (error) {
      console.error('Failed to set Maghrib time:', error);
    }
  },

  // Set notifications enabled
  setNotificationsEnabled: async (enabled: boolean) => {
    try {
      await saveSetting('notificationsEnabled', enabled);
      set({ notificationsEnabled: enabled });
    } catch (error) {
      console.error('Failed to set notifications:', error);
    }
  }
}));
