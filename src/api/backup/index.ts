import { createClient } from '@/lib/supabase/client';

import type {
  TLoamStorageBackupRow,
  TReqUpsertLoamStorageBackupRow,
  TStorageBackupPayload,
} from './type';

const LOAM_STORAGE_BACKUPS_TABLE = 'loam_storage_backups';

async function getCurrentUserId(): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || user === null) {
    throw new Error('Login is required.');
  }

  return user.id;
}

export async function getStorageBackup(): Promise<TStorageBackupPayload | null> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from(LOAM_STORAGE_BACKUPS_TABLE)
    .select('id, user_id, data, schema_version, backed_up_at, created_at, updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data === null) {
    return null;
  }

  return (data as TLoamStorageBackupRow).data;
}

export async function saveStorageBackup(
  backup: TStorageBackupPayload,
): Promise<TStorageBackupPayload> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const backedUpAt = new Date().toISOString();
  const row: TReqUpsertLoamStorageBackupRow = {
    user_id: userId,
    data: {
      ...backup,
      exportedAt: backedUpAt,
    },
    schema_version: backup.version,
    backed_up_at: backedUpAt,
  };

  const { data, error } = await supabase
    .from(LOAM_STORAGE_BACKUPS_TABLE)
    .upsert(row, { onConflict: 'user_id' })
    .select('id, user_id, data, schema_version, backed_up_at, created_at, updated_at')
    .single();

  if (error) {
    throw error;
  }

  return (data as TLoamStorageBackupRow).data;
}
