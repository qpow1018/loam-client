import { storage, StorageKey } from '@/utils/storage';

import type { TMemo, TMemoData } from '@/types/memo';

const EMPTY_DATA: TMemoData = {
  memos: [],
};

export type TMemoStorageKey = typeof StorageKey.LOADO_MEMOS | typeof StorageKey.MAPLEDO_MEMOS;

export function getMemoData(storageKey: TMemoStorageKey): TMemoData {
  return storage.local.get<TMemoData>(storageKey, EMPTY_DATA);
}

export function saveMemoData(storageKey: TMemoStorageKey, data: TMemoData): void {
  storage.local.set(storageKey, data);
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
