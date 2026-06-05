import type { TLostarkGem } from '@/api/lostark/type';

import styles from './gemSection.module.scss';

export default function GemSection(props: { gems: TLostarkGem[] }) {
  const sortedGems = [...props.gems].sort((a, b) => (a.slot ?? 0) - (b.slot ?? 0));

  return (
    <section className={styles['gem-section']}>
      <div className={styles['section-header']}>
        <h3 className={styles['title']}>보석</h3>
        <span className={styles['count']}>{props.gems.length}개</span>
      </div>

      {sortedGems.length > 0 ? (
        <div className={styles['gem-list']}>
          {sortedGems.map((gem, index) => (
            <GemItem key={`${gem.slot ?? index}-${gem.name ?? 'gem'}`} gem={gem} />
          ))}
        </div>
      ) : (
        <p className={styles['empty']}>정보 없음</p>
      )}
    </section>
  );
}

function GemItem(props: { gem: TLostarkGem }) {
  const { gem } = props;
  const effectLabel = getEffectLabel(gem);

  return (
    <div className={styles['gem-item']}>
      <div className={styles['gem-icon']}>
        {gem.icon && <img src={gem.icon} alt="" />}
        {gem.level !== null && <span className={styles['gem-level']}>Lv.{gem.level}</span>}
      </div>

      <div className={styles['gem-info']}>
        <div className={styles['name-line']}>
          <span className={styles['skill-name']}>{gem.skillName ?? gem.kind ?? '-'}</span>
          {effectLabel && (
            <span className={`${styles['effect-type']} ${styles[`type-${gem.effectType}`]}`}>
              {effectLabel}
            </span>
          )}
        </div>

        <div className={styles['effect-list']}>
          {gem.effects.length > 0 ? (
            gem.effects.map((effect, index) => (
              <span key={`${effect}-${index}`} className={styles['effect']}>
                {effect}
              </span>
            ))
          ) : (
            <span className={styles['effect']}>{gem.name ?? '-'}</span>
          )}
        </div>

        {gem.bonusEffect && <p className={styles['bonus-effect']}>{gem.bonusEffect}</p>}
      </div>
    </div>
  );
}

function getEffectLabel(gem: TLostarkGem) {
  if (gem.effectType === 'damage') {
    return '피해';
  }

  if (gem.effectType === 'cooldown') {
    return '쿨감';
  }

  return null;
}
