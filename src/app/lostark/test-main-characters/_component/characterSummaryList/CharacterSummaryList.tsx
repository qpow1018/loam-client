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
        <div key={character.id} className={styles['summary-item']}>
          <ProfileSummary
            character={character}
            onSelect={() => props.onSelectCharacter(character.id)}
          />
          <EquipmentSummary
            equipment={character.summary.equipment}
            braceletScore={character.manualMetrics.braceletScore}
          />
          <SettingSummary summary={character.summary} />

          <div className={styles['detail-layout']}>
            <div className={styles['setting-row']}></div>
            <div className={styles['ark-row']}>
              <ArkSummary summary={character.summary} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
