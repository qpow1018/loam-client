'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';

import {
  createBackupPayload,
  downloadBackupPayload,
  isBackupPayload,
  restoreBackupPayload,
  type TBackupPayload,
} from '@/app/settings/_util/storageBackup';
import api from '@/api';

import Button from '@/components/common/button/Button';
import Confirm from '@/components/common/modal/Confirm';
import SettingsField from '@/app/settings/_component/SettingsField';
import SettingsSection from '@/app/settings/_component/SettingsSection';

import styles from '@/app/settings/_component/backupSection.module.scss';

function formatBackupDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '확인할 수 없음';

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function BackupSection() {
  const backupInputRef = useRef<HTMLInputElement>(null);

  const [backupStatus, setBackupStatus] = useState<string>();
  const [lastCloudBackup, setLastCloudBackup] = useState('확인 중...');
  const [pendingBackup, setPendingBackup] = useState<TBackupPayload | null>(null);
  const [isCloudBackupLoading, setIsCloudBackupLoading] = useState(false);
  const [isCloudRestoreLoading, setIsCloudRestoreLoading] = useState(false);
  const [isCloudRestoreConfirmOpen, setIsCloudRestoreConfirmOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadLastCloudBackup() {
      try {
        const backup = await api.backup.getStorageBackup();
        if (!isActive) return;

        setLastCloudBackup(backup === null ? '없음' : formatBackupDate(backup.exportedAt));
      } catch {
        if (isActive) setLastCloudBackup('확인할 수 없음');
      }
    }

    void loadLastCloudBackup();

    return () => {
      isActive = false;
    };
  }, []);

  function handleExportClick() {
    downloadBackupPayload(createBackupPayload());
    setBackupStatus('백업 파일을 생성했습니다.');
  }

  function handleImportClick() {
    backupInputRef.current?.click();
  }

  async function handleCloudBackupClick() {
    if (isCloudBackupLoading) return;

    setIsCloudBackupLoading(true);
    try {
      const backup = await api.backup.saveStorageBackup(createBackupPayload());
      setLastCloudBackup(formatBackupDate(backup.exportedAt));
      setBackupStatus('현재 저장 데이터를 클라우드에 백업했습니다.');
    } catch {
      setBackupStatus('클라우드 백업에 실패했습니다. 로그인 상태를 확인해주세요.');
    } finally {
      setIsCloudBackupLoading(false);
    }
  }

  function handleCloudRestoreClick() {
    setIsCloudRestoreConfirmOpen(true);
  }

  async function handleBackupFileChange(e: ChangeEvent<HTMLInputElement>) {
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
  }

  function handleRestoreConfirm() {
    if (pendingBackup === null) return;

    restoreBackupPayload(pendingBackup);
    setPendingBackup(null);
    setBackupStatus('백업 데이터를 복원했습니다. 다른 화면은 새로고침 후 반영됩니다.');
  }

  async function handleCloudRestoreConfirm() {
    if (isCloudRestoreLoading) return;

    setIsCloudRestoreLoading(true);
    try {
      const backup = await api.backup.getStorageBackup();

      if (backup === null) {
        setBackupStatus('클라우드에 저장된 백업이 없습니다.');
        setIsCloudRestoreConfirmOpen(false);
        return;
      }

      if (!isBackupPayload(backup)) {
        setBackupStatus('클라우드 백업 데이터 형식이 올바르지 않습니다.');
        setIsCloudRestoreConfirmOpen(false);
        return;
      }

      restoreBackupPayload(backup);
      setBackupStatus('클라우드 백업 데이터를 복원했습니다. 다른 화면은 새로고침 후 반영됩니다.');
      setIsCloudRestoreConfirmOpen(false);
    } catch {
      setBackupStatus('클라우드 복원에 실패했습니다. 로그인 상태를 확인해주세요.');
    } finally {
      setIsCloudRestoreLoading(false);
    }
  }

  return (
    <>
      <SettingsSection
        id="backup"
        title="백업/복원"
        description="할일 테이블과 메모 데이터를 JSON 파일 또는 클라우드 백업으로 보관합니다."
        status={backupStatus}
        variant="primary"
      >
        <SettingsField label="파일 백업" value="JSON 파일로 보관합니다.">
          <Button color="mint" fill="solid" size="small" onClick={handleExportClick}>
            내보내기
          </Button>
          <Button color="gray" fill="outline" size="small" onClick={handleImportClick}>
            가져오기
          </Button>
        </SettingsField>

        <SettingsField label="클라우드" value={`마지막 백업: ${lastCloudBackup}`}>
          <Button
            color="mint"
            fill="solid"
            size="small"
            isLoading={isCloudBackupLoading}
            onClick={() => void handleCloudBackupClick()}
          >
            백업
          </Button>
          <Button
            color="gray"
            fill="outline"
            size="small"
            isLoading={isCloudRestoreLoading}
            onClick={handleCloudRestoreClick}
          >
            복원
          </Button>
        </SettingsField>
      </SettingsSection>

      <input
        ref={backupInputRef}
        type="file"
        accept="application/json,.json"
        className={styles['backup-input']}
        onChange={handleBackupFileChange}
      />

      <Confirm
        isOpen={pendingBackup !== null}
        onClose={() => setPendingBackup(null)}
        title="백업 복원"
        message="현재 저장된 할일 테이블과 메모 데이터를 백업 파일 내용으로 교체할까요?"
        buttons={[
          {
            label: '취소',
            color: 'gray',
            fill: 'outline',
            onClick: () => setPendingBackup(null),
          },
          {
            label: '복원',
            color: 'mint',
            fill: 'solid',
            onClick: handleRestoreConfirm,
          },
        ]}
      />

      <Confirm
        isOpen={isCloudRestoreConfirmOpen}
        onClose={() => setIsCloudRestoreConfirmOpen(false)}
        title="클라우드 백업 복원"
        message="현재 저장된 할일 테이블과 메모 데이터를 클라우드 백업 내용으로 교체할까요?"
        buttons={[
          {
            label: '취소',
            color: 'gray',
            fill: 'outline',
            isDisabled: isCloudRestoreLoading,
            onClick: () => setIsCloudRestoreConfirmOpen(false),
          },
          {
            label: '복원',
            color: 'mint',
            fill: 'solid',
            isDisabled: isCloudRestoreLoading,
            onClick: () => void handleCloudRestoreConfirm(),
          },
        ]}
      />
    </>
  );
}
