import { v4 as uuidv4 } from 'uuid';

import { storage, StorageKey } from '@/utils/storage';

export function getAnonymousClientId(): string {
  const current = storage.local.get<string | null>(StorageKey.ANONYMOUS_CLIENT_ID, null);

  if (current) {
    return current;
  }

  const next = uuidv4();
  storage.local.set(StorageKey.ANONYMOUS_CLIENT_ID, next);

  return next;
}
