import type {
  TLostarkAccessory,
  TLostarkColoredEffect,
  TResLostarkMainCharacter,
} from '@/api/lostark/type';

import styles from './accessorySection.module.scss';

const ACCESSORY_SLOTS = [
  { key: 'necklace', label: '목걸이', typeLabel: '목걸이', index: 0 },
  { key: 'earring-1', label: '귀걸이1', typeLabel: '귀걸이', index: 0 },
  { key: 'earring-2', label: '귀걸이2', typeLabel: '귀걸이', index: 1 },
  { key: 'ring-1', label: '반지1', typeLabel: '반지', index: 0 },
  { key: 'ring-2', label: '반지2', typeLabel: '반지', index: 1 },
] as const;

type TAccessorySlot = (typeof ACCESSORY_SLOTS)[number];
type TPolishGrade = 'top' | 'middle' | 'low';

const POLISH_GRADE_BY_COLOR: Record<string, TPolishGrade> = {
  FE9600: 'top',
  CE43FC: 'middle',
  '00B5FF': 'low',
};

const POLISH_GRADE_LABEL: Record<TPolishGrade, string> = {
  top: '상',
  middle: '중',
  low: '하',
};

const POLISH_GRADE_ORDER: Record<TPolishGrade, number> = {
  top: 0,
  middle: 1,
  low: 2,
};

export default function AccessorySection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <section className={styles['accessory-section']}>
      <div className={styles['section-header']}>
        <h2 className={styles['section-title']}>장신구 연마효과</h2>

        <div className={styles['grade-legend']} aria-label="연마효과 등급 범례">
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-top']} />
            상옵
          </span>
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-middle']} />
            중옵
          </span>
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-low']} />
            하옵
          </span>
        </div>
      </div>

      <div className={styles['accessory-matrix']}>
        <div className={styles['matrix-head-cell']}>캐릭터</div>
        {ACCESSORY_SLOTS.map((slot) => (
          <div key={slot.key} className={styles['matrix-head-cell']}>
            {slot.label}
          </div>
        ))}

        {props.characters.map((character) => (
          <CharacterAccessoryRow key={character.id} character={character} />
        ))}
      </div>
    </section>
  );
}

function CharacterAccessoryRow(props: { character: TResLostarkMainCharacter }) {
  const { character } = props;

  return (
    <>
      <div className={styles['character-cell']}>
        <strong className={styles['character-name']}>{character.characterName}</strong>
      </div>

      {ACCESSORY_SLOTS.map((slot) => {
        const accessory = findAccessoryBySlot(character.summary.equipment.accessories, slot);
        const polishSummary = getPolishSummary(slot, accessory);

        return (
          <div key={slot.key} className={styles['accessory-cell']}>
            <PolishSummary summary={polishSummary} />
          </div>
        );
      })}
    </>
  );
}

function PolishSummary(props: { summary: TPolishSummary }) {
  return (
    <div className={styles['polish-summary']}>
      <span className={styles['polish-label']}>{props.summary.label}</span>

      {props.summary.effects.length > 0 && (
        <span className={styles['polish-dots']} aria-label={props.summary.label}>
          {props.summary.effects.map((effect, index) => (
            <span
              key={`${effect.text}-${index}`}
              className={styles['polish-dot']}
              style={{
                backgroundColor: `#${effect.color}`,
              }}
            />
          ))}
        </span>
      )}
    </div>
  );
}

type TPolishSummary = {
  label: string;
  effects: TLostarkColoredEffect[];
};

function findAccessoryBySlot(accessories: TLostarkAccessory[], slot: TAccessorySlot) {
  return accessories.filter((accessory) => accessory.type?.includes(slot.typeLabel))[slot.index];
}

function getPolishSummary(slot: TAccessorySlot, accessory: TLostarkAccessory | undefined) {
  if (!accessory) {
    return {
      label: '-',
      effects: [],
    };
  }

  const validEffects = accessory.polishEffects
    .filter((effect) => isValidPolishEffect(slot, effect.text))
    .filter((effect) => getPolishGrade(effect.color) !== null)
    .sort((a, b) => {
      const gradeA = getPolishGrade(a.color);
      const gradeB = getPolishGrade(b.color);

      if (!gradeA || !gradeB) {
        return 0;
      }

      return POLISH_GRADE_ORDER[gradeA] - POLISH_GRADE_ORDER[gradeB];
    });

  if (validEffects.length === 0) {
    return {
      label: '-',
      effects: [],
    };
  }

  return {
    label: getPolishLabel(validEffects),
    effects: validEffects,
  };
}

function isValidPolishEffect(slot: TAccessorySlot, text: string) {
  if (slot.typeLabel === '목걸이') {
    return text.includes('적에게 주는 피해') || text.includes('추가 피해');
  }

  if (slot.typeLabel === '귀걸이') {
    return /^(공격력|무기 공격력)\s*\+.*%/.test(text);
  }

  if (slot.typeLabel === '반지') {
    return text.includes('치명타 적중률') || text.includes('치명타 피해');
  }

  return false;
}

function getPolishLabel(effects: TLostarkColoredEffect[]) {
  const labels = effects
    .map((effect) => getPolishGrade(effect.color))
    .filter((grade): grade is TPolishGrade => grade !== null)
    .map((grade) => POLISH_GRADE_LABEL[grade]);

  if (labels.length === 1) {
    return `${labels[0]}단일`;
  }

  return labels.join('');
}

function getPolishGrade(color: string | null) {
  if (!color) {
    return null;
  }

  return POLISH_GRADE_BY_COLOR[color.toUpperCase()] ?? null;
}
