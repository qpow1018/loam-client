import type { TLostarkGem } from '@/api/lostark/type';

import styles from './gemTooltip.module.scss';

type TGemTooltipDetail = {
  label: string;
  value: string | number | null;
};

export default function GemTooltip(props: { gem: TLostarkGem }) {
  const { gem } = props;
  const details = getGemDetails(gem);
  const effects = gem.effects.filter((effect) => effect.trim());

  return (
    <div className={styles['gem-tooltip']}>
      <div className={styles['header']}>
        <p className={styles['gem-name']}>{gem.name ?? '-'}</p>
        {gem.grade && <span className={styles['gem-grade']}>{gem.grade}</span>}
      </div>

      {details.length > 0 && (
        <div className={styles['detail-list']}>
          {details.map((detail) => (
            <span key={detail.label} className={styles['detail-item']}>
              <span className={styles['detail-label']}>{detail.label}</span>
              {detail.value}
            </span>
          ))}
        </div>
      )}

      {effects.length > 0 && (
        <section className={styles['effect-group']}>
          <p className={styles['effect-group-label']}>보석 효과</p>
          <div className={styles['effect-list']}>
            {effects.map((effect, index) => (
              <p key={`${effect}-${index}`} className={styles['effect-item']}>
                {effect}
              </p>
            ))}
          </div>
        </section>
      )}

      {gem.bonusEffect && (
        <section className={styles['effect-group']}>
          <p className={styles['effect-group-label']}>추가 효과</p>
          <p className={styles['effect-item']}>{gem.bonusEffect}</p>
        </section>
      )}
    </div>
  );
}

function getGemDetails(gem: TLostarkGem) {
  return [
    { label: '레벨', value: gem.level !== null ? `Lv. ${gem.level}` : null },
    { label: '종류', value: gem.kind },
    { label: '효과 유형', value: getEffectTypeLabel(gem.effectType) },
    { label: '연결 스킬', value: gem.skillName },
  ].filter((detail): detail is TGemTooltipDetail => detail.value !== null);
}

function getEffectTypeLabel(effectType: TLostarkGem['effectType']) {
  if (effectType === 'damage') return '피해 증가';
  if (effectType === 'cooldown') return '재사용 대기시간 감소';

  return null;
}
