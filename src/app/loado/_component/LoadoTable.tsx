'use client';

import DraggableList from '@/components/common/draggableList/DraggableList';

import styles from './loadoTable.module.scss';

export type TCharacter = { id: string; nickname: string };
export type TMission = { id: string; title: string };

export default function LoadoTable(props: {
  characters: TCharacter[];
  missions: TMission[];
  onReorderCharacters: (newOrder: TCharacter[]) => void;
  onReorderMissions: (newOrder: TMission[]) => void;
}) {
  const { characters, missions, onReorderCharacters, onReorderMissions } = props;

  return (
    <div className={styles['loado-table']}>
      <div className={styles['header-row']}>
        <div className={`${styles['cell']} ${styles['label-cell']}`} />
        <DraggableList<TCharacter>
          items={props.characters}
          getId={(c) => c.id}
          direction="horizontal"
          onReorder={props.onReorderCharacters}
        >
          {(c, { dragHandleProps }) => (
            <div
              className={`${styles['cell']} ${styles['handle']}`}
              ref={dragHandleProps.ref}
              onPointerDown={dragHandleProps.onPointerDown}
            >
              {c.nickname}
            </div>
          )}
        </DraggableList>
      </div>

      <DraggableList<TMission>
        items={props.missions}
        getId={(m) => m.id}
        direction="vertical"
        onReorder={props.onReorderMissions}
      >
        {(m, { dragHandleProps }) => (
          <div className={styles['row']}>
            <div
              className={`${styles['cell']} ${styles['label-cell']} ${styles['handle']}`}
              ref={dragHandleProps.ref}
              onPointerDown={dragHandleProps.onPointerDown}
            >
              {m.title}
            </div>
            {props.characters.map((c) => (
              <div key={c.id} className={styles['cell']} />
            ))}
          </div>
        )}
      </DraggableList>
    </div>
  );
}
