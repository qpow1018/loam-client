'use client';

import { useSyncExternalStore } from 'react';
import { MdDeleteOutline, MdFileDownload, MdInstallMobile, MdSecurity } from 'react-icons/md';

import Button from '@/components/common/button/Button';

import styles from './settingsClient.module.scss';

const RELEASE_BASE_URL = 'https://github.com/qpow1018/loam-client/releases/latest';

const DOWNLOAD_OPTIONS = {
  mac: {
    label: 'macOS',
    url: '/download/mac',
  },
  windows: {
    label: 'Windows',
    url: '/download/windows',
  },
} as const;

type TDownloadPlatform = keyof typeof DOWNLOAD_OPTIONS;

const COMPLETED_SETTINGS = [
  {
    title: '앱 다운로드',
    description: '브라우저를 열지 않고 LoaM을 독립된 데스크톱 창에서 사용할 수 있습니다.',
    icon: MdInstallMobile,
  },
];

const TODO_MEMOS = [
  {
    title: '데이터 백업/복원',
    description: '할일 테이블, 메모, 내 캐릭터 데이터를 JSON 파일로 내보내고 다시 가져오기',
    icon: MdFileDownload,
  },
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
];

function getDownloadPlatform(): TDownloadPlatform | null {
  if (typeof navigator === 'undefined') return null;

  const platform = navigator.platform;
  const normalizedPlatform = platform.toLowerCase();

  if (normalizedPlatform.includes('mac')) return 'mac';
  if (normalizedPlatform.includes('win')) return 'windows';

  return null;
}

function subscribePlatformStore() {
  return () => undefined;
}

export default function SettingsClient() {
  const downloadPlatform = useSyncExternalStore(
    subscribePlatformStore,
    getDownloadPlatform,
    () => null,
  );
  const primaryDownload = downloadPlatform ? DOWNLOAD_OPTIONS[downloadPlatform] : null;
  const downloadLabel = primaryDownload ? `${primaryDownload.label} 다운로드` : '릴리스 보기';

  const handleDownloadClick = () => {
    window.location.href = primaryDownload?.url ?? RELEASE_BASE_URL;
  };

  const handleReleasePageClick = () => {
    window.open(RELEASE_BASE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className={styles['settings-page']}>
      <section className={styles['settings-container']}>
        <div className={styles['section-header']}>
          <p className={styles['title']}>설정</p>
        </div>

        <div className={styles['memo-list']} aria-label="완성된 설정 기능">
          {COMPLETED_SETTINGS.map((memo) => {
            const Icon = memo.icon;

            return (
              <article key={memo.title} className={styles['memo-item']}>
                <div className={styles['icon-box']}>
                  <Icon size={20} />
                </div>
                <div className={styles['memo-content']}>
                  <h2>{memo.title}</h2>
                  <p>{memo.description}</p>
                </div>
                <div className={styles['item-actions']}>
                  <Button theme="bg-pri" size="small" onClick={handleDownloadClick}>
                    <MdInstallMobile size={18} />
                    <span>{downloadLabel}</span>
                  </Button>
                  <Button theme="bd-gray" size="small" onClick={handleReleasePageClick}>
                    <MdFileDownload size={18} />
                    <span>전체 파일</span>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles['settings-container']}>
        <div className={styles['section-header']}>
          <p className={styles['title']}>TODO 메모</p>
        </div>

        <div className={styles['memo-list']} aria-label="설정 페이지 개발 메모">
          {TODO_MEMOS.map((memo) => {
            const Icon = memo.icon;

            return (
              <article key={memo.title} className={styles['memo-item']}>
                <div className={styles['icon-box']}>
                  <Icon size={20} />
                </div>
                <div className={styles['memo-content']}>
                  <h2>{memo.title}</h2>
                  <p>{memo.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
