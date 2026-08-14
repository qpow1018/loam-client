import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import GearSummarySection from './GearSummarySection';
import AccessorySummarySection from './AccessorySummarySection';

import styles from './equipmentSummary.module.scss';

export default function EquipmentSummary(props: {
  equipment: TResLostarkCharacterSummary['equipment'];
}) {
  return (
    <div className={styles['equipment-summary']}>
      <GearSummarySection gears={props.equipment.gears} />
      <AccessorySummarySection accessories={props.equipment.accessories} />
    </div>
  );
}
