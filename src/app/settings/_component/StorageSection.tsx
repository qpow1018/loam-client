'use client';

import { useState, type ChangeEvent } from 'react';

import {
  createBackupPayload,
  downloadBackupPayload,
  isBackupPayload,
  restoreBackupPayload,
  type TBackupPayload,
} from '@/app/settings/_util/storageBackup';

import Confirm from '@/components/common/modal/Confirm';
import SettingsItem, { type TSettingItem } from '@/app/settings/_component/SettingsItem';

import styles from '@/app/settings/_component/storageSection.module.scss';

import { MdBackup, MdDeleteOutline, MdFileDownload, MdSecurity } from 'react-icons/md';

const BACKUP_INPUT_ID = 'settings-backup-input';

const UPCOMING_SETTINGS: TSettingItem[] = [
  {
    title: '저장소 초기화',
    description: '전체 초기화와 할일/메모/캐릭터별 초기화를 Confirm 모달과 함께 제공',
    icon: MdDeleteOutline,
  },
  {
    title: '저장 데이터 검사/복구',
    description: '깨진 localStorage 값, 예전 구조, 누락된 Loado 셀을 감지하고 복구',
    icon: MdSecurity,
  },
  {
    title: '저장소 자동백업',
    description: '일정 주기마다 저장 데이터를 자동으로 백업하고 최근 백업 이력을 관리',
    icon: MdBackup,
  },
];

export default function StorageSection() {
  const [backupStatus, setBackupStatus] = useState<string>();
  const [pendingBackup, setPendingBackup] = useState<TBackupPayload | null>(null);

  function handleExportClick() {
    downloadBackupPayload(createBackupPayload());
    setBackupStatus('백업 파일을 생성했습니다.');
  }

  function handleImportClick() {
    document.getElementById(BACKUP_INPUT_ID)?.click();
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

  const storageSettings: TSettingItem[] = [
    {
      title: '데이터 백업/복원',
      description: '할일 테이블, 메모, 내 캐릭터 데이터를 JSON 파일로 내보내고 다시 가져옵니다.',
      icon: MdFileDownload,
      status: backupStatus,
      actions: [
        {
          label: '내보내기',
          icon: MdFileDownload,
          theme: 'bg-sec',
          onClick: handleExportClick,
        },
        {
          label: '가져오기',
          icon: MdFileDownload,
          theme: 'bd-gray',
          onClick: handleImportClick,
        },
      ],
    },
  ];

  return (
    <>
      <section className={styles['settings-container']}>
        <div className={styles['section-header']}>
          <p className={styles['title']}>저장소</p>
        </div>

        <div className={styles['memo-list']} aria-label="저장소 설정 기능">
          {storageSettings.map((item) => (
            <SettingsItem key={item.title} item={item} />
          ))}
        </div>

        <input
          id={BACKUP_INPUT_ID}
          type="file"
          accept="application/json,.json"
          className={styles['backup-input']}
          onChange={handleBackupFileChange}
        />
      </section>

      <section className={styles['settings-container']}>
        <div className={styles['section-header']}>
          <p className={styles['title']}>저장소 TODO 메모</p>
        </div>

        <div className={styles['memo-list']} aria-label="설정 페이지 개발 메모">
          {UPCOMING_SETTINGS.map((item) => (
            <SettingsItem key={item.title} item={item} />
          ))}
        </div>
      </section>

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
