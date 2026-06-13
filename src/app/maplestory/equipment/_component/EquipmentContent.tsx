import { useEffect, useMemo, useState } from 'react';

import type { TMaplestoryEquipmentStatePatch } from '@/api/maplestory/type';
import type { TMaplestoryEquipmentSlot } from '@/app/maplestory/equipment/_define/equipmentSlots';
import { MAPLESTORY_EQUIPMENT_GROUPS } from '@/app/maplestory/equipment/_define/equipmentSlots';
import type {
  TEquipmentEditor,
  TEquipmentEditorKind,
} from '@/app/maplestory/equipment/_type/equipmentEditor';
import maplestoryQuery from '@/queries/maplestoryQuery';
import toast from '@/utils/toast';

import BoxLoading from '@/components/common/loading/BoxLoading';
import EquipmentTable from './EquipmentTable';
import EquipmentEditorModal from './editor/EquipmentEditorModal';

import styles from '../equipmentClient.module.scss';

export default function EquipmentContent(props: { characterId: string }) {
  const { characterId } = props;

  const [editor, setEditor] = useState<TEquipmentEditor | null>(null);

  const {
    data: equipmentStates = [],
    isLoading,
    isError,
  } = maplestoryQuery.useGetEquipmentStates(characterId);
  const saveEquipmentState = maplestoryQuery.useSaveEquipmentState();
  const toggleEquipmentHighlight = maplestoryQuery.useToggleEquipmentHighlight();

  const stateMap = useMemo(
    () => new Map(equipmentStates.map((state) => [state.slotKey, state])),
    [equipmentStates],
  );

  useEffect(() => {
    if (isError) {
      toast.error('장비 정보를 불러오지 못했습니다.');
    }
  }, [isError]);

  function handleOpenEditor(slot: TMaplestoryEquipmentSlot, kind: TEquipmentEditorKind) {
    setEditor({ slotKey: slot.key, slotName: slot.defaultName, kind });
  }

  async function handleSave(
    slotKey: string,
    patch: TMaplestoryEquipmentStatePatch,
  ): Promise<boolean> {
    try {
      await saveEquipmentState.mutateAsync({ characterId, slotKey, patch });
      return true;
    } catch {
      toast.error('장비 정보 저장에 실패했습니다.');
      return false;
    }
  }

  async function handleToggleHighlight(slot: TMaplestoryEquipmentSlot) {
    const previousState = stateMap.get(slot.key);
    const isHighlighted = !(previousState?.isHighlighted ?? false);

    try {
      await toggleEquipmentHighlight.mutateAsync({
        characterId,
        slotKey: slot.key,
        isHighlighted,
      });
    } catch {
      toast.error('장비 강조 표시 저장에 실패했습니다.');
    }
  }

  return (
    <div className={styles['equipment-content']}>
      {isLoading && <BoxLoading height={360} />}

      {!isLoading && isError && (
        <div className={styles['empty-state']}>장비 정보를 불러오지 못했습니다.</div>
      )}

      {!isLoading && !isError && (
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
