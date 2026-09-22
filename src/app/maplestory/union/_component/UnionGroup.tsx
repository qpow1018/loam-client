import { useState } from 'react';

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
  const [previousCharacters, setPreviousCharacters] = useState(props.characters);
  const [orderedCharacters, setOrderedCharacters] = useState(props.characters);

  if (!hasSameCharacters(props.characters, previousCharacters)) {
    setPreviousCharacters(props.characters);
    setOrderedCharacters(props.characters);
  }

  function handleReorder(nextCharacters: TResMaplestoryUnionCharacter[]) {
    setOrderedCharacters(nextCharacters);
    props.onReorder(nextCharacters);
  }

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
        items={orderedCharacters}
        getId={(character) => character.id}
        direction="vertical"
        isDropLayoutAnimationEnabled={false}
        onReorder={handleReorder}
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

function hasSameCharacters(
  characters: TResMaplestoryUnionCharacter[],
  previousCharacters: TResMaplestoryUnionCharacter[],
) {
  return (
    characters.length === previousCharacters.length &&
    characters.every((character, index) => character === previousCharacters[index])
  );
}
