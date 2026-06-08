'use client';

import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import AbilityStoneSection from './AbilityStoneSection';
import AccessorySection from './AccessorySection';
import BraceletSection from './BraceletSection';
import GemAvatarSection from './GemAvatarSection';
import GearSection from './GearSection';

import styles from './specSummaryPanel.module.scss';

export default function SpecSummaryPanel(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <section className={styles['spec-summary-panel']}>
      <GearSection characters={props.characters} />
      <AccessorySection characters={props.characters} />
      <BraceletSection characters={props.characters} />
      <AbilityStoneSection characters={props.characters} />
      <GemAvatarSection characters={props.characters} />
      <p>아크패시브 레벨</p>
      <p>각인</p>
      <p>코어 - 고대코어, 활성화 포인트</p>
      <p>젬 효과 - 보피</p>
    </section>
  );
}
