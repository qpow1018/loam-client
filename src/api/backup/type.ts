export type TStorageBackupPayload = {
  app: 'loam-client';
  version: number;
  exportedAt: string;
  data: Partial<Record<string, unknown>>;
};

export type TLoamStorageBackupRow = {
  id: string;
  user_id: string;
  data: TStorageBackupPayload;
  schema_version: number;
  backed_up_at: string;
  created_at: string;
  updated_at: string;
};

export type TReqUpsertLoamStorageBackupRow = {
  user_id: string;
  data: TStorageBackupPayload;
  schema_version: number;
  backed_up_at: string;
};
