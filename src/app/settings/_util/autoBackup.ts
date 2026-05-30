import {
  createBackupFileName,
  createBackupPayload,
  type TBackupPayload,
} from '@/app/settings/_util/storageBackup';
import { StorageKey, storage } from '@/utils/storage';
import { getTauriCore } from '@/utils/tauri';

export const AUTO_BACKUP_RETENTION_COUNT = 5;
export const AUTO_BACKUP_SETTINGS_CHANGED_EVENT = 'loam-auto-backup-settings-changed';

const DEFAULT_AUTO_BACKUP_SETTINGS: TAutoBackupSettings = {
  interval: 'off',
};

export type TAutoBackupInterval = 'off' | 'daily' | 'weekly';

export type TAutoBackupSettings = {
  interval: TAutoBackupInterval;
  directoryPath?: string;
  lastBackupAt?: string;
  lastBackupPath?: string;
  lastError?: string;
};

export type TAutoBackupResult = {
  filePath: string;
  deletedCount: number;
};

function normalizeAutoBackupSettings(value: TAutoBackupSettings): TAutoBackupSettings {
  const interval: TAutoBackupInterval =
    value.interval === 'daily' || value.interval === 'weekly' ? value.interval : 'off';

  return {
    ...DEFAULT_AUTO_BACKUP_SETTINGS,
    ...value,
    interval,
  };
}

export function getAutoBackupSettings(): TAutoBackupSettings {
  return normalizeAutoBackupSettings(
    storage.local.get<TAutoBackupSettings>(
      StorageKey.AUTO_BACKUP_SETTINGS,
      DEFAULT_AUTO_BACKUP_SETTINGS,
    ),
  );
}

export function saveAutoBackupSettings(settings: TAutoBackupSettings): TAutoBackupSettings {
  const next = normalizeAutoBackupSettings(settings);
  storage.local.set(StorageKey.AUTO_BACKUP_SETTINGS, next);
  return next;
}

function getLocalDayNumber(date: Date) {
  return Math.floor(
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / (24 * 60 * 60 * 1000),
  );
}

export function shouldRunAutoBackup(settings: TAutoBackupSettings, now = new Date()): boolean {
  if (settings.interval === 'off') return false;
  if (settings.directoryPath === undefined) return false;
  if (settings.lastBackupAt === undefined) return true;

  const lastBackupTime = new Date(settings.lastBackupAt).getTime();
  if (Number.isNaN(lastBackupTime)) return true;

  const elapsedDays = getLocalDayNumber(now) - getLocalDayNumber(new Date(lastBackupTime));
  const intervalDays = settings.interval === 'daily' ? 1 : 7;
  return elapsedDays >= intervalDays;
}

export function getAutoBackupIntervalLabel(interval: TAutoBackupInterval) {
  if (interval === 'daily') return '하루마다';
  if (interval === 'weekly') return '일주일마다';
  return '꺼짐';
}

export async function selectAutoBackupDirectory(): Promise<string | null> {
  const core = getTauriCore();
  if (core === null) {
    throw new Error('데스크톱 앱에서만 자동백업을 사용할 수 있습니다.');
  }

  return core.invoke<string | null>('select_auto_backup_directory');
}

export async function runAutoBackup(directoryPath?: string): Promise<TAutoBackupResult> {
  const core = getTauriCore();
  if (core === null) {
    throw new Error('데스크톱 앱에서만 자동백업을 사용할 수 있습니다.');
  }

  const settings = getAutoBackupSettings();
  const backupDirectoryPath = directoryPath ?? settings.directoryPath;
  if (backupDirectoryPath === undefined) {
    throw new Error('자동백업 폴더를 먼저 선택해주세요.');
  }

  const payload: TBackupPayload = createBackupPayload();
  const result = await core.invoke<TAutoBackupResult>('write_auto_backup', {
    directoryPath: backupDirectoryPath,
    fileName: createBackupFileName(),
    payload,
    retentionCount: AUTO_BACKUP_RETENTION_COUNT,
  });

  saveAutoBackupSettings({
    ...settings,
    directoryPath: backupDirectoryPath,
    lastBackupAt: payload.exportedAt,
    lastBackupPath: result.filePath,
    lastError: undefined,
  });

  return result;
}
