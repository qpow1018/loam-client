'use client';

import type { TDragHandleProps } from '@/components/common/draggableList/DraggableList';

import type { TLoadoColumn } from '../_type/loado';

import styles from './headerCell.module.scss';

export default function HeaderCell(props: {
  column: TLoadoColumn;
  dragHandleProps: TDragHandleProps;
}) {
  const { column, dragHandleProps } = props;
  return (
    <div className={styles['header-cell']} {...dragHandleProps}>
      {column.name}
    </div>
  );
}
