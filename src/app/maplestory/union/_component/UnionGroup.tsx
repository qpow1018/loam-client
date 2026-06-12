import type { TResMaplestoryUnionCharacter } from '@/api/maplestory/type';

import DraggableList from '@/components/common/draggableList/DraggableList';
import UnionCharacterRow from './UnionCharacterRow';

import styles from './unionGroup.module.scss';

export default function UnionGroup(props: {
  label: string;
  characters: TResMaplestoryUnionCharacter[];
  onLevelChange: (characterId: string, level: number | null) => Promise<boolean>;
  onReorder: (characters: TResMaplestoryUnionCharacter[]) => void;
}) {
  return (
    <section className={styles['union-group']}>
      <div className={styles['group-header']}>
        <h2 className={styles['group-name']}>{props.label}</h2>
        <span className={styles['character-count']}>{props.characters.length}개 직업</span>
      </div>

      <div className={styles['column-header']} aria-hidden="true">
        <span />
        <span>직업</span>
        <span>유니온 효과</span>
        <span>링크 효과</span>
        <span>레벨</span>
        <span>상태</span>
      </div>

      <DraggableList<TResMaplestoryUnionCharacter>
        items={props.characters}
        getId={(character) => character.id}
        direction="vertical"
        onReorder={props.onReorder}
        className={styles['character-list']}
      >
        {(character, { dragHandleProps }) => (
          <UnionCharacterRow
            character={character}
            dragHandleProps={dragHandleProps}
            onLevelChange={(level) => props.onLevelChange(character.id, level)}
          />
        )}
      </DraggableList>
    </section>
  );
}
