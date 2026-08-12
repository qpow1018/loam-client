import type { TLostarkArkPassive } from '@/api/lostark/type';

import ArkPassiveNodeSection from './ArkPassiveNodeSection';
import DetailPanel from './DetailPanel';

export default function ArkPassiveSection(props: { arkPassive: TLostarkArkPassive }) {
  return (
    <DetailPanel title="아크 패시브 상세">
      <ArkPassiveNodeSection arkPassive={props.arkPassive} />
    </DetailPanel>
  );
}
