import type { TLostarkGear, TResLostarkMainCharacter } from '@/api/lostark/type';

import CellValueChip from './_shared/CellValueChip';
import SummarySection from './_shared/SummarySection';
import SummaryTable from './_shared/SummaryTable';
import SummaryCharacterRow from './_shared/SummaryCharacterRow';
import SummaryCell from './_shared/SummaryCell';

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

export default function GearSection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <SummarySection
      title="장비 품질"
      legendItems={[
        { label: '100', color: '#f59e0b' },
        { label: '95+', color: '#94a3b8' },
        { label: '그 아래', color: '#62636c' },
      ]}
      className={styles['gear-section']}
    >
      <SummaryTable
        columns={GEAR_SLOTS.map((slot) => ({ key: slot.key, label: slot.label }))}
        gridClassName={styles['gear-grid']}
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

  function findGearBySlot(gears: TLostarkGear[], slot: TGearSlot) {
    return gears.find((gear) =>
      slot.typeLabels.some((typeLabel) => gear.type?.includes(typeLabel)),
    );
  }

  function getQualityGrade(quality: number | null | undefined) {
    if (quality === null || quality === undefined) {
      return 'none';
    }

    if (quality >= 100) {
      return 'high';
    }

    if (quality >= 95) {
      return 'middle';
    }

    return 'low';
  }

  return (
    <SummaryCharacterRow name={character.characterName} className={styles['gear-grid']}>
      {GEAR_SLOTS.map((slot) => {
        const gear = findGearBySlot(character.summary.equipment.gears, slot);

        return (
          <SummaryCell key={slot.key}>
            <CellValueChip grade={getQualityGrade(gear?.quality)}>
              {gear?.quality ?? '-'}
            </CellValueChip>
          </SummaryCell>
        );
      })}
    </SummaryCharacterRow>
  );
}
