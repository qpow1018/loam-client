'use client';

import Header from '@/components/common/header/Header';
import LoadoTable from './_component/loadoTable/LoadoTable';
import MemoTable from './_component/memoTable/MemoTable';

import styles from './loadoClient.module.scss';

export default function LoadoClient() {
  return (
    <>
      <Header />

      <div className={styles['loado-client']}>
        <LoadoTable />
        <MemoTable />
      </div>
    </>
  );
}
