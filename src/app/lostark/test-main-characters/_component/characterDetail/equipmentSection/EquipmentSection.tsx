import type { TLostarkAccessory, TLostarkGear, TResLostarkMainCharacter } from '@/api/lostark/type';

import DetailPanel from '@/app/lostark/test-main-characters/_component/characterDetail/DetailPanel';
import AbilityStoneItem from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/AbilityStoneItem';
import AccessoryItem from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/AccessoryItem';
import BraceletItem from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/BraceletItem';
import GearItem from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/GearItem';
import OrbItem from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/OrbItem';

import styles from './equipmentSection.module.scss';

const GEAR_ORDER = ['투구', '어깨', '상의', '하의', '장갑', '무기', '완갑'];
const ACCESSORY_ORDER = ['목걸이', '귀걸이', '귀걸이', '반지', '반지'];

export default function EquipmentSection(props: {
  equipment: TResLostarkMainCharacter['summary']['equipment'];
}) {
  const { equipment } = props;

  const gearSlots = getGearSlots(equipment.gears);
  const accessories = sortAccessories(equipment.accessories);

  return (
    <DetailPanel title="장비" className={styles['equipment-section']}>
      <div className={styles['left-box']}>
        {gearSlots.map((gearSlot) => (
          <GearItem key={gearSlot.type} type={gearSlot.type} gear={gearSlot.gear} />
        ))}
        <AbilityStoneItem abilityStone={equipment.abilityStone} />
      </div>

      <div className={styles['right-box']}>
        {accessories.map((accessory, index) => (
          <AccessoryItem key={`${accessory.type}-${index}`} accessory={accessory} />
        ))}
        <BraceletItem bracelet={equipment.bracelet} />
        <OrbItem orb={equipment.orb} />
      </div>
    </DetailPanel>
  );
}

function getTypeOrderIndex(type: string | null, typeOrder: string[]) {
  const index = typeOrder.findIndex((typeLabel) => type?.includes(typeLabel));

  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function getGearSlots(gears: TLostarkGear[]) {
  return GEAR_ORDER.map((type) => ({
    type,
    gear: gears.find((gear) => gear.type?.includes(type)) ?? null,
  }));
}

function sortAccessories(accessories: TLostarkAccessory[]) {
  return [...accessories].sort(
    (left, right) =>
      getTypeOrderIndex(left.type, ACCESSORY_ORDER) -
      getTypeOrderIndex(right.type, ACCESSORY_ORDER),
  );
}
