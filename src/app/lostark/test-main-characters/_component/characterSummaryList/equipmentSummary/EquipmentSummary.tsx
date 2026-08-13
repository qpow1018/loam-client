import type {
  TLostarkAccessory,
  TLostarkGear,
  TResLostarkCharacterSummary,
} from '@/api/lostark/type';

import QualityChip from '@/components/lostark/qualityChip/QualityChip';

import SummarySection from '../SummarySection';

import styles from './equipmentSummary.module.scss';

const GEAR_SLOTS = ['투구', '어깨', '상의', '하의', '장갑', '무기', '완갑'] as const;
const ACCESSORY_SLOTS = [
  { label: '목', type: '목걸이', index: 0 },
  { label: '귀1', type: '귀걸이', index: 0 },
  { label: '귀2', type: '귀걸이', index: 1 },
  { label: '반1', type: '반지', index: 0 },
  { label: '반2', type: '반지', index: 1 },
] as const;

export default function EquipmentSummary(props: {
  equipment: TResLostarkCharacterSummary['equipment'];
}) {
  return (
    <div className={styles['equipment-summary']}>
      <SummarySection title="장비">
        <div className={styles['gear-list']}>
          {GEAR_SLOTS.map((slot) => (
            <GearSummary
              key={slot}
              slot={slot}
              gear={props.equipment.gears.find((item) => item.type?.includes(slot))}
            />
          ))}
        </div>
      </SummarySection>

      <SummarySection title="악세서리 연마">
        <div className={styles['accessory-list']}>
          {ACCESSORY_SLOTS.map((slot) => (
            <AccessorySummary
              key={slot.label}
              label={slot.label}
              accessory={
                props.equipment.accessories.filter((item) => item.type?.includes(slot.type))[
                  slot.index
                ]
              }
            />
          ))}
        </div>
      </SummarySection>
    </div>
  );
}

function GearSummary(props: { slot: string; gear: TLostarkGear | undefined }) {
  if (!props.gear) {
    return (
      <div className={`${styles['gear-item']} ${styles['gear-empty']}`}>
        <span>{props.slot}</span>
        <small>미장착</small>
      </div>
    );
  }

  return (
    <div className={styles['gear-item']}>
      <span>{props.slot}</span>
      <b>{`+${props.gear.enhancement ?? '-'}`}</b>
      {props.slot !== '완갑' && (
        <div className={styles['quality']}>
          <QualityChip quality={props.gear.quality} />
        </div>
      )}
    </div>
  );
}

function AccessorySummary(props: { label: string; accessory: TLostarkAccessory | undefined }) {
  const grades =
    props.accessory?.polishEffects
      .filter((effect) => isValidPolishEffect(effect.text))
      .map((effect) => getPolishGrade(effect.color))
      .filter((grade): grade is '상' | '중' | '하' => grade !== null) ?? [];

  return (
    <div className={styles['accessory-item']}>
      <span>{props.label}</span>
      <b>{grades.length === 0 ? '-' : grades.join('')}</b>
    </div>
  );
}

function isValidPolishEffect(text: string) {
  return (
    text.includes('적에게 주는 피해') ||
    text.includes('추가 피해') ||
    /^(공격력|무기 공격력)\s*\+.*%/.test(text) ||
    text.includes('치명타 적중률') ||
    text.includes('치명타 피해')
  );
}

function getPolishGrade(color: string | null) {
  if (color?.toUpperCase() === 'FE9600') return '상';
  if (color?.toUpperCase() === 'CE43FC') return '중';
  if (color?.toUpperCase() === '00B5FF') return '하';

  return null;
}
