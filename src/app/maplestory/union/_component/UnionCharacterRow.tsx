import { useState } from 'react';
import { MdDragHandle } from 'react-icons/md';

import type { TResMaplestoryUnionCharacter } from '@/api/maplestory/type';

import type { TDragHandleProps } from '@/components/common/draggableList/DraggableList';

import styles from './unionCharacterRow.module.scss';

export default function UnionCharacterRow(props: {
  character: TResMaplestoryUnionCharacter;
  dragHandleProps: TDragHandleProps;
  onLevelChange: (level: number | null) => Promise<boolean>;
}) {
  const [levelInput, setLevelInput] = useState(
    props.character.level === null ? '' : String(props.character.level),
  );

  async function handleLevelBlur() {
    const trimmedLevel = levelInput.trim();

    if (trimmedLevel.length === 0) {
      if (props.character.level === null) return;

      const isSaved = await props.onLevelChange(null);
      if (!isSaved) {
        setLevelInput(String(props.character.level));
      }
      return;
    }

    const parsedLevel = Number(trimmedLevel);
    if (!Number.isInteger(parsedLevel) || parsedLevel < 0 || parsedLevel > 300) {
      setLevelInput(props.character.level === null ? '' : String(props.character.level));
      return;
    }

    setLevelInput(String(parsedLevel));
    if (parsedLevel !== props.character.level) {
      const isSaved = await props.onLevelChange(parsedLevel);
      if (!isSaved) {
        setLevelInput(props.character.level === null ? '' : String(props.character.level));
      }
    }
  }

  const level = props.character.level;
  const isLevelVisible = level !== null && level > 200;
  const isHighLevel = level !== null && level >= 250;

  return (
    <div
      className={`${styles['union-character-row']} ${isHighLevel ? styles['is-high-level'] : ''}`}
    >
      <button
        type="button"
        {...props.dragHandleProps}
        className={styles['drag-handle']}
        aria-label={`${props.character.className} 순서 변경`}
      >
        <MdDragHandle />
      </button>

      <strong className={styles['class-name']}>{props.character.className}</strong>
      <span className={styles['effect']}>{props.character.unionEffect}</span>
      <span className={styles['effect']}>{props.character.linkEffect}</span>

      <input
        className={styles['level-input']}
        type="number"
        min={0}
        max={300}
        value={levelInput}
        aria-label={`${props.character.className} 레벨`}
        onChange={(event) => setLevelInput(event.target.value)}
        onBlur={handleLevelBlur}
      />

      <span className={styles['level-status']}>{isLevelVisible ? '완료' : ''}</span>
    </div>
  );
}
