'use client';

import { StorageKey } from '@/utils/storage';

import MaplestoryHeader from '@/components/maplestory/header/MaplestoryHeader';
import MemoTable from '@/components/memoTable/MemoTable';
import MapledoTable from './_component/mapledoTable/MapledoTable';

import styles from './mapledoClient.module.scss';

export default function MapledoClient() {
  return (
    <div className={styles['mapledo-client']}>
      <MaplestoryHeader />

      <div className={styles['mapledo-client-container']}>
        <MapledoTable />
        <MemoTable storageKey={StorageKey.MAPLEDO_MEMOS} />
      </div>
    </div>
  );
}
