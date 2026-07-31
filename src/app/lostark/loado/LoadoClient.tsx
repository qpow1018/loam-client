'use client';

import { StorageKey } from '@/utils/storage';

import LoadoTable from './_component/loadoTable/LoadoTable';
import MemoTable from '@/components/memoTable/MemoTable';

import styles from './loadoClient.module.scss';

export default function LoadoClient() {
  return (
    <div className={styles['loado-client']}>
      <div className={styles['loado-client-container']}>
        <LoadoTable />
        <MemoTable storageKey={StorageKey.LOADO_MEMOS} />
      </div>
    </div>
  );
}
