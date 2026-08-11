import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';

import DetailPanel from '../DetailPanel';
import ItemDetailTooltip from './ItemDetailTooltip';

import styles from './equipmentSection.module.scss';

export default function EquipmentSection(props: {
  equipment: TResLostarkMainCharacter['summary']['equipment'];
}) {
  const { equipment } = props;

  return (
    <div className={styles['equipment-section']}>
      <DetailPanel title="장비">
        <div className={styles['equipment-columns']}>
          <div className={styles['equipment-group']}>
            <h3>무기 · 방어구</h3>
            <div className={styles['equipment-list']}>
              {equipment.gears.map((gear, index) => (
                <div key={`${gear.type}-${index}`} className={styles['item-row']} tabIndex={0}>
                  <ItemSlot imageUrl={gear.icon} grade={gear.grade} size={42} />
                  <div className={styles['item-copy']}>
                    <strong>{gear.type ?? '-'}</strong>
                    <span>{`${gear.enhancement ? `+${gear.enhancement} · ` : ''}${gear.itemLevel ?? gear.name ?? '-'}`}</span>
                  </div>
                  <QualityChip quality={gear.quality} />
                  <ItemDetailTooltip
                    name={gear.name}
                    grade={gear.grade}
                    details={[
                      { label: '강화', value: gear.enhancement ? `+${gear.enhancement}` : null },
                      { label: '아이템 레벨', value: gear.itemLevel },
                      { label: '품질', value: gear.quality },
                    ]}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={styles['equipment-group']}>
            <h3>장신구</h3>
            <div className={styles['equipment-list']}>
              {equipment.accessories.map((accessory, index) => (
                <div key={`${accessory.type}-${index}`} className={styles['item-row']} tabIndex={0}>
                  <ItemSlot imageUrl={accessory.icon} grade={accessory.grade} size={42} />
                  <div className={styles['item-copy']}>
                    <div className={styles['item-heading']}>
                      <strong>{accessory.type ?? '-'}</strong>
                      {accessory.tier && <span>{formatTier(accessory.tier)}</span>}
                    </div>
                    <span>{accessory.arkPassiveEffects[0] ?? accessory.name ?? '-'}</span>
                    <div className={styles['item-effects']}>
                      {accessory.polishEffects.map((effect, effectIndex) => (
                        <span
                          key={`${effect.text}-${effectIndex}`}
                          title={effect.text}
                          style={{ color: effect.color ?? undefined }}
                        >
                          {formatEquipmentEffect(effect.text)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <QualityChip quality={accessory.quality} />
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
                </div>
              ))}
            </div>
            <div className={styles['extra-list']}>
              <ExtraItem
                title="어빌리티 스톤"
                item={equipment.abilityStone}
                effects={[
                  ...(equipment.abilityStone?.basicEffects ?? []),
                  ...(equipment.abilityStone?.additionalEffects ?? []),
                  ...(equipment.abilityStone?.abilityStoneBonusEffects ?? []),
                ]}
                labels={equipment.abilityStone?.abilityStoneEngravings.map((engraving) => ({
                  label: engraving.name,
                  value: engraving.level,
                }))}
              />
              <ExtraItem
                title="팔찌"
                item={equipment.bracelet}
                effects={equipment.bracelet?.braceletEffects.map((effect) => effect.text) ?? []}
                labels={equipment.bracelet?.braceletEffects.map((effect) => ({
                  label: effect.text,
                  value: null,
                }))}
              />
            </div>
          </div>
        </div>
      </DetailPanel>
    </div>
  );
}

function ExtraItem(props: {
  title: string;
  item: {
    icon: string | null;
    grade: string | null;
    name: string | null;
    tier: string | null;
  } | null;
  effects: string[];
  labels?: { label: string; value: number | null }[];
}) {
  if (!props.item) return null;

  return (
    <div className={styles['extra-item']} tabIndex={0}>
      <ItemSlot imageUrl={props.item.icon} grade={props.item.grade} size={38} />
      <div className={styles['item-copy']}>
        <div className={styles['item-heading']}>
          <strong>{props.title}</strong>
          {props.item.tier && <span>{formatTier(props.item.tier)}</span>}
        </div>
        <span>{props.item.name ?? '-'}</span>
        {props.labels && props.labels.length > 0 && (
          <div className={styles['item-effects']}>
            {props.labels.map((label, index) => (
              <span key={`${label.label}-${index}`} title={label.label}>
                {label.value !== null && <b>{label.value}</b>}
                {formatEquipmentEffect(label.label)}
              </span>
            ))}
          </div>
        )}
      </div>
      <ItemDetailTooltip
        name={props.item.name}
        grade={props.item.grade}
        details={[]}
        effects={props.effects.map((text) => ({ text }))}
      />
    </div>
  );
}

function formatTier(tier: string) {
  const tierNumber = tier.match(/\d+/)?.[0];

  return tierNumber ? `T${tierNumber}` : tier;
}

function formatEquipmentEffect(effect: string) {
  const effectLabels = [
    ['세레나데, 신앙, 조화 게이지 획득량', '서폿 아덴'],
    ['아군 공격력 강화 효과', '아군공%'],
    ['백어택 스킬이 적에게 주는 피해', '백어택 주피증'],
    ['공격이 치명타로 적중 시 적에게 주는 피해', '치명 주피증'],
    ['무기 공격력', '무공'],
    ['치명타 피해', '치피'],
    ['치명타 적중률', '치적'],
    ['적에게 주는 피해', '적피'],
    ['추가 피해', '추피'],
    ['공격력', '공'],
  ] as const;
  const matchedEffect = effectLabels.find(([text]) => effect.includes(text));

  if (!matchedEffect) return effect;

  const value = effect.match(/[+-]?\d+(?:\.\d+)?%?/)?.[0];

  return value ? `${matchedEffect[1]} ${value}` : matchedEffect[1];
}
