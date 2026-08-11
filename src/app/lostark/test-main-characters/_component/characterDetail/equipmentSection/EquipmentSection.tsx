import type {
  TLostarkAbilityStone,
  TLostarkAccessory,
  TLostarkBracelet,
  TLostarkColoredEffect,
  TLostarkGear,
  TLostarkOrb,
  TResLostarkMainCharacter,
} from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import {
  ItemTooltip,
  ItemTooltipTrigger,
} from '@/components/lostark/itemTooltip/ItemTooltip';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';

import DetailPanel from '@/app/lostark/test-main-characters/_component/characterDetail/DetailPanel';
import ItemDetailTooltip from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/ItemDetailTooltip';

import styles from './equipmentSection.module.scss';

const GEAR_ORDER = ['투구', '어깨', '상의', '하의', '장갑', '무기', '완갑'];
const ACCESSORY_ORDER = ['목걸이', '귀걸이', '귀걸이', '반지', '반지'];

export default function EquipmentSection(props: {
  equipment: TResLostarkMainCharacter['summary']['equipment'];
}) {
  const { equipment } = props;

  const gears = sortGears(equipment.gears);
  const accessories = sortAccessories(equipment.accessories);

  return (
    <DetailPanel title="장비" className={styles['equipment-content']}>
      <section className={styles['equipment-section']}>
        <div className={styles['left-box']}>
          {gears.map((gear, index) => (
            <GearItem key={`${gear.type}-${index}`} gear={gear} />
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
      </section>
    </DetailPanel>
  );
}

function GearItem(props: { gear: TLostarkGear }) {
  const { gear } = props;

  return (
    <ItemTooltipTrigger className={styles['gear-item']}>
      <ItemSlot imageUrl={gear.icon} grade={gear.grade} />

      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <strong>{`${gear.type ?? '-'}${gear.enhancement !== null ? ` +${gear.enhancement}` : ''}`}</strong>
          {gear.itemLevel && <span className={styles['level-chip']}>{gear.itemLevel}</span>}
        </div>
        <QualityChip quality={gear.quality} />
      </div>

      <ItemTooltip>
        <ItemDetailTooltip
          name={gear.name}
          grade={gear.grade}
          details={[
            { label: '강화', value: gear.enhancement !== null ? `+${gear.enhancement}` : null },
            { label: '아이템 레벨', value: gear.itemLevel },
            { label: '품질', value: gear.quality },
          ]}
          effects={[
            ...gear.basicEffects.map((text) => ({ text })),
            ...gear.additionalEffects.map((text) => ({ text })),
            ...gear.arkPassiveEffects.map((text) => ({ text })),
          ]}
        />
      </ItemTooltip>
    </ItemTooltipTrigger>
  );
}

function AccessoryItem(props: { accessory: TLostarkAccessory }) {
  const { accessory } = props;
  const basicEffect = getPrimaryStatBasicEffect(accessory.basicEffects);

  return (
    <ItemTooltipTrigger className={styles['accessory-item']}>
      <ItemSlot imageUrl={accessory.icon} grade={accessory.grade} />

      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <strong>{accessory.type ?? '-'}</strong>
        </div>
        <QualityChip quality={accessory.quality} />
      </div>

      <div className={styles['item-effect']}>
        {basicEffect && <p className={styles['basic-effect']}>{`스텟 ${basicEffect}`}</p>}
        {accessory.polishEffects.map((effect, index) => (
          <EffectItem key={`${effect.text}-${index}`} effect={effect} />
        ))}
      </div>

      <ItemTooltip>
        <ItemDetailTooltip
          name={accessory.name}
          grade={accessory.grade}
          details={[{ label: '품질', value: accessory.quality }]}
          effects={[
            ...accessory.basicEffects.map((text) => ({ text })),
            ...accessory.additionalEffects.map((text) => ({ text })),
            ...accessory.polishEffects,
            ...accessory.arkPassiveEffects.map((text) => ({ text })),
          ]}
        />
      </ItemTooltip>
    </ItemTooltipTrigger>
  );
}

function AbilityStoneItem(props: { abilityStone: TLostarkAbilityStone | null }) {
  const { abilityStone } = props;

  if (!abilityStone) return null;

  const positiveLevelSum = abilityStone.abilityStoneEngravings
    .slice(0, 2)
    .reduce((sum, engraving) => sum + (engraving.level ?? 0), 0);

  return (
    <ItemTooltipTrigger className={styles['ability-stone-item']}>
      <ItemSlot imageUrl={abilityStone.icon} grade={abilityStone.grade} />

      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <strong>어빌리티 스톤</strong>
          {positiveLevelSum >= 5 && <span className={styles['stone-chip']}>97돌</span>}
        </div>
        <div className={styles['stone-engraving-list']}>
          {abilityStone.abilityStoneEngravings.map((engraving, index) => (
            <div
              key={`${engraving.name}-${index}`}
              className={`${styles['stone-engraving']} ${index >= 2 ? styles['negative'] : ''}`}
            >
              <b>{`+${engraving.level ?? 0}`}</b>
              <span>{engraving.name}</span>
            </div>
          ))}
        </div>
      </div>

      <ItemTooltip>
        <ItemDetailTooltip
          name={abilityStone.name}
          grade={abilityStone.grade}
          details={[]}
          effects={[
            ...abilityStone.basicEffects.map((text) => ({ text })),
            ...abilityStone.additionalEffects.map((text) => ({ text })),
            ...abilityStone.abilityStoneBonusEffects.map((text) => ({ text })),
          ]}
        />
      </ItemTooltip>
    </ItemTooltipTrigger>
  );
}

function BraceletItem(props: { bracelet: TLostarkBracelet | null }) {
  const { bracelet } = props;

  if (!bracelet) return null;

  return (
    <ItemTooltipTrigger className={styles['bracelet-item']}>
      <ItemSlot imageUrl={bracelet.icon} grade={bracelet.grade} />
      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <strong>팔찌</strong>
        </div>
      </div>
      <div className={styles['item-effect']}>
        {getBraceletEffects(bracelet.braceletEffects).map((effect, index) => (
          <EffectItem key={`${effect.text}-${index}`} effect={effect} />
        ))}
      </div>

      <ItemTooltip>
        <ItemDetailTooltip
          name={bracelet.name}
          grade={bracelet.grade}
          details={[]}
          effects={bracelet.braceletEffects}
        />
      </ItemTooltip>
    </ItemTooltipTrigger>
  );
}

function OrbItem(props: { orb: TLostarkOrb | null }) {
  const { orb } = props;

  if (!orb) return null;

  return (
    <ItemTooltipTrigger className={styles['orb-item']}>
      <ItemSlot imageUrl={orb.icon} grade={orb.grade} />
      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <strong>보주</strong>
        </div>
      </div>
      <div className={styles['item-effect']}>
        <p>{orb.paradisePowerText ?? '낙원력 -'}</p>
      </div>

      <ItemTooltip>
        <ItemDetailTooltip
          name={orb.name}
          grade={orb.grade}
          details={[]}
          effects={orb.specialEffects.map((text) => ({ text }))}
        />
      </ItemTooltip>
    </ItemTooltipTrigger>
  );
}

function EffectItem(props: { effect: TLostarkColoredEffect }) {
  return (
    <p className={styles['effect']}>
      {props.effect.color && (
        <span
          className={styles['effect-marker']}
          style={{ backgroundColor: `#${props.effect.color}` }}
        />
      )}
      <span>{props.effect.text}</span>
    </p>
  );
}

function getPrimaryStatBasicEffect(effects: string[]) {
  const basicEffect = effects
    .map((effect) => effect.match(/(힘|민첩|지능)\s*\+?\s*([\d,]+)/)?.[2] ?? null)
    .find((effect) => effect !== null);

  return basicEffect ? `+${basicEffect}` : null;
}

function getBraceletEffects(effects: TLostarkColoredEffect[]) {
  return effects.reduce<TLostarkColoredEffect[]>((combinedEffects, effect) => {
    const previousEffect = combinedEffects[combinedEffects.length - 1];
    const isCombinedOption = effect.color?.replace('#', '').toUpperCase() === '99FF99';

    if (isCombinedOption && previousEffect) {
      previousEffect.text = `${previousEffect.text}\n${effect.text}`;
      return combinedEffects;
    }

    combinedEffects.push({ ...effect });
    return combinedEffects;
  }, []);
}

function getTypeOrderIndex(type: string | null, typeOrder: string[]) {
  const index = typeOrder.findIndex((typeLabel) => type?.includes(typeLabel));

  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function sortGears(gears: TLostarkGear[]) {
  return [...gears].sort(
    (left, right) =>
      getTypeOrderIndex(left.type, GEAR_ORDER) - getTypeOrderIndex(right.type, GEAR_ORDER),
  );
}

function sortAccessories(accessories: TLostarkAccessory[]) {
  return [...accessories].sort(
    (left, right) =>
      getTypeOrderIndex(left.type, ACCESSORY_ORDER) -
      getTypeOrderIndex(right.type, ACCESSORY_ORDER),
  );
}
