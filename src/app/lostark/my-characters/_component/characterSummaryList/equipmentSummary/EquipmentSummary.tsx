import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import GearSummarySection from './GearSummarySection';
import AccessorySummarySection from './AccessorySummarySection';
import EquipmentSupplementSummary from './EquipmentSupplementSummary';

import styles from './equipmentSummary.module.scss';

export default function EquipmentSummary(props: {
  equipment: TResLostarkCharacterSummary['equipment'];
  braceletScore: number | null;
}) {
  return (
    <div className={styles['equipment-summary']}>
      <GearSummarySection gears={props.equipment.gears} />

      <div className={styles['accessory-column']}>
        <AccessorySummarySection accessories={props.equipment.accessories} />
        <EquipmentSupplementSummary
          abilityStone={props.equipment.abilityStone}
          braceletScore={props.braceletScore}
        />
      </div>
    </div>
  );
}
