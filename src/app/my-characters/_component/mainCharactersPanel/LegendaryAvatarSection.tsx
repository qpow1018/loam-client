import type { TLostarkLegendaryAvatar } from '@/api/lostark/type';

import styles from './legendaryAvatarSection.module.scss';

export default function LegendaryAvatarSection(props: {
  legendaryAvatars: TLostarkLegendaryAvatar[];
}) {
  return (
    <section className={styles['legendary-avatar-section']}>
      <div className={styles['section-header']}>
        <h3 className={styles['title']}>전설 아바타</h3>
        <span className={styles['count']}>{props.legendaryAvatars.length}개</span>
      </div>

      {props.legendaryAvatars.length > 0 ? (
        <div className={styles['avatar-list']}>
          {props.legendaryAvatars.map((avatar, index) => (
            <div key={`${avatar.type ?? 'avatar'}-${avatar.name ?? index}`} className={styles['avatar-item']}>
              <div className={styles['avatar-icon']}>
                {avatar.icon && <img src={avatar.icon} alt="" />}
              </div>

              <div className={styles['avatar-info']}>
                <div className={styles['type-line']}>
                  <span className={styles['type']}>{avatar.type ?? '-'}</span>
                  {avatar.grade && <span className={styles['grade']}>{avatar.grade}</span>}
                </div>
                <p className={styles['name']}>{avatar.name ?? '-'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles['empty']}>정보 없음</p>
      )}
    </section>
  );
}
