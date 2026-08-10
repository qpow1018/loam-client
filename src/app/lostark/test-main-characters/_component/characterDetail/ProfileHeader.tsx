import { useState } from 'react';

import type { TLostarkManualMetrics, TResLostarkMainCharacter } from '@/api/lostark/type';

import Button from '@/components/common/button/Button';

import ManualMetricsModal from './ManualMetricsModal';
import styles from './profileHeader.module.scss';

const EXTERNAL_LINKS = [
  { name: '일로아', urlPrefix: 'https://iloa.gg/character/' },
  { name: '로펙', urlPrefix: 'https://lopec.kr/character/specPoint/' },
  { name: '로아랩', urlPrefix: 'https://lo4.app/characters?name=' },
] as const;

export default function ProfileHeader(props: {
  profiles: TResLostarkMainCharacter['summary']['profiles'];
  isRefreshing: boolean;
  isSaving: boolean;
  isSaveDisabled: boolean;
  onRefresh: () => void;
  onSave: () => void;
  manualMetrics: TLostarkManualMetrics;
  onChangeManualMetrics: (manualMetrics: TLostarkManualMetrics) => void;
}) {
  const [isManualMetricsModalOpen, setIsManualMetricsModalOpen] = useState(false);
  const { profiles, isRefreshing, isSaving, isSaveDisabled, onRefresh, onSave, manualMetrics } =
    props;
  const isDirectInputDisabled = isRefreshing || isSaving;

  return (
    <section className={styles['profile-header']}>
      <div className={styles['profile-image']} aria-hidden="true">
        {profiles.characterImage && <img src={profiles.characterImage} alt="" />}
      </div>

      <div className={styles['profile-info']}>
        <ProfileToolbar
          isRefreshing={isRefreshing}
          isSaving={isSaving}
          isSaveDisabled={isSaveDisabled}
          isDirectInputDisabled={isDirectInputDisabled}
          onRefresh={onRefresh}
          onSave={onSave}
          onOpenManualMetrics={() => setIsManualMetricsModalOpen(true)}
        />

        <div className={styles['profile-content']}>
          <PrimaryInfo profiles={profiles} manualMetrics={manualMetrics} />
          <SupportInfo manualMetrics={manualMetrics} />
        </div>
      </div>

      {isManualMetricsModalOpen && (
        <ManualMetricsModal
          manualMetrics={manualMetrics}
          onClose={() => setIsManualMetricsModalOpen(false)}
          onApply={props.onChangeManualMetrics}
        />
      )}
    </section>
  );
}

function ProfileToolbar(props: {
  isRefreshing: boolean;
  isSaving: boolean;
  isSaveDisabled: boolean;
  isDirectInputDisabled: boolean;
  onRefresh: () => void;
  onSave: () => void;
  onOpenManualMetrics: () => void;
}) {
  return (
    <div className={styles['profile-toolbar']}>
      <div className={styles['actions-box']}>
        <Button
          color="gray"
          fill="solid"
          isDisabled={props.isDirectInputDisabled}
          onClick={props.onOpenManualMetrics}
        >
          직접입력
        </Button>
        <Button
          color="gray"
          fill="solid"
          isLoading={props.isRefreshing}
          isDisabled={props.isSaving}
          onClick={props.onRefresh}
        >
          갱신
        </Button>
        <Button
          color="mint"
          fill="solid"
          isLoading={props.isSaving}
          isDisabled={props.isRefreshing || props.isSaveDisabled}
          onClick={props.onSave}
        >
          저장
        </Button>
      </div>
    </div>
  );
}

function PrimaryInfo(props: {
  profiles: TResLostarkMainCharacter['summary']['profiles'];
  manualMetrics: TLostarkManualMetrics;
}) {
  const { profiles, manualMetrics } = props;

  const encodedCharacterName = encodeURIComponent(profiles.characterName ?? '');

  return (
    <div className={styles['primary-info']}>
      <p className={styles['profile-class-name']}>{profiles.characterClassName ?? '-'}</p>
      <h2 className={styles['profile-name']}>{profiles.characterName ?? '-'}</h2>

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
          <strong className={styles['metric-value']}>{profiles.itemAvgLevel ?? '-'}</strong>
        </div>
        <div className={`${styles['metric-item']} ${styles['tone-rose']}`}>
          <span className={styles['metric-label']}>전투력</span>
          <strong className={styles['metric-value']}>{profiles.combatPower ?? '-'}</strong>
        </div>
        <div className={styles['metric-item']}>
          <span className={styles['metric-label']}>로펙 점수</span>
          <strong className={styles['metric-value']}>
            {formatMetric(manualMetrics.lopecScore)}
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
