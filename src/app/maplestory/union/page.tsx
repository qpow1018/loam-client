import { requireAuth } from '@/lib/auth/requireAuth';
import UnionClient from './UnionClient';

export default async function UnionPage() {
  await requireAuth('/maplestory/union');

  return <UnionClient />;
}
