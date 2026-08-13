import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import ArkSummary from './arkSummary/ArkSummary';
import EquipmentSummary from './equipmentSummary/EquipmentSummary';
import ProfileSummary from './profileSummary/ProfileSummary';
import SettingSummary from './settingSummary/SettingSummary';

import styles from './summaryItem.module.scss';

export default function SummaryItem(props: {
  character: TResLostarkMainCharacter;
  onSelect: () => void;
}) {
  return (
    <button type="button" className={styles['summary-item']} onClick={props.onSelect}>
      <ProfileSummary character={props.character} />
      <EquipmentSummary equipment={props.character.summary.equipment} />

      <div className={styles['detail-layout']}>
        <SettingSummary summary={props.character.summary} />
        <ArkSummary summary={props.character.summary} />
      </div>
    </button>
  );
}
