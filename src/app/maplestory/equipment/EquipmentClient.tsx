'use client';

import { useEffect, useMemo, useState } from 'react';

import type {
  TMaplestoryEquipmentState,
  TMaplestoryEquipmentStatePatch,
} from '@/api/maplestory/type';
import type { TMaplestoryEquipmentSlot } from '@/app/maplestory/equipment/_define/equipmentSlots';
import { MAPLESTORY_EQUIPMENT_GROUPS } from '@/app/maplestory/equipment/_define/equipmentSlots';
import type {
  TEquipmentEditor,
  TEquipmentEditorKind,
} from '@/app/maplestory/equipment/_type/equipmentEditor';
import maplestoryQuery from '@/queries/maplestoryQuery';
import toast from '@/utils/toast';

import BoxLoading from '@/components/common/loading/BoxLoading';
import Tabs from '@/components/common/tabs/Tabs';
import MaplestoryHeader from '@/components/maplestory/header/MaplestoryHeader';
import EquipmentTable from './_component/EquipmentTable';
import EquipmentEditorModal from './_component/editor/EquipmentEditorModal';

import styles from './equipmentClient.module.scss';

export default function EquipmentClient() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [editor, setEditor] = useState<TEquipmentEditor | null>(null);
  const {
    data: characters = [],
    isLoading: isCharacterLoading,
    isError: isCharacterLoadError,
  } = maplestoryQuery.useGetMyCharacters();
  const activeCharacterId = characters.some((character) => character.id === selectedCharacterId)
    ? selectedCharacterId
    : (characters[0]?.id ?? null);
  const {
    data: equipmentStates = [],
    isLoading: isEquipmentLoading,
    isError: isEquipmentLoadError,
  } = maplestoryQuery.useGetEquipmentStates(activeCharacterId);
  const saveEquipmentState = maplestoryQuery.useSaveEquipmentState();
  const toggleEquipmentHighlight = maplestoryQuery.useToggleEquipmentHighlight();

  useEffect(() => {
    if (isCharacterLoadError) {
      toast.error('내 캐릭터 목록을 불러오지 못했습니다.');
    }
  }, [isCharacterLoadError]);

  useEffect(() => {
    if (isEquipmentLoadError) {
      toast.error('장비 정보를 불러오지 못했습니다.');
    }
  }, [isEquipmentLoadError]);

  const characterTabs = useMemo(
    () => characters.map((character) => ({ value: character.id, label: character.nickname })),
    [characters],
  );
  const stateMap = useMemo(
    () => new Map(equipmentStates.map((state) => [state.slotKey, state])),
    [equipmentStates],
  );

  function handleOpenEditor(slot: TMaplestoryEquipmentSlot, kind: TEquipmentEditorKind) {
    setEditor({ slotKey: slot.key, slotName: slot.defaultName, kind });
  }

  function handleCharacterChange(characterId: string) {
    setEditor(null);
    setSelectedCharacterId(characterId);
  }

  async function handleSave(
    slotKey: string,
    patch: TMaplestoryEquipmentStatePatch,
  ): Promise<boolean> {
    const characterId = activeCharacterId;
    if (characterId === null) return false;

    try {
      await saveEquipmentState.mutateAsync({ characterId, slotKey, patch });
      return true;
    } catch {
      toast.error('장비 정보 저장에 실패했습니다.');
      return false;
    }
  }

  async function handleToggleHighlight(slot: TMaplestoryEquipmentSlot) {
    const characterId = activeCharacterId;
    if (characterId === null) return;

    const previousState = stateMap.get(slot.key);
    const nextValue = !(previousState?.isHighlighted ?? false);
    const optimisticState = createOptimisticEquipmentState(
      characterId,
      slot.key,
      previousState,
      nextValue,
    );

    try {
      await toggleEquipmentHighlight.mutateAsync({
        characterId,
        slotKey: slot.key,
        state: optimisticState,
      });
    } catch {
      toast.error('장비 강조 표시 저장에 실패했습니다.');
    }
  }

  return (
    <div className={styles['equipment-client']}>
      <MaplestoryHeader />

      <main className={styles['equipment-client-container']}>
        {isCharacterLoading && <BoxLoading height={320} />}

        {!isCharacterLoading && !isCharacterLoadError && characters.length === 0 && (
          <div className={styles['empty-state']}>내 캐릭터를 먼저 등록해 주세요.</div>
        )}

        {!isCharacterLoading && activeCharacterId !== null && (
          <>
            <Tabs
              options={characterTabs}
              value={activeCharacterId}
              onChange={handleCharacterChange}
            />

            <div className={styles['equipment-content']}>
              {isEquipmentLoading && <BoxLoading height={360} />}

              {!isEquipmentLoading && isEquipmentLoadError && (
                <div className={styles['empty-state']}>장비 정보를 불러오지 못했습니다.</div>
              )}

              {!isEquipmentLoading && !isEquipmentLoadError && (
                <div className={styles['table-list']}>
                  {MAPLESTORY_EQUIPMENT_GROUPS.map((group) => (
                    <EquipmentTable
                      key={group.category}
                      group={group}
                      states={stateMap}
                      onEdit={handleOpenEditor}
                      onToggleHighlight={handleToggleHighlight}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {editor !== null && (
        <EquipmentEditorModal
          key={`${editor.slotKey}-${editor.kind}`}
          editor={editor}
          state={stateMap.get(editor.slotKey)}
          onClose={() => setEditor(null)}
          onSubmit={(patch) => handleSave(editor.slotKey, patch)}
        />
      )}
    </div>
  );
}

function createOptimisticEquipmentState(
  characterId: string,
  slotKey: string,
  state: TMaplestoryEquipmentState | undefined,
  isHighlighted: boolean,
): TMaplestoryEquipmentState {
  return {
    id: state?.id ?? '',
    characterId,
    slotKey,
    itemName: state?.itemName ?? null,
    bonusOption: state?.bonusOption ?? null,
    starforce: state?.starforce ?? null,
    scroll: state?.scroll ?? null,
    potential: state?.potential ?? null,
    additionalPotential: state?.additionalPotential ?? null,
    extra: state?.extra ?? null,
    goal: state?.goal ?? null,
    purchasePrice: state?.purchasePrice ?? null,
    isHighlighted,
  };
}
