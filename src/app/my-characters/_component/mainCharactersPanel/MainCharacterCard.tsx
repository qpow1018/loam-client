import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import styles from './mainCharacterCard.module.scss';

export default function MainCharacterCard(props: { character: TResLostarkMainCharacter }) {
  const { character } = props;

  return (
    <div className={styles['main-character-item']}>
      <p className={styles['character-name']}>{character.characterName}</p>
      <p className={styles['character-meta']}>
        {character.characterClass} · {character.itemLevel}
      </p>
    </div>
  );
}
