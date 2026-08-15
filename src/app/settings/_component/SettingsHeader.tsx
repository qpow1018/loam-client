'use client';

import { useRouter } from 'next/navigation';
import { MdArrowBack } from 'react-icons/md';

import styles from '@/app/settings/_component/settingsHeader.module.scss';

export default function SettingsHeader() {
  const router = useRouter();

  return (
    <header className={styles['settings-header']}>
      <button type="button" className={styles['back-button']} onClick={() => router.back()}>
        <MdArrowBack size={20} aria-hidden="true" />
        뒤로가기
      </button>
    </header>
  );
}
