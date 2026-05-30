'use client';

import { useEffect, useState } from 'react';

import {
  AUTO_BACKUP_RETENTION_COUNT,
  AUTO_BACKUP_SETTINGS_CHANGED_EVENT,
  getAutoBackupIntervalLabel,
  getAutoBackupSettings,
  runAutoBackup,
  saveAutoBackupSettings,
  selectAutoBackupDirectory,
  type TAutoBackupInterval,
  type TAutoBackupSettings,
} from '@/app/settings/_util/autoBackup';
import { isTauriAvailable } from '@/utils/tauri';

import Button from '@/components/common/button/Button';
import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import SettingsField from '@/app/settings/_component/SettingsField';
import SettingsSection from '@/app/settings/_component/SettingsSection';

const AUTO_BACKUP_INTERVAL_ACTIONS: Array<{
  label: string;
  value: TAutoBackupInterval;
}> = [
  { label: '끄기', value: 'off' },
  { label: '하루', value: 'daily' },
  { label: '일주일', value: 'weekly' },
];

export default function AutoBackupSection() {
  const [autoBackupSettings, setAutoBackupSettings] =
    useState<TAutoBackupSettings>(getAutoBackupSettings);
  const [autoBackupStatus, setAutoBackupStatus] = useState<string>();
  const [isAutoBackupAvailable, setIsAutoBackupAvailable] = useState(false);
  const [isAutoBackupRunning, setIsAutoBackupRunning] = useState(false);
  const [isDirectorySelecting, setIsDirectorySelecting] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setIsAutoBackupAvailable(isTauriAvailable());
    });

    function handleSettingsChanged() {
      setAutoBackupSettings(getAutoBackupSettings());
      setAutoBackupStatus(undefined);
    }

    window.addEventListener(AUTO_BACKUP_SETTINGS_CHANGED_EVENT, handleSettingsChanged);
    return () => {
      window.removeEventListener(AUTO_BACKUP_SETTINGS_CHANGED_EVENT, handleSettingsChanged);
    };
  }, []);

  function updateAutoBackupSettings(settings: TAutoBackupSettings) {
    const next = saveAutoBackupSettings(settings);
    setAutoBackupSettings(next);
    setAutoBackupStatus(undefined);
  }

  async function pickAutoBackupDirectory() {
    setIsDirectorySelecting(true);
    try {
      const directoryPath = await selectAutoBackupDirectory();
      if (directoryPath === null) return undefined;

      const next = saveAutoBackupSettings({
        ...autoBackupSettings,
        directoryPath,
        lastError: undefined,
      });
      setAutoBackupSettings(next);
      setAutoBackupStatus('자동백업 폴더를 선택했습니다.');
      return directoryPath;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '자동백업 폴더를 선택할 수 없습니다.';
      updateAutoBackupSettings({
        ...autoBackupSettings,
        lastError: message,
      });
      setAutoBackupStatus(message);
      return undefined;
    } finally {
      setIsDirectorySelecting(false);
    }
  }

  async function handleAutoBackupIntervalSelect(interval: TAutoBackupInterval) {
    if (interval === 'off') {
      updateAutoBackupSettings({
        ...autoBackupSettings,
        interval,
      });
      setAutoBackupStatus('자동백업을 껐습니다.');
      return;
    }

    const directoryPath = autoBackupSettings.directoryPath ?? (await pickAutoBackupDirectory());
    if (directoryPath === undefined) return;

    setIsAutoBackupRunning(true);
    try {
      const nextSettings = saveAutoBackupSettings({
        ...autoBackupSettings,
        interval,
        directoryPath,
        lastError: undefined,
      });
      setAutoBackupSettings(nextSettings);
      await runAutoBackup(directoryPath);
      const next = getAutoBackupSettings();
      setAutoBackupSettings(next);
      setAutoBackupStatus(`${getAutoBackupIntervalLabel(interval)} 자동백업을 켰습니다.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : '자동백업에 실패했습니다.';
      updateAutoBackupSettings({
        ...autoBackupSettings,
        interval,
        directoryPath,
        lastError: message,
      });
      setAutoBackupStatus(message);
    } finally {
      setIsAutoBackupRunning(false);
    }
  }

  async function handleAutoBackupRunClick() {
    const directoryPath = autoBackupSettings.directoryPath ?? (await pickAutoBackupDirectory());
    if (directoryPath === undefined) return;

    setIsAutoBackupRunning(true);
    try {
      await runAutoBackup(directoryPath);
      const next = getAutoBackupSettings();
      setAutoBackupSettings(next);
      setAutoBackupStatus('자동백업 파일을 저장했습니다.');
    } catch (error) {
      const message = error instanceof Error ? error.message : '자동백업에 실패했습니다.';
      updateAutoBackupSettings({
        ...autoBackupSettings,
        directoryPath,
        lastError: message,
      });
      setAutoBackupStatus(message);
    } finally {
      setIsAutoBackupRunning(false);
    }
  }

  function getAutoBackupStatus() {
    if (!isAutoBackupAvailable) return '데스크톱 앱에서 사용할 수 있습니다.';
    if (autoBackupStatus !== undefined) return autoBackupStatus;
    if (autoBackupSettings.lastError !== undefined) return autoBackupSettings.lastError;
    if (autoBackupSettings.lastBackupAt !== undefined) {
      return `마지막 백업: ${new Date(autoBackupSettings.lastBackupAt).toLocaleString('ko-KR')}`;
    }

    return autoBackupSettings.interval === 'off' ? '꺼짐' : '아직 자동백업 이력이 없습니다.';
  }

  return (
    <SettingsSection
      title="자동백업"
      description="선택한 폴더에 날짜별 1개 파일로 저장하고 최근 백업만 보관합니다."
      status={getAutoBackupStatus()}
    >
      <SettingsField label="폴더" value={autoBackupSettings.directoryPath ?? '선택 안 됨'} isPath>
        <Button
          theme="bd-gray"
          size="small"
          isDisabled={!isAutoBackupAvailable}
          isLoading={isDirectorySelecting}
          onClick={() => {
            void pickAutoBackupDirectory();
          }}
        >
          폴더 선택
        </Button>
      </SettingsField>

      <SettingsField label="주기" value={getAutoBackupIntervalLabel(autoBackupSettings.interval)}>
        <ButtonGroup
          options={AUTO_BACKUP_INTERVAL_ACTIONS}
          value={autoBackupSettings.interval}
          isDisabled={!isAutoBackupAvailable || isAutoBackupRunning}
          onChange={(next) => {
            void handleAutoBackupIntervalSelect(next);
          }}
        />
      </SettingsField>

      <SettingsField label="보관" value={`최근 ${AUTO_BACKUP_RETENTION_COUNT}개`}>
        <Button
          theme="bg-sec"
          size="small"
          isDisabled={!isAutoBackupAvailable}
          isLoading={isAutoBackupRunning}
          onClick={handleAutoBackupRunClick}
        >
          선택 폴더에 백업
        </Button>
      </SettingsField>
    </SettingsSection>
  );
}
