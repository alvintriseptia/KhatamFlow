import { Goal, DailyGoal } from '@/types/goal';
import { CurrentProgress, ProgressLog } from '@/types/progress';

/**
 * Fallback storage using localStorage when IndexedDB is unavailable
 */

const KEYS = {
  GOAL: 'khatamflow_goal',
  PROGRESS: 'khatamflow_progress',
  LOGS: 'khatamflow_logs',
  DAILY_GOAL: 'khatamflow_daily_goal',
  SETTINGS: 'khatamflow_settings'
};

// Goal operations
export function saveGoalToLS(goal: Goal): void {
  localStorage.setItem(KEYS.GOAL, JSON.stringify(goal));
}

export function getGoalFromLS(): Goal | null {
  const data = localStorage.getItem(KEYS.GOAL);
  return data ? JSON.parse(data) : null;
}

export function deleteGoalFromLS(): void {
  localStorage.removeItem(KEYS.GOAL);
}

// Progress operations
export function saveProgressToLS(progress: CurrentProgress): void {
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
}

export function getProgressFromLS(): CurrentProgress | null {
  const data = localStorage.getItem(KEYS.PROGRESS);
  return data ? JSON.parse(data) : null;
}

// Daily goal operations
export function saveDailyGoalToLS(dailyGoal: DailyGoal): void {
  localStorage.setItem(KEYS.DAILY_GOAL, JSON.stringify(dailyGoal));
}

export function getDailyGoalFromLS(): DailyGoal | null {
  const data = localStorage.getItem(KEYS.DAILY_GOAL);
  return data ? JSON.parse(data) : null;
}

// Log operations
export function saveLogsToLS(logs: ProgressLog[]): void {
  localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
}

export function getLogsFromLS(): ProgressLog[] {
  const data = localStorage.getItem(KEYS.LOGS);
  return data ? JSON.parse(data) : [];
}

export function addLogToLS(log: ProgressLog): void {
  const logs = getLogsFromLS();
  logs.push(log);
  saveLogsToLS(logs);
}

export function updateLogInLS(updatedLog: ProgressLog): void {
  const logs = getLogsFromLS();
  const index = logs.findIndex(log => log.id === updatedLog.id);
  if (index !== -1) {
    logs[index] = updatedLog;
    saveLogsToLS(logs);
  }
}

export function deleteLogFromLS(id: string): void {
  const logs = getLogsFromLS();
  const filtered = logs.filter(log => log.id !== id);
  saveLogsToLS(filtered);
}

// Settings operations
export function saveSettingToLS(key: string, value: any): void {
  const settings = getSettingsFromLS();
  settings[key] = value;
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export function getSettingFromLS(key: string): any {
  const settings = getSettingsFromLS();
  return settings[key];
}

function getSettingsFromLS(): Record<string, any> {
  const data = localStorage.getItem(KEYS.SETTINGS);
  return data ? JSON.parse(data) : {};
}

// Clear all data
export function clearAllDataFromLS(): void {
  localStorage.removeItem(KEYS.GOAL);
  localStorage.removeItem(KEYS.PROGRESS);
  localStorage.removeItem(KEYS.LOGS);
  localStorage.removeItem(KEYS.DAILY_GOAL);
  // Keep settings
}
