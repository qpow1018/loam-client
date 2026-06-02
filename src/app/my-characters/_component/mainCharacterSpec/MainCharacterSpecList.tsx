import type { TCharacterSpec } from '@/api/lostark/type';
import type { TLostarkMyCharacter } from '@/api/lostark/type';

import MainCharacterSpecCard from './MainCharacterSpecCard';

import styles from './mainCharacterSpec.module.scss';

export default function MainCharacterSpecList(props: {
  characters: TLostarkMyCharacter[];
  specsByName: Record<string, TCharacterSpec | undefined>;
  dirtyCharacterNames: Set<string>;
  loadingCharacterNames: Set<string>;
  savingCharacterNames: Set<string>;
  onRefresh: (character: TLostarkMyCharacter) => void;
  onSave: (character: TLostarkMyCharacter) => void;
}) {
  if (props.characters.length === 0) {
    return (
      <div className={styles['empty']}>
        <p className={styles['empty-message']}>전체캐릭터에서 메인 캐릭터를 등록하세요.</p>
      </div>
    );
  }

  return (
    <div className={styles['main-character-spec-list']}>
      {props.characters.map((character) => (
        <MainCharacterSpecCard
          key={character.id}
          character={character}
          spec={props.specsByName[character.nickname]}
          isDirty={props.dirtyCharacterNames.has(character.nickname)}
          isLoading={props.loadingCharacterNames.has(character.nickname)}
          isSaving={props.savingCharacterNames.has(character.nickname)}
          onRefresh={() => props.onRefresh(character)}
          onSave={() => props.onSave(character)}
        />
      ))}
    </div>
  );
}
