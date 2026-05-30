'use client';

import { useRef, useState, type ChangeEvent } from 'react';

import {
  createBackupPayload,
  downloadBackupPayload,
  isBackupPayload,
  restoreBackupPayload,
  type TBackupPayload,
} from '@/app/settings/_util/storageBackup';

import Button from '@/components/common/button/Button';
import Confirm from '@/components/common/modal/Confirm';
import SettingsSection from '@/app/settings/_component/SettingsSection';

import styles from '@/app/settings/_component/backupSection.module.scss';

export default function BackupSection() {
  const backupInputRef = useRef<HTMLInputElement>(null);

  const [backupStatus, setBackupStatus] = useState<string>();
  const [pendingBackup, setPendingBackup] = useState<TBackupPayload | null>(null);

  function handleExportClick() {
    downloadBackupPayload(createBackupPayload());
    setBackupStatus('백업 파일을 생성했습니다.');
  }

  function handleImportClick() {
    backupInputRef.current?.click();
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

  return (
    <>
      <SettingsSection
        title="백업/복원"
        description="할일 테이블, 메모, 내 캐릭터 데이터를 JSON 파일로 내보내고 다시 가져옵니다."
        status={backupStatus}
        actions={
          <>
            <Button theme="bg-sec" size="small" onClick={handleExportClick}>
              내보내기
            </Button>
            <Button theme="bd-gray" size="small" onClick={handleImportClick}>
              가져오기
            </Button>
          </>
        }
      />

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
    </>
  );
}
