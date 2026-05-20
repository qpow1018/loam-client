import { isClient } from './common';

export const StorageKey = {
  LOADO_TABLE: 'loado-table-state',
} as const;

type TStorageKey = (typeof StorageKey)[keyof typeof StorageKey];

export const storage = {
  get<T>(key: TStorageKey, defaultValue: T): T {
    if (!isClient()) return defaultValue;
    const raw = window.localStorage.getItem(key);
    if (raw === null) return defaultValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: TStorageKey, value: T): void {
    if (!isClient()) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key: TStorageKey): void {
    if (!isClient()) return;
    window.localStorage.removeItem(key);
  },
};
