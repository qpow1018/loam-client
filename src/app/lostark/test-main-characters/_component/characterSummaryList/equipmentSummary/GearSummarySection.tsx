import type { ReactNode } from 'react';
import type { TLostarkGear, TResLostarkCharacterSummary } from '@/api/lostark/type';

import SummarySection from '../SummarySection';

import styles from './gearSummarySection.module.scss';

const GEAR_SLOTS = ['투구', '어깨', '상의', '하의', '장갑', '무기', '완갑'] as const;

export default function GearSummarySection(props: {
  gears: TResLostarkCharacterSummary['equipment']['gears'];
}) {
  return (
    <SummarySection title="장비">
      <div className={styles['gear-comparison']}>
        <GearComparisonRow label="부위">
          {GEAR_SLOTS.map((slot) => (
            <span key={slot}>{slot}</span>
          ))}
        </GearComparisonRow>

        <GearComparisonRow label="강화">
          {GEAR_SLOTS.map((slot) => (
            <GearEnhancement
              key={slot}
              gear={props.gears.find((item) => item.type?.includes(slot))}
            />
          ))}
        </GearComparisonRow>

        <GearComparisonRow label="품질">
          {GEAR_SLOTS.map((slot) => (
            <GearQuality
              key={slot}
              slot={slot}
              gear={props.gears.find((item) => item.type?.includes(slot))}
            />
          ))}
        </GearComparisonRow>
      </div>
    </SummarySection>
  );
}

function GearComparisonRow(props: { label: string; children: ReactNode }) {
  return (
    <div className={styles['gear-comparison-row']}>
      <span className={styles['gear-row-label']}>{props.label}</span>
      {props.children}
    </div>
  );
}

function GearEnhancement(props: { gear: TLostarkGear | undefined }) {
  return (
    <b className={styles['gear-enhancement']}>
      {props.gear ? `+${props.gear.enhancement ?? '-'}` : '-'}
    </b>
  );
}

function GearQuality(props: { slot: string; gear: TLostarkGear | undefined }) {
  return (
    <span className={styles['gear-quality']}>
      {props.slot === '완갑' || !props.gear ? '-' : (props.gear.quality ?? '-')}
    </span>
  );
}
