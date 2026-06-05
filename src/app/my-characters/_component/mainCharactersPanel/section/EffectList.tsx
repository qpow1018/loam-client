import type { TLostarkColoredEffect } from '@/api/lostark/type';

import styles from './effectList.module.scss';

export default function EffectList(props: {
  title: string;
  effects: TLostarkColoredEffect[];
}) {
  if (props.effects.length === 0) {
    return null;
  }

  return (
    <div className={styles['effect-group']}>
      <span className={styles['effect-title']}>{props.title}</span>
      <div className={styles['effect-list']}>
        {props.effects.map((effect, index) => (
          <span
            key={`${effect.text}-${index}`}
            className={styles['effect']}
            style={effect.color ? { color: effect.color } : undefined}
          >
            {effect.text}
          </span>
        ))}
      </div>
    </div>
  );
}
