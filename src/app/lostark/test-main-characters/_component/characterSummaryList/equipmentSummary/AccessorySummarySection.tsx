import type { TLostarkAccessory, TResLostarkCharacterSummary } from '@/api/lostark/type';

import SummarySection from '@/app/lostark/test-main-characters/_component/characterSummaryList/SummarySection';

import styles from './accessorySummarySection.module.scss';

const POLISH_GRADES = ['상', '중', '하'] as const;

type TPolishGrade = (typeof POLISH_GRADES)[number];

const ACCESSORY_SLOTS = [
  { label: '목', type: '목걸이', index: 0 },
  { label: '귀1', type: '귀걸이', index: 0 },
  { label: '귀2', type: '귀걸이', index: 1 },
  { label: '반1', type: '반지', index: 0 },
  { label: '반2', type: '반지', index: 1 },
] as const;

const POLISH_GRADE_LABELS: Record<string, TPolishGrade> = {
  FE9600: '상',
  CE43FC: '중',
  '00B5FF': '하',
};

export default function AccessorySummarySection(props: {
  accessories: TResLostarkCharacterSummary['equipment']['accessories'];
}) {
  const accessorySlots = ACCESSORY_SLOTS.map((slot) => ({
    label: slot.label,
    grades: getPolishGrades(
      props.accessories.filter((accessory) => accessory.type?.includes(slot.type))[slot.index],
    ),
  }));

  return (
    <SummarySection title="악세서리 연마">
      <div className={styles['accessory-summary']}>
        {accessorySlots.map((slot) => (
          <div key={slot.label} className={styles['chip-item']}>
            <span className={styles['accessory-label']}>{slot.label}</span>
            <span className={styles['grade-text']}>
              {slot.grades.length === 0 ? '-' : slot.grades.join('')}
            </span>
          </div>
        ))}
      </div>
    </SummarySection>
  );
}

function getPolishGrades(accessory: TLostarkAccessory | undefined): TPolishGrade[] {
  if (!accessory) return [];

  return accessory.polishEffects
    .filter((effect) => isValidPolishEffect(effect.text))
    .map((effect) => POLISH_GRADE_LABELS[effect.color?.toUpperCase() ?? ''])
    .filter((grade) => grade !== undefined)
    .sort((first, second) => POLISH_GRADES.indexOf(first) - POLISH_GRADES.indexOf(second));
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
