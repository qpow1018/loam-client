import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import Button from '@/components/common/button/Button';

import styles from './profileHeader.module.scss';

// TODO
const PREVIEW_STATS = [
  { label: '치명타 확률', value: '82.4%' },
  { label: '로펙 점수', value: '2,450.32' },
  { label: '팔찌', value: '12.38%' },
  { label: '로아랩 잼 환산 Lv', value: '102.92' },
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

  const characterName = profiles.characterName ?? '';
  const encodedCharacterName = encodeURIComponent(characterName);

  return (
    <section className={styles['profile-header']}>
      <div className={styles['profile-image']} aria-hidden="true">
        {profiles.characterImage && <img src={profiles.characterImage} alt="" />}
      </div>

      <div className={styles['profile-info']}>
        <div className={styles['profile-tags']}>
          <span>{profiles.characterClassName ?? '-'}</span>
        </div>

        <h1>{profiles.characterName ?? '-'}</h1>

        <div className={styles['headline-stats']}>
          <Stat label="아이템 레벨" value={profiles.itemAvgLevel ?? '-'} />
          <Stat label="전투력" value={profiles.combatPower ?? '-'} isHighlighted />
          {PREVIEW_STATS.map((stat) => (
            <Stat key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
      </div>

      <div className={styles['profile-actions']}>
        {characterName && (
          <div className={styles['external-links']}>
            <ProfileLink
              name="로펙"
              href={`https://lopec.kr/character/specPoint/${encodedCharacterName}`}
            />
            <ProfileLink name="일로아" href={`https://iloa.gg/character/${encodedCharacterName}`} />
            <ProfileLink
              name="로아랩"
              href={`https://lo4.app/characters?name=${encodedCharacterName}`}
            />
          </div>
        )}
        <div className={styles['test-actions']}>
          <Button
            color="gray"
            fill="solid"
            size="small"
            isLoading={isRefreshing}
            isDisabled={isSaving}
            // onClick={onRefresh}
          >
            직접입력
          </Button>
          <Button
            color="gray"
            fill="solid"
            size="small"
            isLoading={isRefreshing}
            isDisabled={isSaving}
            onClick={onRefresh}
          >
            테스트 갱신
          </Button>
          <Button
            color="rose"
            fill="solid"
            size="small"
            isLoading={isSaving}
            isDisabled={isRefreshing || isSaveDisabled}
            onClick={onSave}
          >
            테스트 저장
          </Button>
        </div>
      </div>
    </section>
  );
}

function Stat(props: { label: string; value: string; isHighlighted?: boolean }) {
  return (
    <div
      className={`${styles['stat-item']} ${props.isHighlighted ? styles['is-highlighted'] : ''}`}
    >
      <span className={styles['stat-label']}>{props.label}</span>
      <strong className={styles['stat-value']}>{props.value}</strong>
    </div>
  );
}

function ProfileLink(props: { name: string; href: string }) {
  return (
    <a href={props.href} target="_blank" rel="noreferrer">
      {props.name}
    </a>
  );
}
