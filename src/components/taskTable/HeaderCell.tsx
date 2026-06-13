import type { TDragHandleProps } from '@/components/common/draggableList/DraggableList';

import styles from './headerCell.module.scss';

export default function HeaderCell(props: {
  children: React.ReactNode;
  dragHandleProps: TDragHandleProps;
  onEdit: () => void;
}) {
  const { children, dragHandleProps, onEdit } = props;

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    onEdit();
  }

  return (
    <div {...dragHandleProps} className={styles['header-cell']} onContextMenu={handleContextMenu}>
      {children}
    </div>
  );
}
