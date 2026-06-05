import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import Button from '@/components/common/button/Button';

import EngravingSection from './section/EngravingSection';

import EquipmentSection from './section/EquipmentSection';
import ExtraEquipmentSection from './section/ExtraEquipmentSection';
import GemSection from './section/GemSection';
import ArkPassiveSection from './section/ArkPassiveSection';
import ArkGridSection from './section/ArkGridSection';
import ProfileImageSection from './section/ProfileImageSection';

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
        <div className={styles['left-box']}>
          <ProfileImageSection imageUrl={profiles.characterImage} />
          <EngravingSection engravings={summary.engravings} />
          전설아바타
        </div>

        <div className={styles['right-box']}>
          <EquipmentSection gears={equipment.gears} accessories={equipment.accessories} />
          <ExtraEquipmentSection
            abilityStone={equipment.abilityStone}
            bracelet={equipment.bracelet}
          />
          <GemSection gems={summary.gems} />
          <div className={styles['ark-summary-box']}>
            <ArkPassiveSection arkPassive={summary.arkPassive} />
            <ArkGridSection arkGrid={summary.arkGrid} />
          </div>
        </div>
      </div>
    </div>
  );
}
