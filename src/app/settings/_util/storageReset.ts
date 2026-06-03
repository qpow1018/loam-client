import { StorageKey, storage } from '@/utils/storage';

export type TResetTarget = 'all' | 'loado' | 'memo';

export const RESET_TARGETS: Record<
  TResetTarget,
  {
    label: string;
    actionLabel: string;
    statusLabel: string;
    confirmMessage: string;
    keys: Array<(typeof StorageKey)[keyof typeof StorageKey]>;
  }
> = {
  all: {
    label: '전체',
    actionLabel: '전체 초기화',
    statusLabel: '전체 저장소',
    confirmMessage: '할일 테이블, 메모 데이터를 모두 초기화할까요?',
    keys: [StorageKey.LOADO_TABLE, StorageKey.LOADO_MEMOS],
  },
  loado: {
    label: '할일',
    actionLabel: '할일',
    statusLabel: '할일 테이블',
    confirmMessage: '할일 테이블 데이터를 초기화할까요?',
    keys: [StorageKey.LOADO_TABLE],
  },
  memo: {
    label: '메모',
    actionLabel: '메모',
    statusLabel: '메모',
    confirmMessage: '메모 데이터를 초기화할까요?',
    keys: [StorageKey.LOADO_MEMOS],
  },
};

export function getResetTargets() {
  return Object.keys(RESET_TARGETS) as TResetTarget[];
}

export function resetStorageTarget(target: TResetTarget) {
  const resetTarget = RESET_TARGETS[target];
  for (const key of resetTarget.keys) {
    storage.local.remove(key);
  }

  return resetTarget;
}
