import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import Button from '@/components/common/button/Button';

import styles from './profileSummary.module.scss';

export default function ProfileSummary(props: {
  character: TResLostarkMainCharacter;
  onSelect: () => void;
}) {
  const { profiles } = props.character.summary;
  const { manualMetrics } = props.character;

  return (
    <div className={styles['profile-summary']}>
      <div className={styles['character-overview']}>
        <div className={styles['character-image']}>
          {profiles.characterImage && <img src={profiles.characterImage} alt="" />}
        </div>
        <div className={styles['character-details']}>
          <p className={styles['character-class-name']}>{profiles.characterClassName ?? '-'}</p>
          <span className={styles['character-name']}>{profiles.characterName ?? '-'}</span>
        </div>
      </div>

      <div className={styles['profile-stats']}>
        <ProfileStat label="아이템 레벨" value={profiles.itemAvgLevel ?? '-'} />
        <ProfileStat label="전투력" value={profiles.combatPower ?? '-'} isHighlighted />
        <ProfileStat label="로펙 점수" value={formatMetric(manualMetrics.lopecScore)} />
        <ProfileStat
          label="젬 환산"
          value={formatMetric(manualMetrics.gemConversionLevel, '%')}
        />
      </div>

      <Button color="gray" fill="outline" size="small" onClick={props.onSelect}>
        상세 보기
      </Button>
    </div>
  );
}

function ProfileStat(props: { label: string; value: string; isHighlighted?: boolean }) {
  return (
    <div
      className={`${styles['profile-stat']} ${props.isHighlighted ? styles['highlighted-stat'] : ''}`}
    >
      <span className={styles['stat-label']}>{props.label}</span>
      <span className={styles['stat-value']}>{props.value}</span>
    </div>
  );
}

function formatMetric(value: number | null, suffix = '', prefix = '') {
  if (value === null) return '-';

  return `${prefix}${new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 }).format(value)}${suffix}`;
}
