import { create } from 'zustand';
import { Goal, DailyGoal } from '@/types/goal';
import { CurrentProgress, ProgressLog } from '@/types/progress';
import { calculateDailyGoal } from '@/core/algorithm/calculator';
import {
  saveGoal,
  getGoal,
  saveProgress,
  getProgress,
  saveDailyGoal,
  getDailyGoal,
  saveLog,
  getLogs,
  updateLog as updateLogDB,
  deleteLog as deleteLogDB,
  clearAllData
} from '@/core/storage/db';
import { useSettingsStore } from './settingsStore';
import { triggerProgressNotifications, resetMilestones } from '@/core/notifications/notificationTriggers';

interface ProgressState {
  // State
  goal: Goal | null;
  currentProgress: CurrentProgress | null;
  dailyGoal: DailyGoal | null;
  logs: ProgressLog[];
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initializeFromStorage: () => Promise<void>;
  setGoal: (goal: Goal) => Promise<void>;
  logProgress: (pageNumber: number, notes?: string) => Promise<void>;
  recalculateDailyGoal: () => Promise<void>;
  updateLog: (log: ProgressLog) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  resetProgress: () => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  // Initial state
  goal: null,
  currentProgress: null,
  dailyGoal: null,
  logs: [],
  isLoading: false,
  isInitialized: false,

  // Initialize from storage
  initializeFromStorage: async () => {
    set({ isLoading: true });

    try {
      const [goal, progress, dailyGoal, logs] = await Promise.all([
        getGoal(),
        getProgress(),
        getDailyGoal(),
        getLogs()
      ]);

      set({
        goal: goal || null,
        currentProgress: progress || null,
        dailyGoal: dailyGoal || null,
        logs: logs || [],
        isInitialized: true,
        isLoading: false
      });

      // Recalculate if goal exists but no daily goal
      if (goal && !dailyGoal) {
        await get().recalculateDailyGoal();
      }
    } catch (error) {
      console.error('Failed to initialize from storage:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  // Set goal (called during onboarding)
  setGoal: async (goal: Goal) => {
    try {
      await saveGoal(goal);

      // Initialize progress if it doesn't exist
      const progress: CurrentProgress = {
        currentPage: goal.startPage - 1, // Start before the starting page
        lastUpdated: Date.now(),
        totalPagesRead: 0
      };

      await saveProgress(progress);

      set({ goal, currentProgress: progress });

      // Reset milestone notifications for new goal
      resetMilestones();

      // Calculate initial daily goal
      await get().recalculateDailyGoal();
    } catch (error) {
      console.error('Failed to set goal:', error);
    }
  },

  // Log progress (main action)
  logProgress: async (pageNumber: number, notes?: string) => {
    const { currentProgress, goal } = get();

    if (!currentProgress || !goal) {
      console.error('Cannot log progress without goal and current progress');
      return;
    }

    try {
      // Calculate pages read
      const pagesRead = Math.max(1, pageNumber - currentProgress.currentPage);

      // Create log entry
      const log: ProgressLog = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        pageNumber,
        timestamp: Date.now(),
        pagesRead,
        notes
      };

      await saveLog(log);

      // Update current progress
      const updatedProgress: CurrentProgress = {
        currentPage: pageNumber,
        lastUpdated: Date.now(),
        totalPagesRead: currentProgress.totalPagesRead + pagesRead
      };

      await saveProgress(updatedProgress);

      // Update state
      const logs = await getLogs();
      set({ currentProgress: updatedProgress, logs });

      // Recalculate daily goal
      await get().recalculateDailyGoal();

      // Trigger notifications for milestones/completion
      await triggerProgressNotifications(pageNumber, goal.mushaf.totalPages);
    } catch (error) {
      console.error('Failed to log progress:', error);
    }
  },

  // Recalculate daily goal
  recalculateDailyGoal: async () => {
    const { goal, currentProgress } = get();

    if (!goal || !currentProgress) {
      return;
    }

    try {
      const maghribTime = useSettingsStore.getState().maghribTime;

      const newDailyGoal = calculateDailyGoal(
        goal.mushaf.totalPages,
        currentProgress.currentPage,
        goal.targetDate,
        maghribTime
      );

      await saveDailyGoal(newDailyGoal);
      set({ dailyGoal: newDailyGoal });
    } catch (error) {
      console.error('Failed to recalculate daily goal:', error);
    }
  },

  // Update existing log
  updateLog: async (log: ProgressLog) => {
    try {
      await updateLogDB(log);

      // Recalculate current progress from all logs
      const logs = await getLogs();
      const { goal } = get();

      if (!goal) return;

      // Sort logs by timestamp
      const sortedLogs = [...logs].sort((a, b) => a.timestamp - b.timestamp);

      // Calculate current page and total pages read
      let currentPage = goal.startPage - 1;
      let totalPagesRead = 0;

      for (const l of sortedLogs) {
        currentPage = l.pageNumber;
        totalPagesRead += l.pagesRead;
      }

      const updatedProgress: CurrentProgress = {
        currentPage,
        lastUpdated: Date.now(),
        totalPagesRead
      };

      await saveProgress(updatedProgress);

      set({ logs, currentProgress: updatedProgress });

      // Recalculate daily goal
      await get().recalculateDailyGoal();
    } catch (error) {
      console.error('Failed to update log:', error);
    }
  },

  // Delete log
  deleteLog: async (id: string) => {
    try {
      await deleteLogDB(id);

      // Recalculate from remaining logs
      const logs = await getLogs();
      const { goal } = get();

      if (!goal) return;

      const sortedLogs = [...logs].sort((a, b) => a.timestamp - b.timestamp);

      let currentPage = goal.startPage - 1;
      let totalPagesRead = 0;

      for (const l of sortedLogs) {
        currentPage = l.pageNumber;
        totalPagesRead += l.pagesRead;
      }

      const updatedProgress: CurrentProgress = {
        currentPage,
        lastUpdated: Date.now(),
        totalPagesRead
      };

      await saveProgress(updatedProgress);

      set({ logs, currentProgress: updatedProgress });

      await get().recalculateDailyGoal();
    } catch (error) {
      console.error('Failed to delete log:', error);
    }
  },

  // Reset all progress
  resetProgress: async () => {
    try {
      await clearAllData();
      resetMilestones();
      set({
        goal: null,
        currentProgress: null,
        dailyGoal: null,
        logs: []
      });
    } catch (error) {
      console.error('Failed to reset progress:', error);
    }
  }
}));
