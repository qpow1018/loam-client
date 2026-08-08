import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import styles from './profileHeader.module.scss';

export default function ProfileHeader(props: {
  profiles: TResLostarkMainCharacter['summary']['profiles'];
}) {
  const { profiles } = props;

  return (
    <section className={styles['profile-header']}>
      <div className={styles['profile-copy']}>
        <div className={styles['profile-tags']}>
          <span>{profiles.serverName ?? '-'}</span>
          <span>{profiles.characterClassName ?? '-'}</span>
        </div>

        <h1>{profiles.characterName ?? '-'}</h1>

        <div className={styles['headline-stats']}>
          <Stat label="아이템 레벨" value={profiles.itemAvgLevel ?? '-'} />
          <Stat label="전투력" value={profiles.combatPower ?? '-'} />
        </div>
      </div>

      <div className={styles['profile-image']}>
        {profiles.characterImage && <img src={profiles.characterImage} alt="" />}
      </div>
    </section>
  );
}

function Stat(props: { label: string; value: string }) {
  return (
    <div>
      <span>{props.label}</span>
      <strong>{props.value}</strong>
    </div>
  );
}
