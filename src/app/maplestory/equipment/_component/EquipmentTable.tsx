import { MdCheck } from 'react-icons/md';

import type { TMaplestoryEquipmentState } from '@/api/maplestory/type';
import type {
  TMaplestoryEquipmentGroup,
  TMaplestoryEquipmentSlot,
} from '@/app/maplestory/equipment/_define/equipmentSlots';
import type { TEquipmentEditorKind } from '@/app/maplestory/equipment/_type/equipmentEditor';
import {
  getEquipmentDisplayName,
  getEquipmentSpecText,
} from '@/app/maplestory/equipment/_util/equipmentState';

import styles from './equipmentTable.module.scss';

export default function EquipmentTable(props: {
  group: TMaplestoryEquipmentGroup;
  states: Map<string, TMaplestoryEquipmentState>;
  onEdit: (slot: TMaplestoryEquipmentSlot, kind: TEquipmentEditorKind) => void;
  onToggleHighlight: (slot: TMaplestoryEquipmentSlot) => void;
}) {
  const { group, states, onEdit, onToggleHighlight } = props;

  return (
    <section className={styles['equipment-table-section']}>
      <table className={styles['equipment-table']}>
        <colgroup>
          <col className={styles['highlight-column']} />
          <col className={styles['name-column']} />
          <col className={styles['content-column']} />
          <col className={styles['content-column']} />
          <col className={styles['price-column']} />
        </colgroup>
        <thead>
          <tr>
            <th aria-label="강조" />
            <th>장비명</th>
            <th>현재 장비 스펙</th>
            <th>목표</th>
            <th>구매 시세</th>
          </tr>
        </thead>
        <tbody>
          {group.slots.map((slot) => {
            const state = states.get(slot.key);
            const displayName = getEquipmentDisplayName(slot.defaultName, state?.itemName ?? null);
            const specText = getEquipmentSpecText(state);
            const isHighlighted = state?.isHighlighted ?? false;

            return (
              <tr key={slot.key} className={isHighlighted ? styles['highlighted'] : undefined}>
                <td className={styles['highlight-cell']}>
                  <button
                    type="button"
                    className={styles['highlight-button']}
                    aria-label={`${displayName} 강조 ${isHighlighted ? '해제' : '설정'}`}
                    aria-pressed={isHighlighted}
                    onClick={() => onToggleHighlight(slot)}
                  >
                    {isHighlighted && <MdCheck aria-hidden="true" />}
                  </button>
                </td>
                <EditableCell
                  value={displayName}
                  isPlaceholder={state?.itemName === null || state === undefined}
                  onClick={() => onEdit(slot, 'itemName')}
                />
                <EditableCell
                  value={specText || '-'}
                  isPlaceholder={!specText}
                  onClick={() => onEdit(slot, 'spec')}
                />
                <EditableCell
                  value={state?.goal ?? '-'}
                  isPlaceholder={!state?.goal}
                  onClick={() => onEdit(slot, 'goal')}
                />
                <EditableCell
                  value={state?.purchasePrice ?? '-'}
                  isPlaceholder={!state?.purchasePrice}
                  onClick={() => onEdit(slot, 'purchasePrice')}
                  isRightAligned
                />
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function EditableCell(props: {
  value: string;
  isPlaceholder: boolean;
  onClick: () => void;
  isRightAligned?: boolean;
}) {
  const { value, isPlaceholder, onClick, isRightAligned = false } = props;

  return (
    <td>
      <button
        type="button"
        className={`${styles['cell-button']} ${isPlaceholder ? styles['placeholder'] : ''} ${
          isRightAligned ? styles['right-aligned'] : ''
        }`}
        onClick={onClick}
      >
        {value}
      </button>
    </td>
  );
}
