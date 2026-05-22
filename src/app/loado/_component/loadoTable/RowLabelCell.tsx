'use client';

import type { TDragHandleProps } from '@/components/common/draggableList/DraggableList';

import type { TLoadoDataRow } from '../../_type/loado';

import styles from './rowLabelCell.module.scss';

export default function RowLabelCell(props: {
  row: TLoadoDataRow;
  dragHandleProps: TDragHandleProps;
  onEdit: () => void;
}) {
  const { row, dragHandleProps, onEdit } = props;

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    onEdit();
  }

  return (
    <div
      className={styles['row-label-cell']}
      {...dragHandleProps}
      onContextMenu={handleContextMenu}
    >
      {row.iconUrl ? (
        // 외부 사용자 입력 URL이므로 Next/Image의 호스트 화이트리스트로 못 다룸 → img 사용
        // eslint-disable-next-line @next/next/no-img-element
        <img src={row.iconUrl} alt="" />
      ) : null}
      {row.name}
    </div>
  );
}
