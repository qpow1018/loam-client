import type {
  TLostarkAccessory,
  TLostarkAbilityStone,
  TLostarkBracelet,
  TLostarkGear,
} from '@/api/lostark/type';

import styles from './equipmentSection.module.scss';

type TEquipmentItem =
  | TLostarkGear
  | TLostarkAccessory
  | TLostarkBracelet
  | TLostarkAbilityStone;

export default function EquipmentSection(props: {
  gears: TLostarkGear[];
  accessories: TLostarkAccessory[];
  bracelet: TLostarkBracelet | null;
  abilityStone: TLostarkAbilityStone | null;
}) {
  const { gears, accessories, bracelet, abilityStone } = props;

  const specialItems = [bracelet, abilityStone].filter(
    (item): item is TLostarkBracelet | TLostarkAbilityStone => item !== null,
  );

  return (
    <section className={styles['equipment-section']}>
      <div className={styles['section-header']}>
        <h3 className={styles['title']}>장비</h3>
      </div>

      <div className={styles['equipment-groups']}>
        <GearGroup gears={gears} />
        <AccessoryGroup accessories={accessories} />
        <EquipmentGroup title="특수 장비" items={specialItems} />
      </div>
    </section>
  );
}

function GearGroup(props: { gears: TLostarkGear[] }) {
  return (
    <div className={styles['equipment-group']}>
      <p className={styles['group-title']}>장비</p>

      {props.gears.length > 0 ? (
        <div className={styles['gear-grid']}>
          {props.gears.map((gear, index) => (
            <GearItem key={`${gear.type ?? 'gear'}-${gear.name ?? index}`} gear={gear} />
          ))}
        </div>
      ) : (
        <p className={styles['empty']}>정보 없음</p>
      )}
    </div>
  );
}

function GearItem(props: { gear: TLostarkGear }) {
  const { gear } = props;

  return (
    <div className={styles['gear-item']}>
      <div className={styles['gear-icon']}>
        {gear.enhancement !== null && (
          <span className={styles['enhancement']}>{gear.enhancement}강</span>
        )}
        {gear.icon && <img src={gear.icon} alt="" />}
        {gear.quality !== null && <span className={styles['quality']}>{gear.quality}</span>}
      </div>

      <div className={styles['gear-tooltip']}>
        <div className={styles['item-title-line']}>
          <span className={styles['item-type']}>{gear.type ?? '-'}</span>
          {gear.grade && <span className={styles['grade']}>{gear.grade}</span>}
        </div>
        <p className={styles['item-name']}>{gear.name ?? '-'}</p>
        <div className={styles['item-meta']}>
          {gear.itemLevel && <span>Lv. {gear.itemLevel}</span>}
          {gear.quality !== null && <span>품질 {gear.quality}</span>}
        </div>
      </div>
    </div>
  );
}

function AccessoryGroup(props: { accessories: TLostarkAccessory[] }) {
  return (
    <div className={styles['equipment-group']}>
      <p className={styles['group-title']}>장신구</p>

      {props.accessories.length > 0 ? (
        <div className={styles['accessory-list']}>
          {props.accessories.map((accessory, index) => (
            <AccessoryItem
              key={`${accessory.type ?? 'accessory'}-${accessory.name ?? index}`}
              accessory={accessory}
            />
          ))}
        </div>
      ) : (
        <p className={styles['empty']}>정보 없음</p>
      )}
    </div>
  );
}

function AccessoryItem(props: { accessory: TLostarkAccessory }) {
  const { accessory } = props;

  return (
    <div className={styles['accessory-item']}>
      <div className={styles['accessory-icon']}>
        {accessory.icon && <img src={accessory.icon} alt="" />}
        {accessory.quality !== null && (
          <span className={styles['quality']}>{accessory.quality}</span>
        )}
      </div>

      <div className={styles['accessory-info']}>
        <div className={styles['item-title-line']}>
          <span className={styles['item-type']}>{accessory.type ?? '-'}</span>
          {accessory.grade && <span className={styles['grade']}>{accessory.grade}</span>}
        </div>

        <EffectList title="연마 효과" effects={accessory.polishEffects} />
        <BasicEffectList effects={accessory.basicEffects} />
      </div>
    </div>
  );
}

function EffectList(props: { title: string; effects: { text: string; color: string | null }[] }) {
  if (props.effects.length === 0) {
    return null;
  }

  return (
    <div className={styles['effect-group']}>
      <span className={styles['effect-title']}>{props.title}</span>
      <div className={styles['effect-list']}>
        {props.effects.map((effect, index) => (
          <span
            key={`${effect.text}-${index}`}
            className={styles['effect']}
            style={effect.color ? { color: effect.color } : undefined}
          >
            {effect.text}
          </span>
        ))}
      </div>
    </div>
  );
}

function BasicEffectList(props: { effects: string[] }) {
  if (props.effects.length === 0) {
    return null;
  }

  return (
    <div className={styles['basic-effect-list']}>
      {props.effects.map((effect, index) => (
        <span key={`${effect}-${index}`} className={styles['basic-effect']}>
          {effect}
        </span>
      ))}
    </div>
  );
}

function EquipmentGroup(props: { title: string; items: TEquipmentItem[] }) {
  return (
    <div className={styles['equipment-group']}>
      <p className={styles['group-title']}>{props.title}</p>

      {props.items.length > 0 ? (
        <div className={styles['item-list']}>
          {props.items.map((item, index) => (
            <EquipmentItem key={`${item.type ?? props.title}-${item.name ?? index}`} item={item} />
          ))}
        </div>
      ) : (
        <p className={styles['empty']}>정보 없음</p>
      )}
    </div>
  );
}

function EquipmentItem(props: { item: TEquipmentItem }) {
  const { item } = props;

  return (
    <div className={styles['equipment-item']}>
      <div className={styles['icon']}>{item.icon && <img src={item.icon} alt="" />}</div>

      <div className={styles['item-info']}>
        <div className={styles['item-title-line']}>
          <span className={styles['item-type']}>{item.type ?? '-'}</span>
          {item.grade && <span className={styles['grade']}>{item.grade}</span>}
        </div>

        <p className={styles['item-name']}>{item.name ?? '-'}</p>

        <div className={styles['item-meta']}>
          {isGearItem(item) && item.itemLevel && <span>Lv. {item.itemLevel}</span>}
          {hasQuality(item) && item.quality !== null && <span>품질 {item.quality}</span>}
        </div>
      </div>
    </div>
  );
}

function isGearItem(item: TEquipmentItem): item is TLostarkGear {
  return 'itemLevel' in item;
}

function hasQuality(item: TEquipmentItem): item is TLostarkGear | TLostarkAccessory {
  return 'quality' in item;
}
