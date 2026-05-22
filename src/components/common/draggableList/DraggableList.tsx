'use client';

import { useMemo } from 'react';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import styles from './draggableList.module.scss';

export type TDragHandleProps = {
  ref: (node: HTMLElement | null) => void;
  onPointerDown?: (event: React.PointerEvent) => void;
};

export default function DraggableList<T>(props: {
  items: T[];
  getId: (item: T) => string;
  direction: 'horizontal' | 'vertical';
  onReorder: (newItems: T[]) => void;
  children: (item: T, props: { dragHandleProps: TDragHandleProps }) => React.ReactNode;
  className?: string;
}) {
  const { items, getId, direction, onReorder, children, className } = props;

  const pointerSensor = useSensor(PointerSensor);
  const sensors = useMemo(() => [pointerSensor], [pointerSensor]);

  const ids = items.map(getId);
  const strategy =
    direction === 'horizontal' ? horizontalListSortingStrategy : verticalListSortingStrategy;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={strategy}>
        <div
          className={`
            ${styles['draggable-list']}
            ${direction === 'horizontal' ? styles['horizontal'] : styles['vertical']}
            ${className ?? ''}
          `}
        >
          {items.map((item) => (
            <SortableItem key={getId(item)} id={getId(item)}>
              {(dragHandleProps) => children(item, { dragHandleProps })}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem(props: {
  id: string;
  children: (dragHandleProps: TDragHandleProps) => React.ReactNode;
}) {
  const { id, children } = props;

  const sortable = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
    opacity: sortable.isDragging ? 0.5 : 1,
  };

  const dragHandleProps: TDragHandleProps = {
    ref: sortable.setActivatorNodeRef,
    onPointerDown: sortable.listeners?.onPointerDown as TDragHandleProps['onPointerDown'],
  };

  return (
    // react-hooks/refs false positive: setNodeRef is a callback ref and attributes are aria props, not refs
    // eslint-disable-next-line react-hooks/refs
    <div ref={sortable.setNodeRef} style={style} {...sortable.attributes}>
      {children(dragHandleProps)}
    </div>
  );
}
