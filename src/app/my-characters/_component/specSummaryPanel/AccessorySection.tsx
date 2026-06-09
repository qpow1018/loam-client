import type {
  TLostarkAccessory,
  TLostarkColoredEffect,
  TResLostarkMainCharacter,
} from '@/api/lostark/type';

import SummarySection from './_shared/SummarySection';
import SummaryTable from './_shared/SummaryTable';
import SummaryCharacterRow from './_shared/SummaryCharacterRow';
import SummaryCell from './_shared/SummaryCell';

import styles from './accessorySection.module.scss';

type TAccessorySlot = (typeof ACCESSORY_SLOTS)[number];

type TPolishSummary = {
  color: string;
  label: string;
  order: number;
};

const ACCESSORY_SLOTS = [
  { key: 'necklace', label: '목걸이', typeLabel: '목걸이', index: 0 },
  { key: 'earring-1', label: '귀걸이1', typeLabel: '귀걸이', index: 0 },
  { key: 'earring-2', label: '귀걸이2', typeLabel: '귀걸이', index: 1 },
  { key: 'ring-1', label: '반지1', typeLabel: '반지', index: 0 },
  { key: 'ring-2', label: '반지2', typeLabel: '반지', index: 1 },
] as const;

const POLISH_GRADE_DATA: Record<string, TPolishSummary> = {
  ['FE9600']: {
    color: 'FE9600',
    label: '상',
    order: 0,
  },
  ['CE43FC']: {
    color: 'CE43FC',
    label: '중',
    order: 1,
  },
  ['00B5FF']: {
    color: '00B5FF',
    label: '하',
    order: 2,
  },
} as const;

export default function AccessorySection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <SummarySection
      title="악세사리"
      legendItems={[
        { label: '상옵', color: '#fe9600' },
        { label: '중옵', color: '#ce43fc' },
        { label: '하옵', color: '#00b5ff' },
      ]}
      className={styles['accessory-section']}
    >
      <SummaryTable
        gridClassName={styles['accessory-grid']}
        columns={ACCESSORY_SLOTS.map((slot) => ({ key: slot.key, label: slot.label }))}
      >
        {props.characters.map((character) => (
          <CharacterAccessoryRow key={character.id} character={character} />
        ))}
      </SummaryTable>
    </SummarySection>
  );
}

function CharacterAccessoryRow(props: { character: TResLostarkMainCharacter }) {
  const { character } = props;

  function findAccessoryBySlot(accessories: TLostarkAccessory[], slot: TAccessorySlot) {
    return accessories.filter((accessory) => accessory.type?.includes(slot.typeLabel))[slot.index];
  }

  function getPolishSummary(accessory?: TLostarkAccessory): TPolishSummary[] {
    if (!accessory) {
      return [];
    }

    const validPolishEffect = accessory.polishEffects.filter((item) => isValidPolishEffect(item));
    return convertPolishSummary(validPolishEffect);
  }

  function isValidPolishEffect(effect: TLostarkColoredEffect) {
    const text = effect.text;

    return (
      text.includes('적에게 주는 피해') ||
      text.includes('추가 피해') ||
      /^(공격력|무기 공격력)\s*\+.*%/.test(text) ||
      text.includes('치명타 적중률') ||
      text.includes('치명타 피해')
    );
  }

  function convertPolishSummary(effects: TLostarkColoredEffect[]) {
    return effects
      .map((item) => POLISH_GRADE_DATA[item.color?.toUpperCase() || ''])
      .sort((a, b) => a.order - b.order);
  }

  return (
    <SummaryCharacterRow name={character.characterName} className={styles['accessory-grid']}>
      {ACCESSORY_SLOTS.map((slot) => {
        const accessory = findAccessoryBySlot(character.summary.equipment.accessories, slot);
        const polishSummary = getPolishSummary(accessory);

        return (
          <SummaryCell key={slot.key} className={styles['accessory-cell']}>
            <PolishSummary summary={polishSummary} />
          </SummaryCell>
        );
      })}
    </SummaryCharacterRow>
  );
}

function PolishSummary(props: { summary: TPolishSummary[] }) {
  const { summary } = props;

  const polishLabel =
    summary.length === 1 ? `${summary[0].label}단일` : summary.map((item) => item.label).join('');

  return (
    <div className={styles['polish-summary']}>
      <span className={styles['polish-label']}>{polishLabel}</span>

      <span className={styles['polish-dots']}>
        {summary.map((item, index) => (
          <span
            key={index}
            className={styles['polish-dot']}
            style={{
              backgroundColor: `#${item.color}`,
            }}
          />
        ))}
      </span>
    </div>
  );
}
