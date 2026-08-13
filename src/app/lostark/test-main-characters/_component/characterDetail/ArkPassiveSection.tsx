import type { TLostarkArkPassive } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';

import DetailPanel from './DetailPanel';

import styles from './arkPassiveSection.module.scss';

const ARK_PASSIVE_CATEGORIES = ['진화', '깨달음', '도약'] as const;

type TArkPassiveCategory = (typeof ARK_PASSIVE_CATEGORIES)[number];

export default function ArkPassiveSection(props: { arkPassive: TLostarkArkPassive }) {
  const { arkPassive } = props;

  if (arkPassive.nodes.length === 0) {
    return (
      <DetailPanel title="아크 패시브 상세">
        <p className={styles['empty-info']}>아크 패시브 상세 정보가 없습니다.</p>
      </DetailPanel>
    );
  }

  return (
    <DetailPanel title="아크 패시브 상세">
      <div className={styles['ark-passive-section']}>
        {ARK_PASSIVE_CATEGORIES.map((category) => {
          const point = arkPassive.points.find((item) => item.name === category);
          const nodes = arkPassive.nodes.filter((node) => node.category === category);

          return (
            <section key={category} className={styles['category-section']}>
              <CategoryHeader category={category} point={point} />
              {nodes.length === 0 ? (
                <p className={styles['empty-info']}>{`${category} 노드 정보가 없습니다.`}</p>
              ) : (
                <div className={styles['node-list']}>
                  {nodes.map((node, index) => {
                    const tooltipId = `ark-passive-${category}-${index}-tooltip`;
                    const hasDescription = Boolean(node.description?.trim());

                    return (
                      <div
                        key={`${node.name ?? 'node'}-${index}`}
                        className={styles['node-row']}
                        tabIndex={0}
                        aria-describedby={hasDescription ? tooltipId : undefined}
                      >
                        <ItemSlot imageUrl={node.icon} grade={null} size={36} />
                        <div className={styles['node-copy']}>
                          <strong>{node.name ?? '-'}</strong>
                          {node.tier !== null && <span>{`T${node.tier}`}</span>}
                        </div>
                        {node.level !== null && (
                          <b className={styles['node-level']}>{`Lv. ${node.level}`}</b>
                        )}
                        {hasDescription && (
                          <div id={tooltipId} className={styles['node-tooltip']} role="tooltip">
                            <strong>{node.name ?? '-'}</strong>
                            <span>
                              {node.tier !== null && `T${node.tier}`}
                              {node.tier !== null && node.level !== null && ' · '}
                              {node.level !== null && `Lv. ${node.level}`}
                            </span>
                            <p>{node.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </DetailPanel>
  );
}

function CategoryHeader(props: {
  category: TArkPassiveCategory;
  point: TLostarkArkPassive['points'][number] | undefined;
}) {
  const { rank, level } = getPointRankAndLevel(props.point?.description);

  return (
    <div className={styles['category-header']}>
      <div>
        <strong>{props.category}</strong>
        {props.point?.value !== null && props.point?.value !== undefined && (
          <span>{props.point.value}P</span>
        )}
      </div>
      {(rank || level) && (
        <span>
          {rank && `랭크 ${rank}`}
          {rank && level && ' · '}
          {level && `Lv. ${level}`}
        </span>
      )}
    </div>
  );
}

function getPointRankAndLevel(description: string | null | undefined) {
  if (!description) return { rank: null, level: null };

  return {
    rank: description.match(/(\d+)\s*랭크/)?.[1] ?? null,
    level: description.match(/(?:Lv\.?|레벨)\s*(\d+)/i)?.[1] ?? null,
  };
}
