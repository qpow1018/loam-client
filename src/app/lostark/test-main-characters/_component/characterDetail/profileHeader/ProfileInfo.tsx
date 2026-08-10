import type { TLostarkManualMetrics, TResLostarkMainCharacter } from '@/api/lostark/type';

import styles from './profileInfo.module.scss';

const EXTERNAL_LINKS = [
  { name: '일로아', urlPrefix: 'https://iloa.gg/character/' },
  { name: '로펙', urlPrefix: 'https://lopec.kr/character/specPoint/' },
  { name: '로아랩', urlPrefix: 'https://lo4.app/characters?name=' },
] as const;

export default function ProfileInfo(props: {
  profiles: TResLostarkMainCharacter['summary']['profiles'];
  manualMetrics: TLostarkManualMetrics;
}) {
  return (
    <div className={styles['profile-content']}>
      <PrimaryInfo profiles={props.profiles} manualMetrics={props.manualMetrics} />
      <SupportInfo manualMetrics={props.manualMetrics} />
    </div>
  );
}

function PrimaryInfo(props: {
  profiles: TResLostarkMainCharacter['summary']['profiles'];
  manualMetrics: TLostarkManualMetrics;
}) {
  const encodedCharacterName = encodeURIComponent(props.profiles.characterName ?? '');

  return (
    <div className={styles['primary-info']}>
      <p className={styles['profile-class-name']}>{props.profiles.characterClassName ?? '-'}</p>
      <h2 className={styles['profile-name']}>{props.profiles.characterName ?? '-'}</h2>

      <div className={styles['external-links']}>
        {EXTERNAL_LINKS.map((link) => (
          <a
            key={link.name}
            href={`${link.urlPrefix}${encodedCharacterName}`}
            target="_blank"
            rel="noreferrer"
          >
            {link.name}
          </a>
        ))}
      </div>

      <div className={styles['primary-metrics']}>
        <div className={styles['metric-item']}>
          <span className={styles['metric-label']}>아이템 레벨</span>
          <strong className={styles['metric-value']}>{props.profiles.itemAvgLevel ?? '-'}</strong>
        </div>
        <div className={`${styles['metric-item']} ${styles['tone-rose']}`}>
          <span className={styles['metric-label']}>전투력</span>
          <strong className={styles['metric-value']}>{props.profiles.combatPower ?? '-'}</strong>
        </div>
        <div className={styles['metric-item']}>
          <span className={styles['metric-label']}>로펙 점수</span>
          <strong className={styles['metric-value']}>
            {formatMetric(props.manualMetrics.lopecScore)}
          </strong>
        </div>
      </div>
    </div>
  );
}

function SupportInfo(props: { manualMetrics: TLostarkManualMetrics }) {
  const settingMetrics = [
    { label: '팔찌', value: formatMetric(props.manualMetrics.braceletScore, '%') },
    { label: '젬 환산', value: formatMetric(props.manualMetrics.gemConversionLevel, '', 'Lv. ') },
  ];

  return (
    <div className={styles['support-info']}>
      <div className={styles['setting-metrics']}>
        {settingMetrics.map((metric) => (
          <div key={metric.label} className={styles['setting-metric']}>
            <span className={styles['label']}>{metric.label}</span>
            <span className={styles['value']}>{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatMetric(value: number | null, suffix = '', prefix = '') {
  if (value === null) return '-';

  return `${prefix}${new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 }).format(value)}${suffix}`;
}
