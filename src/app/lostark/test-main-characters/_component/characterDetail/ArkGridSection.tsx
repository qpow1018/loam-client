import type { TLostarkArkGrid } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';

import DetailPanel from './DetailPanel';

import styles from './arkGridSection.module.scss';

const CORE_ORDER = ['질서의 해', '질서의 달', '질서의 별', '혼돈의 해', '혼돈의 달', '혼돈의 별'];
const EFFECT_ORDER = ['보스 피해', '추가 피해', '공격력'];

export default function ArkGridSection(props: { arkGrid: TLostarkArkGrid }) {
  const { arkGrid } = props;

  const sortedCores = [...arkGrid.cores].sort(
    (a, b) => getCoreOrder(a.name) - getCoreOrder(b.name),
  );
  const sortedEffects = [...arkGrid.effects].sort(
    (a, b) => getEffectOrder(a.name) - getEffectOrder(b.name),
  );
  const bossDamageEffect = arkGrid.effects.find((effect) => effect.name === '보스 피해');

  return (
    <DetailPanel title="아크 그리드">
      <div className={styles['ark-grid-section']}>
        <div className={styles['core-list']}>
          {sortedCores.map((core, index) => (
            <div key={`${core.name}-${index}`} className={styles['core-item']}>
              <ItemSlot imageUrl={core.icon} grade={core.grade} size={44} />
              <div className={styles['core-info']}>
                <p className={styles['core-name']}>{getCoreDisplayName(core.name)}</p>
                <p className={styles['core-point']}>{core.point ?? 0}P</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles['effect-section']}>
          <div className={styles['effect-list']}>
            {sortedEffects.map((effect, index) => (
              <div key={`${effect.name}-${index}`} className={styles['effect-item']}>
                <span className={styles['effect-name']}>{effect.name ?? '-'}</span>
                <span className={styles['effect-level']}>Lv. {effect.level ?? 0}</span>
              </div>
            ))}
          </div>
          {bossDamageEffect && (
            <div className={styles['boss-damage-box']}>
              <span className={styles['boss-damage-label']}>보스 피해</span>
              <strong className={styles['boss-damage-level']}>
                Lv. {bossDamageEffect.level ?? 0}
              </strong>
            </div>
          )}
        </div>
      </div>
    </DetailPanel>
  );
}

function getCoreOrder(name: string | null) {
  const orderIndex = CORE_ORDER.findIndex((coreName) => name?.includes(coreName));

  return orderIndex === -1 ? Number.MAX_SAFE_INTEGER : orderIndex;
}

function getCoreDisplayName(name: string | null) {
  return name?.split(':').at(-1)?.trim() ?? '-';
}

function getEffectOrder(name: string | null) {
  const orderIndex = EFFECT_ORDER.findIndex((effectName) => effectName === name);

  return orderIndex === -1 ? Number.MAX_SAFE_INTEGER : orderIndex;
}
