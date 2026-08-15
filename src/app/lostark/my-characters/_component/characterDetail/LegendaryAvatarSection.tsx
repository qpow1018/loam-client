import type { TLostarkLegendaryAvatar } from '@/api/lostark/type';

import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';
import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';

import DetailPanel from './DetailPanel';

import styles from './legendaryAvatarSection.module.scss';

const AVATAR_PARTS = ['머리', '상의', '하의', '무기'] as const;

export default function LegendaryAvatarSection(props: { avatars: TLostarkLegendaryAvatar[] }) {
  const { avatars } = props;

  return (
    <DetailPanel title="전설 아바타">
      <div className={styles['legendary-avatar-section']}>
        {AVATAR_PARTS.map((part) => {
          const avatar = avatars.find((item) => item.type?.includes(part));

          return <LegendaryAvatarItem key={part} part={part} avatar={avatar} />;
        })}
      </div>
    </DetailPanel>
  );
}

function LegendaryAvatarItem(props: {
  part: (typeof AVATAR_PARTS)[number];
  avatar: TLostarkLegendaryAvatar | undefined;
}) {
  const { part, avatar } = props;

  return (
    <div className={styles['avatar-item']}>
      {avatar ? (
        <ItemTooltipTrigger>
          <ItemSlot imageUrl={avatar.icon} grade={avatar.grade} size={36} />
          <ItemTooltip>TODO</ItemTooltip>
        </ItemTooltipTrigger>
      ) : (
        <ItemSlot imageUrl={null} size={36} />
      )}
      <span className={styles['part']}>{part}</span>
      <p className={`${styles['name']} ${avatar ? '' : styles['empty']}`}>
        {avatar?.name ?? '없음'}
      </p>
    </div>
  );
}
