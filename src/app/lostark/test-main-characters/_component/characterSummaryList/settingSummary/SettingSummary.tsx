import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import SummarySection from '../SummarySection';
import EngravingSummarySection from './EngravingSummarySection';
import GemSummarySection from './GemSummarySection';
import LegendaryAvatarSummarySection from './LegendaryAvatarSummarySection';

import styles from './settingSummary.module.scss';

export default function SettingSummary(props: { summary: TResLostarkCharacterSummary }) {
  return (
    <div className={styles['setting-summary']}>
      <SummarySection title="각인">
        <EngravingSummarySection engravings={props.summary.engravings} />
      </SummarySection>

      <SummarySection title="보석">
        <GemSummarySection gems={props.summary.gems} />
      </SummarySection>

      <SummarySection title="전설 아바타">
        <LegendaryAvatarSummarySection avatars={props.summary.legendaryAvatars} />
      </SummarySection>
    </div>
  );
}
