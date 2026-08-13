import type { TLostarkArkGrid } from '@/api/lostark/type';

import DetailPanel from '@/app/lostark/test-main-characters/_component/characterDetail/DetailPanel';
import CoreGrid from './CoreGrid';
import GemEffectTable from './GemEffectTable';

import styles from './arkGridSection.module.scss';

const CORE_ORDER = ['질서의 해', '질서의 달', '질서의 별', '혼돈의 해', '혼돈의 달', '혼돈의 별'];
const CORE_TYPES = ['질서', '혼돈'] as const;

export default function ArkGridSection(props: { arkGrid: TLostarkArkGrid }) {
  const { arkGrid } = props;

  const coreGroups = CORE_TYPES.map((type) => ({
    type,
    cores: arkGrid.cores
      .filter((core) => core.name?.startsWith(`${type}의`))
      .sort((a, b) => getCoreOrder(a.name) - getCoreOrder(b.name)),
  }));
  const [orderTypeCoreGroup, chaosTypeCoreGroup] = coreGroups;

  return (
    <DetailPanel title="아크 그리드" className={styles['ark-grid-section']}>
      <CoreGrid orderTypeCoreGroup={orderTypeCoreGroup} chaosTypeCoreGroup={chaosTypeCoreGroup} />
      <GemEffectTable coreGroups={coreGroups} />
    </DetailPanel>
  );
}

function getCoreOrder(name: string | null) {
  const orderIndex = CORE_ORDER.findIndex((coreName) => name?.includes(coreName));

  return orderIndex === -1 ? Number.MAX_SAFE_INTEGER : orderIndex;
}
