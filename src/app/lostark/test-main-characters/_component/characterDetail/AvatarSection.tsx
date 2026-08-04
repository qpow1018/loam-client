import type { TLostarkAvatar } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';

import DetailSection from './DetailSection';

import styles from './avatarSection.module.scss';

export default function AvatarSection(props: { avatars: TLostarkAvatar[]; className?: string }) {
  return (
    <DetailSection title="아바타" className={props.className}>
      {props.avatars.length === 0 && <p className={styles['empty']}>아바타 정보가 없습니다.</p>}

      {props.avatars.length > 0 && (
        <div className={styles['avatar-list']}>
          {props.avatars.map((avatar, index) => (
            <div key={`${avatar.type}-${index}`} className={styles['avatar-item']}>
              <ItemSlot imageUrl={avatar.icon} grade={avatar.grade} size={40} />
              <div>
                <strong>{avatar.type ?? '-'}</strong>
                <span>{avatar.name ?? '-'}</span>
              </div>
              {avatar.isSet && <em>세트</em>}
            </div>
          ))}
        </div>
      )}
    </DetailSection>
  );
}
