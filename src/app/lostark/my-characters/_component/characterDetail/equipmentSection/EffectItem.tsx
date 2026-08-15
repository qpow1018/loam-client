import type { TLostarkColoredEffect } from '@/api/lostark/type';

import styles from './effectItem.module.scss';

export default function EffectItem(props: { effect: TLostarkColoredEffect }) {
  const { effect } = props;

  return (
    <p className={styles['effect']}>
      {effect.color && (
        <span
          className={styles['effect-marker']}
          style={{ backgroundColor: `#${effect.color}` }}
        />
      )}
      <span>{effect.text}</span>
    </p>
  );
}
