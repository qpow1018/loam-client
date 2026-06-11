'use client';

import MaplestoryHeader from '@/components/maplestory/header/MaplestoryHeader';
import MapledoTable from './_component/mapledoTable/MapledoTable';

import styles from './mapledoClient.module.scss';

export default function MapledoClient() {
  return (
    <div className={styles['mapledo-client']}>
      <MaplestoryHeader />

      <div className={styles['mapledo-client-container']}>
        <MapledoTable />
      </div>
    </div>
  );
}
