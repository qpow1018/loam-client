'use client';

import { useState, type ChangeEvent } from 'react';

import Confirm from '@/components/common/modal/Confirm';
import { StorageKey } from '@/utils/storage';
import AppSection from './_component/AppSection';
import StorageSection from './_component/StorageSection';

import styles from './settingsClient.module.scss';

const BACKUP_SCHEMA_VERSION = 1;
const BACKUP_STORAGE_KEYS = [
  StorageKey.LOADO_TABLE,
  StorageKey.LOADO_MEMOS,
  StorageKey.MY_CHARACTER_LIST,
] as const;

type TBackupPayload = {
  app: 'loam-client';
  version: number;
  exportedAt: string;
  data: Partial<Record<(typeof BACKUP_STORAGE_KEYS)[number], unknown>>;
};

function getBackupFileName() {
  const stamp = new Date().toISOString().slice(0, 10);
  return `loam-backup-${stamp}.json`;
}

function isBackupPayload(value: unknown): value is TBackupPayload {
  if (value === null || typeof value !== 'object') return false;

  const candidate = value as Partial<TBackupPayload>;
  return (
    candidate.app === 'loam-client' &&
    candidate.version === BACKUP_SCHEMA_VERSION &&
    candidate.data !== null &&
    typeof candidate.data === 'object'
  );
}

export default function SettingsClient() {
  const [backupStatus, setBackupStatus] = useState<string>();
  const [pendingBackup, setPendingBackup] = useState<TBackupPayload | null>(null);

  const handleExportClick = () => {
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

    const backup: TBackupPayload = {
      app: 'loam-client',
      version: BACKUP_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      data,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = getBackupFileName();
    anchor.click();
    URL.revokeObjectURL(url);
    setBackupStatus('백업 파일을 생성했습니다.');
  };

  const handleImportClick = () => {
    document.getElementById('settings-backup-input')?.click();
  };

  const handleBackupFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file === undefined) return;

    try {
      const payload = JSON.parse(await file.text()) as unknown;
      if (!isBackupPayload(payload)) {
        setBackupStatus('LoaM 백업 파일 형식이 아닙니다.');
        return;
      }

      setPendingBackup(payload);
    } catch {
      setBackupStatus('백업 파일을 읽을 수 없습니다.');
    }
  };

  const handleRestoreConfirm = () => {
    if (pendingBackup === null) return;

    for (const key of BACKUP_STORAGE_KEYS) {
      const value = pendingBackup.data[key];
      if (value === undefined) {
        window.localStorage.removeItem(key);
        continue;
      }

      window.localStorage.setItem(key, JSON.stringify(value));
    }

    setPendingBackup(null);
    setBackupStatus('백업 데이터를 복원했습니다. 다른 화면은 새로고침 후 반영됩니다.');
  };

  return (
    <main className={styles['settings-page']}>
      <StorageSection
        backupStatus={backupStatus}
        onExport={handleExportClick}
        onImport={handleImportClick}
      />
      <AppSection />

      <input
        id="settings-backup-input"
        type="file"
        accept="application/json,.json"
        className={styles['backup-input']}
        onChange={handleBackupFileChange}
      />

      <Confirm
        isOpen={pendingBackup !== null}
        onClose={() => setPendingBackup(null)}
        title="백업 복원"
        message="현재 저장된 할일 테이블, 메모, 내 캐릭터 데이터를 백업 파일 내용으로 교체할까요?"
        buttons={[
          {
            label: '취소',
            theme: 'bd-gray',
            onClick: () => setPendingBackup(null),
          },
          {
            label: '복원',
            theme: 'bg-pri',
            onClick: handleRestoreConfirm,
          },
        ]}
      />
    </main>
  );
}
