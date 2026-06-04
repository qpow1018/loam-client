import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import styles from './mainCharacterCard.module.scss';

export default function MainCharacterCard(props: { data: TResLostarkCharacterSummary }) {
  const { data } = props;

  console.log('data', data);

  return <div className={styles['main-character-card']}></div>;
}
