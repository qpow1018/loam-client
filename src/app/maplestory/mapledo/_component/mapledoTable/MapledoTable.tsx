'use client';

import styles from './mapledoTable.module.scss';

export default function MapledoTable() {
  return <MapledoTableContent />;
}

function MapledoTableContent() {
  return <div className={styles['mapledo-table']} />;
}
