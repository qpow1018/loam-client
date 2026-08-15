import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import SummarySection from '@/app/lostark/my-characters/_component/characterSummaryList/SummarySection';

import styles from './legendaryAvatarSummarySection.module.scss';

const AVATAR_PARTS = ['머리', '상의', '하의', '무기'] as const;

export default function LegendaryAvatarSummarySection(props: {
  avatars: TResLostarkCharacterSummary['legendaryAvatars'];
}) {
  const { avatars } = props;

  function hasAvatar(part: (typeof AVATAR_PARTS)[number]) {
    return avatars.some((avatar) => avatar.type?.includes(part));
  }

  return (
    <SummarySection title="전설 아바타">
      <div className={styles['avatar-summary']}>
        <div className={styles['avatar-list']}>
          {AVATAR_PARTS.map((part) => (
            <span
              key={part}
              className={`
                ${styles['avatar-item']}
                ${hasAvatar(part) ? styles['avatar-equipped'] : styles['avatar-empty']}
              `}
            >
              {part}
            </span>
          ))}
        </div>

        <div className={styles['avatar-count-box']}>
          갯수 <span className={styles['avatar-count']}>{`${avatars.length} / 4`}</span>
        </div>
      </div>
    </SummarySection>
  );
}
