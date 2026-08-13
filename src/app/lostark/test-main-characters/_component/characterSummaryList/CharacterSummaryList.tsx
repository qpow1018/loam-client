import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import ArkSummary from './arkSummary/ArkSummary';
import EquipmentSummary from './equipmentSummary/EquipmentSummary';
import ProfileSummary from './profileSummary/ProfileSummary';
import SettingSummary from './settingSummary/SettingSummary';

import styles from './characterSummaryList.module.scss';

export default function CharacterSummaryList(props: {
  characters: TResLostarkMainCharacter[];
  onSelectCharacter: (characterId: string) => void;
}) {
  return (
    <div className={styles['character-summary-list']}>
      {props.characters.map((character) => (
        <div
          key={character.id}
          className={styles['summary-item']}
        >
          <ProfileSummary
            character={character}
            onSelect={() => props.onSelectCharacter(character.id)}
          />
          <EquipmentSummary equipment={character.summary.equipment} />

          <div className={styles['detail-layout']}>
            <SettingSummary summary={character.summary} />
            <ArkSummary summary={character.summary} />
          </div>
        </div>
      ))}
    </div>
  );
}
