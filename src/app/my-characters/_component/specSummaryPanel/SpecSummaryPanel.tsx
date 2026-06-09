'use client';

import { useState } from 'react';

import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import GearSection from './GearSection';
import AccessorySection from './AccessorySection';
import BraceletSection from './BraceletSection';
import AbilityStoneSection from './AbilityStoneSection';
import GemAvatarSection from './GemAvatarSection';
import EngravingSummarySection from './EngravingSummarySection';
import ArkPassiveSummarySection from './ArkPassiveSummarySection';
import ArkGridSummarySection from './ArkGridSummarySection';

import styles from './specSummaryPanel.module.scss';

type TSpecTab =
  | 'gear'
  | 'accessory'
  | 'bracelet'
  | 'abilityStone'
  | 'gemAndAvatar'
  | 'engraving'
  | 'arkPassive'
  | 'arkGrid';

export const SPEC_OPTIONS: { value: TSpecTab; label: string }[] = [
  { value: 'gear', label: '장비 품질' },
  { value: 'accessory', label: '악세사리' },
  { value: 'bracelet', label: '필찌' },
  { value: 'abilityStone', label: '어빌스톤' },
  { value: 'gemAndAvatar', label: '보석/전압' },
  { value: 'engraving', label: '각인' },
  { value: 'arkPassive', label: '아크패시브' },
  { value: 'arkGrid', label: '아크그리드' },
];

export default function SpecSummaryPanel(props: { characters: TResLostarkMainCharacter[] }) {
  const [specTab, setSpecTab] = useState<TSpecTab>('gear');

  return (
    <section className={styles['spec-summary-panel']}>
      <ButtonGroup options={SPEC_OPTIONS} value={specTab} onChange={(value) => setSpecTab(value)} />

      {specTab === 'gear' && <GearSection characters={props.characters} />}
      {specTab === 'accessory' && <AccessorySection characters={props.characters} />}
      {specTab === 'bracelet' && <BraceletSection characters={props.characters} />}
      {specTab === 'abilityStone' && <AbilityStoneSection characters={props.characters} />}
      {specTab === 'gemAndAvatar' && <GemAvatarSection characters={props.characters} />}
      {specTab === 'engraving' && <EngravingSummarySection characters={props.characters} />}
      {specTab === 'arkPassive' && <ArkPassiveSummarySection characters={props.characters} />}
      {specTab === 'arkGrid' && <ArkGridSummarySection characters={props.characters} />}
    </section>
  );
}
