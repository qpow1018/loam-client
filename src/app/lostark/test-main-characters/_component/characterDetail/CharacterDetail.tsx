'use client';

import { useEffect, useState } from 'react';

import type { TLostarkManualMetrics, TResLostarkMainCharacter } from '@/api/lostark/type';
import lostarkQuery from '@/queries/lostarkQuery';
import toast from '@/utils/toast';

import BoxLoading from '@/components/common/loading/BoxLoading';
import ProfileHeader from './profileHeader/ProfileHeader';
import EquipmentSection from './equipmentSection/EquipmentSection';
import CombatStatSection from './CombatStatSection';
import EngravingSection from './EngravingSection';
import GemSection from './GemSection';
import LegendaryAvatarSection from './LegendaryAvatarSection';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import ArkPassiveNodeSection from './ArkPassiveNodeSection';
import CardSection from './CardSection';
import DetailPanel from './DetailPanel';
import SkillSection from './SkillSection';

import styles from './characterDetail.module.scss';

export default function CharacterDetail(props: { characterId: string }) {
  const [draftCharacter, setDraftCharacter] = useState<TResLostarkMainCharacter | null>(null);

  const {
    data: savedCharacter,
    isLoading,
    isError,
  } = lostarkQuery.useGetMainCharacterDetail(props.characterId);
  const refreshMainCharacter = lostarkQuery.useRefreshMainCharacter();
  const saveMainCharacter = lostarkQuery.useSaveMainCharacter();

  const character = draftCharacter ?? savedCharacter;
  const hasUnsavedChanges = draftCharacter !== null;

  useEffect(() => {
    if (isError) {
      toast.error('메인 캐릭터 정보를 불러오지 못했습니다.');
    }
  }, [isError]);

  async function handleRefreshCharacter() {
    if (!character || refreshMainCharacter.isPending) return;

    try {
      const refreshedCharacter = await refreshMainCharacter.mutateAsync(character);
      setDraftCharacter(refreshedCharacter);
      toast.success('최신 정보를 불러왔습니다.');
    } catch {
      toast.error('최신 정보를 불러오지 못했습니다.');
    }
  }

  async function handleSaveCharacter() {
    if (!character || !hasUnsavedChanges || saveMainCharacter.isPending) return;

    try {
      await saveMainCharacter.mutateAsync(character);
      setDraftCharacter(null);
      toast.success('메인 캐릭터 정보를 저장했습니다.');
    } catch {
      toast.error('메인 캐릭터 정보를 저장하지 못했습니다.');
    }
  }

  function handleChangeManualMetrics(manualMetrics: TLostarkManualMetrics) {
    if (!character) return;

    setDraftCharacter({
      ...character,
      manualMetrics,
    });
  }

  if (isLoading) {
    return <BoxLoading height={280} />;
  }

  if (!character) {
    return (
      <div className={styles['character-detail']}>
        <p className={styles['empty-info']}>메인 캐릭터 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const { summary } = character;
  return (
    <div className={styles['character-detail']}>
      <ProfileHeader
        character={character}
        isRefreshing={refreshMainCharacter.isPending}
        isSaving={saveMainCharacter.isPending}
        isSaveDisabled={!hasUnsavedChanges}
        onRefresh={() => void handleRefreshCharacter()}
        onSave={() => void handleSaveCharacter()}
        onChangeManualMetrics={handleChangeManualMetrics}
      />

      <div className={styles['top-layout']}>
        <div className={styles['equipment-column']}>
          <EquipmentSection equipment={summary.equipment} />
          <GemSection gems={summary.gems} />
        </div>

        <div className={styles['side-column']}>
          <CombatStatSection stats={summary.profiles.stats} />
          <EngravingSection engravings={summary.engravings} />
          <LegendaryAvatarSection avatars={summary.legendaryAvatars} />
        </div>
      </div>

      <div className={styles['ark-layout']}>
        <DetailPanel title="아크 패시브 상세">
          <ArkPassiveNodeSection arkPassive={summary.arkPassive} />
        </DetailPanel>

        <DetailPanel title="아크 그리드">
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
        </DetailPanel>
      </div>

      <div className={styles['bottom-details']}>
        <CardSection cards={summary.cards} />

        <SkillSection skills={summary.combatSkills} />
      </div>

      <div>
        <p>TODO</p>
        <p>특성 - 힘민지최생, 치특신</p>
        <p>각인 - 어빌돌 연계</p>
        <p>보석</p>
        <p>아크패시브 - 찍은것도 보여주기</p>
        <p>아크그리드</p>
        <p>카드</p>
        <p>스킬</p>
        <p>아바타</p>
      </div>
    </div>
  );
}
