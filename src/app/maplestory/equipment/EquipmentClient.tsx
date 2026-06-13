'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import api from '@/api';
import type {
  TMaplestoryEquipmentState,
  TMaplestoryEquipmentStatePatch,
  TResMaplestoryMyCharacter,
} from '@/api/maplestory/type';
import type { TMaplestoryEquipmentSlot } from '@/app/maplestory/equipment/_define/equipmentSlots';
import { MAPLESTORY_EQUIPMENT_GROUPS } from '@/app/maplestory/equipment/_define/equipmentSlots';
import type {
  TEquipmentEditor,
  TEquipmentEditorKind,
} from '@/app/maplestory/equipment/_type/equipmentEditor';
import toast from '@/utils/toast';

import BoxLoading from '@/components/common/loading/BoxLoading';
import Tabs from '@/components/common/tabs/Tabs';
import MaplestoryHeader from '@/components/maplestory/header/MaplestoryHeader';
import EquipmentTable from './_component/EquipmentTable';
import EquipmentEditorModal from './_component/editor/EquipmentEditorModal';

import styles from './equipmentClient.module.scss';

export default function EquipmentClient() {
  const [isCharacterLoading, setIsCharacterLoading] = useState(true);
  const [characters, setCharacters] = useState<TResMaplestoryMyCharacter[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [isEquipmentLoading, setIsEquipmentLoading] = useState(true);
  const [isEquipmentLoadError, setIsEquipmentLoadError] = useState(false);
  const [equipmentStates, setEquipmentStates] = useState<TMaplestoryEquipmentState[]>([]);
  const [editor, setEditor] = useState<TEquipmentEditor | null>(null);
  const selectedCharacterIdRef = useRef<string | null>(null);

  useEffect(() => {
    async function loadCharacters() {
      try {
        const response = await api.maplestory.getMyCharacters();
        const firstCharacterId = response[0]?.id ?? null;
        setCharacters(response);
        selectedCharacterIdRef.current = firstCharacterId;
        setSelectedCharacterId(firstCharacterId);
      } catch {
        toast.error('내 캐릭터 목록을 불러오지 못했습니다.');
      } finally {
        setIsCharacterLoading(false);
      }
    }

    loadCharacters();
  }, []);

  useEffect(() => {
    if (selectedCharacterId === null) return;

    let isCancelled = false;

    async function loadEquipmentStates() {
      setIsEquipmentLoading(true);
      setIsEquipmentLoadError(false);
      setEditor(null);

      try {
        const response = await api.maplestory.getEquipmentStates(selectedCharacterId!);
        if (!isCancelled) {
          setEquipmentStates(response);
        }
      } catch {
        if (!isCancelled) {
          setEquipmentStates([]);
          setIsEquipmentLoadError(true);
          toast.error('장비 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (!isCancelled) {
          setIsEquipmentLoading(false);
        }
      }
    }

    loadEquipmentStates();

    return () => {
      isCancelled = true;
    };
  }, [selectedCharacterId]);

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
    selectedCharacterIdRef.current = characterId;
    setSelectedCharacterId(characterId);
  }

  async function handleSave(
    slotKey: string,
    patch: TMaplestoryEquipmentStatePatch,
  ): Promise<boolean> {
    const characterId = selectedCharacterId;
    if (characterId === null) return false;

    try {
      const response = await api.maplestory.saveEquipmentState(characterId, slotKey, patch);
      if (selectedCharacterIdRef.current !== characterId) return true;

      setEquipmentStates((previousStates) =>
        replaceEquipmentState(previousStates, slotKey, response),
      );
      return true;
    } catch {
      if (selectedCharacterIdRef.current === characterId) {
        toast.error('장비 정보 저장에 실패했습니다.');
      }
      return false;
    }
  }

  async function handleToggleHighlight(slot: TMaplestoryEquipmentSlot) {
    const characterId = selectedCharacterId;
    if (characterId === null) return;

    const previousStates = equipmentStates;
    const previousState = stateMap.get(slot.key);
    const nextValue = !(previousState?.isHighlighted ?? false);
    const optimisticState = createOptimisticEquipmentState(
      characterId,
      slot.key,
      previousState,
      nextValue,
    );

    setEquipmentStates(replaceEquipmentState(previousStates, slot.key, optimisticState));

    try {
      const response = await api.maplestory.saveEquipmentState(characterId, slot.key, {
        isHighlighted: nextValue,
      });
      if (selectedCharacterIdRef.current !== characterId) return;

      setEquipmentStates((currentStates) =>
        replaceEquipmentState(currentStates, slot.key, response),
      );
    } catch {
      if (selectedCharacterIdRef.current === characterId) {
        setEquipmentStates(previousStates);
        toast.error('장비 강조 표시 저장에 실패했습니다.');
      }
    }
  }

  return (
    <div className={styles['equipment-client']}>
      <MaplestoryHeader />

      <main className={styles['equipment-client-container']}>
        {isCharacterLoading && <BoxLoading height={320} />}

        {!isCharacterLoading && characters.length === 0 && (
          <div className={styles['empty-state']}>내 캐릭터를 먼저 등록해 주세요.</div>
        )}

        {!isCharacterLoading && selectedCharacterId !== null && (
          <>
            <Tabs
              options={characterTabs}
              value={selectedCharacterId}
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

function replaceEquipmentState(
  states: TMaplestoryEquipmentState[],
  slotKey: string,
  nextState: TMaplestoryEquipmentState | null,
): TMaplestoryEquipmentState[] {
  const nextStates = states.filter((state) => state.slotKey !== slotKey);
  return nextState === null ? nextStates : [...nextStates, nextState];
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
