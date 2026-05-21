'use client';

import { v4 as uuidv4 } from 'uuid';

import type {
  TLoadoTableData,
  TLoadoColumn,
  TLoadoRow,
  TLoadoCellValue,
} from '@/app/loado/_type/loado';

import DraggableList from '@/components/common/draggableList/DraggableList';
import CornerCell from './CornerCell';
import HeaderCell from './HeaderCell';
import RowLabelCell from './RowLabelCell';
import CellView from './CellView';

import styles from './loadoTable.module.scss';

export default function LoadoTable(props: {
  data: TLoadoTableData;
  onChange: (next: TLoadoTableData) => void;
}) {
  const { data, onChange } = props;

  function updateCell(rowId: string, colId: string, next: TLoadoCellValue) {
    const prevRow = data.cells[rowId] ?? {};
    onChange({
      ...data,
      cells: {
        ...data.cells,
        [rowId]: { ...prevRow, [colId]: next },
      },
    });
  }

  function addCharacter() {
    const newColumn: TLoadoColumn = { id: uuidv4(), name: '새 캐릭터' };
    onChange({ ...data, columns: [...data.columns, newColumn] });
  }

  function addTask() {
    const newRow: TLoadoRow = {
      kind: 'data',
      id: uuidv4(),
      name: '새 할일',
      resetPeriod: { kind: 'daily' },
      cellRole: 'checkbox',
    };
    onChange({ ...data, rows: [...data.rows, newRow] });
  }

  function addDivider() {
    const newRow: TLoadoRow = { kind: 'divider', id: uuidv4() };
    onChange({ ...data, rows: [...data.rows, newRow] });
  }

  return (
    <div className={styles['loado-table']}>
      <div className={styles['header-row']}>
        <CornerCell
          onAddCharacter={addCharacter}
          onAddTask={addTask}
          onAddDivider={addDivider}
        />

        <DraggableList<TLoadoColumn>
          items={data.columns}
          getId={(c) => c.id}
          direction="horizontal"
          onReorder={(cols) => onChange({ ...data, columns: cols })}
        >
          {(col, { dragHandleProps }) => (
            <HeaderCell column={col} dragHandleProps={dragHandleProps} />
          )}
        </DraggableList>
      </div>

      <DraggableList<TLoadoRow>
        items={data.rows}
        getId={(r) => r.id}
        direction="vertical"
        onReorder={(rows) => onChange({ ...data, rows })}
      >
        {(row, { dragHandleProps }) =>
          row.kind === 'divider' ? (
            <div className={styles['row-divider']} {...dragHandleProps} />
          ) : (
            <div className={styles['row']}>
              <RowLabelCell row={row} dragHandleProps={dragHandleProps} />
              {data.columns.map((col) => (
                <CellView
                  key={col.id}
                  row={row}
                  cell={data.cells[row.id]?.[col.id]}
                  onChange={(next) => updateCell(row.id, col.id, next)}
                />
              ))}
            </div>
          )
        }
      </DraggableList>
    </div>
  );
}
