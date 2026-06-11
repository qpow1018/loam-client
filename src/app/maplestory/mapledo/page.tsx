import { requireAuth } from '@/lib/auth/requireAuth';
import MapledoClient from './MapledoClient';

export default async function MapledoPage() {
  await requireAuth('/maplestory/mapledo');

  return <MapledoClient />;
}
