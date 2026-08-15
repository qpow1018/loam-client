import type { ReactNode } from 'react';

import type { TLostarkGear, TResLostarkCharacterSummary } from '@/api/lostark/type';

import SummarySection from '@/app/lostark/my-characters/_component/characterSummaryList/SummarySection';

import styles from './gearSummarySection.module.scss';

type TQualityTier = 'low' | 'middle' | 'perfect' | 'none';

const GEAR_SLOTS = ['완갑', '무기', '장갑', '하의', '상의', '어깨', '투구'] as const;

export default function GearSummarySection(props: {
  gears: TResLostarkCharacterSummary['equipment']['gears'];
}) {
  const gearSlots = GEAR_SLOTS.map((slot) => ({
    slot,
    gear: props.gears.find((item) => item.type?.includes(slot)),
  }));

  function getQualityTier(slot: string, gear: TLostarkGear | undefined): TQualityTier {
    if (slot === '완갑' || !gear || gear.quality === null) return 'none';
    if (gear.quality === 100) return 'perfect';
    if (gear.quality >= 90) return 'middle';

    return 'low';
  }

  return (
    <SummarySection title="장비">
      <div className={styles['gear-table']}>
        <GearTableRow label="부위">
          {gearSlots.map(({ slot }) => (
            <span key={slot} className={`${styles['gear-table-cell']} ${styles['gear-slot-name']}`}>
              {slot}
            </span>
          ))}
        </GearTableRow>

        <GearTableRow label="강화">
          {gearSlots.map(({ slot, gear }) => (
            <span key={slot} className={`${styles['gear-table-cell']} ${styles['gear-enhancement']}`}>
              {gear ? `+${gear.enhancement ?? '-'}` : '-'}
            </span>
          ))}
        </GearTableRow>

        <GearTableRow label="품질">
          {gearSlots.map(({ slot, gear }) => (
            <GearQualityCell
              key={slot}
              quality={slot === '완갑' ? null : (gear?.quality ?? null)}
              tier={getQualityTier(slot, gear)}
            />
          ))}
        </GearTableRow>
      </div>
    </SummarySection>
  );
}

function GearTableRow(props: { label: string; children: ReactNode }) {
  return (
    <div className={styles['gear-table-row']}>
      <span className={`${styles['gear-table-cell']} ${styles['gear-row-label']}`}>
        {props.label}
      </span>
      {props.children}
    </div>
  );
}

function GearQualityCell(props: { quality: number | null; tier: TQualityTier }) {
  return (
    <span
      className={`${styles['gear-table-cell']} ${styles['gear-quality']} ${styles[`quality-${props.tier}`]}`}
    >
      {props.quality ?? '-'}
    </span>
  );
}
