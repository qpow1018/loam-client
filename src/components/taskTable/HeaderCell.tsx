import type { TTaskTableColumn } from '@/types/taskTable';

import type { TDragHandleProps } from '@/components/common/draggableList/DraggableList';

import styles from './headerCell.module.scss';

export default function HeaderCell(props: {
  column: TTaskTableColumn;
  dragHandleProps: TDragHandleProps;
  onEdit: () => void;
}) {
  const { column, dragHandleProps, onEdit } = props;

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    onEdit();
  }

  return (
    <div {...dragHandleProps} className={styles['header-cell']} onContextMenu={handleContextMenu}>
      {column.imageUrl && (
        <div className={styles['icon-box']}>
          <img src={column.imageUrl} alt="" />
        </div>
      )}
      {column.name}
    </div>
  );
}
