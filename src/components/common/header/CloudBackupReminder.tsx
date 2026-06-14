'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import api from '@/api';

import styles from './header.module.scss';

const BACKUP_REMINDER_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export default function CloudBackupReminder(props: { settingsLink: string }) {
  const { settingsLink } = props;
  const [label, setLabel] = useState<string>();

  useEffect(() => {
    let isActive = true;

    async function loadBackupReminder() {
      try {
        const backup = await api.backup.getStorageBackup();
        if (!isActive) return;

        setLabel(getBackupReminderLabel(backup?.exportedAt));
      } catch {
        if (isActive) setLabel(undefined);
      }
    }

    void loadBackupReminder();

    return () => {
      isActive = false;
    };
  }, []);

  if (label === undefined) return null;

  return (
    <>
      <span aria-hidden="true" className={styles['navigation-divider']} />
      <Link href={settingsLink} className={styles['backup-reminder']}>
        <span aria-hidden="true" className={styles['backup-reminder-dot']} />
        {label}
      </Link>
    </>
  );
}

function getBackupReminderLabel(exportedAt?: string): string | undefined {
  if (exportedAt === undefined) return '클라우드 백업 없음';

  const backupTime = new Date(exportedAt).getTime();
  if (Number.isNaN(backupTime)) return undefined;

  const elapsedMs = Date.now() - backupTime;
  if (elapsedMs < BACKUP_REMINDER_INTERVAL_MS) return undefined;

  return `마지막 백업 ${Math.floor(elapsedMs / DAY_MS)}일 전`;
}
