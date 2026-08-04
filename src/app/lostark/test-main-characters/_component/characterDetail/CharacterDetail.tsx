import type { TResLostarkMainCharacter } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';

import styles from './characterDetail.module.scss';

export default function CharacterDetail(props: {
  selectedCharacter: TResLostarkMainCharacter;
}) {
  const { summary } = props.selectedCharacter;
  const { profiles, equipment } = summary;

  return (
    <div className={styles['character-detail']}>
      <section className={styles['profile-header']}>
        <div className={styles['profile-image']}>
          {profiles.characterImage && <img src={profiles.characterImage} alt="" />}
        </div>
        <div className={styles['profile-copy']}>
          <p>{`${profiles.serverName ?? '-'} · ${profiles.characterClassName ?? '-'}`}</p>
          <h1>{profiles.characterName ?? '-'}</h1>
          <div className={styles['headline-stats']}>
            <Stat label="아이템 레벨" value={profiles.itemAvgLevel ?? '-'} />
            <Stat label="전투력" value={profiles.combatPower ?? '-'} />
          </div>
        </div>
      </section>

      <div className={styles['detail-grid']}>
        <Section title="장비와 악세서리" className={styles['equipment-section']}>
          <div className={styles['equipment-list']}>
            {[...equipment.gears, ...equipment.accessories].map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className={styles['item-row']}
                title={item.name ?? ''}
              >
                <ItemSlot imageUrl={item.icon} grade={item.grade} size={42} />
                <div>
                  <strong>{item.type ?? '-'}</strong>
                  <span>{('itemLevel' in item ? item.itemLevel : null) ?? item.name ?? '-'}</span>
                </div>
                <QualityChip quality={item.quality} />
              </div>
            ))}
          </div>
          <div className={styles['extra-list']}>
            <ExtraItem
              title="어빌리티 스톤"
              item={equipment.abilityStone}
              effects={equipment.abilityStone?.abilityStoneBonusEffects ?? []}
            />
            <ExtraItem
              title="팔찌"
              item={equipment.bracelet}
              effects={equipment.bracelet?.braceletEffects.map((effect) => effect.text) ?? []}
            />
          </div>
          <div className={styles['effect-summary']}>
            {equipment.accessories.map((accessory, index) => (
              <span
                key={`${accessory.type}-${index}`}
                title={accessory.polishEffects.map((effect) => effect.text).join('\n')}
              >
                <strong>{accessory.type ?? '악세서리'}</strong>
                {accessory.polishEffects[0]?.text ?? accessory.basicEffects[0] ?? '-'}
              </span>
            ))}
          </div>
          <div className={styles['avatar-list']}>
            <p>전설 아바타</p>
            {summary.legendaryAvatars.length === 0 && <span>장착한 전설 아바타가 없습니다.</span>}
            {summary.legendaryAvatars.map((avatar, index) => (
              <div key={`${avatar.type}-${index}`} title={avatar.name ?? ''}>
                <ItemSlot imageUrl={avatar.icon} grade={avatar.grade} size={34} />
                <span>{avatar.type ?? '-'}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="특성 · 각인 · 아크 패시브" className={styles['build-section']}>
          <div className={styles['engraving-list']}>
            {summary.engravings.map((engraving, index) => (
              <span key={`${engraving.name}-${index}`} title={engraving.description ?? ''}>
                {engraving.name ?? '-'} <strong>&times;{engraving.level ?? 0}</strong>
              </span>
            ))}
          </div>
          <div className={styles['ark-points']}>
            {summary.arkPassive.points.map((point, index) => (
              <span key={`${point.name}-${index}`} title={point.description ?? ''}>
                {point.name ?? '-'} <strong>{point.value ?? 0}P</strong>
              </span>
            ))}
          </div>
        </Section>

        <Section title="보석" className={styles['gems-section']}>
          <div className={styles['gem-list']}>
            {summary.gems.map((gem, index) => (
              <div
                key={`${gem.slot}-${index}`}
                className={styles['gem-item']}
                title={[gem.skillName, ...gem.effects, gem.bonusEffect].filter(Boolean).join('\n')}
              >
                <ItemSlot imageUrl={gem.icon} grade={gem.grade} size={42} />
                <span>{`${gem.level ?? '-'} ${gem.kind ?? ''}`}</span>
                <small>{gem.skillName ?? '-'}</small>
              </div>
            ))}
          </div>
        </Section>

        <Section title="아크 그리드" className={styles['grid-section']}>
          <div className={styles['core-list']}>
            {summary.arkGrid.cores.map((core, index) => (
              <div key={`${core.name}-${index}`}>
                <ItemSlot imageUrl={core.icon} grade={core.grade} size={36} />
                <span>{core.name?.split(':').at(-1)?.trim() ?? '-'}</span>
                <strong>{core.point ?? 0}P</strong>
              </div>
            ))}
          </div>
          <div className={styles['effect-list']}>
            {summary.arkGrid.effects.map((effect, index) => (
              <span key={`${effect.name}-${index}`}>
                {effect.name ?? '-'} <strong>Lv. {effect.level ?? 0}</strong>
              </span>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section(props: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`${styles['section']} ${props.className ?? ''}`}>
      <h2>{props.title}</h2>
      {props.children}
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
function ExtraItem(props: {
  title: string;
  item: { icon: string | null; grade: string | null; name: string | null } | null;
  effects: string[];
}) {
  if (!props.item) return null;
  return (
    <div className={styles['extra-item']} title={props.effects.join('\n')}>
      <ItemSlot imageUrl={props.item.icon} grade={props.item.grade} size={38} />
      <span>{props.title}</span>
      <small>{props.item.name ?? '-'}</small>
    </div>
  );
}
