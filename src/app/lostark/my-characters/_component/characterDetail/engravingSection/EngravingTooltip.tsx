import type { TLostarkEngraving } from '@/api/lostark/type';

import styles from './engravingTooltip.module.scss';

type TEngravingTooltipDetail = {
  label: string;
  value: string | null;
};

export default function EngravingTooltip(props: { engraving: TLostarkEngraving }) {
  const { engraving } = props;
  const details = getEngravingDetails(engraving);

  return (
    <div className={styles['engraving-tooltip']}>
      <div className={styles['header']}>
        <p className={styles['engraving-name']}>{engraving.name ?? '-'}</p>
        {engraving.grade && <span className={styles['engraving-grade']}>{engraving.grade}</span>}
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

      {engraving.description && (
        <section className={styles['description-group']}>
          <p className={styles['description-label']}>각인 효과</p>
          <p className={styles['description']}>{engraving.description}</p>
        </section>
      )}
    </div>
  );
}

function getEngravingDetails(engraving: TLostarkEngraving) {
  return [
    { label: '레벨', value: engraving.level !== null ? `Lv. ${engraving.level}` : null },
    {
      label: '어빌리티 스톤 레벨',
      value: engraving.abilityStoneLevel !== null ? `Lv. ${engraving.abilityStoneLevel}` : null,
    },
  ].filter((detail): detail is TEngravingTooltipDetail => detail.value !== null);
}
