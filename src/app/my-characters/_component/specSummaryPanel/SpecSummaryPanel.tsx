'use client';

import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import AccessorySection from './AccessorySection';
import GearSection from './GearSection';

import styles from './specSummaryPanel.module.scss';

export default function SpecSummaryPanel(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <section className={styles['spec-summary-panel']}>
      <GearSection characters={props.characters} />
      <AccessorySection characters={props.characters} />
      <p>팔찌 자체</p>
      <p>97돌 여부</p>
      <p>보석 갯수</p>
      <p>전압 갯수</p>
      <p>아크패시브 레벨</p>
      <p>각인</p>
      <p>코어 - 고대코어, 활성화 포인트</p>
      <p>젬 효과 - 보피</p>
    </section>
  );
}
