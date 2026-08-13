import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import Button from '@/components/common/button/Button';

import styles from './profileSummary.module.scss';

export default function ProfileSummary(props: {
  character: TResLostarkMainCharacter;
  onSelect: () => void;
}) {
  const { profiles, equipment } = props.character.summary;
  const { manualMetrics } = props.character;
  const abilityStoneEngravings = equipment.abilityStone?.abilityStoneEngravings.slice(0, 2) ?? [];

  return (
    <div className={styles['profile-summary']}>
      <div className={styles['identity']}>
        <div className={styles['portrait']}>
          {profiles.characterImage && <img src={profiles.characterImage} alt="" />}
        </div>
        <div>
          <p className={styles['class-name']}>{profiles.characterClassName ?? '-'}</p>
          <strong>{profiles.characterName ?? '-'}</strong>
          <span>{`아이템 레벨 ${profiles.itemAvgLevel ?? '-'}`}</span>
        </div>
      </div>

      <div className={styles['primary-stats']}>
        <Stat label="전투력" value={profiles.combatPower ?? '-'} isAccent />
        <Stat label="팔찌 점수" value={formatMetric(manualMetrics.braceletScore, '%')} />
        <Stat
          label="젬 환산 레벨"
          value={formatMetric(manualMetrics.gemConversionLevel, '', 'Lv. ')}
        />
      </div>

      <div className={styles['ability-stone']}>
        <p>어빌리티 스톤</p>
        {abilityStoneEngravings.length === 0 ? (
          <span className={styles['empty-value']}>미장착</span>
        ) : (
          <div className={styles['ability-stone-list']}>
            {abilityStoneEngravings.map((engraving, index) => (
              <span key={`${engraving.name}-${index}`}>
                <b>{`+${engraving.level ?? 0}`}</b>
                {engraving.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <Button color="mint" fill="outline" size="small" onClick={props.onSelect}>
        상세 보기
      </Button>
    </div>
  );
}

function Stat(props: { label: string; value: string; isAccent?: boolean }) {
  return (
    <div className={`${styles['stat']} ${props.isAccent ? styles['accent-stat'] : ''}`}>
      <span>{props.label}</span>
      <strong>{props.value}</strong>
    </div>
  );
}

function formatMetric(value: number | null, suffix = '', prefix = '') {
  if (value === null) return '-';

  return `${prefix}${new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 }).format(value)}${suffix}`;
}
