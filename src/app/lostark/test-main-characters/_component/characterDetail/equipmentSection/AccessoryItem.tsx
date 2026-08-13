import type { TLostarkAccessory } from '@/api/lostark/type';

import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';
import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';
import EffectItem from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/EffectItem';

import EquipmentTooltip from './EquipmentTooltip';

import styles from './accessoryItem.module.scss';

export default function AccessoryItem(props: { accessory: TLostarkAccessory }) {
  const { accessory } = props;

  return (
    <div className={styles['accessory-item']}>
      <ItemTooltipTrigger>
        <ItemSlot imageUrl={accessory.icon} grade={accessory.grade} />
        <ItemTooltip>
          <EquipmentTooltip
            name={accessory.name}
            grade={accessory.grade}
            details={[
              { label: '상세 이름', value: accessory.title },
              { label: '종류', value: accessory.type },
              { label: '티어', value: accessory.tier },
              { label: '품질', value: accessory.quality },
            ]}
            effectGroups={[
              {
                label: '기본 효과',
                effects: accessory.basicEffects.map((text) => ({ text, color: null })),
              },
              {
                label: '추가 효과',
                effects: accessory.additionalEffects.map((text) => ({ text, color: null })),
              },
              { label: '연마 효과', effects: accessory.polishEffects },
              {
                label: '아크 패시브 효과',
                effects: accessory.arkPassiveEffects.map((text) => ({ text, color: null })),
              },
            ]}
          />
        </ItemTooltip>
      </ItemTooltipTrigger>

      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <p className={styles['item-name']}>{accessory.type ?? '-'}</p>
        </div>
        <QualityChip quality={accessory.quality} />
      </div>

      <div className={styles['effect-list']}>
        {accessory.polishEffects.map((effect, index) => (
          <EffectItem key={`${effect.text}-${index}`} effect={effect} />
        ))}
      </div>
    </div>
  );
}
