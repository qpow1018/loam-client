import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import EngravingSummarySection from './EngravingSummarySection';
import GemSummarySection from './GemSummarySection';
import LegendaryAvatarSummarySection from './LegendaryAvatarSummarySection';

import styles from './settingSummary.module.scss';

export default function SettingSummary(props: { summary: TResLostarkCharacterSummary }) {
  return (
    <div className={styles['setting-summary']}>
      <GemSummarySection gems={props.summary.gems} />
      <EngravingSummarySection engravings={props.summary.engravings} />
      <LegendaryAvatarSummarySection avatars={props.summary.legendaryAvatars} />
    </div>
  );
}
