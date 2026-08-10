import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import Button from '@/components/common/button/Button';

import styles from './profileHeader.module.scss';

// TODO
const SETTING_METRICS = [
  { label: '팔찌', value: '12.38%' },
  { label: '젬 환산', value: 'Lv. 102.92' },
] as const;

const LOPEC_SCORE = '2,450.32';

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
}) {
  const { profiles, isRefreshing, isSaving, isSaveDisabled, onRefresh, onSave } = props;

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
          onRefresh={onRefresh}
          onSave={onSave}
        />

        <div className={styles['profile-content']}>
          <PrimaryInfo profiles={profiles} />
          <SupportInfo />
        </div>
      </div>
    </section>
  );
}

function ProfileToolbar(props: {
  isRefreshing: boolean;
  isSaving: boolean;
  isSaveDisabled: boolean;
  onRefresh: () => void;
  onSave: () => void;
}) {
  return (
    <div className={styles['profile-toolbar']}>
      <div className={styles['actions-box']}>
        <Button
          color="gray"
          fill="solid"
          isLoading={props.isRefreshing}
          isDisabled={props.isSaving}
          // onClick={props.onRefresh}
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

function PrimaryInfo(props: { profiles: TResLostarkMainCharacter['summary']['profiles'] }) {
  const { profiles } = props;

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
        <div className={`${styles['metric-item']} ${styles['tone-mint']}`}>
          <span className={styles['metric-label']}>전투력</span>
          <strong className={styles['metric-value']}>{profiles.combatPower ?? '-'}</strong>
        </div>
        <div className={styles['metric-item']}>
          <span className={styles['metric-label']}>로펙 점수</span>
          <strong className={styles['metric-value']}>{LOPEC_SCORE}</strong>
        </div>
      </div>
    </div>
  );
}

function SupportInfo() {
  return (
    <div className={styles['support-info']}>
      <div className={styles['setting-metrics']}>
        {SETTING_METRICS.map((metric) => (
          <div key={metric.label} className={styles['setting-metric']}>
            <span className={styles['label']}>{metric.label}</span>
            <span className={styles['value']}>{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
