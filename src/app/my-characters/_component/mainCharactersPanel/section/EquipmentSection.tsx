import type { TLostarkAccessory, TLostarkGear } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';

import styles from './equipmentSection.module.scss';

const GEAR_ORDER = [['투구', '모자'], ['어깨', '견갑'], ['상의'], ['하의'], ['장갑'], ['무기']];
const ACCESSORY_ORDER = ['목걸이', '귀걸이', '귀걸이', '반지', '반지'];

export default function EquipmentSection(props: {
  gears: TLostarkGear[];
  accessories: TLostarkAccessory[];
}) {
  function getTypeOrderIndex(type: string | null, typeOrder: string[][]) {
    const index = typeOrder.findIndex((typeLabels) =>
      typeLabels.some((typeLabel) => type?.includes(typeLabel)),
    );

    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  function sortGears(gears: TLostarkGear[]) {
    return [...gears].sort(
      (a, b) => getTypeOrderIndex(a.type, GEAR_ORDER) - getTypeOrderIndex(b.type, GEAR_ORDER),
    );
  }

  function sortAccessories(accessories: TLostarkAccessory[]) {
    const accessoryOrder = ACCESSORY_ORDER.map((typeLabel) => [typeLabel]);

    return [...accessories].sort(
      (a, b) =>
        getTypeOrderIndex(a.type, accessoryOrder) - getTypeOrderIndex(b.type, accessoryOrder),
    );
  }

  const gears = sortGears(props.gears);
  const accessories = sortAccessories(props.accessories);
  console.log('accessories', accessories);

  return (
    <section className={styles['equipment-section']}>
      <div className={styles['left-box']}>
        {gears.map((gear, index) => (
          <GearItem key={index} gear={gear} />
        ))}
      </div>
      <div className={styles['right-box']}>
        {accessories.map((accessory, index) => (
          <AccessoryItem key={index} accessory={accessory} />
        ))}
      </div>
    </section>
  );
}

function GearItem(props: { gear: TLostarkGear }) {
  const { gear } = props;

  return (
    <div className={styles['gear-item']}>
      <ItemSlot imageUrl={gear.icon} grade={gear.grade} />

      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <div className={styles['name']}>
            {gear.type} +{gear.enhancement}
          </div>

          <span className={styles['level-chip']}>{gear.itemLevel}</span>
        </div>

        <QualityChip quality={gear.quality} />
      </div>
    </div>
  );
}

function AccessoryItem(props: { accessory: TLostarkAccessory }) {
  const { accessory } = props;

  function getPrimaryStatBasicEffectValue(effect: string) {
    const matched = effect.match(/(힘|민첩|지능)\s*\+?\s*([\d,]+)/);

    if (!matched) {
      return null;
    }

    return `+${matched[2]}`;
  }

  const basicEffect =
    accessory.basicEffects
      .map((effect) => getPrimaryStatBasicEffectValue(effect))
      .find((effect) => effect !== null) ?? null;

  return (
    <div className={styles['accessory-item']}>
      <ItemSlot imageUrl={accessory.icon} grade={accessory.grade} />

      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <div className={styles['name']}>{accessory.type}</div>
        </div>
        <QualityChip quality={accessory.quality} />
      </div>

      <div className={styles['item-effect']}>
        {basicEffect && <p className={styles['basic-effect']}>{`스텟 ${basicEffect}`}</p>}

        {accessory.polishEffects.map((effect, index) => (
          <p key={index} className={styles['effect']}>
            <span
              className={styles['effect-grade']}
              style={{
                backgroundColor: `#${effect.color}`,
              }}
            />
            <span className={styles['effect-text']}>{effect.text}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
