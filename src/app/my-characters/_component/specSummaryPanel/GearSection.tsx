import type { TLostarkGear, TResLostarkMainCharacter } from '@/api/lostark/type';

import SummaryCell from './_shared/SummaryCell';
import SummaryCharacterCell from './_shared/SummaryCharacterCell';
import SummarySection from './_shared/SummarySection';
import SummaryTable from './_shared/SummaryTable';

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
    <SummarySection
      title="무기, 방어구 품질"
      className={styles['gear-section']}
      legendItems={[
        { label: '100', color: '#f59e0b' },
        { label: '95+', color: '#94a3b8' },
        { label: '그 아래', color: '#62636c' },
      ]}
    >
      <SummaryTable
        className={styles['quality-matrix']}
        headCellClassName={styles['matrix-head-cell']}
        columns={[
          { key: 'character', label: '캐릭터' },
          ...GEAR_SLOTS.map((slot) => ({ key: slot.key, label: slot.label })),
        ]}
      >
        {props.characters.map((character) => (
          <CharacterQualityRow key={character.id} character={character} />
        ))}
      </SummaryTable>
    </SummarySection>
  );
}

function CharacterQualityRow(props: { character: TResLostarkMainCharacter }) {
  const { character } = props;

  return (
    <>
      <SummaryCharacterCell name={character.characterName} className={styles['character-cell']} />

      {GEAR_SLOTS.map((slot) => {
        const gear = findGearBySlot(character.summary.equipment.gears, slot);

        return (
          <SummaryCell key={slot.key} className={styles['quality-cell']}>
            <QualityValue quality={gear?.quality} />
          </SummaryCell>
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
