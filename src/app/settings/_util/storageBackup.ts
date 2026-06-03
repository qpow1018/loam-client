import { StorageKey } from '@/utils/storage';

const BACKUP_SCHEMA_VERSION = 1;
const BACKUP_STORAGE_KEYS = [
  StorageKey.LOADO_TABLE,
  StorageKey.LOADO_MEMOS,
] as const;

export type TBackupPayload = {
  app: 'loam-client';
  version: number;
  exportedAt: string;
  data: Partial<Record<(typeof BACKUP_STORAGE_KEYS)[number], unknown>>;
};

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function createBackupFileName(options?: { includeTime?: boolean; prefix?: string }) {
  const now = new Date();
  const date = formatLocalDate(now);
  const prefix = options?.prefix ?? 'loam-backup';

  if (options?.includeTime !== true) {
    return `${prefix}-${date}.json`;
  }

  const time = now.toTimeString().slice(0, 8).replaceAll(':', '');
  return `${prefix}-${date}-${time}.json`;
}

export function createBackupPayload(): TBackupPayload {
  const data: TBackupPayload['data'] = {};

  for (const key of BACKUP_STORAGE_KEYS) {
    const raw = window.localStorage.getItem(key);
    if (raw === null) continue;

    try {
      data[key] = JSON.parse(raw) as unknown;
    } catch {
      data[key] = raw;
    }
  }

  return {
    app: 'loam-client',
    version: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function downloadBackupPayload(backup: TBackupPayload): void {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = createBackupFileName();
  anchor.click();
  URL.revokeObjectURL(url);
}

export function isBackupPayload(value: unknown): value is TBackupPayload {
  if (value === null || typeof value !== 'object') return false;

  const candidate = value as Partial<TBackupPayload>;
  return (
    candidate.app === 'loam-client' &&
    candidate.version === BACKUP_SCHEMA_VERSION &&
    candidate.data !== null &&
    typeof candidate.data === 'object'
  );
}

export function restoreBackupPayload(backup: TBackupPayload): void {
  for (const key of BACKUP_STORAGE_KEYS) {
    const value = backup.data[key];
    if (value === undefined) {
      window.localStorage.removeItem(key);
      continue;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }
}
