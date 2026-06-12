import { isClient } from './common';

export const StorageKey = {
  LOADO_TABLE: 'loado-table-state',
  LOADO_MEMOS: 'loado-memos-state',
  MAPLEDO_TABLE: 'mapledo-table-state',
} as const;

type TStorageKey = (typeof StorageKey)[keyof typeof StorageKey];

function createBucket(getStore: () => Storage) {
  return {
    get<T>(key: TStorageKey, defaultValue: T): T {
      if (!isClient()) return defaultValue;
      const raw = getStore().getItem(key);
      if (raw === null) return defaultValue;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return defaultValue;
      }
    },

    set<T>(key: TStorageKey, value: T): void {
      if (!isClient()) return;
      getStore().setItem(key, JSON.stringify(value));
    },

    remove(key: TStorageKey): void {
      if (!isClient()) return;
      getStore().removeItem(key);
    },
  };
}

export const storage = {
  local: createBucket(() => window.localStorage),
  session: createBucket(() => window.sessionStorage),
};
