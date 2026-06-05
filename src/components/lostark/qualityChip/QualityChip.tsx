import { getEquipQualityBackground } from '@/utils/lostark';

import styles from './qualityChip.module.scss';

export type TQualityChipProps = {
  quality: number | null | undefined;
};

export default function QualityChip(props: TQualityChipProps) {
  const { quality } = props;

  if (quality === null || quality === undefined) {
    return null;
  }

  return (
    <span
      className={styles['quality-chip']}
      style={{
        backgroundColor: getEquipQualityBackground(quality),
      }}
    >
      {quality}
    </span>
  );
}
