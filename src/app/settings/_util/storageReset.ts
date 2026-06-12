import { StorageKey, storage } from '@/utils/storage';

export type TResetTarget = 'lostark' | 'loado' | 'memo' | 'maplestory';

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
  lostark: {
    label: '로스트아크 전체',
    actionLabel: '로스트아크 전체 초기화',
    statusLabel: '로스트아크 저장소',
    confirmMessage: 'Loado 할일 테이블과 메모 데이터를 모두 초기화할까요?',
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
  maplestory: {
    label: '메이플스토리 전체',
    actionLabel: '메이플스토리 전체 초기화',
    statusLabel: '메이플스토리 저장소',
    confirmMessage: 'Mapledo 할일 테이블 데이터를 모두 초기화할까요?',
    keys: [StorageKey.MAPLEDO_TABLE],
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
