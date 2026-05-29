'use client';

import { useSyncExternalStore } from 'react';
import { MdInstallMobile } from 'react-icons/md';

import {
  getDownloadLabel,
  getDownloadPlatform,
  getDownloadUrl,
  subscribeDownloadPlatformStore,
} from '../_util/download';
import SettingsItem, { type TSettingItem } from './SettingsItem';

import styles from '../settingsClient.module.scss';

export default function AppSection() {
  const downloadPlatform = useSyncExternalStore(
    subscribeDownloadPlatformStore,
    getDownloadPlatform,
    () => null,
  );
  const downloadLabel = getDownloadLabel(downloadPlatform);
  const downloadUrl = getDownloadUrl(downloadPlatform);

  const handleDownloadClick = () => {
    if (downloadUrl === null) return;

    window.location.href = downloadUrl;
  };

  const appSettings: TSettingItem[] = [
    {
      title: '앱 다운로드',
      description: '브라우저를 열지 않고 LoaM을 독립된 데스크톱 창에서 사용할 수 있습니다.',
      icon: MdInstallMobile,
      actions: [
        {
          label: downloadLabel,
          icon: MdInstallMobile,
          theme: 'bg-pri',
          onClick: handleDownloadClick,
          isDisabled: downloadUrl === null,
        },
      ],
    },
  ];

  return (
    <section className={styles['settings-container']}>
      <div className={styles['section-header']}>
        <p className={styles['title']}>앱</p>
      </div>

      <div className={styles['memo-list']} aria-label="앱 설정 기능">
        {appSettings.map((item) => (
          <SettingsItem key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
