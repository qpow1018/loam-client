'use client';

import LoadoTable from './_component/loadoTable/LoadoTable';
import MemoTable from './_component/memoTable/MemoTable';
import LostarkHeader from '@/components/lostark/header/LostarkHeader';

import styles from './loadoClient.module.scss';

export default function LoadoClient() {
  return (
    <div className={styles['loado-client']}>
      <LostarkHeader />

      <div className={styles['loado-client-container']}>
        <LoadoTable />
        <MemoTable />
      </div>
    </div>
  );
}
