import { storage, StorageKey } from '@/utils/storage';

import type { TMemo, TMemoData } from '@/app/loado/_type/memo';

const EMPTY_DATA: TMemoData = {
  memos: [],
};

export function getMemoData(): TMemoData {
  return storage.local.get<TMemoData>(StorageKey.LOADO_MEMOS, EMPTY_DATA);
}

export function saveMemoData(data: TMemoData): void {
  storage.local.set(StorageKey.LOADO_MEMOS, data);
}

export function addMemo(data: TMemoData, next: TMemo): TMemoData {
  return { ...data, memos: [...data.memos, next] };
}

export function updateMemo(data: TMemoData, next: TMemo): TMemoData {
  if (!data.memos.some((m) => m.id === next.id)) return data;
  return {
    ...data,
    memos: data.memos.map((m) => (m.id === next.id ? next : m)),
  };
}

export function deleteMemo(data: TMemoData, memoId: string): TMemoData {
  return { ...data, memos: data.memos.filter((m) => m.id !== memoId) };
}

export function reorderMemos(data: TMemoData, memos: TMemo[]): TMemoData {
  return { ...data, memos };
}
