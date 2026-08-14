import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import styles from './settingSummary.module.scss';

const AVATAR_PARTS = ['머리', '상의', '하의', '무기'] as const;

export default function LegendaryAvatarSummarySection(props: {
  avatars: TResLostarkCharacterSummary['legendaryAvatars'];
}) {
  const avatarCount = props.avatars.filter((avatar) =>
    AVATAR_PARTS.some((part) => avatar.type?.includes(part)),
  ).length;

  return (
    <div className={styles['avatar-list']}>
      {AVATAR_PARTS.map((part) => (
        <span
          key={part}
          className={
            props.avatars.some((avatar) => avatar.type?.includes(part))
              ? styles['avatar-equipped']
              : styles['avatar-empty']
          }
        >
          {part}
        </span>
      ))}
      <b>{`${avatarCount} / 4`}</b>
    </div>
  );
}
