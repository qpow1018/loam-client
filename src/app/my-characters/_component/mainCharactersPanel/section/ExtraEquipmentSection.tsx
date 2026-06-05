import type { TLostarkBracelet, TLostarkLegendaryAvatar } from '@/api/lostark/type';

import EffectList from './EffectList';
import styles from './extraEquipmentSection.module.scss';

export default function ExtraEquipmentSection(props: {
  bracelet: TLostarkBracelet | null;
  legendaryAvatars: TLostarkLegendaryAvatar[];
}) {
  return (
    <section className={styles['extra-equipment-section']}>
      <BraceletGroup bracelet={props.bracelet} />
      <LegendaryAvatarGroup legendaryAvatars={props.legendaryAvatars} />
    </section>
  );
}

function BraceletGroup(props: { bracelet: TLostarkBracelet | null }) {
  const { bracelet } = props;

  if (!bracelet) {
    return (
      <div className={styles['bracelet-group']}>
        <p className={styles['empty']}>팔찌 정보 없음</p>
      </div>
    );
  }

  return (
    <div className={styles['bracelet-group']}>
      <div className={styles['bracelet-item']}>
        <div className={styles['bracelet-image']}>
          {bracelet.icon && <img src={bracelet.icon} alt="" />}
        </div>

        <div className={styles['bracelet-info']}>
          <div className={styles['item-title-line']}>
            <span className={styles['item-type']}>{bracelet.type ?? '팔찌'}</span>
            {bracelet.grade && <span className={styles['grade']}>{bracelet.grade}</span>}
          </div>

          <EffectList title="팔찌 효과" effects={bracelet.braceletEffects} />
        </div>
      </div>
    </div>
  );
}

function LegendaryAvatarGroup(props: { legendaryAvatars: TLostarkLegendaryAvatar[] }) {
  return (
    <div className={styles['legendary-avatar-group']}>
      {props.legendaryAvatars.length > 0 ? (
        props.legendaryAvatars.map((avatar, index) => (
          <div
            key={`${avatar.type ?? 'avatar'}-${avatar.name ?? 'item'}-${index}`}
            className={styles['legendary-avatar-item']}
          >
            <div className={styles['legendary-avatar-image']}>
              {avatar.icon && <img src={avatar.icon} alt="" />}
            </div>

            <div className={styles['legendary-avatar-info']}>
              <div className={styles['item-title-line']}>
                <span className={styles['item-type']}>{avatar.type ?? '-'}</span>
                {avatar.grade && <span className={styles['grade']}>{avatar.grade}</span>}
              </div>
              <p className={styles['item-name']}>{avatar.name ?? '-'}</p>
            </div>
          </div>
        ))
      ) : (
        <p className={styles['empty']}>전설 아바타 정보 없음</p>
      )}
    </div>
  );
}
