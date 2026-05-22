'use client';

import TextInput from '@/components/common/form/TextInput';

import type { TLoadoCellValue } from '@/app/loado/_type/loado';

import styles from './textFields.module.scss';

export default function TextFields(props: {
  cell: TLoadoCellValue;
  onPatch: (updates: Partial<TLoadoCellValue>) => void;
}) {
  const { cell, onPatch } = props;

  return (
    <div className={styles['field']}>
      <span className={styles['field-label']}>텍스트</span>
      <div className={styles['text-input-wrapper']}>
        <TextInput value={cell.text} onChange={(text) => onPatch({ text })} />
      </div>
    </div>
  );
}
