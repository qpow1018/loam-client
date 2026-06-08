import type { TLostarkGear, TResLostarkMainCharacter } from '@/api/lostark/type';

import styles from './gearSection.module.scss';

const GEAR_SLOTS = [
  { key: 'weapon', label: '무기', typeLabels: ['무기'] },
  { key: 'gloves', label: '장갑', typeLabels: ['장갑'] },
  { key: 'bottom', label: '하의', typeLabels: ['하의'] },
  { key: 'top', label: '상의', typeLabels: ['상의'] },
  { key: 'shoulder', label: '어깨', typeLabels: ['어깨', '견갑'] },
  { key: 'helmet', label: '투구', typeLabels: ['투구', '모자'] },
] as const;

type TGearSlot = (typeof GEAR_SLOTS)[number];
type TQualityTier = 'perfect' | 'high' | 'normal' | 'empty';

export default function GearSection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <section className={styles['gear-section']}>
      <div className={styles['section-header']}>
        <h2 className={styles['section-title']}>무기, 방어구 품질</h2>

        <div className={styles['quality-legend']} aria-label="품질 등급 범례">
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-perfect']} />
            100
          </span>
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-high']} />
            95+
          </span>
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-normal']} />그 아래
          </span>
        </div>
      </div>

      <div className={styles['quality-matrix']}>
        <div className={styles['matrix-head-cell']}>캐릭터</div>
        {GEAR_SLOTS.map((slot) => (
          <div key={slot.key} className={styles['matrix-head-cell']}>
            {slot.label}
          </div>
        ))}

        {props.characters.map((character) => (
          <CharacterQualityRow key={character.id} character={character} />
        ))}
      </div>
    </section>
  );
}

function CharacterQualityRow(props: { character: TResLostarkMainCharacter }) {
  const { character } = props;

  return (
    <>
      <div className={styles['character-cell']}>
        <strong className={styles['character-name']}>{character.characterName}</strong>
      </div>

      {GEAR_SLOTS.map((slot) => {
        const gear = findGearBySlot(character.summary.equipment.gears, slot);

        return (
          <div key={slot.key} className={styles['quality-cell']}>
            <QualityValue quality={gear?.quality} />
          </div>
        );
      })}
    </>
  );
}

function QualityValue(props: { quality: number | null | undefined }) {
  const tier = getQualityTier(props.quality);

  return <span className={styles[`quality-value-${tier}`]}>{props.quality ?? '-'}</span>;
}

function findGearBySlot(gears: TLostarkGear[], slot: TGearSlot) {
  return gears.find((gear) => slot.typeLabels.some((typeLabel) => gear.type?.includes(typeLabel)));
}

function getQualityTier(quality: number | null | undefined): TQualityTier {
  if (quality === null || quality === undefined) {
    return 'empty';
  }

  if (quality >= 100) {
    return 'perfect';
  }

  if (quality >= 95) {
    return 'high';
  }

  return 'normal';
}
