import type { TLostarkLegendaryAvatar } from '@/api/lostark/type';

import styles from './legendaryAvatarSection.module.scss';

const AVATAR_PARTS = ['머리', '상의', '하의', '무기'] as const;

export default function LegendaryAvatarSection(props: { avatars: TLostarkLegendaryAvatar[] }) {
  function findAvatarByPart(part: (typeof AVATAR_PARTS)[number]) {
    return props.avatars.find((avatar) => avatar.type?.includes(part));
  }

  return (
    <section className={styles['legendary-avatar-section']}>
      <h3 className={styles['title']}>전설 아바타</h3>

      <div className={styles['avatar-list']}>
        {AVATAR_PARTS.map((part) => {
          const avatar = findAvatarByPart(part);

          return (
            <div key={part} className={styles['avatar-item']}>
              <span className={styles['part']}>{part}</span>
              <p className={`${styles['name']} ${avatar ? '' : styles['empty']}`}>
                {avatar?.name ?? '없음'}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
