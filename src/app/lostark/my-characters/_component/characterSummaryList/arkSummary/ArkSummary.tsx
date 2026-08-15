import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import ArkGridSummarySection from './ArkGridSummarySection';
import ArkPassiveSummarySection from './ArkPassiveSummarySection';

import styles from './arkSummary.module.scss';

export default function ArkSummary(props: { summary: TResLostarkCharacterSummary }) {
  return (
    <div className={styles['ark-summary']}>
      <ArkGridSummarySection arkGrid={props.summary.arkGrid} />
      <ArkPassiveSummarySection arkPassive={props.summary.arkPassive} />
    </div>
  );
}
