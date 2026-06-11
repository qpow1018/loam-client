import type { TTaskTableDataRow } from '@/types/taskTable';

import type { TDragHandleProps } from '@/components/common/draggableList/DraggableList';

import styles from './rowLabelCell.module.scss';

export default function RowLabelCell(props: {
  dragHandleProps: TDragHandleProps;
  row: TTaskTableDataRow;
  onEdit: () => void;
}) {
  const { dragHandleProps, row, onEdit } = props;

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    onEdit();
  }

  return (
    <div {...dragHandleProps} className={styles['row-label-cell']} onContextMenu={handleContextMenu}>
      <div className={styles['icon-box']}>{row.iconUrl && <img src={row.iconUrl} alt="" />}</div>

      {row.name}
    </div>
  );
}
