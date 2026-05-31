'use client';

import { useEffect, useState } from 'react';

import Button from '@/components/common/button/Button';
import SettingsField from '@/app/settings/_component/SettingsField';
import SettingsSection from '@/app/settings/_component/SettingsSection';

type TBeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isStandaloneDisplayMode() {
  if (typeof window === 'undefined') return false;
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    navigatorWithStandalone.standalone === true
  );
}

export default function PwaInstallSection() {
  const [installPrompt, setInstallPrompt] = useState<TBeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [status, setStatus] = useState('설치 상태를 확인하고 있습니다.');

  useEffect(() => {
    queueMicrotask(() => {
      const standalone = isStandaloneDisplayMode();
      setIsStandalone(standalone);
      setStatus(standalone ? '설치된 앱으로 실행 중입니다.' : '설치 대기 중');
    });

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as TBeforeInstallPromptEvent);
      setStatus('설치할 수 있습니다.');
    }

    function handleAppInstalled() {
      setInstallPrompt(null);
      setIsStandalone(true);
      setStatus('설치를 완료했습니다.');
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  async function handleInstallClick() {
    if (installPrompt === null) return;

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    setStatus(choice.outcome === 'accepted' ? '설치를 시작했습니다.' : '설치를 취소했습니다.');
  }

  const canInstall = installPrompt !== null && !isStandalone;

  return (
    <SettingsSection
      title="앱 설치"
      description="LoaM을 브라우저 밖의 독립된 앱 창으로 설치합니다."
      status={status}
      actions={
        <Button theme="bg-pri" size="small" isDisabled={!canInstall} onClick={handleInstallClick}>
          설치
        </Button>
      }
    >
      <SettingsField label="실행 방식" value={isStandalone ? '설치 앱' : '브라우저'} />
      <SettingsField label="상태" value={canInstall ? '설치 가능' : status} />
    </SettingsSection>
  );
}
