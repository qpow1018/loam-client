import type { TLostarkCharacterRawPayload } from '@/api/lostark/type';

import styles from '../buildAnalysisPage.module.scss';

type TSnapshotStat = {
  type: string;
  value: string;
};

export default function BuildAnalysisSnapshot(props: { rawPayload: TLostarkCharacterRawPayload }) {
  const profile = getRecord(props.rawPayload.profiles);

  if (!profile) {
    return (
      <p className={styles['status-message']}>
        원본 응답에서 기준 캐릭터 프로필 정보를 찾지 못했습니다.
      </p>
    );
  }

  const profileMetrics = [
    { label: '아이템 레벨', value: getString(profile.ItemAvgLevel) },
    { label: '전투 레벨', value: getString(profile.CharacterLevel) },
    { label: '전투력', value: getString(profile.CombatPower) },
  ];
  const stats = getStats(profile.Stats);

  return (
    <section className={styles['snapshot']} aria-labelledby="build-analysis-snapshot-title">
      <div className={styles['snapshot-heading']}>
        <div>
          <p className={styles['snapshot-eyebrow']}>확정 스냅샷</p>
          <h2 id="build-analysis-snapshot-title">
            {getString(profile.CharacterName) ?? '-'} ·{' '}
            {getString(profile.CharacterClassName) ?? '-'}
          </h2>
        </div>
        <p>원본 API 응답의 현재 최종값을 그대로 표시합니다.</p>
      </div>

      <dl className={styles['profile-metrics']}>
        {profileMetrics.map((metric) => (
          <div key={metric.label} className={styles['metric-item']}>
            <dt>{metric.label}</dt>
            <dd>{metric.value ?? '-'}</dd>
          </div>
        ))}
      </dl>

      <div className={styles['stat-section']}>
        <h3>현재 스탯</h3>
        <p>장착 세팅이 반영된 프로필의 최종 수치입니다. 피해 계산식에는 아직 사용하지 않습니다.</p>

        <dl className={styles['stat-list']}>
          {stats.map((stat) => (
            <div key={stat.type} className={styles['stat-item']}>
              <dt>{stat.type}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function getRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;

  return value as Record<string, unknown>;
}

function getString(value: unknown): string | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null;

  return String(value);
}

function getStats(value: unknown): TSnapshotStat[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const stat = getRecord(item);
    const type = getString(stat?.Type);
    const statValue = getString(stat?.Value);

    if (!type || !statValue) return [];

    return [{ type, value: statValue }];
  });
}
