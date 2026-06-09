import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import Button from '@/components/common/button/Button';
import ProfileImageSection from './section/ProfileImageSection';
import EngravingSection from './section/EngravingSection';
import LegendaryAvatarSection from './section/LegendaryAvatarSection';
import EquipmentSection from './section/EquipmentSection';
import ExtraEquipmentSection from './section/ExtraEquipmentSection';
import GemSection from './section/GemSection';
import ArkPassiveSection from './section/ArkPassiveSection';
import ArkGridSection from './section/ArkGridSection';

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
        <div className={styles['profile-column']}>
          <ProfileImageSection imageUrl={profiles.characterImage} />
          <LegendaryAvatarSection avatars={summary.legendaryAvatars} />
        </div>

        <div className={styles['equipment-column']}>
          <EquipmentSection gears={equipment.gears} accessories={equipment.accessories} />
          <ExtraEquipmentSection
            abilityStone={equipment.abilityStone}
            bracelet={equipment.bracelet}
          />
          <GemSection gems={summary.gems} />
        </div>

        <div className={styles['ark-column']}>
          <div className={styles['build-summary-row']}>
            <ArkPassiveSection arkPassive={summary.arkPassive} />
            <EngravingSection engravings={summary.engravings} />
          </div>
          <ArkGridSection arkGrid={summary.arkGrid} />
        </div>
      </div>
    </div>
  );
}
