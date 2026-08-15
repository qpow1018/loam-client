import type { TLostarkColoredEffect } from '@/api/lostark/type';

import styles from './equipmentTooltip.module.scss';

type TEquipmentTooltipDetail = {
  label: string;
  value: string | number | null | undefined;
};

type TEquipmentTooltipEffect = TLostarkColoredEffect;

type TEquipmentTooltipEffectGroup = {
  label: string;
  effects: TEquipmentTooltipEffect[];
};

type TEquipmentTooltipProps = {
  name: string | null;
  grade: string | null;
  details?: TEquipmentTooltipDetail[];
  effectGroups?: TEquipmentTooltipEffectGroup[];
};

export default function EquipmentTooltip(props: TEquipmentTooltipProps) {
  const details = props.details?.filter(
    (detail) => detail.value !== null && detail.value !== undefined,
  );
  const effectGroups =
    props.effectGroups
      ?.map((effectGroup) => ({
        ...effectGroup,
        effects: effectGroup.effects.filter((effect) => effect.text.trim()),
      }))
      .filter((effectGroup) => effectGroup.effects.length > 0) ?? [];

  return (
    <div className={styles['equipment-tooltip']}>
      <div className={styles['header']}>
        <p className={styles['item-name']}>{props.name ?? '-'}</p>
        {props.grade && <span className={styles['item-grade']}>{props.grade}</span>}
      </div>

      {details && details.length > 0 && (
        <div className={styles['detail-list']}>
          {details.map((detail) => (
            <span key={detail.label} className={styles['detail-item']}>
              <span className={styles['detail-label']}>{detail.label}</span>
              {detail.value}
            </span>
          ))}
        </div>
      )}

      {effectGroups.length > 0 && (
        <div className={styles['effect-groups']}>
          {effectGroups.map((effectGroup) => (
            <section key={effectGroup.label} className={styles['effect-group']}>
              <p className={styles['effect-group-label']}>{effectGroup.label}</p>
              <div className={styles['effect-list']}>
                {effectGroup.effects.map((effect, index) => (
                  <p
                    key={`${effect.text}-${index}`}
                    className={styles['effect-item']}
                    style={{
                      color: effect.color ? `#${effect.color.replace('#', '')}` : undefined,
                    }}
                  >
                    {effect.text}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
