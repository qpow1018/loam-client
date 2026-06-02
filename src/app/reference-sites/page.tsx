import ReferenceSitesClient from './ReferenceSitesClient';
import { requireAuth } from '@/lib/auth/requireAuth';

export default async function ReferenceSitesPage() {
  await requireAuth('/reference-sites');

  return <ReferenceSitesClient />;
}
