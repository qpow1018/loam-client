'use client';

import { useSyncExternalStore } from 'react';

import {
  getDownloadLabel,
  getDownloadPlatform,
  getDownloadPlatformLabel,
  getDownloadUrl,
  subscribeDownloadPlatformStore,
} from '@/app/settings/_util/download';

import Button from '@/components/common/button/Button';
import SettingsField from '@/app/settings/_component/SettingsField';
import SettingsSection from '@/app/settings/_component/SettingsSection';

export default function AppSection() {
  const downloadPlatform = useSyncExternalStore(
    subscribeDownloadPlatformStore,
    getDownloadPlatform,
    () => null,
  );
  const downloadLabel = getDownloadLabel(downloadPlatform);
  const downloadUrl = getDownloadUrl(downloadPlatform);
  const platformLabel = getDownloadPlatformLabel(downloadPlatform);

  function handleDownloadClick() {
    if (downloadUrl === null) return;

    window.location.href = downloadUrl;
  }

  return (
    <SettingsSection
      title="앱 다운로드"
      description="브라우저를 열지 않고 LoaM을 독립된 데스크톱 창에서 사용할 수 있습니다."
      status={
        downloadUrl === null
          ? '현재 환경에서는 자동 다운로드를 지원하지 않습니다.'
          : '다운로드 가능'
      }
      actions={
        <Button
          theme="bg-pri"
          size="small"
          isDisabled={downloadUrl === null}
          onClick={handleDownloadClick}
        >
          {downloadLabel}
        </Button>
      }
    >
      <SettingsField label="환경" value={platformLabel} />
      <SettingsField
        label="상태"
        value={downloadUrl === null ? '다운로드 링크 없음' : '설치 파일 준비됨'}
      />
    </SettingsSection>
  );
}
