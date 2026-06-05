import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import Button from '@/components/common/button/Button';
import EquipmentSection from './section/EquipmentSection';
import ExtraEquipmentSection from './section/ExtraEquipmentSection';

import ArkGridSection from './section/ArkGridSection';
import ArkPassiveSection from './section/ArkPassiveSection';
import EngravingSection from './section/EngravingSection';
import GemSection from './section/GemSection';

import styles from './mainCharacterCard.module.scss';

export default function MainCharacterCard(props: {
  summary: TResLostarkCharacterSummary;
  isRefreshing?: boolean;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  onRefresh: () => void;
  onSave: () => void;
}) {
  const { summary } = props;
  const { profiles, equipment } = summary;

  return (
    <div className={styles['main-character-card']}>
      <div className={styles['card-header']}>
        <div className={styles['character-info']}>
          <div className={styles['label-line']}>
            <span>{profiles.characterClassName ?? '-'}</span>
            <span>레벨</span>
            <span>전투력</span>
          </div>
          <div className={styles['value-line']}>
            <p className={styles['nickname']}>{profiles.characterName ?? '-'}</p>
            <p className={styles['item-level']}>{profiles.itemAvgLevel ?? '-'}</p>
            <p className={styles['combat-power']}>{profiles.combatPower ?? '-'}</p>
          </div>
        </div>

        <div className={styles['actions']}>
          <Button
            theme="bg-gray600"
            size="small"
            isLoading={props.isRefreshing}
            isDisabled={props.isSaving}
            onClick={props.onRefresh}
          >
            갱신
          </Button>
          <Button
            theme="bg-pri"
            size="small"
            isLoading={props.isSaving}
            isDisabled={props.isRefreshing || !props.hasUnsavedChanges}
            onClick={props.onSave}
          >
            저장
          </Button>
        </div>
      </div>

      <div className={styles['card-content']}>
        <div className={styles['profile-image']}>
          {profiles.characterImage && <img src={profiles.characterImage} alt="" />}
        </div>

        <div className={styles['content-box']}>
          <EquipmentSection gears={equipment.gears} accessories={equipment.accessories} />
          <ExtraEquipmentSection
            abilityStone={equipment.abilityStone}
            bracelet={equipment.bracelet}
          />

          {/* <ArkPassiveSection arkPassive={summary.arkPassive} />
          <ArkGridSection arkGrid={summary.arkGrid} />
          <EngravingSection engravings={summary.engravings} />
          <GemSection gems={summary.gems} /> */}
        </div>
      </div>
    </div>
  );
}
