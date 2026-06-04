import type {
  TLostarkAccessory,
  TLostarkAbilityStone,
  TLostarkBracelet,
  TLostarkGear,
} from '@/api/lostark/type';
import { getEquipQualityBackground } from '@/utils/lostark';

import styles from './equipmentSection.module.scss';

export default function EquipmentSection(props: {
  gears: TLostarkGear[];
  accessories: TLostarkAccessory[];
  bracelet: TLostarkBracelet | null;
  abilityStone: TLostarkAbilityStone | null;
}) {
  const { gears, accessories, bracelet, abilityStone } = props;

  return (
    <section className={styles['equipment-section']}>
      <div className={styles['equipment-layout']}>
        <div className={styles['equipment-row']}>
          <GearGroup gears={gears} />
          <AbilityStoneGroup abilityStone={abilityStone} />
        </div>

        {/* <div className={styles['equipment-row']}>
          <AccessoryGroup accessories={accessories} />
          <EquipmentSingleGroup title="팔찌" item={bracelet} />
        </div> */}
      </div>
    </section>
  );
}

function GearGroup(props: { gears: TLostarkGear[] }) {
  return (
    <div className={styles['gear-group']}>
      <p className={styles['group-title']}>장비</p>

      <div className={styles['gear-list']}>
        {props.gears.map((gear, index) => {
          return (
            <div key={index} className={styles['gear-item']}>
              <div className={styles['gear-icon']}>
                <img src={gear.icon || ''} alt="" />
                {gear.quality !== null && (
                  <span
                    className={styles['quality']}
                    style={{
                      backgroundColor: getEquipQualityBackground(gear.quality),
                    }}
                  >
                    {gear.quality}
                  </span>
                )}
              </div>

              <p className={styles['enhancement']}>
                {gear.type ?? '-'} {gear.enhancement !== null ? `+${gear.enhancement}` : '-'}
              </p>

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
        })}
      </div>
    </div>
  );
}

function AbilityStoneGroup(props: { abilityStone: TLostarkAbilityStone | null }) {
  const { abilityStone } = props;

  const positiveLevelSum =
    abilityStone?.abilityStoneEngravings
      .slice(0, 2)
      .reduce((sum, engraving) => sum + (engraving.level ?? 0), 0) ?? 0;
  const isNineSevenStone = positiveLevelSum >= 5;

  if (!abilityStone) {
    return null;
  }

  return (
    <div className={styles['ability-stone-group']}>
      <p className={styles['group-title']}>어빌리티 스톤</p>

      <div className={styles['ability-stone-summary']}>
        <div className={styles['ability-stone-icon']}>
          {abilityStone.icon && <img src={abilityStone.icon} alt="" />}
          {isNineSevenStone && <span className={styles['nine-seven-badge']}>97돌</span>}
        </div>

        {abilityStone.abilityStoneEngravings.length > 0 && (
          <div className={styles['stone-engraving-list']}>
            {abilityStone.abilityStoneEngravings.map((engraving, index) => (
              <div
                key={`${engraving.name}-${index}`}
                className={`${styles['stone-engraving']} ${
                  index >= 2 ? styles['stone-engraving--negative'] : ''
                }`}
              >
                <span className={styles['stone-engraving-level']}>
                  {engraving.level !== null ? `+${engraving.level}` : '-'}
                </span>
                <span className={styles['stone-engraving-name']}>{engraving.name}</span>
              </div>
            ))}
          </div>
        )}
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
