'use client';

import LoadoTable from './_component/loadoTable/LoadoTable';
import MemoTable from './_component/memoTable/MemoTable';
import Header from '@/components/common/header/Header';

import styles from './loadoClient.module.scss';

export default function LoadoClient() {
  return (
    <div className={styles['loado-client']}>
      <Header />

      <div className={styles['loado-client-container']}>
        <LoadoTable />
        <MemoTable />
      </div>
    </div>
  );
}
