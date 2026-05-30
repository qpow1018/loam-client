'use client';

import { useEffect } from 'react';

import { isTauriAvailable } from '@/utils/tauri';
import {
  getAutoBackupSettings,
  runAutoBackup,
  saveAutoBackupSettings,
  shouldRunAutoBackup,
} from '@/app/settings/_util/autoBackup';

export default function AutoBackupRunner() {
  useEffect(() => {
    if (!isTauriAvailable()) return;

    async function checkAutoBackup() {
      const settings = getAutoBackupSettings();
      if (!shouldRunAutoBackup(settings)) return;

      try {
        await runAutoBackup();
      } catch (error) {
        saveAutoBackupSettings({
          ...settings,
          lastError: error instanceof Error ? error.message : '자동백업에 실패했습니다.',
        });
      }
    }

    void checkAutoBackup();
  }, []);

  return null;
}
