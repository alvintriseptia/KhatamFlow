import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Goal, DailyGoal } from '@/types/goal';
import { CurrentProgress, ProgressLog } from '@/types/progress';

interface KhatamFlowDB extends DBSchema {
  goal: {
    key: string;
    value: Goal;
  };
  progress: {
    key: string;
    value: CurrentProgress;
  };
  logs: {
    key: string;
    value: ProgressLog;
    indexes: { 'by-timestamp': number };
  };
  dailyGoal: {
    key: string;
    value: DailyGoal;
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'khatamflow-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<KhatamFlowDB> | null = null;

/**
 * Initialize IndexedDB connection
 */
export async function initDB(): Promise<IDBPDatabase<KhatamFlowDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<KhatamFlowDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create goal store
      if (!db.objectStoreNames.contains('goal')) {
        db.createObjectStore('goal');
      }

      // Create progress store
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress');
      }

      // Create logs store with timestamp index
      if (!db.objectStoreNames.contains('logs')) {
        const logStore = db.createObjectStore('logs', { keyPath: 'id' });
        logStore.createIndex('by-timestamp', 'timestamp');
      }

      // Create dailyGoal store
      if (!db.objectStoreNames.contains('dailyGoal')) {
        db.createObjectStore('dailyGoal');
      }

      // Create settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    }
  });

  return dbInstance;
}

// Goal operations
export async function saveGoal(goal: Goal): Promise<void> {
  const db = await initDB();
  await db.put('goal', goal, 'current');
}

export async function getGoal(): Promise<Goal | undefined> {
  const db = await initDB();
  return await db.get('goal', 'current');
}

export async function deleteGoal(): Promise<void> {
  const db = await initDB();
  await db.delete('goal', 'current');
}

// Progress operations
export async function saveProgress(progress: CurrentProgress): Promise<void> {
  const db = await initDB();
  await db.put('progress', progress, 'current');
}

export async function getProgress(): Promise<CurrentProgress | undefined> {
  const db = await initDB();
  return await db.get('progress', 'current');
}

// Daily goal operations
export async function saveDailyGoal(dailyGoal: DailyGoal): Promise<void> {
  const db = await initDB();
  await db.put('dailyGoal', dailyGoal, 'current');
}

export async function getDailyGoal(): Promise<DailyGoal | undefined> {
  const db = await initDB();
  return await db.get('dailyGoal', 'current');
}

// Log operations
export async function saveLog(log: ProgressLog): Promise<void> {
  const db = await initDB();
  await db.put('logs', log);
}

export async function getLogs(): Promise<ProgressLog[]> {
  const db = await initDB();
  const logs = await db.getAllFromIndex('logs', 'by-timestamp');
  return logs.reverse(); // Most recent first
}

export async function getLog(id: string): Promise<ProgressLog | undefined> {
  const db = await initDB();
  return await db.get('logs', id);
}

export async function deleteLog(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('logs', id);
}

// Settings operations
export async function saveSetting(key: string, value: any): Promise<void> {
  const db = await initDB();
  await db.put('settings', value, key);
}

export async function getSetting(key: string): Promise<any> {
  const db = await initDB();
  return await db.get('settings', key);
}

// Clear all data
export async function clearAllData(): Promise<void> {
  const db = await initDB();
  await db.clear('goal');
  await db.clear('progress');
  await db.clear('logs');
  await db.clear('dailyGoal');
  // Keep settings
}
