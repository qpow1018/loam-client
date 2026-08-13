import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import SummaryItem from './SummaryItem';

import styles from './characterSummaryList.module.scss';

export default function CharacterSummaryList(props: {
  characters: TResLostarkMainCharacter[];
  onSelectCharacter: (characterId: string) => void;
}) {
  return (
    <div className={styles['character-summary-list']}>
      <div className={styles['intro']}>
        <p className={styles['eyebrow']}>등록한 메인 캐릭터</p>
        <h1>전체 캐릭터 요약</h1>
        <p>장비와 세팅 상태를 빠르게 비교하고, 캐릭터를 선택해 상세 정보를 확인하세요.</p>
      </div>

      <div className={styles['list']}>
        {props.characters.map((character) => (
          <SummaryItem
            key={character.id}
            character={character}
            onSelect={() => props.onSelectCharacter(character.id)}
          />
        ))}
      </div>
    </div>
  );
}
